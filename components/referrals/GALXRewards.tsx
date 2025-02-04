import { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    AlertCircle,
    CheckCircle,
    ExternalLink,
    Gift,
    Loader2,
    Wallet,
} from 'lucide-react';
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
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        const loadExistingAddress = async () => {
            if (!userId) return;

            try {
                const address = await db.getGalxEthAddress(userId);
                if (address) {
                    setEthAddress(address);
                    setSuccess(true);
                }
            } catch (err) {
                console.error('Failed to load ETH address:', err);
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
                <AccordionItem value="galx-rewards" className="border-none">
                    <AccordionTrigger className="flex items-center justify-between py-4 w-full hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Gift className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-base font-medium">
                                    GALX Rewards Available
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {success
                                        ? 'Your rewards are linked. Check discord for distribution date'
                                        : 'Connect wallet to claim'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {success && (
                                <span className="flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    Connected
                                </span>
                            )}
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-4 pb-2">
                        <div className="space-y-6">
                            {showInfo && (
                                <motion.div
                                    className="bg-primary/5 rounded-lg p-4 space-y-3"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <h4 className="font-medium text-primary">
                                        About GALX Rewards
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                1
                                            </div>
                                            <p>
                                                Complete quests to earn GALX
                                                tokens
                                            </p>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                2
                                            </div>
                                            <p>
                                                Link your ETH wallet to receive
                                                rewards
                                            </p>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                3
                                            </div>
                                            <p>
                                                Rewards distributed after quest
                                                completion
                                            </p>
                                        </li>
                                    </ul>
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        placeholder="Enter your ETH address (0x...)"
                                        value={ethAddress}
                                        onChange={(e) => {
                                            setError(null);
                                            setSuccess(false);
                                            setEthAddress(e.target.value);
                                        }}
                                        className={`
                                            font-mono pl-10 pr-4 py-6 text-base
                                            ${
                                                error
                                                    ? 'border-red-300'
                                                    : success
                                                    ? 'border-green-300'
                                                    : ''
                                            }
                                        `}
                                        disabled={isSubmitting}
                                    />
                                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-600 text-sm"
                                        >
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            <span className="flex-1">
                                                {error}
                                            </span>
                                        </motion.div>
                                    )}

                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-600 text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                            <span className="flex-1">
                                                Your GALX rewards are now
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
                                    className="w-full py-6"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Linking rewards...
                                        </span>
                                    ) : success ? (
                                        <span className="flex items-center gap-2">
                                            <Gift className="w-5 h-5" />
                                            Update Reward Address
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Gift className="w-5 h-5" />
                                            Link GALX Rewards
                                        </span>
                                    )}
                                </Button>
                            </div>

                            <div className="text-xs text-gray-500 flex items-center justify-between">
                                <p>
                                    Use the same Ethereum address from your GALX
                                    quest
                                </p>
                                <button
                                    onClick={() => setShowInfo(!showInfo)}
                                    className="inline-flex items-center gap-1 text-primary hover:text-primary-600 transition-colors"
                                >
                                    {showInfo ? 'Hide details' : 'Learn more'}
                                    <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default GALXRewardsSection;
