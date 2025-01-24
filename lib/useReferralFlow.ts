import { useState, useEffect } from 'react';
import { db, ReferralStats, TwitterAuthResponse } from '@/lib/database';
import {
    useArweaveWalletInit,
    useArweaveWalletStore,
} from '@/hooks/use-wallet';

export enum Step {
    TWITTER_AUTH = 1,
    WALLET_CONNECT = 2,
    TWITTER_FOLLOW = 3,
    SHARE = 4,
}
export interface StepContentProps {
    state: {
        step: Step;
        loading: boolean;
        error: string;
        twitterData: TwitterAuthResponse | null;
        walletAddress: string | null;
        referralCode: string;
        referralStats: ReferralStats | null;
    };
    actions: {
        handleTwitterAuth: (data: TwitterAuthResponse) => Promise<void>;
        handleWalletConnect: (address: string) => Promise<void>;
        handleTwitterFollow: () => Promise<void>;
        handleSkipFollow: () => void;
        handleShare: () => Promise<void>;
    };
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

export const useReferralFlow = (initialReferralCode?: string | null) => {
    const [state, setState] = useState<ReferralState>({
        step: Step.TWITTER_AUTH,
        twitterData: null,
        loading: false,
        error: '',
        completedSteps: {
            wallet: false,
            twitter: false,
        },
        referralCode: initialReferralCode || '',
        walletAddress: null,
        referralStats: null,
    });

    useArweaveWalletInit();
    const { address: connectedAddress } = useArweaveWalletStore();

    const setError = (error: string) => setState((s) => ({ ...s, error }));
    const setLoading = (loading: boolean) =>
        setState((s) => ({ ...s, loading }));

    // Check initial auth state
    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await db.supabase.auth.getSession();
            if (session?.user) {
                const twitterData: TwitterAuthResponse = {
                    user: {
                        id: session.user.id,
                        username: session.user.user_metadata.user_name,
                        name: session.user.user_metadata.full_name,
                    },
                };
                setState((s) => ({
                    ...s,
                    twitterData,
                    step: Step.WALLET_CONNECT,
                }));
            }
        };
        checkAuth();
    }, []);

    // Handle wallet connection
    useEffect(() => {
        const initWallet = async () => {
            if (!connectedAddress || !state.twitterData?.user.id) return;

            try {
                const user = await db.linkWalletToTwitterUser(
                    state.twitterData.user.id,
                    connectedAddress
                );

                if (initialReferralCode) {
                    await db.processPendingReferral(connectedAddress);
                }

                const stats = await db.getUserReferralStats(connectedAddress);

                setState((s) => ({
                    ...s,
                    walletAddress: connectedAddress,
                    referralCode: user.referral_code,
                    referralStats: stats,
                    completedSteps: { ...s.completedSteps, wallet: true },
                    step: Step.TWITTER_FOLLOW,
                }));
            } catch (err) {
                setError((err as Error).message);
            }
        };
        initWallet();
    }, [connectedAddress, state.twitterData?.user.id, initialReferralCode]);

    const actions = {
        handleTwitterAuth: async (data: TwitterAuthResponse) => {
            setLoading(true);
            setError('');
            try {
                await db.createOrUpdateUserWithTwitter(data);
                setState((s) => ({
                    ...s,
                    twitterData: data,
                    step: Step.WALLET_CONNECT,
                }));
            } catch (err) {
                setError((err as Error).message);
            }
            setLoading(false);
        },

        handleWalletConnect: async (address: string) => {
            setLoading(true);
            setError('');
            try {
                if (!state.twitterData?.user.id) {
                    throw new Error('Twitter authentication required');
                }

                const user = await db.linkWalletToTwitterUser(
                    state.twitterData.user.id,
                    address
                );

                if (initialReferralCode) {
                    await db.processPendingReferral(address);
                }

                const stats = await db.getUserReferralStats(address);

                setState((s) => ({
                    ...s,
                    walletAddress: address,
                    referralCode: user.referral_code,
                    referralStats: stats,
                    completedSteps: { ...s.completedSteps, wallet: true },
                    step: Step.TWITTER_FOLLOW,
                }));
            } catch (err) {
                setError((err as Error).message);
            }
            setLoading(false);
        },

        handleTwitterFollow: async () => {
            if (!state.walletAddress) return;

            try {
                window.open(
                    'https://twitter.com/intent/follow?screen_name=mithril_labs',
                    '_blank'
                );
                await db.updateTwitterStatus(state.walletAddress, true);
                setState((s) => ({
                    ...s,
                    completedSteps: { ...s.completedSteps, twitter: true },
                    step: Step.SHARE,
                }));
            } catch (err) {
                setError((err as Error).message);
            }
        },

        handleSkipFollow: () => {
            setState((s) => ({
                ...s,
                completedSteps: { ...s.completedSteps, twitter: true },
                step: Step.SHARE,
            }));
        },

        handleShare: async () => {
            if (!state.walletAddress) return;

            try {
                await navigator.clipboard.writeText(
                    `https://mint.example.com/ref/${state.referralCode}`
                );
                const stats = await db.getUserReferralStats(
                    state.walletAddress
                );
                setState((s) => ({ ...s, referralStats: stats }));
            } catch (err) {
                setError((err as Error).message);
            }
        },
    };

    return { state, actions };
};
