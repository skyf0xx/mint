// services/rewards-service.ts
import { REWARDS_PROCESS, sendAndGetResult } from '@/lib/wallet-actions';
import { CACHE_EXPIRY } from '@/lib/cache';
import { shortNumberFormat, withRetry } from '@/lib/utils';

export interface UserRewards {
    total: string;
    lastReceived: string;
    lastDistributionTime: number;
    distributions: number;
    formattedTotal?: string;
    formattedLastReceived?: string;
}

export interface RewardsSummary {
    totalAddresses: number;
    totalDistributed: string;
    lastDistributionTime: number;
    formattedTotalDistributed?: string;
}

const formatMintAmount = (amount: string): string => {
    const denomination = 100_000_000;
    return shortNumberFormat((Number(amount) / denomination).toString());
};

/**
 * Fetches accumulated rewards for a specific user address
 * @param address User's wallet address
 * @returns User rewards data
 */
export async function getUserRewards(
    address: string
): Promise<UserRewards | null> {
    try {
        const tags = [
            { name: 'Action', value: 'Get-Accumulated-Rewards' },
            { name: 'Address', value: address },
        ];

        return await withRetry(async () => {
            const response = await sendAndGetResult(
                REWARDS_PROCESS,
                tags,
                false,
                CACHE_EXPIRY.MINUTE * 5,
                address
            );

            if (!response?.Messages?.[0]?.Data) {
                return null;
            }

            const data = JSON.parse(response.Messages[0].Data) as UserRewards;
            return {
                ...data,
                formattedTotal: formatMintAmount(data.total),
                formattedLastReceived: formatMintAmount(data.lastReceived),
            };
        });
    } catch (error) {
        console.error('Error fetching user rewards:', error);
        return null;
    }
}

/**
 * Fetches global rewards summary information
 * @returns Summary statistics about rewards distribution
 */
export async function getRewardsSummary(): Promise<RewardsSummary | null> {
    try {
        const tags = [{ name: 'Action', value: 'Get-Rewards-Summary' }];

        return await withRetry(async () => {
            const response = await sendAndGetResult(
                REWARDS_PROCESS,
                tags,
                false,
                CACHE_EXPIRY.HOUR
            );

            if (!response?.Messages?.[0]?.Data) {
                return null;
            }

            const data = JSON.parse(
                response.Messages[0].Data
            ) as RewardsSummary;

            return {
                ...data,
                formattedTotalDistributed: formatMintAmount(
                    data.totalDistributed
                ),
            };
        });
    } catch (error) {
        console.error('Error fetching rewards summary:', error);
        return null;
    }
}
