import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { ShareStep } from './referrals/ShareStep';
import { StepProgress } from './referrals/StepIndicator';
import { WalletStep } from './referrals/WalletStep';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import ConnectedWallet from './referrals/ConnectedWallet';
import {
    useArweaveWalletInit,
    useArweaveWalletStore,
} from '@/hooks/use-wallet';
import { db, ReferralStats, TwitterAuthResponse } from '@/lib/database';
import { TwitterFollowStep } from './referrals/TwitterFollowStep';
import { TwitterAuthStep } from './referrals/TwitterAuthStep';

interface ReferralFlowProps {
    initialReferralCode?: string | null;
}

enum Step {
    TWITTER_AUTH = 1,
    WALLET_CONNECT = 2,
    TWITTER_FOLLOW = 3,
    SHARE = 4,
}

/*
    TODO:
    
    1. Update wallet connection so that instead of calling: upsertUser, it calls linkWalletToTwitterUser
    2. Update completedSteps logic
    3. ETC
*/

export const ReferralFlow = ({ initialReferralCode }: ReferralFlowProps) => {
    const [step, setStep] = useState<Step>(Step.TWITTER_AUTH);
    const [twitterData, setTwitterData] = useState<TwitterAuthResponse | null>(
        null
    );

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
        const checkAuth = async () => {
            const {
                data: { session },
            } = await db.supabase.auth.getSession();
            if (session?.user) {
                // Convert session data to TwitterAuthResponse format
                const twitterData: TwitterAuthResponse = {
                    user: {
                        id: session.user.id,
                        username: session.user.user_metadata.user_name,
                        name: session.user.user_metadata.full_name,
                    },
                };
                setTwitterData(twitterData);
                setStep(Step.WALLET_CONNECT);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const initializeConnectedWallet = async () => {
            if (connectedAddress && twitterData?.user.id) {
                try {
                    const user = await db.linkWalletToTwitterUser(
                        twitterData.user.id,
                        connectedAddress
                    );
                    setWalletAddress(connectedAddress);
                    setReferralCode(user.referral_code);
                    setCompletedSteps({ ...completedSteps, wallet: true });
                    setStep(Step.TWITTER_FOLLOW);

                    const stats = await db.getUserReferralStats(
                        connectedAddress
                    );
                    setReferralStats(stats);

                    // Process initial referral if exists
                    if (initialReferralCode) {
                        await db.processPendingReferral(connectedAddress);
                    }
                } catch (err) {
                    setError((err as Error).message);
                }
            }
        };

        initializeConnectedWallet();
    }, [
        completedSteps,
        connectedAddress,
        initialReferralCode,
        twitterData?.user.id,
    ]);

    const handleTwitterAuth = async (data: TwitterAuthResponse) => {
        setLoading(true);
        setError('');
        try {
            const user = await db.createOrUpdateUserWithTwitter(data);
            console.log({ user });
            setTwitterData(data);
            setStep(Step.WALLET_CONNECT);
        } catch (err) {
            setError((err as Error).message);
        }
        setLoading(false);
    };

    const connectWallet = async (address: string) => {
        setLoading(true);
        setError('');
        try {
            if (!twitterData?.user.id) {
                throw new Error('Twitter authentication required');
            }

            const user = await db.linkWalletToTwitterUser(
                twitterData.user.id,
                address
            );
            setWalletAddress(address);
            setReferralCode(user.referral_code);

            if (initialReferralCode) {
                await db.processPendingReferral(address);
            }

            const stats = await db.getUserReferralStats(address);
            setReferralStats(stats);

            setCompletedSteps({ ...completedSteps, wallet: true });
            setStep(Step.TWITTER_FOLLOW);
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
            setStep(Step.SHARE);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const skipFollow = () => {
        setCompletedSteps({ ...completedSteps, twitter: true });
        setStep(Step.SHARE);
    };

    const shareReferral = async () => {
        if (!walletAddress) return;

        try {
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
                        {twitterData && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-gray-600"
                            >
                                Connected as @{twitterData.user.username}
                            </motion.div>
                        )}
                        {walletAddress && (
                            <ConnectedWallet address={walletAddress} />
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
                                {step === Step.TWITTER_AUTH && (
                                    <TwitterAuthStep
                                        onSuccess={handleTwitterAuth}
                                    />
                                )}
                                {step === Step.WALLET_CONNECT && (
                                    <WalletStep
                                        onConnect={connectWallet}
                                        loading={loading}
                                    />
                                )}
                                {step === Step.TWITTER_FOLLOW && (
                                    <TwitterFollowStep
                                        onFollow={followTwitter}
                                        onSkip={skipFollow}
                                    />
                                )}
                                {step === Step.SHARE && (
                                    <ShareStep
                                        referralCode={referralCode}
                                        walletAddress={walletAddress || ''}
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
