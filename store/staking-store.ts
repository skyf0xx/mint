// store/staking-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import {
    StakingPosition,
    TokenInfo,
    AppView,
    DashboardMetrics,
} from '@/types/staking';
import {
    getAllowedTokens,
    getUserPositions,
    stakeTokens,
    unstakeTokens,
    getDashboardMetrics,
    getTokenBalance,
    checkSufficientBalance,
    deleteUserPositionsCache,
    getUserOperations,
} from '@/services/staking-service';
import { checkMaintenance } from '@/lib/wallet-actions';
import { useEffect } from 'react';
import {
    Transaction,
    TransactionStage,
} from '@/components/app/dashboard/transaction/transaction-status';

interface StakingState {
    // Data states
    availableTokens: TokenInfo[];
    userPositions: StakingPosition[];
    selectedPositionId: string | null;
    dashboardMetrics: DashboardMetrics;

    // UI states
    isLoading: boolean;
    isStaking: boolean;
    isUnstaking: boolean;
    currentView: AppView;
    isInMaintenance: boolean;
    checkingMaintenance: boolean;

    pollingInterval: NodeJS.Timeout | null;

    pollingNextTime: number | null;

    transactions: Transaction[];
    getTransactions: (userAddress: string) => Transaction[];
    updateTransactionStage: (id: string, stage: TransactionStage) => void;
    removeTransaction: (id: string) => void;
    removeCompletedTransactions: () => void;
    checkTransactionStatus: (id: string) => Promise<void>;

    pendingOperations: {
        id: string;
        type: 'stake' | 'unstake';
        tokenAddress: string;
        amount?: string;
        timestamp: number;
        userAddress: string;
        positionId?: string;
        failureReason?: string;
        failedAt?: number;
    }[];

    // Maintenance mode actions
    checkMaintenanceStatus: () => Promise<boolean>;

    // Other actions
    getPendingOperations: (userAddress: string) => void;
    triggerManualCheck: (userAddress: string) => Promise<void>;
    startPolling: (userAddress: string) => void;
    stopPolling: (userAddress: string) => void;
    checkPendingStakes: (userAddress: string) => Promise<void>;

    fetchTokens: () => Promise<TokenInfo[]>;
    fetchPositions: (userAddress: string) => Promise<StakingPosition[]>;
    fetchDashboardMetrics: (userAddress: string) => Promise<DashboardMetrics>;

    fetchTokenBalance: (
        tokenAddress: string,
        userAddress: string
    ) => Promise<string | null>;

    selectPosition: (positionId: string | null) => void;
    setView: (view: AppView) => void;

    stakeToken: (tokenAddress: string, amount: string) => Promise<boolean>;
    unstakePosition: (tokenAddress: string) => Promise<boolean>;

    checkBalance: (
        tokenAddress: string,
        amount: string,
        userAddress: string
    ) => Promise<boolean>;
    resetLoadingState: () => void;
}

