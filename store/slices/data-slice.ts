// store/slices/data-slice.ts
import { toast } from 'react-toastify';
import { StakingState } from '@/types/staking-store';
import {
    getAllowedTokens,
    getUserPositions,
    getDashboardMetrics,
    getTokenBalance,
} from '@/services/staking-service';
import { StakingPosition, TokenInfo, DashboardMetrics } from '@/types/staking';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createDataSlice = (set: any, get: () => StakingState) => ({
    availableTokens: [] as TokenInfo[],
    userPositions: [] as StakingPosition[],
    selectedPositionId: null as string | null,
    dashboardMetrics: {
        totalStaked: '0',
        totalEarned: '0',
        totalTokens: '0',
        positionsCount: 0,
        oldestPosition: '0d',
    } as DashboardMetrics,

    fetchTokens: async () => {
        try {
            set({ isLoading: true });
            const tokens = await getAllowedTokens();
            set({ availableTokens: tokens });
            return tokens;
        } catch (error) {
            console.error('Error fetching tokens:', error);
            toast.error('Could not retrieve available tokens for staking', {
                autoClose: 5000,
            });
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

    fetchTokenBalance: async (tokenAddress: string, userAddress: string) => {
        try {
            const balanceInfo = await getTokenBalance(
                tokenAddress,
                userAddress
            );
            if (!balanceInfo) return null;

            // Update token balance in available tokens list
            const tokens = [...get().availableTokens];
            const index = tokens.findIndex((t) => t.address === tokenAddress);

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

    selectPosition: (positionId: string | null) => {
        set({ selectedPositionId: positionId });
    },
});
