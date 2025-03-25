// components/app/staking/position-summary.tsx
import React from 'react';

interface PositionSummaryProps {
    tokenAmount: string;
    tokenSymbol: string;
}

const PositionSummary = ({
    tokenAmount,
    tokenSymbol,
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
                    <span>MINT</span>
                    <span className="font-medium">
                        MINT protocol will provide the other side of the LP
                    </span>
                </li>
            </ul>
        </div>
    );
};

export default PositionSummary;
