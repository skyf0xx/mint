// store/staking-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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
    getPositionDetails,
    getDashboardMetrics,
    getTokenBalance,
    checkSufficientBalance,
} from '@/services/staking-service';
import { toast } from '@/hooks/use-toast';
import React from 'react';

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

    // Actions
    fetchTokens: () => Promise<TokenInfo[]>;
    fetchPositions: (userAddress: string) => Promise<StakingPosition[]>;
    fetchDashboardMetrics: (userAddress: string) => Promise<DashboardMetrics>;
    fetchPositionDetails: (
        positionId: string,
        userAddress: string
    ) => Promise<StakingPosition | null>;
    fetchTokenBalance: (
        tokenAddress: string,
        userAddress: string
    ) => Promise<string | null>;

    selectPosition: (positionId: string | null) => void;
    setView: (view: AppView) => void;

    stakeToken: (tokenAddress: string, amount: string) => Promise<boolean>;
    unstakePosition: (positionId: string, amount: string) => Promise<boolean>;

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
                averageILProtection: 0,
                totalEarned: '0',
            },

            // Initial UI states
            isLoading: false,
            isStaking: false,
            isUnstaking: false,
            currentView: 'dashboard',

            // Data fetching actions
            fetchTokens: async () => {
                try {
                    set({ isLoading: true });
                    const tokens = await getAllowedTokens();
                    set({ availableTokens: tokens });
                    return tokens;
                } catch (error) {
                    console.error('Error fetching tokens:', error);
                    toast({
                        title: 'Failed to Load Tokens',
                        description:
                            'Could not retrieve available tokens for staking',
                        variant: 'destructive',
                    });
                    return [];
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchPositions: async (userAddress: string) => {
                try {
                    set({ isLoading: true });
                    const positions = await getUserPositions(userAddress);
                    set({ userPositions: positions });
                    return positions;
                } catch (error) {
                    console.error('Error fetching positions:', error);
                    toast({
                        title: 'Failed to Load Positions',
                        description:
                            'Could not retrieve your staking positions',
                        variant: 'destructive',
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

            fetchPositionDetails: async (
                positionId: string,
                userAddress: string
            ) => {
                try {
                    set({ isLoading: true });
                    const position = await getPositionDetails(
                        positionId,
                        userAddress
                    );

                    // Update the position in the positions array if it exists
                    if (position) {
                        const positions = [...get().userPositions];
                        const index = positions.findIndex(
                            (p) => p.id === positionId
                        );

                        if (index >= 0) {
                            positions[index] = position;
                            set({ userPositions: positions });
                        }
                    }

                    return position;
                } catch (error) {
                    console.error('Error fetching position details:', error);
                    toast({
                        title: 'Position Details Error',
                        description:
                            'Failed to load detailed position information',
                        variant: 'destructive',
                    });
                    return null;
                } finally {
                    set({ isLoading: false });
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
                        toast({
                            title: 'Insufficient Balance',
                            description:
                                'You do not have enough tokens to complete this transaction',
                            variant: 'destructive',
                        });
                        return false;
                    }

                    // Proceed with staking
                    await stakeTokens(tokenAddress, amount);

                    toast({
                        title: 'Staking Initiated',
                        description:
                            'Your tokens are being staked. This may take a few minutes to complete.',
                    });

                    // Wait a moment before refreshing positions to allow blockchain to process
                    setTimeout(async () => {
                        await get().fetchPositions(userAddress as string);
                        await get().fetchDashboardMetrics(
                            userAddress as string
                        );
                    }, 10000); // 10 second delay

                    // Return to dashboard
                    set({ currentView: 'dashboard' });
                    return true;
                } catch (error) {
                    console.error('Staking error:', error);
                    toast({
                        title: 'Staking Failed',
                        description:
                            'There was an error processing your staking transaction',
                        variant: 'destructive',
                    });
                    return false;
                } finally {
                    set({ isStaking: false });
                }
            },

            unstakePosition: async (positionId: string, amount: string) => {
                try {
                    set({ isUnstaking: true });

                    // Find the position
                    const position = get().userPositions.find(
                        (p) => p.id === positionId
                    );
                    if (!position) {
                        throw new Error('Position not found');
                    }

                    // Perform unstaking
                    await unstakeTokens(position.tokenAddress, amount);

                    toast({
                        title: 'Unstaking Initiated',
                        description:
                            'Your tokens are being unstaked. This may take a few minutes to complete.',
                    });

                    // Wait a moment and refresh user data
                    const userAddress =
                        await window.arweaveWallet?.getActiveAddress();
                    setTimeout(async () => {
                        await get().fetchPositions(userAddress as string);
                        await get().fetchDashboardMetrics(
                            userAddress as string
                        );
                        await get().fetchTokenBalance(
                            position.tokenAddress,
                            userAddress as string
                        );
                    }, 10000); // 10 second delay

                    // Return to dashboard
                    set({ currentView: 'dashboard' });
                    return true;
                } catch (error) {
                    console.error('Unstaking error:', error);
                    toast({
                        title: 'Unstaking Failed',
                        description:
                            'There was an error processing your unstaking transaction',
                        variant: 'destructive',
                    });
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
    const { fetchTokens, fetchPositions, fetchDashboardMetrics } =
        useStakingStore();

    React.useEffect(() => {
        // Load data when wallet is connected
        if (userAddress) {
            fetchTokens();
            fetchPositions(userAddress);
            fetchDashboardMetrics(userAddress);

            // Set up periodic refresh
            const refreshInterval = setInterval(() => {
                if (userAddress) {
                    fetchPositions(userAddress);
                    fetchDashboardMetrics(userAddress);
                }
            }, 60000); // Refresh every minute

            return () => clearInterval(refreshInterval);
        }
    }, [userAddress]);
};
