import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface User {
    wallet_address: string;
    referral_code: string;
    total_referrals: number;
    twitter_followed: boolean;
    created_at: string;
    updated_at: string;
}

export interface Referral {
    id: string;
    referrer_address: string;
    referred_address: string;
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

    // User Functions
    async upsertUser(walletAddress: string): Promise<User> {
        const referralCode = this.generateReferralCode(walletAddress);

        const { data, error } = await this.supabase
            .from('users')
            .upsert({
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
        const { error } = await this.supabase
            .from('users')
            .update({
                twitter_followed: followed,
                updated_at: new Date().toISOString(),
            })
            .eq('wallet_address', walletAddress);

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

    // Referral Functions
    async createReferral(
        referrerAddress: string,
        referredAddress: string
    ): Promise<Referral> {
        await this.validateReferral(referrerAddress, referredAddress);

        const { data, error } = await this.supabase
            .from('referrals')
            .insert({
                referrer_address: referrerAddress,
                referred_address: referredAddress,
            })
            .select()
            .single();

        if (error)
            throw new Error(`Failed to create referral: ${error.message}`);

        // Increment referral count
        await this.supabase.rpc('increment_referral_count', {
            address: referrerAddress,
        });

        return data;
    }

    async updateReferralStatus(
        referralId: string,
        status: 'pending' | 'completed'
    ): Promise<void> {
        const { error } = await this.supabase
            .from('referrals')
            .update({ status })
            .eq('id', referralId);

        if (error)
            throw new Error(
                `Failed to update referral status: ${error.message}`
            );
    }

    async getReferralsByUser(
        walletAddress: string,
        type: 'referrer' | 'referred'
    ): Promise<Referral[]> {
        const column =
            type === 'referrer' ? 'referrer_address' : 'referred_address';

        const { data, error } = await this.supabase
            .from('referrals')
            .select()
            .eq(column, walletAddress)
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to get referrals: ${error.message}`);
        return data || [];
    }

    async getUserReferralStats(walletAddress: string): Promise<ReferralStats> {
        const { data: referrals, error } = await this.supabase
            .from('referrals')
            .select()
            .eq('referrer_address', walletAddress);

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

    // Validation Functions
    private async validateReferral(
        referrerAddress: string,
        referredAddress: string
    ): Promise<boolean> {
        if (referrerAddress === referredAddress) {
            throw new Error('Self-referrals are not allowed');
        }

        const { data: existingReferral, error } = await this.supabase
            .from('referrals')
            .select()
            .eq('referrer_address', referrerAddress)
            .eq('referred_address', referredAddress)
            .single();

        if (existingReferral) {
            throw new Error('Duplicate referral');
        }

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Referral validation failed: ${error.message}`);
        }

        return true;
    }

    async checkRateLimits(walletAddress: string): Promise<boolean> {
        const { count, error } = await this.supabase
            .from('referrals')
            .select('id', { count: 'exact', head: true })
            .eq('referrer_address', walletAddress)
            .gte(
                'created_at',
                new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            );

        if (error)
            throw new Error(`Failed to check rate limits: ${error.message}`);

        const DAILY_LIMIT = 10;
        return (count || 0) < DAILY_LIMIT;
    }

    // Helper Functions
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
