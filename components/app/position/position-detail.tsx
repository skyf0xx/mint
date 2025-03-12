// components/app/position/position-details.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StakingPosition } from '@/types/staking';
import { Progress } from '@/components/ui/progress';
import { Shield, Clock } from 'lucide-react';

interface PositionDetailsProps {
    position: StakingPosition;
}

const PositionDetails = ({ position }: PositionDetailsProps) => {
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
        <Card className="overflow-hidden border-2 border-primary/10">
            <CardHeader className="bg-slate-50 pb-3">
                <CardTitle className="text-base text-gray-700 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-primary" />
                    Protection & Position Details
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Protection Progress Section */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">
                            IL Protection Progress
                        </span>
                        <span className="text-primary font-medium">
                            {position.ilProtectionPercentage}%
                        </span>
                    </div>

                    <Progress
                        value={(daysStaked / 30) * 100}
                        max={100}
                        className="h-2 bg-gray-100"
                    />

                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>Staked {daysStaked} days ago</span>
                        </div>
                        <div>{formatRemainingTime()}</div>
                    </div>
                </div>

                {/* Position Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-slate-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">
                            Initial Deposit
                        </div>
                        <div className="font-medium">
                            {position.formattedTokenAmount}{' '}
                            {position.tokenSymbol}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">
                            LP Tokens
                        </div>
                        <div className="font-medium">
                            {position.formattedLpTokens}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">
                            Staked Date
                        </div>
                        <div className="font-medium">
                            {new Date(position.stakedDate).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500 mb-1">
                            MINT in Pool
                        </div>
                        <div className="font-medium">{position.mintAmount}</div>
                    </div>
                </div>

                {/* Protection Information */}
                <div className="bg-primary/5 p-3 rounded-md mt-4">
                    <div className="flex items-center text-primary mb-2">
                        <Shield className="w-4 h-4 mr-2" />
                        <span className="font-medium text-sm">
                            Protection Details
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Your impermanent loss protection vests linearly over 30
                        days, currently at {position.ilProtectionPercentage}%
                        coverage. If you unstake now, you&apos;ll be protected
                        against {position.ilProtectionPercentage}% of any
                        impermanent loss incurred.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default PositionDetails;
