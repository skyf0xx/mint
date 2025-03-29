// store/slices/operations-slice.ts
import { toast } from 'react-toastify';
import { StakingState } from '@/types/staking-store';
import {
    stakeTokens,
    unstakeTokens,
    checkSufficientBalance,
} from '@/services/staking-service';
import { Transaction } from '@/components/app/dashboard/transaction/transaction-status';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOperationsSlice = (set: any, get: () => StakingState) => ({
    isStaking: false,
    isUnstaking: false,

    stakeToken: async (tokenAddress: string, amount: string) => {
        try {
            // Check for maintenance mode first
            const isInMaintenance = await get().checkMaintenanceStatus();
            if (isInMaintenance) {
                toast.warning(
                    'Staking is temporarily unavailable during maintenance.',
                    { autoClose: 5000 }
                );
                return false;
            }

            set({ isStaking: true });

            // Check balance first
            const userAddress = await window.arweaveWallet?.getActiveAddress();
            const hasBalance = await get().checkBalance(
                tokenAddress,
                amount,
                userAddress as string
            );

            if (!hasBalance) {
                toast.error(
                    'You do not have enough tokens to complete this transaction',
                    { autoClose: 5000 }
                );
                return false;
            }

            // Generate transaction ID
            const transactionId = `stake-${tokenAddress}-${userAddress}-${Date.now()}`;

            // Get token details
            const token = get().availableTokens.find(
                (t) => t.address === tokenAddress
            );

            // Create transaction object with initial 'pending' stage
            const transaction: Transaction = {
                id: transactionId,
                type: 'stake',
                tokenAddress,
                tokenSymbol: token?.symbol || 'Unknown',
                amount,
                timestamp: Date.now(),
                userAddress: userAddress as string,
                stage: 'pending',
                estimatedTimeMinutes: 5,
            };

            // Add to transactions list
            set({ transactions: [...get().transactions, transaction] });

            // Proceed with staking
            await stakeTokens(tokenAddress, amount, transactionId);

            toast.success(
                'Your staking transaction has been submitted. You can track its progress above.',
                { autoClose: 5000 }
            );

            // Start polling
            get().startPolling(userAddress as string);

            // Return to dashboard
            set({ currentView: 'dashboard' });

            return true;
        } catch (error) {
            console.error('Staking error:', error);
            toast.error(
                'There was an error processing your staking transaction',
                { autoClose: 5000 }
            );
            return false;
        } finally {
            set({ isStaking: false });
        }
    },

    unstakePosition: async (positionId: string) => {
        try {
            // Check for maintenance mode first
            const isInMaintenance = await get().checkMaintenanceStatus();
            if (isInMaintenance) {
                toast.warning(
                    'Unstaking is temporarily unavailable during maintenance.',
                    { autoClose: 5000 }
                );
                return false;
            }

            set({ isUnstaking: true });

            // Find the position
            const position = get().userPositions.find(
                (p) => p.id === positionId
            );
            if (!position) {
                throw new Error('Position not found');
            }

            // Get user address
            const userAddress = await window.arweaveWallet?.getActiveAddress();

            // Generate transaction ID
            const transactionId = `unstake-${positionId}-${Date.now()}`;

            // Create transaction object with initial 'pending' stage
            const transaction: Transaction = {
                id: transactionId,
                type: 'unstake',
                tokenAddress: position.tokenAddress,
                tokenSymbol: position.tokenSymbol,
                amount: position.formattedTokenAmount,
                timestamp: Date.now(),
                userAddress: userAddress as string,
                positionId,
                stage: 'pending',
                estimatedTimeMinutes: 5,
            };

            // Add to transactions list
            set({ transactions: [...get().transactions, transaction] });

            // Perform unstaking
            await unstakeTokens(position.tokenAddress, transactionId);

            toast.success(
                'Your unstaking transaction has been submitted. You can track its progress above.',
                { autoClose: 5000 }
            );

            // Start polling
            get().startPolling(userAddress as string);

            // Return to dashboard
            set({ currentView: 'dashboard' });
            return true;
        } catch (error) {
            console.error('Unstaking error:', error);
            toast.error(
                'There was an error processing your unstaking transaction',
                { autoClose: 5000 }
            );
            return false;
        } finally {
            set({ isUnstaking: false });
        }
    },

    checkBalance: async (
        tokenAddress: string,
        amount: string,
        userAddress: string
    ) => {
        try {
            return await checkSufficientBalance(
                tokenAddress,
                amount,
                userAddress
            );
        } catch (error) {
            console.error('Error checking balance:', error);
            return false;
        }
    },
});
