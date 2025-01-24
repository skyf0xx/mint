import { useReferralActions } from '@/lib/actions/userReferralActions';
import {
    useInitialAuth,
    useWalletConnection,
} from '@/lib/effects/userReferralEffects';
import { ReferralActions, ReferralState } from '@/lib/referral';
import { useReferralState } from '@/lib/state/userReferralState';
import { useArweaveWalletInit } from './use-wallet';

export interface StepContentProps {
    state: ReferralState;
    actions: ReferralActions;
}

export const useReferralFlow = (initialReferralCode?: string | null) => {
    useArweaveWalletInit();

    const { state, setError, setLoading, updateState } =
        useReferralState(initialReferralCode);

    useInitialAuth(updateState);
    useWalletConnection(state, updateState, setError, initialReferralCode);

    const actions = useReferralActions(
        state,
        updateState,
        setError,
        setLoading,
        initialReferralCode
    );

    return { state, actions };
};
