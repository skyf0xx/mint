// components/app/dashboard/index.tsx
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertTriangle, PlusCircle } from 'lucide-react';
import DashboardHeader from './header';
import EmptyState from './empty-state';
import PositionsList from './positions-list';
import RewardsSummary from './rewards-summary';
import LoadingState from '@/components/app/shared/loading-state';
import { StakingPosition } from '@/types/staking';
import { useStakingStore } from '@/store/staking-store';
import MaintenanceMessage from '../shared/maintenance-message';
import TransactionStatusManager from './transaction/transaction-status-manager';

interface DashboardProps {
    address: string | null;
    positions: StakingPosition[];
    onStartStaking: () => void;
    onViewPosition: (id: string) => void;
    onUnstake: (id: string) => void;
    isLoading: boolean;
    isInMaintenance?: boolean;
}

const Dashboard = ({
    address,
    positions,
    onStartStaking,
    onViewPosition,
    onUnstake,
    isLoading,
    isInMaintenance = false,
}: DashboardProps) => {
    const hasPositions = positions.length > 0;

    const {
        transactions,
        checkTransactionStatus,
        removeCompletedTransactions,
    } = useStakingStore();

    // Check if there are any transactions for the current user
    const hasTransactions = () => {
        if (!address) return false;

        return transactions.some((tx) => tx.userAddress === address);
    };

    const handleCheckNow = async (transactionId: string) => {
        await checkTransactionStatus(transactionId);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
        >
            {/* Add the pending operations component with animation */}
            <AnimatePresence>
                {address && hasTransactions() && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TransactionStatusManager
                            userAddress={address}
                            transactions={transactions.filter(
                                (tx) => tx.userAddress === address
                            )}
                            onCheckNow={handleCheckNow}
                            onDismissCompleted={removeCompletedTransactions}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add maintenance banner if in maintenance mode */}
            {isInMaintenance && <MaintenanceMessage />}

            {/* Add Rewards Summary component */}
            {address && hasPositions && <RewardsSummary />}

            <Card className="border-2 border-primary/10 shadow-lg" id="stake">
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
                                disabled={isInMaintenance}
                                className="bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300 flex items-center"
                            >
                                {isInMaintenance ? (
                                    <>
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Maintenance Mode
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="h-4 w-4 mr-1" />
                                        New Position
                                    </>
                                )}
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
                            isInMaintenance={isInMaintenance}
                        />
                    ) : (
                        <EmptyState
                            onStartStaking={onStartStaking}
                            isInMaintenance={isInMaintenance}
                        />
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Dashboard;
