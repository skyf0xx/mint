// lib/effects/useReferralEffects.ts

import { useEffect } from 'react';
import { db, TwitterAuthResponse } from '../database';
import { useArweaveWalletStore } from '@/hooks/use-wallet';
import { ReferralState, Step } from '../referral';

export const useInitialAuth = (
    updateState: (updates: Partial<ReferralState>) => void
) => {
    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await db.supabase.auth.getSession();
            if (session?.user) {
                const twitterData: TwitterAuthResponse = {
                    user: {
                        id: session.user.id,
                        twitter_id: session.user.identities?.[0]?.id || '',
                        username: session.user.user_metadata.user_name,
                        name: session.user.user_metadata.full_name,
                    },
                };
                updateState({ twitterData, step: Step.WALLET_CONNECT });
            }
        };
        checkAuth();
    }, []);
};

export const useWalletConnection = (
    state: ReferralState,
    updateState: (updates: Partial<ReferralState>) => void,
    setError: (error: string) => void,
    initialReferralCode?: string | null
) => {
    const { address: connectedAddress } = useArweaveWalletStore();

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

                const stats = await db.getUserReferralStats(
                    state.twitterData.user.id
                );

                updateState({
                    walletAddress: connectedAddress,
                    referralCode: user.referral_code,
                    referralStats: stats,
                    completedSteps: {
                        ...state.completedSteps,
                        wallet: true,
                    },
                    step: Step.TWITTER_FOLLOW,
                });
            } catch (err) {
                setError((err as Error).message);
            }
        };
        initWallet();
    }, [
        connectedAddress,
        state.twitterData?.user.id,
        initialReferralCode,
        state.completedSteps,
    ]);
};
