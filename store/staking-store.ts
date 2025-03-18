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
} from '@/services/staking-service';
import { useEffect } from 'react';

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

    pollingInterval: NodeJS.Timeout | null;

    pollingNextTime: number | null;
    pendingOperations: {
        id: string;
        type: 'stake' | 'unstake';
        tokenAddress: string;
        amount?: string;
        timestamp: number;
        userAddress: string;
        positionId?: string;
    }[];

    // Actions
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

            pollingInterval: null,

            pollingNextTime: null,
            pendingOperations: [],

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
                // Get pending stakes from localStorage
                const pendingItems = JSON.parse(
                    localStorage.getItem('pendingStakes') || '[]'
                );

                // If no pending items, stop polling
                if (pendingItems.length === 0) {
                    get().stopPolling(userAddress);
                    return;
                }

                // Get current positions
                const positions = get().userPositions;

                // The current time to check for stale operations
                const currentTime = Date.now();
                const maxAgeMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

                // Filter out completed items and stale items
                const updatedPendingItems = pendingItems.filter(
                    (item: {
                        type: string;
                        positionId: string;
                        tokenAddress: string;
                        amount: string;
                        timestamp: number;
                        userAddress: string;
                    }) => {
                        // Check if item is stale (older than 24 hours)
                        if (currentTime - item.timestamp > maxAgeMs) {
                            return false;
                        }

                        // Only process items for the current user
                        if (item.userAddress !== userAddress) {
                            return true; // Keep items for other users
                        }

                        if (item.type === 'unstake') {
                            // For unstakes, check if the position with that ID is no longer in the list
                            return positions.some(
                                (position) => position.id === item.positionId
                            );
                        } else {
                            // For stakes, check if there's a matching position with the same token address
                            const matchingPosition = positions.find(
                                (position) =>
                                    position.tokenAddress ===
                                        item.tokenAddress &&
                                    // Approximate amount matching (within 1% tolerance)
                                    Math.abs(
                                        parseFloat(
                                            position.formattedTokenAmount
                                        ) - parseFloat(item.amount)
                                    ) /
                                        parseFloat(item.amount) <
                                        0.01
                            );

                            return !matchingPosition;
                        }
                    }
                );

                // Update localStorage with remaining pending items
                localStorage.setItem(
                    'pendingStakes',
                    JSON.stringify(updatedPendingItems)
                );

                // If all items are processed, stop polling
                if (updatedPendingItems.length === 0) {
                    get().stopPolling(userAddress);
                }
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
                            {
                                autoClose: 5000,
                            }
                        );
                        return false;
                    }

                    // Proceed with staking
                    await stakeTokens(tokenAddress, amount);

                    // Store pending stake in localStorage
                    const token = get().availableTokens.find(
                        (t) => t.address === tokenAddress
                    );
                    const pendingStake = {
                        id: `stake-${tokenAddress}-${userAddress}-${Date.now()}`,
                        type: 'stake',
                        tokenAddress,
                        amount,
                        timestamp: Date.now(),
                        userAddress: userAddress as string,
                        tokenSymbol: token?.symbol || 'Unknown Token',
                    };

                    // Get existing pending stakes
                    const existingPendingStakes = JSON.parse(
                        localStorage.getItem('pendingStakes') || '[]'
                    );

                    // Add new pending stake
                    existingPendingStakes.push(pendingStake);

                    // Save back to localStorage
                    localStorage.setItem(
                        'pendingStakes',
                        JSON.stringify(existingPendingStakes)
                    );

                    toast.success(
                        'Your tokens are being staked. This may take a few minutes to complete.',
                        {
                            autoClose: 5000,
                        }
                    );

                    get().startPolling(userAddress as string);

                    // Return to dashboard
                    set({ currentView: 'dashboard' });

                    const event = new CustomEvent('pendingOperationsUpdated');
                    window.dispatchEvent(event);
                    return true;
                } catch (error) {
                    console.error('Staking error:', error);
                    toast.error(
                        'There was an error processing your staking transaction',
                        {
                            autoClose: 5000,
                        }
                    );
                    return false;
                } finally {
                    set({ isStaking: false });
                }
            },

            unstakePosition: async (positionId: string) => {
                try {
                    set({ isUnstaking: true });

                    // Find the position
                    const position = get().userPositions.find(
                        (p) => p.id === positionId
                    );
                    if (!position) {
                        throw new Error('Position not found');
                    }

                    // Perform unstaking (removed duplicate call)
                    await unstakeTokens(position.tokenAddress);

                    // Store pending unstake in localStorage
                    const userAddress =
                        await window.arweaveWallet?.getActiveAddress();
                    const pendingUnstake = {
                        id: `unstake-${positionId}-${Date.now()}`,
                        type: 'unstake',
                        positionId,
                        tokenAddress: position.tokenAddress,
                        timestamp: Date.now(),
                        userAddress: userAddress as string,
                    };

                    // Get existing pending items
                    const existingPendingItems = JSON.parse(
                        localStorage.getItem('pendingStakes') || '[]'
                    );

                    // Add new pending unstake
                    existingPendingItems.push(pendingUnstake);

                    // Save back to localStorage
                    localStorage.setItem(
                        'pendingStakes',
                        JSON.stringify(existingPendingItems)
                    );

                    // Start polling for completion
                    get().startPolling(userAddress as string);

                    toast.success(
                        'Your tokens are being unstaked. This may take a few minutes to complete.',
                        {
                            autoClose: 5000,
                        }
                    );

                    // Return to dashboard
                    set({ currentView: 'dashboard' });
                    return true;
                } catch (error) {
                    console.error('Unstaking error:', error);
                    toast.error(
                        'There was an error processing your unstaking transaction',
                        {
                            autoClose: 5000,
                        }
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
    const { fetchTokens, fetchPositions, fetchDashboardMetrics, startPolling } =
        useStakingStore();

    useEffect(() => {
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
    ]);
};
