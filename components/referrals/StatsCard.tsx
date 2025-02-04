import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';

export const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    featured = false,
}: {
    icon: LucideIcon;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
        value: number;
        positive: boolean;
    };
    featured?: boolean;
}) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`group cursor-pointer ${featured ? 'col-span-2' : ''}`}
        >
            <Card
                className={`
                h-full p-4 border-2 transition-all duration-300
                ${
                    featured
                        ? 'bg-gradient-to-br from-primary/5 to-transparent border-primary/20'
                        : 'hover:border-primary/10 border-gray-100'
                }
            `}
            >
                <div className="space-y-3">
                    {/* Primary: Value and Icon */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div
                                className={`
                                text-2xl font-bold
                                ${featured ? 'text-primary' : 'text-gray-900'}
                            `}
                            >
                                {value}
                            </div>
                            {trend && (
                                <div
                                    className={`
                                    text-sm flex items-center
                                    ${
                                        trend.positive
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                    }
                                `}
                                >
                                    <TrendingUp
                                        className={`
                                        w-4 h-4 mr-1
                                        ${!trend.positive && 'rotate-180'}
                                    `}
                                    />
                                    {trend.value}%
                                </div>
                            )}
                        </div>
                        <div
                            className={`
                            p-2 rounded-lg transition-colors
                            ${
                                featured
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-gray-100 text-gray-500 group-hover:bg-primary/5 group-hover:text-primary'
                            }
                        `}
                        >
                            <Icon className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Secondary: Title and Subtitle */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700">
                            {title}
                        </h4>
                        {subtitle && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Tertiary: Hover State */}
                <div
                    className={`
                    absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 pointer-events-none
                    bg-gradient-to-r from-transparent via-primary/5 to-transparent
                `}
                />
            </Card>
        </motion.div>
    );
};
