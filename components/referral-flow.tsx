import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShareStep } from './referrals/ShareStep';
import { StepProgress } from './referrals/StepIndicator';
import { WalletStep } from './referrals/WalletStep';
import { TwitterFollowStep } from './referrals/TwitterFollowStep';
import { TwitterAuthStep } from './referrals/TwitterAuthStep';
import ConnectedWallet from './referrals/ConnectedWallet';
import { StepContentProps, useReferralFlow } from '@/hooks/userReferralFlow';
import { Step } from '@/lib/referral';

const ErrorMessage = ({ error }: { error: string }) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
    >
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-red-600 text-sm">{error}</p>
    </motion.div>
);

const StepContent = ({ state, actions }: StepContentProps) => {
    const { step } = state;

    return (
        <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {step === Step.TWITTER_AUTH && (
                <TwitterAuthStep onSuccess={actions.handleTwitterAuth} />
            )}
            {step === Step.WALLET_CONNECT && (
                <WalletStep
                    onConnect={actions.handleWalletConnect}
                    loading={state.loading}
                />
            )}
            {step === Step.TWITTER_FOLLOW && (
                <TwitterFollowStep
                    onFollow={actions.handleTwitterFollow}
                    onSkip={actions.handleSkipFollow}
                />
            )}
            {step === Step.SHARE && (
                <ShareStep
                    referralCode={state.referralCode}
                    walletAddress={state.walletAddress || ''}
                    onShare={actions.handleShare}
                    stats={state.referralStats}
                />
            )}
        </motion.div>
    );
};

interface ReferralFlowProps {
    initialReferralCode?: string | null;
}

export const ReferralFlow = ({ initialReferralCode }: ReferralFlowProps) => {
    const { state, actions } = useReferralFlow(initialReferralCode);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
            <div className="max-w-xl mx-auto">
                <StepProgress
                    currentStep={state.step}
                    completedSteps={state.completedSteps}
                />

                <Card className="shadow-lg border-2 border-primary/10">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                            Get Your MINT Tokens
                        </CardTitle>
                        {state.twitterData && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-sm text-gray-600"
                            >
                                Connected as @{state.twitterData.user.username}
                            </motion.div>
                        )}
                        {state.walletAddress && (
                            <ConnectedWallet address={state.walletAddress} />
                        )}
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <AnimatePresence mode="wait">
                            {state.error && (
                                <ErrorMessage error={state.error} />
                            )}
                            <StepContent state={state} actions={actions} />
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReferralFlow;
