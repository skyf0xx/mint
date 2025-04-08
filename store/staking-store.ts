// store/staking-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useEffect } from 'react';
import { StakingState } from '@/types/staking-store';
import { createDataSlice } from './slices/data-slice';
import { createUISlice } from './slices/ui-slice';
import { createOperationsSlice } from './slices/operations-slice';
import { createTransactionSlice } from './slices/transaction-slice';
import { createPollingSlice } from './slices/polling-slice';
import { createRewardsSlice } from './slices/rewards-slice';

// Create the store with all slices combined
export const useStakingStore = create<StakingState>()(
    devtools(
        (set, get) => ({
            ...createDataSlice(set, get),
            ...createUISlice(set),
            ...createOperationsSlice(set, get),
            ...createTransactionSlice(set, get),
            ...createPollingSlice(set, get),
            ...createRewardsSlice(set, get),
        }),
        { name: 'staking-store' }
    )
);

// Hook for initializing and auto-refreshing staking data
export const useStakingInit = (userAddress: string | null) => {
    const {
        fetchTokens,
        fetchPositions,
        fetchDashboardMetrics,
        fetchUserRewards,
        fetchRewardsSummary,
        fetchStakeOwnership,
        startPolling,
        checkMaintenanceStatus,
    } = useStakingStore();

    useEffect(() => {
        // Check maintenance status first
        checkMaintenanceStatus();

        // Load data when wallet is connected
        if (userAddress) {
            fetchTokens();
            fetchPositions(userAddress);
            fetchDashboardMetrics(userAddress);
            fetchUserRewards(userAddress);
            fetchRewardsSummary();
            fetchStakeOwnership(userAddress); // Call the function

            // Check for pending stakes and start polling if needed
            const pendingStakes = JSON.parse(
                localStorage.getItem('pendingStakes') || '[]'
            );
            if (pendingStakes.length > 0) {
                startPolling(userAddress);
            }
        }
    }, [
        userAddress,
        fetchTokens,
        fetchPositions,
        fetchDashboardMetrics,
        fetchUserRewards,
        fetchRewardsSummary,
        fetchStakeOwnership, // Add dependency
        startPolling,
        checkMaintenanceStatus,
    ]);
};
