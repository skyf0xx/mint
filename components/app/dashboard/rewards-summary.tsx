// components/app/dashboard/rewards-summary.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Coins,
    Clock,
    ArrowUpRight,
    BarChart3,
    PieChart,
    Info,
} from 'lucide-react';
import { useStakingStore } from '@/store/staking-store';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const RewardsSummary: React.FC = () => {
    const { userRewards, rewardsSummary, stakeOwnership, isLoadingRewards } =
        useStakingStore();

    const formatTimestamp = (timestamp: number): string => {
        if (!timestamp) return 'Never';
        return formatDistanceToNow(new Date(timestamp), {
            addSuffix: true,
        });
    };

    // Calculate average reward per distribution
    const avgRewardPerDistribution = React.useMemo(() => {
        if (
            !userRewards?.total ||
            !userRewards?.distributions ||
            userRewards.distributions === 0
        ) {
            return '0';
        }
        const avg = Number(userRewards.total) / userRewards.distributions;
        return avg.toFixed(avg < 0.01 ? 6 : 4);
    }, [userRewards]);

    return (
        <Card className="border-2 border-primary/10 shadow-lg mb-6">
            <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
                <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                    Your Hyper Rare MINT Liquidity Mining Rewards
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {/* Primary Section: Pool Share & Reward Relationship */}
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="w-full md:w-2/5 mb-4 md:mb-0">
                            <div className="flex items-center mb-2">
                                <div className="p-2 rounded-full bg-blue-200 mr-3">
                                    <PieChart className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="text-lg font-medium text-gray-800">
                                    Your Pool Share
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 ml-1 text-gray-400 inline cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Your percentage of the total
                                                    staking pool. This directly
                                                    determines your reward
                                                    amount in each distribution.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                            {isLoadingRewards ? (
                                <Skeleton className="h-12 w-40" />
                            ) : (
                                <div className="text-3xl font-bold text-blue-700">
                                    {stakeOwnership?.formattedPercentage ||
                                        '0.000000'}
                                    %
                                    <div className="text-sm font-normal text-gray-600 mt-1">
                                        of total staking pool
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hidden md:block border-r border-blue-200 h-20 mx-4"></div>

                        <div className="w-full md:w-3/5">
                            <div className="flex items-center mb-2">
                                <div className="p-2 rounded-full bg-blue-200 mr-3">
                                    <ArrowUpRight className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="text-lg font-medium text-gray-800">
                                    How Your Rewards Are Calculated
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 ml-1 text-gray-400 inline cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Your rewards = (Your Pool
                                                    Share %) × (Distribution
                                                    Amount)
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-60 p-3 rounded-md text-sm">
                                <p className="mb-2">
                                    Your rewards are directly proportional to
                                    your pool share:
                                </p>
                                <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                    <span>
                                        Higher stake = higher percentage of each
                                        distribution
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                                    <span>
                                        Average per distribution:{' '}
                                        <strong>
                                            {avgRewardPerDistribution} MINT
                                        </strong>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rewards Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Rewards */}
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                            <div className="p-2 rounded-full bg-primary/20 mr-3">
                                <Coins className="h-5 w-5 text-primary" />
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Rewards
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-3.5 w-3.5 ml-1 text-gray-400 inline cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Total MINT tokens you&apos;ve
                                                earned from liquidity mining
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        {isLoadingRewards ? (
                            <Skeleton className="h-9 w-32" />
                        ) : (
                            <div className="text-2xl font-semibold">
                                {userRewards?.formattedTotal || '0'}{' '}
                                <span className="text-sm text-gray-500">
                                    MINT
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Last Distribution */}
                    <div className="bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                            <div className="p-2 rounded-full bg-accent/20 mr-3">
                                <Clock className="h-5 w-5 text-accent" />
                            </div>
                            <div className="text-sm text-gray-600">
                                Last Received
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-3.5 w-3.5 ml-1 text-gray-400 inline cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Most recent reward amount and
                                                when it was distributed
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        {isLoadingRewards ? (
                            <Skeleton className="h-9 w-32" />
                        ) : (
                            <>
                                <div className="text-2xl font-semibold">
                                    {userRewards?.formattedLastReceived || '0'}{' '}
                                    <span className="text-sm text-gray-500">
                                        MINT
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {userRewards
                                        ? formatTimestamp(
                                              userRewards.lastDistributionTime
                                          )
                                        : 'Never'}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Distribution Stats */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                            <div className="p-2 rounded-full bg-gray-200 mr-3">
                                <BarChart3 className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="text-sm text-gray-600">
                                Distribution Stats
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-3.5 w-3.5 ml-1 text-gray-400 inline cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Number of distributions
                                                you&apos;ve received and timing
                                                of next distribution
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        {isLoadingRewards ? (
                            <Skeleton className="h-9 w-32" />
                        ) : (
                            <>
                                <div className="text-2xl font-semibold">
                                    {userRewards?.distributions || 0}{' '}
                                    <span className="text-sm text-gray-500">
                                        distributions
                                    </span>
                                </div>
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                    <ArrowUpRight className="h-3 w-3 mr-1 text-primary" />
                                    <span>
                                        Next distribution in approximately 5
                                        minutes
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {rewardsSummary && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
                        <div className="flex items-center">
                            <div className="mr-2">
                                <Coins className="h-4 w-4 text-gray-400" />
                            </div>
                            <span>
                                Total of{' '}
                                <strong>
                                    {rewardsSummary.formattedTotalDistributed}{' '}
                                    MINT
                                </strong>{' '}
                                distributed to{' '}
                                <strong>{rewardsSummary.totalAddresses}</strong>{' '}
                                stakers. Last global distribution{' '}
                                {formatTimestamp(
                                    rewardsSummary.lastDistributionTime
                                )}
                                .
                            </span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-3.5 w-3.5 ml-2 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            Summary of global distribution
                                            statistics across all stakers
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RewardsSummary;
