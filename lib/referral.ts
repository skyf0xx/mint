// lib/types/referral.ts

export enum Step {
    TWITTER_AUTH = 1,
    WALLET_CONNECT = 2,
    TWITTER_FOLLOW = 3,
    SHARE = 4,
}

export interface TwitterUser {
    id: string;
    username: string;
    name: string;
}

export interface TwitterAuthResponse {
    user: TwitterUser;
}

export interface ReferralStats {
    totalReferrals: number;
    completedReferrals: number;
    pendingReferrals: number;
}

export interface ReferralState {
    step: Step;
    twitterData: TwitterAuthResponse | null;
    loading: boolean;
    error: string;
    completedSteps: {
        wallet: boolean;
        twitter: boolean;
    };
    referralCode: string;
    walletAddress: string | null;
    referralStats: ReferralStats | null;
}

export interface ReferralActions {
    handleTwitterAuth: (data: TwitterAuthResponse) => Promise<void>;
    handleWalletConnect: (address: string) => Promise<void>;
    handleTwitterFollow: () => Promise<void>;
    handleSkipFollow: () => void;
    handleShare: () => Promise<void>;
}
