// components/app/position/position-detail-view.tsx
import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    ArrowLeft,
    MinusCircle,
    Info,
    Shield,
    Clock,
    ExternalLink,
    Coins,
    Calendar,
} from 'lucide-react';
import { StakingPosition } from '@/types/staking';

interface PositionDetailViewProps {
    position: StakingPosition;
    onBack: () => void;
    onUnstake: () => void;
    onShowILInfo: () => void;
}

const PositionDetailView = ({
    position,
    onBack,
    onUnstake,
    onShowILInfo,
}: PositionDetailViewProps) => {
    // Calculate days staked
    const daysStaked = Math.floor(
        (new Date().getTime() - new Date(position.stakedDate).getTime()) /
            (1000 * 60 * 60 * 24)
    );

    // Calculate remaining days until full vesting (30 days total)
    const remainingDays = Math.max(0, 30 - daysStaked);

    // Format the remaining time
    const formatRemainingTime = () => {
        if (remainingDays === 0) {
            return 'Fully vested';
        } else if (remainingDays === 1) {
            return '1 day remaining';
        } else {
            return `${remainingDays} days remaining`;
        }
    };

    return (
        <>
            <Card className="max-w-3xl mx-auto border-2 border-primary/10 shadow-lg">
                {/* Header with title and IL info button */}
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onBack}
                                className="mr-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                                {position.tokenSymbol} Position Details
                            </CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onShowILInfo}
                            className="text-primary"
                        >
                            <Info className="h-4 w-4 mr-1" />
                            IL Protection
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Position Summary - Group related tokens and amounts together */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-primary/10">
                        <h3 className="text-sm font-medium flex items-center mb-3">
                            <Coins className="w-4 h-4 mr-2 text-primary" />
                            Position Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-600 mb-1">
                                    Staked Amount
                                </div>
                                <div className="font-medium text-lg">
                                    {position.formattedTokenAmount}{' '}
                                    {position.tokenSymbol}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">
                                    MINT Supplied
                                </div>
                                <div className="font-medium text-lg">
                                    {position.formattedMintAmount} MINT
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">
                                    LP Tokens
                                </div>
                                <div className="font-medium">
                                    {position.formattedLpTokens}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-1">
                                    AMM Pool
                                </div>
                                <a
                                    href={`https://www.ao.link/#/entity/${position.amm}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-primary hover:underline flex items-center"
                                >
                                    {position.amm.substring(0, 6)}...
                                    {position.amm.substring(
                                        position.amm.length - 4
                                    )}
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Staking Duration */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-primary/10">
                        <h3 className="text-sm font-medium flex items-center mb-3">
                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                            Staking Duration
                        </h3>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-medium text-lg">
                                    {daysStaked} days
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Since{' '}
                                    {new Date(
                                        position.stakedDate
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600 mb-1">
                                    IL Protection Level
                                </div>
                                <div className="font-medium text-lg text-primary">
                                    {position.ilProtectionPercentage}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* IL Protection Progress */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-primary/10">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium flex items-center">
                                <Shield className="w-4 h-4 mr-2 text-primary" />
                                IL Protection Progress
                            </h3>
                        </div>

                        <Progress
                            value={(daysStaked / 30) * 100}
                            max={100}
                            className="h-2 bg-gray-100"
                        />

                        <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                            <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{formatRemainingTime()}</span>
                            </div>
                            <div>Maximum: 50% coverage</div>
                        </div>

                        <p className="text-xs text-gray-600 mt-3 bg-primary/5 p-2 rounded">
                            Your impermanent loss protection vests linearly over
                            30 days. If you unstake now, you&apos;ll be
                            protected against {position.ilProtectionPercentage}%
                            of any impermanent loss incurred.
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end space-x-3 pt-2">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>

                    <Button
                        className="bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300"
                        onClick={onUnstake}
                    >
                        <MinusCircle className="mr-2 h-4 w-4" /> Unstake
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default PositionDetailView;
