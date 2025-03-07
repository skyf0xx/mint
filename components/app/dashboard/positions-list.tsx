// components/app/dashboard/positions-list.tsx
import React from 'react';
import { ExternalLink, MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TokenBadge from '@/components/app/shared/token-badge';
import { StakingPosition } from '@/types/staking';
import ILProtectionIndicator from '@/components/app/shared/il-protection-indicator';

interface PositionsListProps {
    positions: StakingPosition[];
    onViewPosition: (id: string) => void;
    onUnstake: (id: string) => void;
}

const PositionsList = ({
    positions,
    onViewPosition,
    onUnstake,
}: PositionsListProps) => {
    // Group positions by token
    const groupedPositions: Record<string, StakingPosition[]> = {};

    positions.forEach((position) => {
        if (!groupedPositions[position.token]) {
            groupedPositions[position.token] = [];
        }
        groupedPositions[position.token].push(position);
    });

    // Calculate days staked for a position
    const getDaysStaked = (stakedDate: Date): number => {
        return Math.floor(
            (new Date().getTime() - new Date(stakedDate).getTime()) /
                (1000 * 60 * 60 * 24)
        );
    };

    return (
        <div className="space-y-4">
            {Object.keys(groupedPositions).length === 0 && (
                <div className="text-center text-gray-500 py-4">
                    No positions found
                </div>
            )}

            {Object.entries(groupedPositions).map(([token, tokenPositions]) => (
                <div
                    key={token}
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center">
                            <TokenBadge token={token} />
                        </div>
                        <span className="text-sm text-gray-500">
                            {tokenPositions.length} position
                            {tokenPositions.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {tokenPositions.map((position) => {
                            const daysStaked = getDaysStaked(
                                position.stakedDate
                            );

                            return (
                                <div
                                    key={position.id}
                                    className="p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Amount
                                            </div>
                                            <div className="font-medium">
                                                {position.initialAmount} {token}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Current: {position.currentValue}{' '}
                                                {token}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Staked
                                            </div>
                                            <div className="font-medium">
                                                {daysStaked}d ago
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(
                                                    position.stakedDate
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="md:col-span-1 lg:col-span-1">
                                            <div className="text-xs text-gray-500 mb-1">
                                                IL Protection
                                            </div>
                                            <ILProtectionIndicator
                                                percentage={
                                                    position.ilProtectionPercentage
                                                }
                                                daysStaked={daysStaked}
                                                maxDays={30}
                                            />
                                        </div>

                                        <div className="flex justify-end items-center space-x-2 md:col-span-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 text-primary border-primary/30"
                                                onClick={() =>
                                                    onUnstake(position.id)
                                                }
                                            >
                                                <MinusCircle className="h-4 w-4 mr-1" />
                                                <span className="hidden sm:inline">
                                                    Unstake
                                                </span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9"
                                                onClick={() =>
                                                    onViewPosition(position.id)
                                                }
                                            >
                                                <ExternalLink className="h-4 w-4 mr-1" />
                                                <span className="hidden sm:inline">
                                                    Details
                                                </span>
                                            </Button>
                                        </div>
                                    </div>

                                    {position.estimatedRewards &&
                                        parseFloat(position.estimatedRewards) >
                                            0 && (
                                            <div className="mt-2 text-xs text-green-600">
                                                Estimated rewards:{' '}
                                                {position.estimatedRewards}{' '}
                                                {token}
                                            </div>
                                        )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PositionsList;
