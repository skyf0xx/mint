// store/slices/transaction-slice.ts
import { toast } from 'react-toastify';
import { StakingState } from '@/types/staking-store';
import {
    Transaction,
    TransactionStage,
} from '@/components/app/dashboard/transaction/transaction-status';
import { getUserOperations } from '@/services/staking-service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTransactionSlice = (set: any, get: () => StakingState) => ({
    transactions: [] as Transaction[],

    getTransactions: (userAddress: string) => {
        return get().transactions.filter(
            (tx) => tx.userAddress === userAddress
        );
    },

    updateTransactionStage: (id: string, stage: TransactionStage) => {
        const transactions = [...get().transactions];
        const index = transactions.findIndex((tx) => tx.id === id);

        if (index >= 0) {
            transactions[index] = {
                ...transactions[index],
                stage,
                // Add timestamp for completed or failed stages
                ...(stage === 'completed' || stage === 'failed'
                    ? { completedAt: Date.now() }
                    : {}),
            };

            set({ transactions });

            // Create a custom event to notify UI components
            const event = new CustomEvent('transactionUpdated', {
                detail: { id, stage },
            });
            window.dispatchEvent(event);

            // Show appropriate notifications
            if (stage === 'completed') {
                const tx = transactions[index];
                toast.success(
                    `${tx.type === 'stake' ? 'Staking' : 'Unstaking'} ${
                        tx.amount
                    } ${tx.tokenSymbol} completed successfully!`,
                    { autoClose: 5000 }
                );
            } else if (stage === 'failed') {
                const tx = transactions[index];
                toast.error(
                    `${
                        tx.type === 'stake' ? 'Staking' : 'Unstaking'
                    } transaction failed. ${tx.failureReason || ''}`,
                    { autoClose: 7000 }
                );
            }
        }
    },

    removeTransaction: (id: string) => {
        const transactions = get().transactions.filter((tx) => tx.id !== id);
        set({ transactions });
    },

    removeCompletedTransactions: () => {
        const transactions = get().transactions.filter(
            (tx) => tx.stage !== 'completed' && tx.stage !== 'failed'
        );
        set({ transactions });
    },

    checkTransactionStatus: async (id: string) => {
        const transaction = get().transactions.find((tx) => tx.id === id);
        if (!transaction) return;

        try {
            // For stake operations
            if (transaction.type === 'stake') {
                // Check if the position exists now
                const positions = await get().fetchPositions(
                    transaction.userAddress
                );
                const matchingPosition = positions.find((position) => {
                    const fetchedAmount = parseFloat(
                        position.formattedTokenAmount
                    );
                    const txAmount = parseFloat(transaction.amount);

                    return (
                        position.tokenAddress === transaction.tokenAddress &&
                        (Math.abs(fetchedAmount - txAmount) / txAmount < 0.01 ||
                            fetchedAmount - txAmount >= 0)
                    );
                });

                if (matchingPosition) {
                    // Position found - transaction completed
                    get().updateTransactionStage(id, 'completed');
                } else {
                    // Check for failure on blockchain
                    const operations = await getUserOperations(
                        transaction.userAddress,
                        'failed'
                    );
                    const failedOp = operations.find(
                        (op) => op.clientOperationId === id
                    );

                    if (failedOp) {
                        get().updateTransactionStage(id, 'failed');
                        // Update failure details
                        const transactions = [...get().transactions];
                        const index = transactions.findIndex(
                            (tx) => tx.id === id
                        );
                        if (index >= 0) {
                            transactions[index].failureReason =
                                failedOp.failureReason;
                            transactions[index].failedAt = failedOp.failedAt;
                            set({ transactions });
                        }
                    }
                    // If not matched and not failed, transaction is still pending
                }
            }
            // For unstake operations
            else if (transaction.type === 'unstake') {
                // Check if position still exists
                const positions = await get().fetchPositions(
                    transaction.userAddress
                );
                const positionStillExists = positions.some(
                    (p) => p.id === transaction.positionId
                );

                if (!positionStillExists) {
                    // Position no longer exists - unstake completed
                    get().updateTransactionStage(id, 'completed');
                } else {
                    // Check for failure on blockchain
                    const operations = await getUserOperations(
                        transaction.userAddress,
                        'failed'
                    );
                    const failedOp = operations.find(
                        (op) => op.clientOperationId === id
                    );

                    if (failedOp) {
                        get().updateTransactionStage(id, 'failed');
                        // Update failure details
                        const transactions = [...get().transactions];
                        const index = transactions.findIndex(
                            (tx) => tx.id === id
                        );
                        if (index >= 0) {
                            transactions[index].failureReason =
                                failedOp.failureReason;
                            transactions[index].failedAt = failedOp.failedAt;
                            set({ transactions });
                        }
                    }
                    // If position still exists and no failure, transaction is still pending
                }
            }
        } catch (error) {
            console.error('Error checking transaction status:', error);
            // Don't update status on error - just continue trying
        }
    },
});
