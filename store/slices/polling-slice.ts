// store/slices/polling-slice.ts
import { toast } from 'react-toastify';
import { StakingState, PendingOperation } from '@/types/staking-store';
import { deleteUserPositionsCache } from '@/services/staking-service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPollingSlice = (set: any, get: () => StakingState) => ({
    pollingInterval: null as NodeJS.Timeout | null,
    pollingNextTime: null as number | null,
    pendingOperations: [] as PendingOperation[],

    startPolling: (userAddress: string) => {
        deleteUserPositionsCache(userAddress);
        const { pollingInterval } = get();

        // Don't create a new interval if one is already running
        if (pollingInterval) return;

        // Set the next poll time
        set({ pollingNextTime: Date.now() + 30000 });

        // Load pending operations initially
        get().getPendingOperations(userAddress);

        const interval = setInterval(async () => {
            try {
                // Refresh positions first
                await get().fetchPositions(userAddress);
                await get().fetchDashboardMetrics(userAddress);

                // Also fetch rewards data
                await get().fetchUserRewards(userAddress);

                // Then check if any pending stakes are complete
                await get().checkPendingStakes(userAddress);

                // Update next poll time and pending operations
                set({ pollingNextTime: Date.now() + 30000 });
                get().getPendingOperations(userAddress);

                // Dispatch a custom event to notify UI components
                const event = new CustomEvent('pendingOperationsUpdated');
                window.dispatchEvent(event);
            } catch (error) {
                console.error('Error during polling:', error);
                // Don't stop polling on error - just continue trying
            }
        }, 30000); // 30 second interval

        set({ pollingInterval: interval as unknown as NodeJS.Timeout });
    },

    getPendingOperations: (userAddress: string) => {
        const pendingItems = JSON.parse(
            localStorage.getItem('pendingStakes') || '[]'
        ).filter(
            (item: { userAddress: string }) => item.userAddress === userAddress
        );

        set({ pendingOperations: pendingItems });
    },

    triggerManualCheck: async (userAddress: string) => {
        try {
            // Check maintenance status as well
            await get().checkMaintenanceStatus();

            // Reset timer
            set({ pollingNextTime: Date.now() + 30000 });

            // Run all the checks
            await get().fetchPositions(userAddress);
            await get().fetchDashboardMetrics(userAddress);
            await get().fetchUserRewards(userAddress);
            await get().checkPendingStakes(userAddress);
            get().getPendingOperations(userAddress);

            // Notify UI with toast
            toast.info('Checking for completed transactions...', {
                autoClose: 2000,
            });
        } catch (error) {
            console.error('Error during manual check:', error);
            toast.error('Failed to check transaction status', {
                autoClose: 3000,
            });
        }
    },

    stopPolling: (userAddress: string) => {
        deleteUserPositionsCache(userAddress);
        const { pollingInterval } = get();

        if (pollingInterval) {
            clearInterval(pollingInterval);
            set({ pollingInterval: null });
        }
    },

    checkPendingStakes: async (userAddress: string) => {
        // Process all active transactions
        const transactions = get().transactions.filter(
            (tx) =>
                tx.stage !== 'completed' &&
                tx.stage !== 'failed' &&
                tx.userAddress === userAddress
        );

        if (transactions.length === 0) {
            get().stopPolling(userAddress);
            return;
        }

        // Check status for each transaction
        for (const transaction of transactions) {
            await get().checkTransactionStatus(transaction.id);
        }

        // Refresh positions and metrics
        await get().fetchPositions(userAddress);
        await get().fetchDashboardMetrics(userAddress);
        await get().fetchUserRewards(userAddress);
    },
});
