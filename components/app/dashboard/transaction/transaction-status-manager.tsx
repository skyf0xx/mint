// Updated TransactionStatusManager Component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eraser } from 'lucide-react';
import TransactionStatusCard, { Transaction } from './transaction-status';

interface TransactionStatusManagerProps {
    userAddress: string;
    transactions: Transaction[];
    onCheckNow: (transactionId: string) => Promise<void>;
    onDismissCompleted: () => void;
}

const TransactionStatusManager: React.FC<TransactionStatusManagerProps> = ({
    transactions,
    onCheckNow,
    onDismissCompleted,
}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isCheckingNow, setIsCheckingNow] = useState<Record<string, boolean>>(
        {}
    );
    const [lastChecked, setLastChecked] = useState<Record<string, string>>({});
    const [nextCheckTimes, setNextCheckTimes] = useState<
        Record<string, number>
    >({});

    // Count active and completed transactions
    const activeTransactions = transactions.filter(
        (tx) => tx.stage === 'pending'
    );
    const completedTransactions = transactions.filter(
        (tx) => tx.stage === 'completed' || tx.stage === 'failed'
    );

    // Initialize next check times for new transactions
    useEffect(() => {
        const now = Date.now();
        const updatedNextCheckTimes = { ...nextCheckTimes };

        transactions.forEach((tx) => {
            if (!nextCheckTimes[tx.id]) {
                updatedNextCheckTimes[tx.id] = now + 30000; // 30 seconds
            }
        });

        if (
            Object.keys(updatedNextCheckTimes).length >
            Object.keys(nextCheckTimes).length
        ) {
            setNextCheckTimes(updatedNextCheckTimes);
        }
    }, [transactions]);

    // Automatically expand when new transactions are added
    useEffect(() => {
        if (activeTransactions.length > 0) {
            setCollapsed(false);
        }
    }, [activeTransactions.length]);

    const handleCheckNow = async (txId: string) => {
        setIsCheckingNow((prev) => ({ ...prev, [txId]: true }));
        await onCheckNow(txId);
        setLastChecked((prev) => ({ ...prev, [txId]: 'Just now' }));
        setNextCheckTimes((prev) => ({ ...prev, [txId]: Date.now() + 30000 }));
        setIsCheckingNow((prev) => ({ ...prev, [txId]: false }));
    };

    // If no transactions, return null
    if (transactions.length === 0) {
        return null;
    }

    // Determine the overall status color
    const getStatusColor = () => {
        if (transactions.some((tx) => tx.stage === 'failed'))
            return 'bg-red-500';
        if (activeTransactions.length > 0) return 'bg-amber-500';
        return 'bg-green-500';
    };

    return (
        <div className="mb-6">
            <div
                className="flex items-center justify-between bg-white rounded-t-lg border border-gray-200 px-4 py-3 cursor-pointer"
                onClick={() => setCollapsed(!collapsed)}
            >
                <div className="flex items-center">
                    <div
                        className={`w-3 h-3 rounded-full mr-3 ${getStatusColor()}`}
                    ></div>
                    <div className="font-medium text-gray-800">
                        Transaction Status
                        {activeTransactions.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
                                {activeTransactions.length} active
                            </span>
                        )}
                        {completedTransactions.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
                                {completedTransactions.length} completed
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center">
                    {completedTransactions.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mr-2 h-7 text-xs text-gray-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDismissCompleted();
                            }}
                        >
                            <Eraser className="h-3 w-3 mr-1" />
                            Clear Completed
                        </Button>
                    )}
                    {collapsed ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronUp className="h-4 w-4" />
                    )}
                </div>
            </div>

            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-t-0 border-gray-200 rounded-b-lg p-4 bg-gray-50"
                    >
                        <div className="space-y-4">
                            {/* Active Transactions */}
                            {activeTransactions.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                                        Active Transactions
                                    </h3>
                                    {activeTransactions.map((transaction) => (
                                        <TransactionStatusCard
                                            key={transaction.id}
                                            transaction={transaction}
                                            onCheckNow={() =>
                                                handleCheckNow(transaction.id)
                                            }
                                            isCheckingNow={
                                                isCheckingNow[transaction.id] ||
                                                false
                                            }
                                            lastChecked={
                                                lastChecked[transaction.id] ||
                                                'Never'
                                            }
                                            nextCheckTime={
                                                nextCheckTimes[
                                                    transaction.id
                                                ] || Date.now() + 30000
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Completed Transactions */}
                            {completedTransactions.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                                        Recently Completed
                                    </h3>
                                    {completedTransactions.map(
                                        (transaction) => (
                                            <TransactionStatusCard
                                                key={transaction.id}
                                                transaction={transaction}
                                                onCheckNow={() => {}}
                                                isCheckingNow={false}
                                                lastChecked="Completed"
                                                nextCheckTime={0}
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TransactionStatusManager;
