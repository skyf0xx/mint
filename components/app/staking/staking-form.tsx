import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import TokenSelector from './token-selector';
import AmountInput from './amount-input';
import PositionSummary from './position-summary';
import TransactionStatus from '../shared/transaction-status';
import { useStakingStore } from '@/store/staking-store';
import { useArweaveWalletStore } from '@/hooks/use-wallet';
import { TokenOption } from '@/types/staking';

interface StakingFormProps {
    onCancel: () => void;
    onSubmit: (tokenAddress: string, amount: string) => Promise<boolean>;
    onShowILInfo: () => void;
}

const StakingForm = ({
    onCancel,
    onSubmit,
    onShowILInfo,
}: StakingFormProps) => {
    // Get data from stores
    const { availableTokens, isStaking, fetchTokenBalance } = useStakingStore();
    const { address } = useArweaveWalletStore();

    // Local state
    const [selectedToken, setSelectedToken] = useState('');
    const [selectedTokenAddress, setSelectedTokenAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState('0');
    const [txStatus, setTxStatus] = useState<{
        status: 'pending' | 'success' | 'error' | null;
        message: string;
        txId?: string;
    }>({ status: null, message: '' });

    // Load token balances when token selection changes
    useEffect(() => {
        if (address && selectedToken) {
            const token = availableTokens.find(
                (t) => t.symbol === selectedToken
            );
            if (token) {
                setSelectedTokenAddress(token.address);

                // Fetch balance for the selected token
                fetchTokenBalance(token.address, address)
                    .then((balanceData) => {
                        if (balanceData) {
                            setBalance(balanceData);
                        } else {
                            setBalance('0');
                        }
                    })
                    .catch((err) => {
                        console.error('Error fetching balance:', err);
                        setBalance('0');
                    });
            }
        }
    }, [address, selectedToken]);

    // Handle max button click
    const handleMaxClick = () => {
        setAmount(balance);
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setTxStatus({
                status: 'pending',
                message: 'Processing your staking transaction...',
            });

            const success = await onSubmit(selectedTokenAddress, amount);

            if (success) {
                setTxStatus({
                    status: 'success',
                    message: `Successfully staked ${amount} ${selectedToken}`,
                });

                // Reset form after a successful transaction
                setTimeout(() => {
                    setAmount('');
                    setTxStatus({ status: null, message: '' });
                }, 3000);
            } else {
                setTxStatus({
                    status: 'error',
                    message: 'Transaction failed. Please try again.',
                });
            }
        } catch (error) {
            console.error('Staking failed:', error);
            setTxStatus({
                status: 'error',
                message: 'Failed to stake your tokens. Please try again.',
            });
        }
    };

    // Prepare token options for selector
    const tokenOptions: TokenOption[] = availableTokens.map((token) => ({
        value: token.symbol,
        label: token.symbol,
        balance: token.balance || '0',
    }));

    // Calculate estimated values for position summary
    // These would come from an API in a real implementation
    const estimatedMintAmount = (parseFloat(amount || '0') * 0.473).toFixed(2);
    const estimatedApr = '12.4';

    // Check if form is valid
    const isFormValid =
        selectedToken &&
        amount &&
        parseFloat(amount) > 0 &&
        parseFloat(amount) <= parseFloat(balance);

    return (
        <Card className="max-w-md mx-auto border-2 border-primary/10 shadow-lg">
            <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                    New Staking Position
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

                <TokenSelector
                    tokens={tokenOptions}
                    selectedToken={selectedToken}
                    onSelectToken={setSelectedToken}
                />

                <AmountInput
                    value={amount}
                    onChange={setAmount}
                    maxAmount={balance}
                    onMaxClick={handleMaxClick}
                    tokenSymbol={selectedToken}
                />

                {amount && parseFloat(amount) > 0 && (
                    <PositionSummary
                        tokenAmount={amount}
                        tokenSymbol={selectedToken}
                        mintAmount={estimatedMintAmount}
                        estimatedApr={estimatedApr}
                    />
                )}

                {parseFloat(amount) > parseFloat(balance) && (
                    <div className="text-sm text-red-500 px-1">
                        Insufficient balance. You need {amount} {selectedToken}{' '}
                        but have {balance}.
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
                        Protection details
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 pt-2 border-t border-gray-100">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isStaking || txStatus.status === 'pending'}
                >
                    Cancel
                </Button>
                <Button
                    className="bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300"
                    onClick={handleSubmit}
                    disabled={
                        !isFormValid ||
                        isStaking ||
                        txStatus.status === 'pending'
                    }
                >
                    {isStaking || txStatus.status === 'pending'
                        ? 'Processing...'
                        : 'Stake'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default StakingForm;
