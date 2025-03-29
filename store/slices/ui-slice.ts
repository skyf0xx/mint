// store/slices/ui-slice.ts
import { AppView } from '@/types/staking';
import { checkMaintenance } from '@/lib/wallet-actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUISlice = (set: any) => ({
    isLoading: false,
    isStaking: false,
    isUnstaking: false,
    currentView: 'dashboard' as AppView,
    isInMaintenance: false,
    checkingMaintenance: false,

    setView: (view: AppView) => {
        set({ currentView: view });
    },

    resetLoadingState: () => {
        set({
            isLoading: false,
            isStaking: false,
            isUnstaking: false,
        });
    },

    checkMaintenanceStatus: async () => {
        try {
            set({ checkingMaintenance: true });
            const isInMaintenance = await checkMaintenance();
            set({ isInMaintenance, checkingMaintenance: false });
            return isInMaintenance;
        } catch (error) {
            console.error('Error checking maintenance status:', error);
            set({ isInMaintenance: false, checkingMaintenance: false });
            return false;
        }
    },
});
