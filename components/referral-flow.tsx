// components/referral/ReferralFlow.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { ShareStep } from './referrals/ShareStep';
import { StepProgress } from './referrals/StepIndicator';
import { TwitterStep } from './referrals/TwitterStep';
import { WalletStep } from './referrals/WalletStep';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import ConnectedWallet from './referrals/ConnectedWallet';

interface ReferralFlowProps {
    initialReferralCode?: string | null;
}

export const ReferralFlow = ({ initialReferralCode }: ReferralFlowProps) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [completedSteps, setCompletedSteps] = useState({
        wallet: false,
        twitter: false,
    });
    const [referralCode, setReferralCode] = useState(initialReferralCode || '');

    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const generateReferralCode = (address: string): string => {
        // Take first 6 chars of address and add 3 deterministic chars based on full address
        const prefix = address.slice(0, 6);

        // Create deterministic suffix by hashing the full address
        let hash = 0;
        for (let i = 0; i < address.length; i++) {
            hash = (hash << 5) - hash + address.charCodeAt(i);
            hash = hash & hash;
        }

        // Convert hash to 3 alphanumeric characters
        const suffix = Math.abs(hash).toString(36).slice(0, 3).toUpperCase();

        return `${prefix}${suffix}`;
    };

    const connectWallet = async (address: string) => {
        setLoading(true);
        setError('');
        try {
            const code = generateReferralCode(address);
            setWalletAddress(address);
            setReferralCode(code);
            setCompletedSteps({ ...completedSteps, wallet: true });
            setStep(2);
        } catch (err) {
            setError(err as string);
        }
        setLoading(false);
    };

    const followTwitter = () => {
        window.open(
            'https://twitter.com/intent/follow?screen_name=mithril_labs',
            '_blank'
        );
        setCompletedSteps({ ...completedSteps, twitter: true });
        setStep(3);
    };

    const skipFollow = () => {
        setCompletedSteps({ ...completedSteps, twitter: true });
        setStep(3);
    };

    const shareReferral = () => {
        navigator.clipboard.writeText(
            `https://mint.example.com/ref/${referralCode}`
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
            <div className="max-w-xl mx-auto">
                <StepProgress
                    currentStep={step}
                    completedSteps={completedSteps}
                />

                <Card className="shadow-lg border-2 border-primary/10">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                            Get Your MINT Tokens
                        </CardTitle>
                        {walletAddress && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4"
                            >
                                <ConnectedWallet address={walletAddress} />
                            </motion.div>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <p className="text-red-600 text-sm">
                                        {error}
                                    </p>
                                </motion.div>
                            )}

                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {step === 1 && (
                                    <WalletStep
                                        onConnect={connectWallet}
                                        loading={loading}
                                    />
                                )}
                                {step === 2 && (
                                    <TwitterStep
                                        onFollow={followTwitter}
                                        onSkip={skipFollow}
                                    />
                                )}
                                {step === 3 && (
                                    <ShareStep
                                        referralCode={referralCode}
                                        onShare={shareReferral}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReferralFlow;
