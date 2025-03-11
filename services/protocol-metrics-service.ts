// services/protocol-metrics-service.ts
import {
    getBalance,
    MINT_PROCESS,
    MINT_TOKEN,
    sendAndGetResult,
} from '@/lib/wallet-actions';
import { withRetry } from '@/lib/utils';
import { CACHE_EXPIRY } from '@/lib/cache';
import { ProtocolMetricsData } from '@/hooks/use-protocol-metrics';

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
        const balance = (await getBalance(MINT_PROCESS, MINT_TOKEN, 8)) || null;
        if (balance) {
            return {
                balance: balance.balance.padEnd(
                    balance.balance.length + 8,
                    '0'
                ),
                formattedBalance: balance.balance,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching treasury balance:', error);
        return null;
    }
}
