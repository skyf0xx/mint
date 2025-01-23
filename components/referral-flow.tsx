import { useState, useEffect } from 'react';
import {
    Wallet,
    Twitter,
    Share2,
    Loader2,
    Check,
    AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ReferralFlowProps {
    initialReferralCode?: string | null;
}

const ReferralFlow = ({ initialReferralCode }: ReferralFlowProps) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [twitterFollowed, setTwitterFollowed] = useState(false);
    const [error, setError] = useState('');

    const [referralCode, setReferralCode] = useState(initialReferralCode || '');

    useEffect(() => {
        // Handle the referral code when component mounts
        if (initialReferralCode) {
            // Store the referral code or validate it
            console.log('Referral code:', initialReferralCode);
        }
    }, [initialReferralCode]);

    const connectWallet = async () => {
        setLoading(true);
        setError('');
        try {
            // Simulated wallet connection - replace with actual implementation
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setWalletConnected(true);
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
        setTwitterFollowed(true);
        setStep(3);
    };

    interface StepIndicatorProps {
        number: number;
        active: boolean;
        completed: boolean;
    }

    const StepIndicator = ({
        number,
        active,
        completed,
    }: StepIndicatorProps) => (
        <div
            className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${
                completed
                    ? 'bg-primary text-white'
                    : active
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-100 text-gray-400'
            }
            transition-all duration-300
          `}
        >
            {completed ? <Check className="w-4 h-4" /> : number}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
            <div className="max-w-xl mx-auto">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8 relative">
                    <div className="flex items-center space-x-4">
                        <StepIndicator
                            number={1}
                            active={step === 1}
                            completed={walletConnected}
                        />
                        <div className="w-16 h-0.5 bg-gray-200">
                            <div
                                className={`h-full bg-primary transition-all duration-500 ${
                                    walletConnected ? 'w-full' : 'w-0'
                                }`}
                            />
                        </div>
                        <StepIndicator
                            number={2}
                            active={step === 2}
                            completed={twitterFollowed}
                        />
                        <div className="w-16 h-0.5 bg-gray-200">
                            <div
                                className={`h-full bg-primary transition-all duration-500 ${
                                    twitterFollowed ? 'w-full' : 'w-0'
                                }`}
                            />
                        </div>
                        <StepIndicator
                            number={3}
                            active={step === 3}
                            completed={false}
                        />
                    </div>
                </div>

                {/* Main Card */}
                <Card className="shadow-lg border-2 border-primary/10">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                            Get Your MINT Tokens
                        </CardTitle>
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
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-center">
                                            Connect Your Wallet
                                        </h3>
                                        <p className="text-gray-600 text-center">
                                            Connect your ArConnect wallet to get
                                            started
                                        </p>
                                        <Button
                                            className="w-full py-6"
                                            onClick={connectWallet}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            ) : (
                                                <Wallet className="w-5 h-5 mr-2" />
                                            )}
                                            Connect Wallet
                                        </Button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-center">
                                            Follow on Twitter
                                        </h3>
                                        <p className="text-gray-600 text-center">
                                            Follow @mithril_labs to continue
                                        </p>
                                        <Button
                                            className="w-full py-6"
                                            onClick={followTwitter}
                                        >
                                            <Twitter className="w-5 h-5 mr-2" />
                                            Follow @mithril_labs
                                        </Button>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-center">
                                            Share & Earn
                                        </h3>
                                        <p className="text-gray-600 text-center">
                                            Share your referral link to earn
                                            rewards
                                        </p>
                                        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                                            <code className="text-sm flex-1 text-gray-600 overflow-hidden text-ellipsis">
                                                https://mint.example.com/ref/ABC123
                                            </code>
                                            <Button variant="outline" size="sm">
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Skip option for step 2 */}
                        {step === 2 && (
                            <button
                                onClick={() => setStep(3)}
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors text-center w-full mt-4"
                            >
                                Skip for now
                            </button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReferralFlow;
