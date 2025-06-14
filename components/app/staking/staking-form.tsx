import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
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
    const [fetchingBalance, setFetchingBalance] = useState(false);
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

                // Set loading state to true
                setFetchingBalance(true);

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
                    })
                    .finally(() => {
                        // Set loading state to false when done
                        setFetchingBalance(false);
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
                }, 10000);
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

    const tokenOptions: TokenOption[] = availableTokens.map((token) => {
        const option: TokenOption = {
            value: token.symbol,
            label: token.symbol,
            balance: token.balance || '0',
            isTestToken: ['MATRIX', 'TTT'].includes(token.symbol),
            disabled: false, //token.symbol === 'MATRIX',
        };

        // Add token-specific notes
        if (token.symbol === 'TTT') {
            option.note = {
                text: 'These are Test Net Tokens. Testnet users will be rewarded - you can get them from',
                link: {
                    url: 'https://7ergimovvt6djnozunspgq5faks6am2tlab5axyyv3avom5yus5q.arweave.net/-SJkMdWs_DS12aNk80OlAqXgM1NYA9BfGK7BVzO4pLs',
                    text: 'Test Tokens',
                },
            };
        } else if (token.symbol === 'MINT') {
            option.note = {
                text: 'MINT is the native token of MINT Protocol',
            };
        } else if (token.symbol === 'MATRIX') {
            option.note = {
                text: 'MATRIX token is for testing purposes. MATRIX testers will be compensated by MINT Protocol',
                link: {
                    url: 'https://x.com/AlwaysBigger/status/1904321788152267019',
                    text: 'See details',
                },
            };
        } else if (token.symbol === 'NAB') {
            option.note = {
                text: 'Number Always Bigger',
                link: {
                    url: 'https://number-always-bigger.ar.io/',
                    text: 'Get NAB',
                },
            };
        }

        return option;
    });

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

                {/* Important Notice - Shows after token selection */}
                {selectedToken && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <span className="font-medium text-amber-800 mb-2">
                                    Before staking, make sure you understand
                                    impermanent loss.{' '}
                                </span>
                                <a
                                    href="https://www.youtube.com/watch?v=8XJ1MSTEuU0"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium transition-colors"
                                >
                                    Watch explanation video
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                <AmountInput
                    value={amount}
                    onChange={setAmount}
                    maxAmount={balance}
                    onMaxClick={handleMaxClick}
                    tokenSymbol={selectedToken}
                />

                {selectedToken && (
                    <div className="flex items-center text-sm px-1 text-gray-600">
                        <span>Balance: </span>
                        {fetchingBalance ? (
                            <span className="flex items-center ml-2">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Loading...
                            </span>
                        ) : (
                            <span className="ml-2 font-medium">
                                {balance} {selectedToken}
                            </span>
                        )}
                    </div>
                )}

                {amount && parseFloat(amount) > 0 && (
                    <>
                        <PositionSummary
                            tokenAmount={amount}
                            tokenSymbol={selectedToken}
                        />

                        {/* Impermanent Loss Educational Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                            <div className="flex items-start space-x-2">
                                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">
                                        Understanding Price Fluctuations
                                    </p>
                                    <p className="text-blue-700 leading-relaxed">
                                        When providing liquidity, your token
                                        values may fluctuate relative to simply
                                        holding them. This is a natural part of
                                        automated market making.
                                    </p>
                                    <a
                                        href="https://www.youtube.com/watch?v=8XJ1MSTEuU0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                    >
                                        Learn more about how this works
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </>
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
                        txStatus.status === 'pending' ||
                        fetchingBalance
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
