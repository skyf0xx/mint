import { useReferralActions } from '@/hooks/use-referralActions';
import {
    useInitialAuth,
    useWalletConnection,
} from '@/hooks/use-referralEffects';
import { ReferralActions, ReferralState } from '@/lib/referral';
import { useReferralState } from '@/hooks/use-referralState';
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
