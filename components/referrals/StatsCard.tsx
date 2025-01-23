import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    loading?: boolean;
    trend?: {
        direction: 'up' | 'down' | 'neutral';
        value: string;
    };
}

const StatsCard = ({
    title,
    value,
    subtitle,
    loading = false,
    trend,
}: StatsCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full"
    >
        <Card className="p-4 h-full border-2 border-gray-100 hover:border-primary/10 transition-colors duration-300">
            {loading ? (
                <div className="space-y-3">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                    {subtitle && (
                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-primary">
                        {value}
                        {trend && (
                            <span
                                className={`text-sm ml-2 ${
                                    trend.direction === 'up'
                                        ? 'text-green-500'
                                        : trend.direction === 'down'
                                        ? 'text-red-500'
                                        : 'text-gray-500'
                                }`}
                            >
                                {trend.value}
                            </span>
                        )}
                    </p>
                    {subtitle && (
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    )}
                </div>
            )}
        </Card>
    </motion.div>
);

export default StatsCard;
