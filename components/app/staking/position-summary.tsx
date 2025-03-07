// components/app/staking/position-summary.tsx
import React from 'react';

interface PositionSummaryProps {
    tokenAmount: string;
    tokenSymbol: string;
    mintAmount: string;
    estimatedApr: string;
}

const PositionSummary = ({
    tokenAmount,
    tokenSymbol,
    mintAmount,
    estimatedApr,
}: PositionSummaryProps) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-medium text-gray-700">Position Summary</h3>
            <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                    <span>You provide:</span>
                    <span className="font-medium">
                        {tokenAmount} {tokenSymbol}
                    </span>
                </li>
                <li className="flex justify-between">
                    <span>Protocol provides:</span>
                    <span className="font-medium">~{mintAmount} MINT</span>
                </li>
                <li className="flex justify-between">
                    <span>Initial IL protection:</span>
                    <span className="font-medium">
                        0% (vests to 50% over 30 days)
                    </span>
                </li>
                <li className="flex justify-between">
                    <span>Estimated APR:</span>
                    <span className="font-medium text-primary">
                        {estimatedApr}%
                    </span>
                </li>
            </ul>
            <div className="text-xs text-primary mt-2 cursor-pointer hover:underline">
                What is impermanent loss protection?
            </div>
        </div>
    );
};

export default PositionSummary;
