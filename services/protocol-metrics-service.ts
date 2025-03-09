// services/protocol-metrics-service.ts
import {
    MINT_PROCESS,
    sendAndGetResult,
    MessageResult,
} from '@/lib/wallet-actions';
import { withRetry } from '@/lib/utils';
import {
    CACHE_EXPIRY,
    generateCacheKey,
    getFromCache,
    setCache,
} from '@/lib/cache';
import { ProtocolMetricsData } from '@/hooks/use-protocol-metrics';

// Constants
const METRICS_CACHE_DURATION = CACHE_EXPIRY.DAY;

/**
 * Fetches protocol metrics data from the blockchain
 * @returns Protocol metrics data including token metrics, IL metrics, and settings
 */
export async function getProtocolMetrics(): Promise<ProtocolMetricsData> {
    const tags = [{ name: 'Action', value: 'Get-Protocol-Metrics' }];
    const cacheKey = generateCacheKey(MINT_PROCESS, tags);

    try {
        // Check cache first
        const cachedData = await getFromCache(cacheKey);
        if (cachedData) {
            // Convert MessageResult to ProtocolMetricsData
            const messageResult = cachedData as MessageResult;
            if (messageResult.Messages?.[0]?.Data) {
                const protocolData = JSON.parse(
                    messageResult.Messages[0].Data
                ) as ProtocolMetricsData;

                // Refresh cache in the background if data exists
                setTimeout(() => refreshMetricsCache(cacheKey, tags), 0);

                return protocolData;
            }
        }

        return await fetchAndCacheMetrics(cacheKey, tags);
    } catch (error) {
        console.error('Error fetching protocol metrics:', error);
        throw error;
    }
}

/**
 * Fetches and caches fresh protocol metrics data
 * @param cacheKey The cache key for storing the metrics
 * @param tags Tags for the blockchain query
 * @returns Fresh protocol metrics data
 */
async function fetchAndCacheMetrics(
    cacheKey: string,
    tags: { name: string; value: string }[]
): Promise<ProtocolMetricsData> {
    return await withRetry(async () => {
        const response = await sendAndGetResult(
            MINT_PROCESS,
            tags,
            false,
            false // Don't cache at the lower level since we're handling caching here
        );

        if (!response?.Messages?.[0]?.Data) {
            throw new Error('No protocol metrics data in response');
        }

        // Parse the response data
        const metricsData = JSON.parse(
            response.Messages[0].Data
        ) as ProtocolMetricsData;

        // Store the original MessageResult in the cache, not the parsed ProtocolMetricsData
        setCache(cacheKey, response, METRICS_CACHE_DURATION);

        return metricsData;
    });
}

/**
 * Refreshes the metrics cache in the background without blocking
 * @param cacheKey The cache key for the metrics
 * @param tags Tags for the blockchain query
 */
async function refreshMetricsCache(
    cacheKey: string,
    tags: { name: string; value: string }[]
): Promise<void> {
    try {
        await fetchAndCacheMetrics(cacheKey, tags);
    } catch (error) {
        console.error('Error refreshing metrics cache:', error);
        // Don't throw here as this is a background refresh
    }
}
