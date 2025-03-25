import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';
import TokenBadge from '@/components/app/shared/token-badge';
import { useStakingStore } from '@/store/staking-store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PendingOperation {
    id: string;
    type: 'stake' | 'unstake';
    tokenAddress: string;
    amount?: string;
    timestamp: number;
    userAddress: string;
    positionId?: string;
    tokenSymbol?: string;
}

interface PendingOperationsProps {
    userAddress: string;
    tokens: Array<{
        address: string;
        symbol: string;
        name?: string;
        decimals?: number;
    }>;
}

const PendingOperations = ({ userAddress, tokens }: PendingOperationsProps) => {
    const [pendingItems, setPendingItems] = useState<PendingOperation[]>([]);
    const [nextPollTime, setNextPollTime] = useState<number>(0);
    const [countdown, setCountdown] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);

    const { pollingInterval } = useStakingStore();
    const { triggerManualCheck } = useStakingStore();
    const [isCheckingNow, setIsCheckingNow] = useState(false);
    const [lastChecked, setLastChecked] = useState<string>('');

    const handleCheckNow = async () => {
        setIsCheckingNow(true);
        await triggerManualCheck(userAddress);
        setLastChecked('Just now');
        setIsCheckingNow(false);
        // Reset countdown and progress
        setNextPollTime(Date.now() + 30000);
        setProgress(0);
    };

    // Load pending operations from localStorage and enhance with token info
    useEffect(() => {
        const loadPendingItems = () => {
            const allPendingItems = JSON.parse(
                localStorage.getItem('pendingStakes') || '[]'
            );

            // Filter for current user and enhance with token symbol
            const userPendingItems = allPendingItems
                .filter(
                    (item: PendingOperation) => item.userAddress === userAddress
                )
                .map((item: PendingOperation) => {
                    const matchingToken = tokens.find(
                        (token: { address: string }) =>
                            token.address === item.tokenAddress
                    );
                    return {
                        ...item,
                        tokenSymbol: matchingToken?.symbol || 'Unknown',
                    };
                });

            setPendingItems(userPendingItems);
        };

        loadPendingItems();

        // Set up a listener for localStorage changes
        const handleStorageChange = () => {
            loadPendingItems();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [userAddress, tokens]);

    // Set up countdown timer
    useEffect(() => {
        if (pollingInterval) {
            const pollingTime = 30000; // 30 seconds in ms
            setNextPollTime(Date.now() + pollingTime);

            const timer = setInterval(() => {
                const now = Date.now();
                const remaining = Math.ceil((nextPollTime - now) / 1000);
                setCountdown(remaining > 0 ? remaining : 30);

                // Calculate progress percentage (inverted: 0% at start, 100% at end)
                const progressValue = 100 - (remaining / 30) * 100;
                setProgress(progressValue > 0 ? progressValue : 0);

                // Reset timer when it hits zero
                if (remaining <= 0) {
                    setNextPollTime(now + pollingTime);
                    setLastChecked('Just now');
                } else if (remaining > 25) {
                    setLastChecked('Just now');
                } else {
                    setLastChecked(`${30 - remaining}s ago`);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [pollingInterval, nextPollTime]);

    if (pendingItems.length === 0) {
        return null;
    }

    // Get time elapsed since pending operation started
    const getTimeElapsed = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor(
            (seconds % 3600) / 60
        )}m ago`;
    };

    // Get status indicator based on time elapsed
    const getStatusIndicator = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 30) {
            return <span className="text-amber-600">Submitting</span>;
        } else if (seconds < 120) {
            return <span className="text-amber-600">Processing</span>;
        } else {
            return (
                <span className="text-amber-700">
                    Processing (taking longer than usual)
                </span>
            );
        }
    };

    return (
        <Card className="mb-6 border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-amber-800 flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin text-amber-600" />
                        Pending Transactions
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center text-xs text-amber-600 mr-3">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Next check: {countdown}s</span>
                            <span className="mx-2 text-amber-400">|</span>
                            <span>Last checked: {lastChecked}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                            onClick={handleCheckNow}
                            disabled={isCheckingNow}
                        >
                            <RefreshCw
                                className={`h-3 w-3 mr-1 ${
                                    isCheckingNow ? 'animate-spin' : ''
                                }`}
                            />
                            Check Now
                        </Button>
                    </div>
                </div>

                <Progress value={progress} className="h-1 mb-3 bg-amber-200" />

                <div className="space-y-3">
                    {pendingItems.map((item) => (
                        <div
                            key={item.id}
                            className="p-3 bg-white rounded-md shadow-sm border border-amber-100"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="mr-3">
                                        <TokenBadge
                                            token={item.tokenSymbol || ''}
                                        />
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {item.type === 'stake'
                                                ? 'Staking'
                                                : 'Unstaking'}{' '}
                                            {item.amount} {item.tokenSymbol}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Started{' '}
                                            {getTimeElapsed(item.timestamp)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center text-amber-600">
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    {getStatusIndicator(item.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-3 text-xs text-amber-700 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Note: Transactions may take several minutes to complete. You
                    can continue using the app while they process.
                </div>
            </CardContent>
        </Card>
    );
};

export default PendingOperations;
