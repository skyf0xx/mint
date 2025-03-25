// components/app/unstaking/position-details.tsx
import React from 'react';

interface PositionDetailsProps {
    token: string;
    initialAmount: string;
    currentValue: string;
    stakedDays: number;
    ilProtectionPercentage: number;
}

const PositionDetails = ({
    token,
    initialAmount,
    currentValue,
    stakedDays,
    ilProtectionPercentage,
}: PositionDetailsProps) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-medium text-gray-700">
                Position Details: {token}
            </h3>
            <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                    <span>Initial deposit:</span>
                    <span className="font-medium">
                        {initialAmount} {token}
                    </span>
                </li>
                <li className="flex justify-between">
                    <span>Current value:</span>
                    <span className="font-medium">
                        {currentValue} {token}
                    </span>
                </li>
                <li className="flex justify-between">
                    <span>Time staked:</span>
                    <span className="font-medium">{stakedDays} days</span>
                </li>
                <li className="flex justify-between">
                    <span>IL protection:</span>
                    <span className="font-medium">
                        {ilProtectionPercentage}% vested
                    </span>
                </li>
            </ul>
        </div>
    );
};

export default PositionDetails;
