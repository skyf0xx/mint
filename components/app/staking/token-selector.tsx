// components/app/staking/token-selector.tsx
import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface TokenOption {
    value: string;
    label: string;
    icon?: string;
    balance?: string;
}

interface TokenSelectorProps {
    tokens: TokenOption[];
    selectedToken: string;
    onSelectToken: (token: string) => void;
}

const TokenSelector = ({
    tokens,
    selectedToken,
    onSelectToken,
}: TokenSelectorProps) => {
    return (
        <div className="space-y-2">
            <label
                htmlFor="token-select"
                className="text-sm font-medium text-gray-700"
            >
                Select Token
            </label>
            <Select value={selectedToken} onValueChange={onSelectToken}>
                <SelectTrigger id="token-select" className="w-full">
                    <SelectValue placeholder="Select a token" />
                </SelectTrigger>
                <SelectContent>
                    {tokens.map((token) => (
                        <SelectItem key={token.value} value={token.value}>
                            {token.label}
                            {token.balance && (
                                <span className="ml-2 text-gray-500 text-sm">
                                    ({token.balance})
                                </span>
                            )}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default TokenSelector;
