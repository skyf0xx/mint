import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { ShareStep } from './referrals/ShareStep';
import { StepProgress } from './referrals/StepIndicator';
import { TwitterStep } from './referrals/TwitterStep';
import { WalletStep } from './referrals/WalletStep';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import ConnectedWallet from './referrals/ConnectedWallet';
import {
    useArweaveWalletInit,
    useArweaveWalletStore,
} from '@/hooks/use-wallet';
import { db, ReferralStats } from '@/lib/database';

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
    const [referralStats, setReferralStats] = useState<ReferralStats | null>(
        null
    );

    useArweaveWalletInit();
    const { address: connectedAddress } = useArweaveWalletStore();

    useEffect(() => {
        const initializeConnectedWallet = async () => {
            if (connectedAddress) {
                try {
                    const user = await db.upsertUser(connectedAddress);
                    setWalletAddress(connectedAddress);
                    setReferralCode(user.referral_code);
                    setCompletedSteps({ ...completedSteps, wallet: true });
                    setStep(2);

                    const stats = await db.getUserReferralStats(
                        connectedAddress
                    );
                    setReferralStats(stats);

                    // Process initial referral if exists
                    if (initialReferralCode) {
                        const referrer = await db.getUserByReferralCode(
                            initialReferralCode
                        );
                        if (
                            referrer &&
                            referrer.wallet_address !== connectedAddress
                        ) {
                            await db.createReferral(
                                referrer.wallet_address,
                                connectedAddress
                            );
                        }
                    }
                } catch (err) {
                    setError((err as Error).message);
                }
            }
        };

        initializeConnectedWallet();
    }, [connectedAddress, initialReferralCode]);

    const connectWallet = async (address: string) => {
        setLoading(true);
        setError('');
        try {
            const user = await db.upsertUser(address);
            await db.processPendingReferral(address); // Add this line
            setWalletAddress(address);
            setReferralCode(user.referral_code);

            if (initialReferralCode) {
                const referrer = await db.getUserByReferralCode(
                    initialReferralCode
                );
                if (referrer && referrer.wallet_address !== address) {
                    await db.createReferral(referrer.wallet_address, address);
                }
            }

            const stats = await db.getUserReferralStats(address);
            setReferralStats(stats);

            setCompletedSteps({ ...completedSteps, wallet: true });
            setStep(2);
        } catch (err) {
            setError((err as Error).message);
        }
        setLoading(false);
    };

    const followTwitter = async () => {
        if (!walletAddress) return;

        try {
            window.open(
                'https://twitter.com/intent/follow?screen_name=mithril_labs',
                '_blank'
            );
            await db.updateTwitterStatus(walletAddress, true);
            setCompletedSteps({ ...completedSteps, twitter: true });
            setStep(3);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const skipFollow = () => {
        setCompletedSteps({ ...completedSteps, twitter: true });
        setStep(3);
    };

    const shareReferral = async () => {
        if (!walletAddress) return;

        try {
            const withinLimits = await db.checkRateLimits(walletAddress);
            if (!withinLimits) {
                throw new Error('Daily sharing limit reached');
            }

            await navigator.clipboard.writeText(
                `https://mint.example.com/ref/${referralCode}`
            );

            // Refresh stats after sharing
            const stats = await db.getUserReferralStats(walletAddress);
            setReferralStats(stats);
        } catch (err) {
            setError((err as Error).message);
        }
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
                                        walletAddress={walletAddress || ''} // Add this line
                                        onShare={shareReferral}
                                        stats={referralStats}
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
