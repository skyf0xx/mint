import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface User {
    id: string;
    wallet_address: string;
    referral_code: string;
    total_referrals: number;
    twitter_followed: boolean;
    created_at: string;
    updated_at: string;
}

export interface Referral {
    id: string;
    referrer_id: string;
    referred_id: string;
    status: 'pending' | 'completed';
    created_at: string;
}

export interface ReferralStats {
    totalReferrals: number;
    completedReferrals: number;
    pendingReferrals: number;
}

export class DatabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }

    private sanitizeWalletForEmail(walletAddress: string): string {
        const sanitized = walletAddress.replace(/[^a-zA-Z0-9]/g, '');
        return `${sanitized}@arweave.org`;
    }

    async signUpWithWallet(walletAddress: string) {
        const email = this.sanitizeWalletForEmail(walletAddress);
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password: walletAddress,
        });

        if (error) throw new Error(`Failed to sign up: ${error.message}`);
        return data;
    }

    async signInWithWallet(walletAddress: string) {
        try {
            const email = this.sanitizeWalletForEmail(walletAddress);
            const { data: signInData, error: signInError } =
                await this.supabase.auth.signInWithPassword({
                    email,
                    password: walletAddress,
                });

            if (!signInError) return signInData;

            if (signInError.status === 400) {
                const { data: signUpData, error: signUpError } =
                    await this.supabase.auth.signUp({
                        email,
                        password: walletAddress,
                    });

                if (signUpError)
                    throw new Error(`Signup failed: ${signUpError.message}`);
                return signUpData;
            }

            throw new Error(`Signin failed: ${signInError.message}`);
        } catch (error) {
            throw error;
        }
    }

    async upsertUser(walletAddress: string): Promise<User> {
        const authData = await this.signInWithWallet(walletAddress);
        if (!authData.user?.id) throw new Error('Authentication failed');

        const referralCode = this.generateReferralCode(walletAddress);

        const { data, error } = await this.supabase
            .from('users')
            .upsert({
                id: authData.user.id,
                wallet_address: walletAddress,
                referral_code: referralCode,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw new Error(`Failed to upsert user: ${error.message}`);
        return data;
    }

    async updateTwitterStatus(
        walletAddress: string,
        followed: boolean
    ): Promise<void> {
        const authData = await this.signInWithWallet(walletAddress);
        if (!authData.user?.id) throw new Error('Authentication failed');

        const { error } = await this.supabase
            .from('users')
            .update({
                twitter_followed: followed,
                updated_at: new Date().toISOString(),
            })
            .eq('id', authData.user.id);

        if (error)
            throw new Error(
                `Failed to update Twitter status: ${error.message}`
            );
    }

    async getUserByWallet(walletAddress: string): Promise<User | null> {
        const { data, error } = await this.supabase
            .from('users')
            .select()
            .eq('wallet_address', walletAddress)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to get user: ${error.message}`);
        }
        return data;
    }

    async getUserByReferralCode(referralCode: string): Promise<User | null> {
        const { data, error } = await this.supabase
            .from('users')
            .select()
            .eq('referral_code', referralCode)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(
                `Failed to get user by referral code: ${error.message}`
            );
        }
        return data;
    }

    async processPendingReferral(walletAddress: string): Promise<void> {
        const authData = await this.signInWithWallet(walletAddress);
        if (!authData.user?.id) throw new Error('Authentication failed');

        const pendingCode = localStorage.getItem('pendingReferralCode');
        if (!pendingCode) return;

        try {
            const referrer = await this.getUserByReferralCode(pendingCode);
            if (referrer) {
                await this.createReferral(referrer.id, authData.user.id);
            }
            localStorage.removeItem('pendingReferralCode');
        } catch (error) {
            console.error('Failed to process pending referral:', error);
        }
    }

    async createReferral(
        referrerId: string,
        referredId: string
    ): Promise<Referral> {
        const { data, error } = await this.supabase
            .from('referrals')
            .insert({
                referrer_id: referrerId,
                referred_id: referredId,
            })
            .select()
            .single();

        if (error)
            throw new Error(`Failed to create referral: ${error.message}`);

        await this.supabase.rpc('increment_referral_count', {
            user_id: referrerId,
        });

        return data;
    }

    async updateReferralStatus(
        referralId: string,
        userId: string,
        status: 'pending' | 'completed'
    ): Promise<void> {
        const { error } = await this.supabase
            .from('referrals')
            .update({ status })
            .eq('id', referralId)
            .eq('referrer_id', userId);

        if (error)
            throw new Error(
                `Failed to update referral status: ${error.message}`
            );
    }

    async getReferralsByUser(
        userId: string,
        type: 'referrer' | 'referred'
    ): Promise<Referral[]> {
        const column = type === 'referrer' ? 'referrer_id' : 'referred_id';

        const { data, error } = await this.supabase
            .from('referrals')
            .select()
            .eq(column, userId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to get referrals: ${error.message}`);
        return data || [];
    }

    async getUserReferralStats(walletAddress: string): Promise<ReferralStats> {
        const user = await this.getUserByWallet(walletAddress);
        if (!user) throw new Error('User not found');

        const { data: referrals, error } = await this.supabase
            .from('referrals')
            .select()
            .eq('referrer_id', user.id);

        if (error)
            throw new Error(`Failed to get referral stats: ${error.message}`);

        const totalReferrals = referrals?.length || 0;
        const completedReferrals =
            referrals?.filter((r) => r.status === 'completed').length || 0;
        const pendingReferrals = totalReferrals - completedReferrals;

        return {
            totalReferrals,
            completedReferrals,
            pendingReferrals,
        };
    }

    private generateReferralCode(address: string): string {
        const prefix = address.slice(0, 6);
        let hash = 0;

        for (let i = 0; i < address.length; i++) {
            hash = (hash << 5) - hash + address.charCodeAt(i);
            hash = hash & hash;
        }

        const suffix = Math.abs(hash).toString(36).slice(0, 3).toUpperCase();
        return `${prefix}${suffix}`;
    }
}

export const db = new DatabaseService();
