// hooks/use-protocol-metrics.ts
import { getProtocolMetrics } from '@/services/protocol-metrics-service';
import { useState, useEffect } from 'react';

export interface TokenMetric {
    address: string;
    name: string;
    totalStaked: string;
    formattedTotalStaked: string;
    activePositions: number;
    activeUsers: number;
    amm: string;
    decimals: number;
}

export interface ProtocolSettings {
    maxVestingDays: number;
    maxCoveragePercentage: string;
    protocolFeePercentage: string;
    userSharePercentage: string;
}

export interface ImpermanentLossMetrics {
    totalCompensation: string;
    formattedTotalCompensation: string;
    occurrences: number;
}

export interface ProtocolMetricsData {
    timestamp: number;
    totalStakingPositions: number;
    totalActiveUsers: number;
    treasuryBalance: string;
    formattedTreasuryBalance: string;
    tokenMetrics: { [tokenAddress: string]: TokenMetric };
    impermanentLossMetrics: ImpermanentLossMetrics;
    protocolSettings: ProtocolSettings;
}

/**
 * Hook to fetch and manage protocol metrics data
 * @returns Object containing metrics data, loading state, error state, and refetch function
 */
export const useProtocolMetrics = () => {
    const [metrics, setMetrics] = useState<ProtocolMetricsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchMetrics = async () => {
        setLoading(true);
        setError(null);

        try {
            const metricsData = await getProtocolMetrics();
            setMetrics(metricsData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error('Failed to fetch metrics')
            );
            console.error('Error in useProtocolMetrics:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchMetrics();

        // Refresh every 5 minutes
        const refreshInterval = 5 * 60 * 1000;
        const timer = setInterval(fetchMetrics, refreshInterval);

        return () => clearInterval(timer);
    }, []);

    return {
        metrics,
        loading,
        error,
        refetch: fetchMetrics,
    };
};
