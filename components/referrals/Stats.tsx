import { ReferralStats } from '@/lib/database';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Award,
    ChevronRight,
    Trophy,
    Users,
    Clock,
    AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Card } from '../ui/card';
import { StatCard } from './StatsCard';

interface StatsDashProps {
    stats: ReferralStats;
    completedSteps: {
        wallet: boolean;
        twitter: boolean;
    };
    delay?: number;
    className?: string;
}

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
        className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm"
    >
        <Card className="p-3 sm:p-4 bg-gradient-to-r from-primary to-primary-600 text-white">
            <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <div>
                    <h4 className="text-sm sm:text-base font-medium">
                        {achievement.title}
                    </h4>
                    <p className="text-xs sm:text-sm opacity-90">
                        {achievement.description}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
        </Card>
    </motion.div>
);

const calculateScore = (
    stats: ReferralStats,
    completedSteps: { wallet: boolean; twitter: boolean }
) => {
    const onboardingPoints =
        (completedSteps.wallet ? 10 : 0) + (completedSteps.twitter ? 10 : 0);
    const referralPoints = stats.totalReferrals * 10;
    return onboardingPoints + referralPoints;
};

const getRank = (score: number) => {
    if (score >= 100) return 'Diamond';
    if (score >= 50) return 'Gold';
    if (score >= 20) return 'Silver';
    return 'Bronze';
};

const StatsDash = ({
    stats,
    completedSteps,
    delay = 0.3,
    className = '',
}: StatsDashProps) => {
    const [showAchievement, setShowAchievement] = useState(false);
    const score = calculateScore(stats, completedSteps);
    const rank = getRank(score);

    const checkAchievements = () => {
        if (score >= 50 && !showAchievement) {
            setShowAchievement(true);
        }
    };

    const referralTrend = {
        value: (stats.completedReferrals / stats.totalReferrals) * 100 || 0,
        positive: stats.completedReferrals > stats.pendingReferrals,
    };

    return (
        <motion.div
            className={`space-y-4 sm:space-y-6 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            onAnimationComplete={checkAchievements}
        >
            {/* Primary Content: Score and Stats Grid */}
            <div className="space-y-3 sm:space-y-4">
                {/* Score Card */}
                <StatCard
                    icon={Trophy}
                    title={`${rank} Rank Holder`}
                    value={score}
                    subtitle="10 points per successful referral"
                    featured
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <StatCard
                        icon={Users}
                        title="Successful Referrals"
                        value={stats.totalReferrals}
                        subtitle={`${stats.totalReferrals * 10} points earned`}
                        trend={referralTrend}
                    />
                    <StatCard
                        icon={Award}
                        title="Active Users"
                        value={stats.completedReferrals}
                        subtitle="Fully onboarded"
                    />
                    <StatCard
                        icon={Clock}
                        title="In Progress"
                        value={stats.pendingReferrals}
                        subtitle="Still onboarding"
                    />
                </div>
            </div>

            {/* Secondary Content: Performance Insights */}
            {stats.totalReferrals > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.2 }}
                    className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10"
                >
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5" />
                        <div>
                            <h5 className="text-xs sm:text-sm font-medium text-gray-700">
                                Referral Progress
                            </h5>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {score >= 50
                                    ? `Congratulations on reaching ${rank} rank! Each new referral earns you 10 more points.`
                                    : `${
                                          10 - (score % 10)
                                      } points until your next milestone. Earn 10 points for each successful referral.`}
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
                            title: `${rank} Rank Achievement`,
                            description: `You've earned ${score} points through successful referrals!`,
                        }}
                        onClose={() => setShowAchievement(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StatsDash;
