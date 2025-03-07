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
import { ArrowLeft, PlusCircle, MinusCircle, Info } from 'lucide-react';
import ILProtectionIndicator from '@/components/app/shared/il-protection-indicator';
import PositionChart from './position-chart';
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

    // Calculate impermanent loss
    const initialValue = parseFloat(position.initialAmount);
    const currentValue = parseFloat(position.currentValue);
    const impermanentLoss = initialValue - currentValue;
    const impermanentLossPercent =
        initialValue > 0
            ? ((impermanentLoss / initialValue) * 100).toFixed(2)
            : '0.00';

    return (
        <Card className="max-w-xl mx-auto border-2 border-primary/10 shadow-lg">
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
                            {position.token} Position Details
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
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-sm text-gray-600">Staked</div>
                        <div className="font-medium">
                            {position.initialAmount} {position.token}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-sm text-gray-600">Current</div>
                        <div className="font-medium">
                            {position.currentValue} {position.token}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-sm text-gray-600">IL Cover</div>
                        <div className="font-medium">
                            {position.ilProtectionPercentage}% vested
                        </div>
                    </div>
                </div>

                <ILProtectionIndicator
                    percentage={position.ilProtectionPercentage}
                    daysStaked={daysStaked}
                    maxDays={30}
                />

                <PositionChart position={position} />

                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <h3 className="font-medium text-gray-700">
                        Position Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-gray-600">
                                        Created:
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            position.stakedDate
                                        ).toLocaleDateString()}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-600">
                                        Days staked:
                                    </span>
                                    <span className="font-medium">
                                        {daysStaked} days
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-600">
                                        LP tokens:
                                    </span>
                                    <span className="font-medium">
                                        {position.lpTokens}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-gray-600">
                                        Impermanent loss:
                                    </span>
                                    <span
                                        className={`font-medium ${
                                            impermanentLoss > 0
                                                ? 'text-red-500'
                                                : 'text-green-500'
                                        }`}
                                    >
                                        {impermanentLossPercent}%
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-600">
                                        Protected amount:
                                    </span>
                                    <span className="font-medium">
                                        {(
                                            (impermanentLoss *
                                                position.ilProtectionPercentage) /
                                            100
                                        ).toFixed(4)}{' '}
                                        {position.token}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-600">
                                        Rewards earned:
                                    </span>
                                    <span className="font-medium text-green-500">
                                        {position.estimatedRewards}{' '}
                                        {position.token}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="flex items-center text-primary mb-2">
                        <Info className="h-4 w-4 mr-2" />
                        <h3 className="font-medium">Price Ratio Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Initial ratio:
                            </span>
                            <span className="font-medium">
                                1 {position.token} ={' '}
                                {position.initialPriceRatio || '0.473'} MINT
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Current ratio:
                            </span>
                            <span className="font-medium">
                                1 {position.token} ={' '}
                                {position.finalPriceRatio || '0.512'} MINT
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-3 pt-2">
                <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={onBack}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                    variant="outline"
                    className="flex items-center text-primary border-primary/30"
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add More
                </Button>
                <Button
                    className="bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300 flex items-center"
                    onClick={onUnstake}
                >
                    <MinusCircle className="mr-2 h-4 w-4" /> Unstake
                </Button>
            </CardFooter>
        </Card>
    );
};

export default PositionDetailView;
