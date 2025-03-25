// components/app/staking/token-selector.tsx
import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ExternalLink, AlertCircle, LockIcon } from 'lucide-react';
import { TokenOption } from '@/types/staking';

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

    // Separate tokens into production and test groups
    const productionTokens = tokens.filter((token) => !token.isTestToken);
    const testTokens = tokens.filter((token) => token.isTestToken);

    // Sort tokens within each group alphabetically by label
    const sortedProductionTokens = [...productionTokens].sort((a, b) =>
        a.label.localeCompare(b.label)
    );

    const sortedTestTokens = [...testTokens].sort((a, b) =>
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
                    {/* Production Tokens */}
                    <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Production Tokens
                    </div>
                    {sortedProductionTokens.map((token) => (
                        <SelectItem
                            key={token.value}
                            value={token.value}
                            disabled={token.disabled}
                            className={
                                token.disabled
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                            }
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <span>{token.label}</span>
                                    {token.disabled && (
                                        <span className="ml-2 flex items-center text-gray-400">
                                            <LockIcon className="h-3 w-3 mr-1" />
                                            <span className="text-xs">
                                                Disabled
                                            </span>
                                        </span>
                                    )}
                                </div>
                                {token.balance && token.balance !== '0' && (
                                    <span className="ml-2 text-gray-500 text-sm">
                                        ({token.balance})
                                    </span>
                                )}
                            </div>
                        </SelectItem>
                    ))}

                    {/* Test Tokens Section */}
                    {sortedTestTokens.length > 0 && (
                        <>
                            <div className="mt-2 px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider border-t border-gray-100 pt-2">
                                Test Tokens
                            </div>
                            {sortedTestTokens.map((token) => (
                                <SelectItem
                                    key={token.value}
                                    value={token.value}
                                    disabled={token.disabled}
                                    className={
                                        token.disabled
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <span>{token.label}</span>
                                            <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                                                Test
                                            </span>
                                            {token.disabled && (
                                                <span className="ml-2 flex items-center text-gray-400">
                                                    <LockIcon className="h-3 w-3 mr-1" />
                                                    <span className="text-xs">
                                                        Disabled
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                        {token.balance &&
                                            token.balance !== '0' && (
                                                <span className="ml-2 text-gray-500 text-sm">
                                                    ({token.balance})
                                                </span>
                                            )}
                                    </div>
                                </SelectItem>
                            ))}
                        </>
                    )}
                </SelectContent>
            </Select>

            {/* Display note if the selected token has one */}
            {selectedTokenObj?.note && (
                <div
                    className={`mt-2 text-sm p-3 rounded-md border ${
                        selectedTokenObj.disabled
                            ? 'bg-gray-50 border-gray-200 text-gray-500'
                            : selectedTokenObj.isTestToken
                            ? 'bg-blue-50 border-blue-100 text-gray-600'
                            : 'bg-blue-50 border-blue-100 text-gray-600'
                    }`}
                >
                    {selectedTokenObj.isTestToken && (
                        <div className="flex items-center mb-1 text-yellow-700">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="font-medium">Test Token</span>
                        </div>
                    )}
                    {selectedTokenObj.disabled && (
                        <div className="flex items-center mb-1 text-gray-500">
                            <LockIcon className="h-4 w-4 mr-1" />
                            <span className="font-medium">Disabled Token</span>
                        </div>
                    )}
                    {selectedTokenObj.note.text}
                    {selectedTokenObj.note.link && (
                        <a
                            href={selectedTokenObj.note.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`ml-1 inline-flex items-center ${
                                selectedTokenObj.disabled
                                    ? 'text-gray-400 hover:underline'
                                    : 'text-primary hover:underline'
                            }`}
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
