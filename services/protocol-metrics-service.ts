// services/protocol-metrics-service.ts
import { MINT_PROCESS, sendAndGetResult } from '@/lib/wallet-actions';
import { withRetry } from '@/lib/utils';
import { CACHE_EXPIRY } from '@/lib/cache';
import { ProtocolMetricsData } from '@/hooks/use-protocol-metrics';

/**
 * Fetches protocol metrics data from the blockchain
 * @returns Protocol metrics data including token metrics, IL metrics, and settings
 */
export async function getProtocolMetrics(): Promise<ProtocolMetricsData> {
    const tags = [{ name: 'Action', value: 'Get-Protocol-Metrics' }];

    return await withRetry(async () => {
        const response = await sendAndGetResult(
            MINT_PROCESS,
            tags,
            false,
            CACHE_EXPIRY.DAY
        );

        if (!response?.Messages?.[0]?.Data) {
            throw new Error('No protocol metrics data in response');
        }

        // Parse the response data
        const metricsData = JSON.parse(
            response.Messages[0].Data
        ) as ProtocolMetricsData;

        return metricsData;
    });
}
