import { motion, AnimatePresence } from 'framer-motion';
import { ReferralStats } from '@/lib/database';
import { Card } from '@/components/ui/card';
import {
    Users,
    TrendingUp,
    Clock,
    Award,
    ChevronRight,
    AlertCircle,
    LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

interface StatsDashProps {
    stats: ReferralStats;
    delay?: number;
    className?: string;
}

// Individual stat card with enhanced visual hierarchy
const StatCard = ({
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

// Achievement notification component
const AchievementPopup = ({
    achievement,
    onClose,
}: {
    achievement: { title: string; description: string };
    onClose: () => void;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-4 right-4 z-50"
    >
        <Card className="p-4 bg-gradient-to-r from-primary to-primary-600 text-white">
            <div className="flex items-start space-x-3">
                <Award className="w-6 h-6 flex-shrink-0" />
                <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm opacity-90">
                        {achievement.description}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </Card>
    </motion.div>
);

// Enhanced StatsCard with loading states
const StatsDash = ({ stats, delay = 0.3, className = '' }: StatsDashProps) => {
    const [showAchievement, setShowAchievement] = useState(false);

    // Check for achievements based on stats
    const checkAchievements = () => {
        if (stats.totalReferrals >= 10 && !showAchievement) {
            setShowAchievement(true);
        }
    };

    // Process trend data
    const referralTrend = {
        value: (stats.completedReferrals / stats.totalReferrals) * 100 || 0,
        positive: stats.completedReferrals > stats.pendingReferrals,
    };

    return (
        <motion.div
            className={`space-y-6 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            onAnimationComplete={checkAchievements}
        >
            {/* Primary Content: Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard
                    icon={Users}
                    title="Total Referrals"
                    value={stats.totalReferrals}
                    subtitle="All-time invites"
                    trend={referralTrend}
                    featured
                />
                <StatCard
                    icon={Award}
                    title="Completed"
                    value={stats.completedReferrals}
                    subtitle="Successful referrals"
                />
                <StatCard
                    icon={Clock}
                    title="Pending"
                    value={stats.pendingReferrals}
                    subtitle="Awaiting completion"
                />
            </div>

            {/* Secondary Content: Performance Insights */}
            {stats.totalReferrals > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.2 }}
                    className="p-4 rounded-lg bg-primary/5 border border-primary/10"
                >
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                            <h5 className="text-sm font-medium text-gray-700">
                                Performance Insight
                            </h5>
                            <p className="text-sm text-gray-600 mt-1">
                                {stats.completedReferrals > 5
                                    ? "Great work! You're in the top 10% of referrers."
                                    : 'Share with more friends to increase your rewards.'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Tertiary Content: Achievement Popup */}
            <AnimatePresence>
                {showAchievement && (
                    <AchievementPopup
                        achievement={{
                            title: 'Power Referrer!',
                            description:
                                "You've successfully referred 10+ users",
                        }}
                        onClose={() => setShowAchievement(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StatsDash;
