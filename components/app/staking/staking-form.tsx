// components/app/staking/staking-form.tsx
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TokenSelector from './token-selector';
import AmountInput from './amount-input';
import PositionSummary from './position-summary';

// Placeholder token options
const TOKENS = [
    { value: 'qAR', label: 'qAR', balance: '250' },
    { value: 'wAR', label: 'wAR', balance: '130' },
    { value: 'NAB', label: 'NAB', balance: '500' },
    { value: 'AO', label: 'AO', balance: '1000' },
    { value: 'USDC', label: 'USDC', balance: '432' },
];

interface StakingFormProps {
    onCancel: () => void;
    onSubmit: (token: string, amount: string) => Promise<void>;
}

const StakingForm = ({ onCancel, onSubmit }: StakingFormProps) => {
    const [selectedToken, setSelectedToken] = useState(TOKENS[0].value);
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get token details based on selection
    const selectedTokenDetails =
        TOKENS.find((t) => t.value === selectedToken) || TOKENS[0];

    // Handle max button click
    const handleMaxClick = () => {
        if (selectedTokenDetails) {
            setAmount(selectedTokenDetails.balance);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await onSubmit(selectedToken, amount);
        } catch (error) {
            console.error('Staking failed:', error);
            // Error handling would go here
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate estimated values (these would come from API in the real implementation)
    const estimatedMintAmount = (parseFloat(amount || '0') * 0.473).toFixed(1);
    const estimatedApr = '12.4';

    return (
        <Card className="max-w-md mx-auto border-2 border-primary/10">
            <CardHeader>
                <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                    New Staking Position
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <TokenSelector
                    tokens={TOKENS}
                    selectedToken={selectedToken}
                    onSelectToken={setSelectedToken}
                />

                <AmountInput
                    value={amount}
                    onChange={setAmount}
                    maxAmount={selectedTokenDetails.balance}
                    onMaxClick={handleMaxClick}
                    tokenSymbol={selectedToken}
                />

                {amount && parseFloat(amount) > 0 && (
                    <PositionSummary
                        tokenAmount={amount}
                        tokenSymbol={selectedToken}
                        mintAmount={estimatedMintAmount}
                        estimatedApr={estimatedApr}
                    />
                )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    className="bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300"
                    onClick={handleSubmit}
                    disabled={
                        !amount || parseFloat(amount) <= 0 || isSubmitting
                    }
                >
                    {isSubmitting ? 'Staking...' : 'Stake'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default StakingForm;
