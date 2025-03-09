// services/protocol-metrics-service.ts
import { MINT_PROCESS, sendAndGetResult } from '@/lib/wallet-actions';
import { withRetry } from '@/lib/utils';
import { CACHE_EXPIRY } from '@/lib/cache';
import { ProtocolMetricsData } from '@/hooks/use-protocol-metrics';
import { adjustDecimalString } from '@/lib/utils';

// Constants
const MINT_TOKEN = 'SWQx44W-1iMwGFBSHlC3lStCq3Z7O2WZrx9quLeZOu0';

/**
 * Fetches protocol metrics data from the blockchain
 * @returns Protocol metrics data including token metrics, IL metrics, and settings
 */
export async function getProtocolMetrics(): Promise<ProtocolMetricsData> {
    const tags = [{ name: 'Action', value: 'Get-Protocol-Metrics' }];

    const metricsData = await withRetry(async () => {
        const response = await sendAndGetResult(
            MINT_PROCESS,
            tags,
            false,
            CACHE_EXPIRY.HOUR
        );

        if (!response?.Messages?.[0]?.Data) {
            throw new Error('No protocol metrics data in response');
        }

        // Parse the response data
        return JSON.parse(response.Messages[0].Data) as ProtocolMetricsData;
    });

    // Get treasury balance separately
    const treasuryData = await getTreasuryBalance();

    // Update the metrics with the treasury balance
    if (treasuryData) {
        metricsData.treasuryBalance = treasuryData.balance;
        metricsData.formattedTreasuryBalance = treasuryData.formattedBalance;
    }

    return metricsData;
}

/**
 * Fetches the MINT token balance of the treasury
 * @returns Treasury balance information
 */
export async function getTreasuryBalance(): Promise<{
    balance: string;
    formattedBalance: string;
} | null> {
    try {
        const tags = [
            { name: 'Action', value: 'Balance' },
            { name: 'Target', value: MINT_PROCESS },
        ];

        return await withRetry(async () => {
            const response = await sendAndGetResult(
                MINT_TOKEN,
                tags,
                false,
                CACHE_EXPIRY.HOUR
            );

            if (!response?.Messages?.[0]?.Tags) {
                throw new Error('No treasury balance data in response');
            }

            // Extract balance from tags
            const balanceTag = response.Messages[0].Tags.find(
                (tag: { name: string; value: string }) => tag.name === 'Balance'
            );

            const denominationTag = response.Messages[0].Tags.find(
                (tag: { name: string; value: string }) =>
                    tag.name === 'Denomination'
            );

            if (!balanceTag) {
                throw new Error('Balance tag not found in response');
            }

            const balance = balanceTag.value;
            const denomination = denominationTag
                ? parseInt(denominationTag.value)
                : 8;

            // Adjust balance with proper decimal places
            const formattedBalance = adjustDecimalString(balance, denomination);

            return {
                balance,
                formattedBalance,
            };
        });
    } catch (error) {
        console.error('Error fetching treasury balance:', error);
        return null;
    }
}
