// components/app/staking/token-selector.tsx
import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ExternalLink } from 'lucide-react';

interface TokenOption {
    value: string;
    label: string;
    icon?: string;
    balance?: string;
    note?: {
        text: string;
        link?: {
            url: string;
            text: string;
        };
    };
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
    // Find the selected token object
    const selectedTokenObj = tokens.find(
        (token) => token.value === selectedToken
    );

    // Sort tokens alphabetically by label
    const sortedTokens = [...tokens].sort((a, b) =>
        a.label.localeCompare(b.label)
    );

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
                    {sortedTokens.map((token) => (
                        <SelectItem key={token.value} value={token.value}>
                            {token.label}
                            {token.balance && token.balance != '0' && (
                                <span className="ml-2 text-gray-500 text-sm">
                                    ({token.balance})
                                </span>
                            )}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Display note if the selected token has one */}
            {selectedTokenObj?.note && (
                <div className="mt-2 text-sm text-gray-600 p-3 bg-blue-50 rounded-md border border-blue-100">
                    {selectedTokenObj.note.text}
                    {selectedTokenObj.note.link && (
                        <a
                            href={selectedTokenObj.note.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-primary hover:underline inline-flex items-center"
                        >
                            {selectedTokenObj.note.link.text}
                            <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default TokenSelector;
