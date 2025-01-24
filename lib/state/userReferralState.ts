// lib/state/useReferralState.ts

import { useState } from 'react';
import { ReferralState, Step } from '../referral';

export const initialReferralState = (
    referralCode?: string | null
): ReferralState => ({
    step: Step.TWITTER_AUTH,
    twitterData: null,
    loading: false,
    error: '',
    completedSteps: {
        wallet: false,
        twitter: false,
    },
    referralCode: referralCode || '',
    walletAddress: null,
    referralStats: null,
});

export const useReferralState = (initialReferralCode?: string | null) => {
    const [state, setState] = useState<ReferralState>(
        initialReferralState(initialReferralCode)
    );

    const setError = (error: string) => setState((s) => ({ ...s, error }));
    const setLoading = (loading: boolean) =>
        setState((s) => ({ ...s, loading }));
    const updateState = (updates: Partial<ReferralState>) =>
        setState((s) => ({ ...s, ...updates }));

    return {
        state,
        setError,
        setLoading,
        updateState,
    };
};
