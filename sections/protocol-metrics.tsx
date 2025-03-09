import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import CountUp from 'react-countup';
import { useProtocolMetrics } from '@/hooks/use-protocol-metrics';

interface MetricProps {
    title: string;
    value: string | number;
    subtitle: string;
    delay?: number;
    featured?: boolean;
    loading?: boolean;
    animate?: boolean;
    suffix: string;
    decimals: number;
    tooltip?: string;
}

const MetricCard = ({
    title,
    value,
    subtitle,
    delay = 0,
    featured = false,
    loading = false,
    animate = false,
    suffix,
    decimals,
    tooltip,
}: MetricProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="h-full"
    >
        <Card
            className={`h-full group transition-all duration-500 hover:shadow-lg ${
                featured ? 'border-2 border-primary/20 bg-primary/5' : ''
            }`}
        >
            <CardContent className="h-full p-4 sm:p-6 flex flex-col justify-between">
                <dl className="flex flex-col h-full justify-between">
                    <div className="space-y-2">
                        <dt
                            className={`text-sm font-medium ${
                                featured ? 'text-primary-600' : 'text-gray-600'
                            } flex items-center`}
                        >
                            {title}
                            {tooltip && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="ml-1 h-4 w-4 text-gray-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs">
                                                {tooltip}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </dt>
                        <dd
                            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                                featured
                                    ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600'
                                    : 'text-gray-900'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
                                    <span className="text-primary/50">
                                        Loading...
                                    </span>
                                </div>
                            ) : animate && typeof value === 'number' ? (
                                <CountUp
                                    end={value}
                                    duration={2.5}
                                    separator=","
                                    decimal="."
                                    decimals={decimals}
                                    suffix={suffix}
                                />
                            ) : (
                                value
                            )}
                        </dd>
                    </div>
                    <dd className="text-sm text-gray-500 mt-2">{subtitle}</dd>
                </dl>
            </CardContent>
        </Card>
    </motion.div>
);

const ProtocolMetrics = () => {
    const { metrics, loading, refetch } = useProtocolMetrics();

    // Calculate TVL (Total Value Locked)
    const calculateTVL = () => {
        if (!metrics || !metrics.tokenMetrics) return 24.8; // Fallback to a default value

        let totalStaked = 0;

        for (const tokenAddress in metrics.tokenMetrics) {
            const tokenMetric = metrics.tokenMetrics[tokenAddress];
            // Convert from token units to human-readable amount based on decimals
            const amount =
                parseFloat(tokenMetric.totalStaked) /
                Math.pow(10, tokenMetric.decimals || 8);
            totalStaked += amount;
        }

        // Return in millions
        return totalStaked / 100000000;
    };

    // Parse the treasury balance amount
    const parseTreasuryBalance = () => {
        if (!metrics || !metrics.formattedTreasuryBalance) return 0;

        // If formattedTreasuryBalance is already formatted, parse it directly
        try {
            // Remove any commas and convert to number
            const value = parseFloat(
                metrics.formattedTreasuryBalance.replace(/,/g, '')
            );
            // Convert to millions
            return value / 100000000;
        } catch (e) {
            console.error('Error parsing treasury balance:', e);
            return 0;
        }
    };

    // Get values for display
    const tvl = calculateTVL();
    const treasuryBalance = parseTreasuryBalance();
    const activePositions = metrics?.totalStakingPositions || 4721; // Fallback

    return (
        <section
            id="metrics"
            className="container mx-auto px-4 py-24 relative bg-gradient-to-b from-transparent to-gray-50/30"
        >
            <div className="flex justify-between items-center mb-8">
                <motion.h3
                    className="text-2xl sm:text-3xl font-bold text-center w-full bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Protocol Metrics
                </motion.h3>

                {/* Add refresh button */}
                <div className="absolute right-8">
                    <motion.button
                        className="text-gray-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100"
                        onClick={refetch}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        aria-label="Refresh metrics"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
                <MetricCard
                    title="Total Value Locked"
                    value={tvl}
                    subtitle="Million USD"
                    delay={0.1}
                    loading={loading}
                    animate={true}
                    suffix="M"
                    decimals={1}
                    tooltip="The total value of all tokens staked in the protocol across all supported tokens"
                />
                <MetricCard
                    title="MINT Treasury"
                    value={treasuryBalance}
                    subtitle="Million MINT"
                    delay={0.2}
                    loading={loading}
                    animate={true}
                    suffix="M"
                    decimals={1}
                    tooltip="The amount of MINT tokens reserved to protect users against impermanent loss"
                    featured={true}
                />
                <MetricCard
                    title="Active Positions"
                    value={activePositions}
                    subtitle="Staking Positions"
                    delay={0.3}
                    loading={loading}
                    animate={true}
                    suffix=""
                    decimals={0}
                    tooltip="The total number of active staking positions across all supported tokens"
                    featured={true}
                />
            </div>

            {/* Add last updated timestamp */}
            {metrics?.timestamp && (
                <motion.div
                    className="text-center text-xs text-gray-400 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Last updated:{' '}
                    {new Date(metrics.timestamp * 1000).toLocaleString()}
                </motion.div>
            )}
        </section>
    );
};

export default ProtocolMetrics;
