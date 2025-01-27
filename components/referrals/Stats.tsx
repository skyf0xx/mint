import { motion } from 'framer-motion';
import { ReferralStats } from '@/lib/database';
import StatsCard from './StatsCard';

interface StatsDashProps {
    stats: ReferralStats;
    delay?: number;
    className?: string;
}

const StatsDash = ({ stats, delay = 0.3, className = '' }: StatsDashProps) => {
    return (
        <motion.div
            className={`space-y-2 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <p className="text-sm text-gray-600">Your Referrals</p>
            <div className="grid grid-cols-3 gap-3">
                <StatsCard title="Total" value={stats.totalReferrals} />
                <StatsCard title="Completed" value={stats.completedReferrals} />
                <StatsCard title="Pending" value={stats.pendingReferrals} />
            </div>
        </motion.div>
    );
};

export default StatsDash;
