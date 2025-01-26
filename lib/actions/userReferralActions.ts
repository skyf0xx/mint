// lib/actions/useReferralActions.ts

import { db, TwitterAuthResponse } from '../database';
import { ReferralState, Step } from '../referral';

export const useReferralActions = (
    state: ReferralState,
    updateState: (updates: Partial<ReferralState>) => void,
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void,
    initialReferralCode?: string | null
) => {
    const handleTwitterAuth = async (data: TwitterAuthResponse) => {
        setLoading(true);
        setError('');
        try {
            await db.createOrUpdateUserWithTwitter(data);
            updateState({
                twitterData: data,
                step: Step.WALLET_CONNECT,
            });
        } catch (err) {
            setError((err as Error).message);
        }
        setLoading(false);
    };

    const handleWalletConnect = async (address: string) => {
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

            const stats = await db.getUserReferralStats(
                state.twitterData.user.id
            );

            updateState({
                walletAddress: address,
                referralCode: user.referral_code,
                referralStats: stats,
                completedSteps: { ...state.completedSteps, wallet: true },
                step: Step.TWITTER_FOLLOW,
            });
        } catch (err) {
            setError((err as Error).message);
        }
        setLoading(false);
    };

    const handleTwitterFollow = async () => {
        if (!state.walletAddress) return;

        try {
            window.open(
                'https://twitter.com/intent/follow?screen_name=mithril_labs',
                '_blank'
            );
            await db.updateTwitterStatus(state.walletAddress, true);
            updateState({
                completedSteps: { ...state.completedSteps, twitter: true },
                step: Step.SHARE,
            });
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const handleSkipFollow = () => {
        updateState({
            completedSteps: { ...state.completedSteps, twitter: true },
            step: Step.SHARE,
        });
    };

    const handleShare = async () => {
        if (!state.walletAddress) return;

        try {
            await navigator.clipboard.writeText(
                `https://mint.example.com/ref/${state.referralCode}`
            );
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return {
        handleTwitterAuth,
        handleWalletConnect,
        handleTwitterFollow,
        handleSkipFollow,
        handleShare,
    };
};
