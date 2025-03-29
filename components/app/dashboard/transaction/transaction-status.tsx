import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    RefreshCw,
    HelpCircle,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import TokenBadge from '@/components/app/shared/token-badge';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Enhanced transaction status types
export type TransactionStage = 'pending' | 'completed' | 'failed';

// Represents a transaction in the system
export interface Transaction {
    id: string;
    type: 'stake' | 'unstake';
    tokenAddress: string;
    tokenSymbol: string;
    amount: string;
    timestamp: number;
    userAddress: string;
    positionId?: string;
    stage: TransactionStage;
    estimatedTimeMinutes?: number;
    failureReason?: string;
    failedAt?: number;
    txId?: string;
    retryCount?: number;
}

interface TransactionStatusCardProps {
    transaction: Transaction;
    onCheckNow: () => void;
    isCheckingNow: boolean;
    lastChecked: string;
    nextCheckTime: number;
}

const DiscordButton = () => {
    return (
        <a
            href="https://discord.gg/T55faTyzkc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Help on Discord
        </a>
    );
};

const TransactionStatusCard: React.FC<TransactionStatusCardProps> = ({
    transaction,
    onCheckNow,
    isCheckingNow,
    lastChecked,
    nextCheckTime,
}) => {
    const [progress, setProgress] = useState<number>(0);
    const [countdown, setCountdown] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState<string>('');

    // Update elapsed time, progress, and countdown
    useEffect(() => {
        const timer = setInterval(() => {
            // Calculate elapsed time
            const elapsed = Date.now() - transaction.timestamp;
            setElapsedTime(formatElapsedTime(elapsed));

            // Calculate progress based on estimated time
            const estimatedMs =
                (transaction.estimatedTimeMinutes || 3) * 60 * 1000;
            const progressValue = Math.min((elapsed / estimatedMs) * 100, 99);
            setProgress(
                transaction.stage === 'completed' ? 100 : progressValue
            );

            // Calculate countdown to next check
            const timeToNextCheck = Math.max(0, nextCheckTime - Date.now());
            setCountdown(Math.ceil(timeToNextCheck / 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, [transaction, nextCheckTime]);

    // Format elapsed time for display
    const formatElapsedTime = (ms: number): string => {
        const seconds = Math.floor(ms / 1000);

        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600)
            return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor(
            (seconds % 3600) / 60
        )}m`;
    };

    // Get stage-specific display details
    const getStageInfo = () => {
        switch (transaction.stage) {
            case 'pending':
                return {
                    title: 'Transaction Pending',
                    description:
                        'Your transaction is being processed. This may take a few minutes.',
                    icon: (
                        <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                    ),
                    color: 'text-amber-600',
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                };
            case 'completed':
                return {
                    title: 'Transaction Complete',
                    description:
                        'Your transaction has been successfully completed.',
                    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                };
            case 'failed':
                return {
                    title: 'Transaction Failed',
                    description: 'Your transaction failed to complete.',
                    icon: <XCircle className="h-5 w-5 text-red-500" />,
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                };
            default:
                return {
                    title: 'Processing Transaction',
                    description: 'Your transaction is being processed.',
                    icon: (
                        <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                    ),
                    color: 'text-amber-600',
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                };
        }
    };

    const stageInfo = getStageInfo();
    const isActive = transaction.stage === 'pending';

    return (
        <Card
            className={`mb-3 shadow-sm ${stageInfo.bgColor} border ${stageInfo.borderColor}`}
        >
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <div
                        className={`font-medium flex items-center ${stageInfo.color}`}
                    >
                        {stageInfo.icon}
                        <span className="ml-2">{stageInfo.title}</span>
                    </div>

                    {isActive && (
                        <div className="flex items-center">
                            <div className="flex items-center text-xs text-gray-600 mr-3">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>Next check: {countdown}s</span>
                                <span className="mx-2 text-gray-400">|</span>
                                <span>Last: {lastChecked}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`h-7 text-xs border-gray-300 ${stageInfo.color} hover:${stageInfo.bgColor}`}
                                onClick={onCheckNow}
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
                    )}

                    {!isActive && transaction.stage === 'completed' && (
                        <div className="text-xs text-green-600 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Completed {elapsedTime} ago
                        </div>
                    )}

                    {!isActive && transaction.stage === 'failed' && (
                        <div className="text-xs text-red-600 flex items-center">
                            <XCircle className="h-4 w-4 mr-1" />
                            Failed {elapsedTime} ago
                        </div>
                    )}
                </div>

                {isActive && (
                    <Progress
                        value={progress}
                        className="h-2 mb-3 bg-amber-100"
                    />
                )}

                <div
                    className={`p-3 rounded-md ${
                        isActive ? 'bg-white' : stageInfo.bgColor
                    } border ${stageInfo.borderColor}`}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="mr-3">
                                <TokenBadge token={transaction.tokenSymbol} />
                            </div>
                            <div>
                                <div className="font-medium">
                                    {transaction.type === 'stake'
                                        ? 'Staking'
                                        : 'Unstaking'}{' '}
                                    {transaction.amount}{' '}
                                    {transaction.tokenSymbol}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Started {elapsedTime} ago
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div
                                className={`px-3 py-1 rounded-full text-sm ${stageInfo.color} ${stageInfo.bgColor} border ${stageInfo.borderColor}`}
                            >
                                {stageInfo.icon}
                                <span className="ml-1">
                                    {transaction.stage.charAt(0).toUpperCase() +
                                        transaction.stage.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                        <p>{stageInfo.description}</p>

                        {transaction.stage === 'pending' && (
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center cursor-help">
                                                <HelpCircle className="h-3 w-3 mr-1" />
                                                <span>
                                                    Why does this take time?
                                                </span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p>
                                                Staking operations require
                                                multiple confirmations on the
                                                blockchain. This process
                                                typically takes 2-5 minutes but
                                                can take longer during periods
                                                of network congestion.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        )}

                        {transaction.txId && (
                            <div className="mt-2 text-xs flex items-center text-gray-500">
                                <span className="font-mono">
                                    TX: {transaction.txId.substring(0, 12)}...
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 p-0 px-1 ml-1 text-primary"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                </Button>
                            </div>
                        )}

                        {transaction.stage === 'failed' && (
                            <div className="mt-2 flex justify-between">
                                <span className="text-red-600 text-sm">
                                    {transaction.failureReason ||
                                        'Transaction failed to complete.'}
                                </span>
                                <DiscordButton />
                            </div>
                        )}
                    </div>
                </div>

                {isActive && (
                    <div className="mt-3 text-xs flex items-center justify-between">
                        <div className="flex items-center text-gray-500">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            <span>
                                You can continue using the app while this
                                processes
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TransactionStatusCard;
