import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface User {
    id: string;
    wallet_address: string;
    twitter_id: string;
    twitter_username: string;
    twitter_name: string;
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

export interface TwitterAuthResponse {
    user: {
        id: string;
        twitter_id: string;
        username: string;
        name: string;
    };
}

export class DatabaseService {
    public supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }

    async signInWithTwitter(referralCode?: string) {
        const redirectTo = new URL(`${window.location.origin}/callback`);
        if (referralCode) {
            redirectTo.searchParams.set('ref', referralCode);
        }
        return await this.supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
                redirectTo: redirectTo.toString(),
                scopes: 'users.read',
                skipBrowserRedirect: false,
                queryParams: {
                    force_verify: 'true',
                },
            },
        });
    }

    async getUserByTwitterId(twitterId: string): Promise<User | null> {
        const { data, error } = await this.supabase
            .from('users')
            .select()
            .eq('twitter_id', twitterId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(
                `Failed to get user by Twitter ID: ${error.message}`
            );
        }
        return data;
    }

    async createOrUpdateUserWithTwitter(
        twitterData: TwitterAuthResponse
    ): Promise<User> {
        const userData: Partial<User> = {
            id: twitterData.user.id,
            twitter_id: twitterData.user.twitter_id,
            twitter_username: twitterData.user.username,
            wallet_address: '',
            referral_code: '',
            twitter_name: twitterData.user.name,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await this.supabase
            .from('users')
            .upsert(userData)
            .select()
            .single();

        if (error) {
            console.error(error);
            throw new Error(
                `Failed to create/update user with Twitter: ${error?.message}`
            );
        }
        return data;
    }

    async linkWalletToTwitterUser(
        twitterId: string,
        walletAddress: string
    ): Promise<User> {
        const referralCode = this.generateReferralCode(walletAddress);

        const { data, error } = await this.supabase
            .from('users')
            .update({
                wallet_address: walletAddress,
                referral_code: referralCode,
                updated_at: new Date().toISOString(),
            })
            .eq('twitter_id', twitterId)
            .select()
            .single();

        if (error) {
            throw new Error(
                `Failed to link wallet to Twitter user: ${error.message}`
            );
        }

        if (!data) {
            throw new Error('No user found with the provided Twitter ID');
        }

        return data;
    }

    async updateTwitterStatus(
        userId: string,
        followed: boolean
    ): Promise<void> {
        const { error } = await this.supabase
            .from('users')
            .update({
                twitter_followed: followed,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        if (error) {
            throw new Error(
                `Failed to update Twitter status: ${error.message}`
            );
        }
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
        const pendingCode = localStorage.getItem('pendingReferralCode');
        if (!pendingCode) return;

        try {
            const referrer = await this.getUserByReferralCode(pendingCode);
            if (referrer && referrer.wallet_address !== walletAddress) {
                await this.createReferral(
                    referrer.wallet_address,
                    walletAddress
                );
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

        if (error) {
            throw new Error(`Failed to create referral: ${error.message}`);
        }

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

        if (error) {
            throw new Error(
                `Failed to update referral status: ${error.message}`
            );
        }
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

        if (error) {
            throw new Error(`Failed to get referrals: ${error.message}`);
        }
        return data || [];
    }

    async getUserReferralStats(userId: string): Promise<ReferralStats> {
        const { data: referrals, error } = await this.supabase
            .from('referrals')
            .select()
            .eq('referrer_id', userId);

        if (error) {
            throw new Error(`Failed to get referral stats: ${error.message}`);
        }

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
