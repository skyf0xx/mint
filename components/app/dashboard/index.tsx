// components/app/dashboard/index.tsx
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import DashboardHeader from './header';
import DashboardMetrics from './metrics';
import EmptyState from './empty-state';
import PositionsList from './positions-list';

interface DashboardProps {
    address: string | null;
    positions: any[]; // Will be properly typed later
    onStartStaking: () => void;
    onViewPosition: (id: string) => void;
    onUnstake: (id: string) => void;
}

const Dashboard = ({
    address,
    positions,
    onStartStaking,
    onViewPosition,
    onUnstake,
}: DashboardProps) => {
    const hasPositions = positions.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
        >
            <Card className="border-2 border-primary/10 shadow-lg">
                <CardHeader className="border-b border-gray-100">
                    <DashboardHeader title="Your Staking Dashboard" />
                </CardHeader>
                <CardContent className="p-6">
                    <DashboardMetrics address={address} />

                    <div className="space-y-6">
                        <div className="text-lg font-semibold">
                            Your Staking Positions
                        </div>
                        {hasPositions ? (
                            <PositionsList
                                positions={positions}
                                onViewPosition={onViewPosition}
                                onUnstake={onUnstake}
                            />
                        ) : (
                            <EmptyState onStartStaking={onStartStaking} />
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Dashboard;
