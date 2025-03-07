// components/app/unstaking/unstake-form.tsx
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PositionDetails from './position-details';
import UnstakeSummary from './unstake-summary';

interface UnstakeFormProps {
    position: {
        id: string;
        token: string;
        initialAmount: string;
        currentValue: string;
        stakedDays: number;
        ilProtectionPercentage: number;
    };
    onCancel: () => void;
    onUnstake: (positionId: string, amount: string) => Promise<void>;
}

const UnstakeForm = ({ position, onCancel, onUnstake }: UnstakeFormProps) => {
    const [amount, setAmount] = useState(position.currentValue);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle max button click
    const handleMaxClick = () => {
        setAmount(position.currentValue);
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await onUnstake(position.id, amount);
        } catch (error) {
            console.error('Unstaking failed:', error);
            // Error handling would go here
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate values for the summary (these would come from API in real implementation)
    const impermanentLoss = (
        parseFloat(position.initialAmount) - parseFloat(position.currentValue)
    ).toFixed(1);
    const ilProtection = (
        (parseFloat(impermanentLoss) * position.ilProtectionPercentage) /
        100
    ).toFixed(2);
    const receiveAmount = (
        parseFloat(position.currentValue) + parseFloat(ilProtection)
    ).toFixed(2);

    return (
        <Card className="max-w-md mx-auto border-2 border-primary/10">
            <CardHeader>
                <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                    Unstake Position
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <PositionDetails
                    token={position.token}
                    initialAmount={position.initialAmount}
                    currentValue={position.currentValue}
                    stakedDays={position.stakedDays}
                    ilProtectionPercentage={position.ilProtectionPercentage}
                />

                <div className="space-y-2">
                    <label
                        htmlFor="unstake-amount"
                        className="text-sm font-medium text-gray-700"
                    >
                        Amount to Unstake
                    </label>
                    <div className="relative">
                        <Input
                            id="unstake-amount"
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pr-20"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8 text-primary"
                            onClick={handleMaxClick}
                        >
                            MAX
                        </Button>
                    </div>
                </div>

                <UnstakeSummary
                    currentValue={position.currentValue}
                    impermanentLoss={impermanentLoss}
                    ilProtection={ilProtection}
                    receiveAmount={receiveAmount}
                    token={position.token}
                />
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
                    {isSubmitting ? 'Unstaking...' : 'Unstake'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default UnstakeForm;
