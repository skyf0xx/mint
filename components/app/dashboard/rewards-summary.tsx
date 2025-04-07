// components/app/dashboard/rewards-summary.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Clock, ArrowUpRight, BarChart3 } from 'lucide-react';
import { useStakingStore } from '@/store/staking-store';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const RewardsSummary: React.FC = () => {
    const { userRewards, rewardsSummary, isLoadingRewards } = useStakingStore();

    const formatTimestamp = (timestamp: number): string => {
        if (!timestamp) return 'Never';
        return formatDistanceToNow(new Date(timestamp * 1000), {
            addSuffix: true,
        });
    };

    return (
        <Card className="border-2 border-primary/10 shadow-lg mb-6">
            <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
                <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                    Your Hyper Rare MINT Liquidity Mining Rewards
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Rewards */}
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                            <div className="p-2 rounded-full bg-primary/20 mr-3">
                                <Coins className="h-5 w-5 text-primary" />
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Rewards
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
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RewardsSummary;
