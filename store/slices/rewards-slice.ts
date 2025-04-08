// store/slices/rewards-slice.ts
import { StakingState } from '@/types/staking-store';
import {
    getUserRewards,
    getRewardsSummary,
    getStakeOwnership,
    UserRewards,
    RewardsSummary,
} from '@/services/rewards-service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const createRewardsSlice = (set: any, get: () => StakingState) => ({
    userRewards: null as UserRewards | null,
    rewardsSummary: null as RewardsSummary | null,
    isLoadingRewards: false,

    /**
     * Fetches rewards data for the current user
     * @param userAddress User's wallet address
     */
    fetchUserRewards: async (userAddress: string) => {
        if (!userAddress) return;

        try {
            set({ isLoadingRewards: true });
            const rewards = await getUserRewards(userAddress);

            if (rewards) {
                set({ userRewards: rewards });
            }

            return rewards;
        } catch (error) {
            console.error('Error fetching user rewards:', error);
            return null;
        } finally {
            set({ isLoadingRewards: false });
        }
    },

    /**
     * Fetches global rewards summary statistics
     */
    fetchRewardsSummary: async () => {
        try {
            const summary = await getRewardsSummary();

            if (summary) {
                set({ rewardsSummary: summary });
            }

            return summary;
        } catch (error) {
            console.error('Error fetching rewards summary:', error);
            return null;
        }
    },
    /**
     * Fetches stake ownership percentage for the current user
     * @param userAddress User's wallet address
     */
    fetchStakeOwnership: async (userAddress: string) => {
        if (!userAddress) return;

        try {
            const ownership = await getStakeOwnership(userAddress);

            if (ownership) {
                set({ stakeOwnership: ownership });
            }

            return ownership;
        } catch (error) {
            console.error('Error fetching stake ownership:', error);
            return null;
        }
    },

    /**
     * Clears rewards data when user disconnects
     */
    clearRewardsData: () => {
        set({
            userRewards: null,
            rewardsSummary: null,
        });
    },
});
