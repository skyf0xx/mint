// components/app/dashboard/positions-list.tsx
import React from 'react';
import { MinusCircle, Loader2, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TokenBadge from '@/components/app/shared/token-badge';
import { StakingPosition } from '@/types/staking';
import ILProtectionIndicator from '@/components/app/shared/il-protection-indicator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface PositionsListProps {
    positions: StakingPosition[];
    onViewPosition: (id: string) => void;
    onUnstake: (id: string) => void;
    isInMaintenance?: boolean;
}

const PositionsList = ({
    positions,
    onViewPosition,
    onUnstake,
    isInMaintenance,
}: PositionsListProps) => {
    // Group positions by token
    const groupedPositions: Record<string, StakingPosition[]> = {};

    positions.forEach((position) => {
        const token = position.tokenSymbol;
        if (!groupedPositions[token]) {
            groupedPositions[token] = [];
        }
        groupedPositions[token].push(position);
    });

    // Calculate days staked for a position
    const getDaysStaked = (stakedDate: Date): number => {
        return Math.floor(
            (new Date().getTime() - new Date(stakedDate).getTime()) /
                (1000 * 60 * 60 * 24)
        );
    };

    // Check if a position is currently being unstaked
    const isBeingUnstaked = (positionId: string): boolean => {
        const pendingItems = JSON.parse(
            localStorage.getItem('pendingStakes') || '[]'
        );
        return pendingItems.some(
            (item: { type: string; positionId: string }) =>
                item.type === 'unstake' && item.positionId === positionId
        );
    };

    // Get unstaking time for a position
    const getUnstakingTime = (positionId: string): number => {
        const pendingItems = JSON.parse(
            localStorage.getItem('pendingStakes') || '[]'
        );
        const item = pendingItems.find(
            (item: { type: string; positionId: string; timestamp: number }) =>
                item.type === 'unstake' && item.positionId === positionId
        );
        return item ? Date.now() - item.timestamp : 0;
    };

    // Get formatted unstaking time
    const getFormattedUnstakingTime = (positionId: string): string => {
        const timeElapsed = getUnstakingTime(positionId);
        const seconds = Math.floor(timeElapsed / 1000);

        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600)
            return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor(
            (seconds % 3600) / 60
        )}m`;
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

                            // Use formattedTokenAmount as initialAmount if initialAmount is not available
                            const initialAmount = position.formattedTokenAmount;

                            // Check if this position is being unstaked
                            const unstaking = isBeingUnstaked(position.id);

                            return (
                                <div
                                    key={position.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                        unstaking ? 'bg-amber-50' : ''
                                    }`}
                                    onClick={() => onViewPosition(position.id)}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Amount
                                            </div>
                                            <div className="font-medium">
                                                {initialAmount} {token}
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
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger className="w-full text-left">
                                                        <ILProtectionIndicator
                                                            percentage={
                                                                position.ilProtectionPercentage
                                                            }
                                                            daysStaked={
                                                                daysStaked
                                                            }
                                                            maxDays={30}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Current IL
                                                            protection:{' '}
                                                            {
                                                                position.ilProtectionPercentage
                                                            }
                                                            %
                                                        </p>
                                                        <p>
                                                            Full protection
                                                            after 30 days
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                        <div className="flex justify-end items-center space-x-2 md:col-span-1">
                                            {unstaking ? (
                                                <div className="flex items-center text-amber-600 px-2 bg-amber-50 border border-amber-200 rounded-md py-1">
                                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                    <span className="text-sm mr-1">
                                                        Unstaking
                                                    </span>
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    <span className="text-xs">
                                                        {getFormattedUnstakingTime(
                                                            position.id
                                                        )}
                                                    </span>
                                                </div>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUnstake(position.id);
                                                    }}
                                                    disabled={
                                                        unstaking ||
                                                        isInMaintenance
                                                    }
                                                >
                                                    {isInMaintenance ? (
                                                        <>
                                                            <AlertTriangle className="h-4 w-4 mr-1" />
                                                            <span className="hidden sm:inline">
                                                                Maintenance
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MinusCircle className="h-4 w-4 mr-1" />
                                                            <span className="hidden sm:inline">
                                                                Unstake
                                                            </span>
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 text-primary border-primary/30"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewPosition(position.id);
                                                }}
                                            >
                                                <MinusCircle className="h-4 w-4 mr-1" />
                                                <span className="hidden sm:inline">
                                                    Details
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
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
