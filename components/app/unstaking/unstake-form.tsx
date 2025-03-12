// components/app/unstaking/unstake-form.tsx
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';
import TransactionStatus from '../shared/transaction-status';
import { StakingPosition } from '@/types/staking';
import { useStakingStore } from '@/store/staking-store';

interface UnstakeFormProps {
    position: StakingPosition;
    onCancel: () => void;
    onUnstake: (positionId: string) => Promise<boolean>;
    onShowILInfo: () => void;
}

const UnstakeForm = ({
    position,
    onCancel,
    onUnstake,
    onShowILInfo,
}: UnstakeFormProps) => {
    const { isUnstaking } = useStakingStore();

    // Use formattedTokenAmount as the initial amount value since we don't have currentValue
    const [amount, setAmount] = useState(position.formattedTokenAmount);

    const [txStatus, setTxStatus] = useState<{
        status: 'pending' | 'success' | 'error' | null;
        message: string;
        txId?: string;
    }>({ status: null, message: '' });

    // Calculate days staked
    const daysStaked = Math.floor(
        (new Date().getTime() - new Date(position.stakedDate).getTime()) /
            (1000 * 60 * 60 * 24)
    );

    // Handle max button click - set to the full amount available
    const handleMaxClick = () => {
        setAmount(position.formattedTokenAmount);
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setTxStatus({
                status: 'pending',
                message: 'Processing your unstaking transaction...',
            });

            const success = await onUnstake(position.id);

            if (success) {
                setTxStatus({
                    status: 'success',
                    message: `Successfully unstaked ${position.formattedTokenAmount} ${position.tokenSymbol}`,
                });

                // Reset form after a successful transaction
                setTimeout(() => {
                    setTxStatus({ status: null, message: '' });
                }, 10000);
            } else {
                setTxStatus({
                    status: 'error',
                    message: 'Transaction failed. Please try again.',
                });
            }
        } catch (error) {
            console.error('Unstaking failed:', error);
            setTxStatus({
                status: 'error',
                message: 'Failed to unstake your tokens. Please try again.',
            });
        }
    };

    // Form validation - only allow valid amounts up to the max available
    const isAmountValid =
        amount &&
        parseFloat(amount) > 0 &&
        parseFloat(amount) <= parseFloat(position.formattedTokenAmount);

    return (
        <Card className="max-w-md mx-auto border-2 border-primary/10 shadow-lg">
            <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                    Unstake Position
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {txStatus.status && (
                    <TransactionStatus
                        status={txStatus.status}
                        title={
                            txStatus.status === 'pending'
                                ? 'Processing Transaction'
                                : txStatus.status === 'success'
                                ? 'Transaction Successful'
                                : 'Transaction Failed'
                        }
                        message={txStatus.message}
                        txId={txStatus.txId}
                    />
                )}

                {/* Position Details Section */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <h3 className="font-medium text-gray-700 mb-1">
                        Position Details: {position.tokenSymbol}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Initial deposit:
                            </span>
                            <span className="font-medium">
                                {position.formattedTokenAmount}{' '}
                                {position.tokenSymbol}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Time staked:</span>
                            <span className="font-medium">
                                {position.timeStaked}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Days staked:</span>
                            <span className="font-medium">
                                {daysStaked} days
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                IL protection:
                            </span>
                            <span className="font-medium">
                                {position.ilProtectionPercentage}% vested
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="unstake-amount"
                        className="text-sm font-medium text-gray-700"
                    >
                        Amount to Unstake
                    </label>
                    <div className="relative">
                        <Input
                            id="unstake-amount"
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pr-20"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 text-primary"
                            onClick={handleMaxClick}
                        >
                            MAX
                        </Button>
                    </div>
                </div>

                {/* Unstaking Summary Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">
                        Unstaking Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Position value:
                            </span>
                            <span>
                                {position.formattedTokenAmount}{' '}
                                {position.tokenSymbol}
                            </span>
                        </div>
                    </div>
                </div>

                {!isAmountValid && amount && (
                    <div className="text-sm text-red-500 px-1">
                        Please enter a valid amount between 0 and{' '}
                        {position.formattedTokenAmount} {position.tokenSymbol}
                    </div>
                )}

                <div className="flex items-center justify-end mt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onShowILInfo}
                        className="text-primary text-sm flex items-center"
                    >
                        <Info className="h-4 w-4 mr-1" />
                        Learn about impermanent loss protection
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 pt-2 border-t border-gray-100">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isUnstaking || txStatus.status === 'pending'}
                >
                    Cancel
                </Button>
                <Button
                    className="bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300"
                    onClick={handleSubmit}
                    disabled={
                        !isAmountValid ||
                        isUnstaking ||
                        txStatus.status === 'pending'
                    }
                >
                    {isUnstaking || txStatus.status === 'pending'
                        ? 'Processing...'
                        : 'Unstake'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default UnstakeForm;
