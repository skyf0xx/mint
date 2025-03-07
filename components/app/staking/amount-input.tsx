// components/app/staking/amount-input.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
    maxAmount: string;
    onMaxClick: () => void;
    tokenSymbol: string;
}

const AmountInput = ({
    value,
    onChange,
    maxAmount,
    onMaxClick,
    tokenSymbol,
}: AmountInputProps) => {
    return (
        <div className="space-y-2">
            <label
                htmlFor="amount-input"
                className="text-sm font-medium text-gray-700"
            >
                Amount to Stake
            </label>
            <div className="relative">
                <Input
                    id="amount-input"
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pr-20"
                />
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 text-primary"
                    onClick={onMaxClick}
                >
                    MAX
                </Button>
            </div>
            <div className="text-sm text-gray-500">
                Balance: {maxAmount} {tokenSymbol}
            </div>
        </div>
    );
};

export default AmountInput;
