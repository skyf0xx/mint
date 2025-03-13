// components/app/dashboard/index.tsx
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import DashboardHeader from './header';
import EmptyState from './empty-state';
import PositionsList from './positions-list';
import LoadingState from '@/components/app/shared/loading-state';
import { StakingPosition } from '@/types/staking';
import { useStakingStore } from '@/store/staking-store';
import PendingOperations from './pending-operations';

interface DashboardProps {
    address: string | null;
    positions: StakingPosition[];
    onStartStaking: () => void;
    onViewPosition: (id: string) => void;
    onUnstake: (id: string) => void;
    isLoading: boolean;
}

const Dashboard = ({
    address,
    positions,
    onStartStaking,
    onViewPosition,
    onUnstake,
    isLoading,
}: DashboardProps) => {
    const hasPositions = positions.length > 0;
    const { availableTokens } = useStakingStore();

    // Check if there are any pending operations
    const hasPendingOperations = () => {
        if (!address) return false;

        const pendingItems = JSON.parse(
            localStorage.getItem('pendingStakes') || '[]'
        );
        return pendingItems.some(
            (item: { userAddress: string }) => item.userAddress === address
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
        >
            {/* Add the pending operations component with animation */}
            <AnimatePresence>
                {address && hasPendingOperations() && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <PendingOperations
                            userAddress={address}
                            tokens={availableTokens}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Card className="border-2 border-primary/10 shadow-lg">
                <CardHeader className="border-b border-gray-100">
                    <DashboardHeader title="Your Staking Dashboard" />
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-lg font-semibold">
                            Your Staking Positions
                        </div>
                        {hasPositions && (
                            <Button
                                onClick={onStartStaking}
                                className="bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300 flex items-center"
                            >
                                <PlusCircle className="h-4 w-4 mr-1" />
                                New Position
                            </Button>
                        )}
                    </div>

                    {isLoading ? (
                        <LoadingState message="Loading your positions..." />
                    ) : hasPositions ? (
                        <PositionsList
                            positions={positions}
                            onViewPosition={onViewPosition}
                            onUnstake={onUnstake}
                        />
                    ) : (
                        <EmptyState onStartStaking={onStartStaking} />
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Dashboard;
