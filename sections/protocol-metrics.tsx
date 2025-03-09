import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import CountUp from 'react-countup';

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
                            }`}
                        >
                            {title}
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
    return (
        <section
            id="metrics"
            className="container mx-auto px-4 py-24 relative bg-gradient-to-b from-transparent to-gray-50/30"
        >
            <motion.h3
                className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                Protocol Metrics
            </motion.h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
                <MetricCard
                    title="Total Value Locked"
                    value={24.8}
                    subtitle="Million USD"
                    delay={0.1}
                    animate={true}
                    suffix="M"
                    decimals={1}
                />
                <MetricCard
                    title="MINT Insuarance Treasury"
                    value={1.2}
                    subtitle="MINT"
                    delay={0.2}
                    featured={true}
                    animate={true}
                    suffix="M"
                    decimals={1}
                />
                <MetricCard
                    title="Active Positions"
                    value={4721}
                    subtitle="Staking Positions"
                    delay={0.3}
                    animate={true}
                    suffix=""
                    decimals={0}
                />
                <MetricCard
                    title="Average Protection"
                    value={38.5}
                    subtitle="Coverage Percentage"
                    delay={0.4}
                    animate={true}
                    suffix="%"
                    decimals={1}
                />
            </div>
        </section>
    );
};

export default ProtocolMetrics;