export const useStakingStore = create<StakingState>()(
    devtools(
        (set, get) => ({
            // Initial data states
            availableTokens: [],
            userPositions: [],
            selectedPositionId: null,
            dashboardMetrics: {
                totalStaked: '0',
                totalEarned: '0',
                totalTokens: '0',
                positionsCount: 0,
                oldestPosition: '0d',
            },

            // Initial UI states
            isLoading: false,
            isStaking: false,
            isUnstaking: false,
            currentView: 'dashboard',
            isInMaintenance: false,
            checkingMaintenance: false,

            pollingInterval: null,

            pollingNextTime: null,
            pendingOperations: [],

            // Maintenance mode check
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

            // Initialize transactions array
            transactions: [],

            // Get transactions for a user
            getTransactions: (userAddress: string) => {
                return get().transactions.filter(
                    (tx) => tx.userAddress === userAddress
                );
            },

            // Update transaction stage
            updateTransactionStage: (id: string, stage: TransactionStage) => {
                const transactions = [...get().transactions];
                const index = transactions.findIndex((tx) => tx.id === id);

                if (index >= 0) {
                    transactions[index] = {
                        ...transactions[index],
                        stage,
                        // Add timestamp for completed or failed stages
                        ...(stage === 'completed' || stage === 'failed'
                            ? { completedAt: Date.now() }
                            : {}),
                    };

                    set({ transactions });

                    // Create a custom event to notify UI components
                    const event = new CustomEvent('transactionUpdated', {
                        detail: { id, stage },
                    });
                    window.dispatchEvent(event);

                    // Show appropriate notifications
                    if (stage === 'completed') {
                        const tx = transactions[index];
                        toast.success(
                            `${tx.type === 'stake' ? 'Staking' : 'Unstaking'} ${
                                tx.amount
                            } ${tx.tokenSymbol} completed successfully!`,
                            { autoClose: 5000 }
                        );
                    } else if (stage === 'failed') {
                        const tx = transactions[index];
                        toast.error(
                            `${
                                tx.type === 'stake' ? 'Staking' : 'Unstaking'
                            } transaction failed. ${tx.failureReason || ''}`,
                            { autoClose: 7000 }
                        );
                    }
                }
            },

            // Remove a transaction
            removeTransaction: (id: string) => {
                const transactions = get().transactions.filter(
                    (tx) => tx.id !== id
                );
                set({ transactions });
            },

            // Remove all completed transactions
            removeCompletedTransactions: () => {
                const transactions = get().transactions.filter(
                    (tx) => tx.stage !== 'completed' && tx.stage !== 'failed'
                );
                set({ transactions });
            },

            // Check status of a specific transaction
            checkTransactionStatus: async (id: string) => {
                const transaction = get().transactions.find(
                    (tx) => tx.id === id
                );
                if (!transaction) return;

                try {
                    // For stake operations
                    if (transaction.type === 'stake') {
                        // Check if the position exists now
                        const positions = await get().fetchPositions(
                            transaction.userAddress
                        );
                        const matchingPosition = positions.find((position) => {
                            const fetchedAmount = parseFloat(
                                position.formattedTokenAmount
                            );
                            const txAmount = parseFloat(transaction.amount);

                            return (
                                position.tokenAddress ===
                                    transaction.tokenAddress &&
                                (Math.abs(fetchedAmount - txAmount) / txAmount <
                                    0.01 ||
                                    fetchedAmount - txAmount >= 0)
                            );
                        });

                        if (matchingPosition) {
                            // Position found - transaction completed
                            get().updateTransactionStage(id, 'completed');
                        } else {
                            // Check for failure on blockchain
                            const operations = await getUserOperations(
                                transaction.userAddress,
                                'failed'
                            );
                            const failedOp = operations.find(
                                (op) => op.clientOperationId === id
                            );

                            if (failedOp) {
                                get().updateTransactionStage(id, 'failed');
                                // Update failure details
                                const transactions = [...get().transactions];
                                const index = transactions.findIndex(
                                    (tx) => tx.id === id
                                );
                                if (index >= 0) {
                                    transactions[index].failureReason =
                                        failedOp.failureReason;
                                    transactions[index].failedAt =
                                        failedOp.failedAt;
                                    set({ transactions });
                                }
                            }
                            // If not matched and not failed, transaction is still pending
                        }
                    }
                    // For unstake operations
                    else if (transaction.type === 'unstake') {
                        // Check if position still exists
                        const positions = await get().fetchPositions(
                            transaction.userAddress
                        );
                        const positionStillExists = positions.some(
                            (p) => p.id === transaction.positionId
                        );

                        if (!positionStillExists) {
                            // Position no longer exists - unstake completed
                            get().updateTransactionStage(id, 'completed');
                        } else {
                            // Check for failure on blockchain
                            const operations = await getUserOperations(
                                transaction.userAddress,
                                'failed'
                            );
                            const failedOp = operations.find(
                                (op) => op.clientOperationId === id
                            );

                            if (failedOp) {
                                get().updateTransactionStage(id, 'failed');
                                // Update failure details
                                const transactions = [...get().transactions];
                                const index = transactions.findIndex(
                                    (tx) => tx.id === id
                                );
                                if (index >= 0) {
                                    transactions[index].failureReason =
                                        failedOp.failureReason;
                                    transactions[index].failedAt =
                                        failedOp.failedAt;
                                    set({ transactions });
                                }
                            }
                            // If position still exists and no failure, transaction is still pending
                        }
                    }
                } catch (error) {
                    console.error('Error checking transaction status:', error);
                    // Don't update status on error - just continue trying
                }
            },

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

                        // Then check if any pending stakes are complete
                        await get().checkPendingStakes(userAddress);

                        // Update next poll time and pending operations
                        set({ pollingNextTime: Date.now() + 30000 });
                        get().getPendingOperations(userAddress);

                        // Dispatch a custom event to notify UI components
                        const event = new CustomEvent(
                            'pendingOperationsUpdated'
                        );
                        window.dispatchEvent(event);
                    } catch (error) {
                        console.error('Error during polling:', error);
                        // Don't stop polling on error - just continue trying
                    }
                }, 30000); // 30 second interval

                set({ pollingInterval: interval as unknown as NodeJS.Timeout });
            },

            // Get pending operations for a specific user
            getPendingOperations: (userAddress: string) => {
                const pendingItems = JSON.parse(
                    localStorage.getItem('pendingStakes') || '[]'
                ).filter(
                    (item: { userAddress: string }) =>
                        item.userAddress === userAddress
                );

                set({ pendingOperations: pendingItems });
            },

            // Allow UI to trigger an immediate check
            triggerManualCheck: async (userAddress: string) => {
                try {
                    // Check maintenance status as well
                    await get().checkMaintenanceStatus();

                    // Reset timer
                    set({ pollingNextTime: Date.now() + 30000 });

                    // Run all the checks
                    await get().fetchPositions(userAddress);
                    await get().fetchDashboardMetrics(userAddress);
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

            stopPolling: (userAddress) => {
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
            },

            // Data fetching actions
            fetchTokens: async () => {
                try {
                    set({ isLoading: true });
                    const tokens = await getAllowedTokens();
                    set({ availableTokens: tokens });
                    return tokens;
                } catch (error) {
                    console.error('Error fetching tokens:', error);
                    toast.error(
                        'Could not retrieve available tokens for staking',
                        {
                            autoClose: 5000,
                        }
                    );
                    return [];
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchPositions: async (userAddress: string) => {
                try {
                    set({ isLoading: true });
                    let positions = await getUserPositions(userAddress);

                    // Enhance positions with additional data needed by the updated interface
                    positions = await Promise.all(
                        positions.map(async (position) => {
                            // Calculate estimated rewards (mock data until actual API is available)
                            const estimatedRewards = (
                                parseFloat(position.formattedTokenAmount) * 0.05
                            ).toFixed(2);

                            return {
                                ...position,
                                initialAmount: position.formattedTokenAmount,
                                estimatedRewards: estimatedRewards,
                                token: position.tokenSymbol, // Needed for components that use position.token
                            } as StakingPosition;
                        })
                    );

                    set({ userPositions: positions });
                    return positions;
                } catch (error) {
                    console.error('Error fetching positions:', error);
                    toast.error('Could not retrieve your staking positions', {
                        autoClose: 5000,
                    });
                    return [];
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchDashboardMetrics: async (userAddress: string) => {
                try {
                    const metrics = await getDashboardMetrics(userAddress);
                    set({ dashboardMetrics: metrics });
                    return metrics;
                } catch (error) {
                    console.error('Error fetching dashboard metrics:', error);
                    return get().dashboardMetrics;
                }
            },

            fetchTokenBalance: async (
                tokenAddress: string,
                userAddress: string
            ) => {
                try {
                    const balanceInfo = await getTokenBalance(
                        tokenAddress,
                        userAddress
                    );
                    if (!balanceInfo) return null;

                    // Update token balance in available tokens list
                    const tokens = [...get().availableTokens];
                    const index = tokens.findIndex(
                        (t) => t.address === tokenAddress
                    );

                    if (index >= 0) {
                        tokens[index] = {
                            ...tokens[index],
                            balance: balanceInfo.balance,
                        };
                        set({ availableTokens: tokens });
                    }

                    return balanceInfo.balance;
                } catch (error) {
                    console.error('Error fetching token balance:', error);
                    return null;
                }
            },

            // UI state actions
            selectPosition: (positionId: string | null) => {
                set({ selectedPositionId: positionId });
            },

            setView: (view: AppView) => {
                set({ currentView: view });
            },

            // Operation actions
            stakeToken: async (tokenAddress: string, amount: string) => {
                try {
                    // Check for maintenance mode first
                    const isInMaintenance =
                        await get().checkMaintenanceStatus();
                    if (isInMaintenance) {
                        toast.warning(
                            'Staking is temporarily unavailable during maintenance.',
                            { autoClose: 5000 }
                        );
                        return false;
                    }

                    set({ isStaking: true });

                    // Check balance first
                    const userAddress =
                        await window.arweaveWallet?.getActiveAddress();
                    const hasBalance = await get().checkBalance(
                        tokenAddress,
                        amount,
                        userAddress as string
                    );

                    if (!hasBalance) {
                        toast.error(
                            'You do not have enough tokens to complete this transaction',
                            { autoClose: 5000 }
                        );
                        return false;
                    }

                    // Generate transaction ID
                    const transactionId = `stake-${tokenAddress}-${userAddress}-${Date.now()}`;

                    // Get token details
                    const token = get().availableTokens.find(
                        (t) => t.address === tokenAddress
                    );

                    // Create transaction object with initial 'pending' stage
                    const transaction: Transaction = {
                        id: transactionId,
                        type: 'stake',
                        tokenAddress,
                        tokenSymbol: token?.symbol || 'Unknown',
                        amount,
                        timestamp: Date.now(),
                        userAddress: userAddress as string,
                        stage: 'pending',
                        estimatedTimeMinutes: 5,
                    };

                    // Add to transactions list
                    set({ transactions: [...get().transactions, transaction] });

                    // Proceed with staking
                    await stakeTokens(tokenAddress, amount, transactionId);

                    toast.success(
                        'Your staking transaction has been submitted. You can track its progress above.',
                        { autoClose: 5000 }
                    );

                    // Start polling
                    get().startPolling(userAddress as string);

                    // Return to dashboard
                    set({ currentView: 'dashboard' });

                    return true;
                } catch (error) {
                    console.error('Staking error:', error);
                    toast.error(
                        'There was an error processing your staking transaction',
                        { autoClose: 5000 }
                    );
                    return false;
                } finally {
                    set({ isStaking: false });
                }
            },

            unstakePosition: async (positionId: string) => {
                try {
                    // Check for maintenance mode first
                    const isInMaintenance =
                        await get().checkMaintenanceStatus();
                    if (isInMaintenance) {
                        toast.warning(
                            'Unstaking is temporarily unavailable during maintenance.',
                            { autoClose: 5000 }
                        );
                        return false;
                    }

                    set({ isUnstaking: true });

                    // Find the position
                    const position = get().userPositions.find(
                        (p) => p.id === positionId
                    );
                    if (!position) {
                        throw new Error('Position not found');
                    }

                    // Get user address
                    const userAddress =
                        await window.arweaveWallet?.getActiveAddress();

                    // Generate transaction ID
                    const transactionId = `unstake-${positionId}-${Date.now()}`;

                    // Create transaction object with initial 'pending' stage
                    const transaction: Transaction = {
                        id: transactionId,
                        type: 'unstake',
                        tokenAddress: position.tokenAddress,
                        tokenSymbol: position.tokenSymbol,
                        amount: position.formattedTokenAmount,
                        timestamp: Date.now(),
                        userAddress: userAddress as string,
                        positionId,
                        stage: 'pending',
                        estimatedTimeMinutes: 5,
                    };

                    // Add to transactions list
                    set({ transactions: [...get().transactions, transaction] });

                    // Perform unstaking
                    await unstakeTokens(position.tokenAddress, transactionId);

                    toast.success(
                        'Your unstaking transaction has been submitted. You can track its progress above.',
                        { autoClose: 5000 }
                    );

                    // Start polling
                    get().startPolling(userAddress as string);

                    // Return to dashboard
                    set({ currentView: 'dashboard' });
                    return true;
                } catch (error) {
                    console.error('Unstaking error:', error);
                    toast.error(
                        'There was an error processing your unstaking transaction',
                        { autoClose: 5000 }
                    );
                    return false;
                } finally {
                    set({ isUnstaking: false });
                }
            },

            // Utility functions
            checkBalance: async (
                tokenAddress: string,
                amount: string,
                userAddress: string
            ) => {
                try {
                    return await checkSufficientBalance(
                        tokenAddress,
                        amount,
                        userAddress
                    );
                } catch (error) {
                    console.error('Error checking balance:', error);
                    return false;
                }
            },

            resetLoadingState: () => {
                set({
                    isLoading: false,
                    isStaking: false,
                    isUnstaking: false,
                });
            },
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
        startPolling,
        checkMaintenanceStatus,
    ]);
};
