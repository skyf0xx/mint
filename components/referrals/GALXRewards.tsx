import { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/database';

interface GALXRewardsSectionProps {
    userId: string;
    onSubmit: (ethAddress: string) => Promise<void>;
}

const GALXRewardsSection = ({ userId, onSubmit }: GALXRewardsSectionProps) => {
    const [ethAddress, setEthAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadExistingAddress = async () => {
            if (!userId) return;

            try {
                const address = await db.getGalxEthAddress(userId);
                if (address) {
                    setEthAddress(address);
                    setSuccess(true); // If we have an address, consider it already successful
                }
            } catch (err) {
                console.error('Failed to load ETH address:', err);
                // Don't show error to user, just log it
            } finally {
                setIsLoading(false);
            }
        };

        loadExistingAddress();
    }, [userId]);

    const validateEthAddress = (address: string) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    const handleSubmit = async () => {
        if (!validateEthAddress(ethAddress)) {
            setError('Please enter a valid Ethereum address');
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await onSubmit(ethAddress);
            setSuccess(true);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to submit address'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="mt-8">
                <Accordion type="single" collapsible>
                    <AccordionItem value="galx-rewards">
                        <AccordionTrigger className="text-left">
                            Did you take part in the GALX quest?
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <Accordion type="single" collapsible>
                <AccordionItem value="galx-rewards">
                    <AccordionTrigger className="text-left">
                        Did you take part in the GALX quest?
                        {success && (
                            <span className="ml-2 text-xs text-green-600">
                                (Connected)
                            </span>
                        )}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-2">
                            <p className="text-sm text-gray-600">
                                {success
                                    ? 'Your ETH address is linked to receive GALX rewards.'
                                    : 'Paste your ETH address here to link your GALX rewards. This will ensure your quest completion is properly tracked and rewards are distributed.'}
                            </p>

                            <div className="space-y-4">
                                <Input
                                    placeholder="0x..."
                                    value={ethAddress}
                                    onChange={(e) => {
                                        setError(null);
                                        setSuccess(false);
                                        setEthAddress(e.target.value);
                                    }}
                                    className={`font-mono ${
                                        error ? 'border-red-300' : ''
                                    }`}
                                    disabled={isSubmitting}
                                />

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2 text-red-600 text-sm"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{error}</span>
                                        </motion.div>
                                    )}

                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2 text-green-600 text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            <span>
                                                GALX rewards successfully
                                                linked!
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={
                                        isSubmitting || (success && !ethAddress)
                                    }
                                    className="w-full"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Linking rewards...
                                        </>
                                    ) : success ? (
                                        'Update Address'
                                    ) : (
                                        'Link GALX Rewards'
                                    )}
                                </Button>
                            </div>

                            <p className="text-xs text-gray-500">
                                Note: Make sure to use the same Ethereum address
                                that participated in the GALX quest. Incorrect
                                addresses cannot be credited with rewards.
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default GALXRewardsSection;
