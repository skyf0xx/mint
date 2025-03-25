// components/app/unstaking/unstake-summary.tsx
import React from 'react';

interface UnstakeSummaryProps {
    currentValue: string;
    impermanentLoss: string;
    ilProtection: string;
    receiveAmount: string;
    token: string;
}

const UnstakeSummary = ({
    currentValue,
    impermanentLoss,
    ilProtection,
    receiveAmount,
    token,
}: UnstakeSummaryProps) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-700">Unstaking Summary</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Current position value:</span>
                    <span className="font-medium">
                        {currentValue} {token}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Impermanent loss:</span>
                    <span className="font-medium text-red-600">
                        {impermanentLoss} {token}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>IL protection applied:</span>
                    <span className="font-medium text-green-600">
                        {ilProtection} {token}
                    </span>
                </div>
                <div className="h-px bg-gray-300 my-2" />
                <div className="flex justify-between font-medium">
                    <span>You will receive:</span>
                    <span className="text-primary">
                        {receiveAmount} {token}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UnstakeSummary;
