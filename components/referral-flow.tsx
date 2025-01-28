import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ShareStep } from './referrals/ShareStep';
import { StepProgress } from './referrals/StepIndicator';
import { WalletStep } from './referrals/WalletStep';
import { TwitterFollowStep } from './referrals/TwitterFollowStep';
import { TwitterAuthStep } from './referrals/TwitterAuthStep';
import ConnectedWallet from './referrals/ConnectedWallet';
import { StepContentProps, useReferralFlow } from '@/hooks/use-referralFlow';
import { ReferralStats, Step, TwitterAuthResponse } from '@/lib/referral';
import { memo } from 'react';

// Primary focus: The main action component for each step
const StepContent = memo(({ state, actions }: StepContentProps) => {
    const { step } = state;

    return (
        <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-20" // Ensure primary content is above decorative elements
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
                    twitterUserId={state.twitterData?.user.id ?? ''}
                />
            )}
            {step === Step.SHARE && (
                <ShareStep
                    referralCode={state.referralCode}
                    state={state}
                    onShare={actions.handleShare}
                    stats={state.referralStats}
                />
            )}
        </motion.div>
    );
});

StepContent.displayName = 'StepContent';

export interface ReferralFlowState {
    step: Step;
    loading: boolean;
    error: string | null;
    walletAddress: string | null;
    twitterData: TwitterAuthResponse | null;
    referralCode: string;
    referralStats: ReferralStats | null;
    completedSteps: {
        wallet: boolean;
        twitter: boolean;
    };
}

// Secondary information: Status indicators and progress
const StatusIndicators = memo(({ state }: { state: ReferralFlowState }) => (
    <div className="space-y-2 mb-4">
        {state.twitterData && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-600 text-center"
            >
                Welcome, @{state.twitterData.user.username}
            </motion.div>
        )}
        {state.walletAddress && (
            <ConnectedWallet address={state.walletAddress} />
        )}
    </div>
));

StatusIndicators.displayName = 'StatusIndicators';

// Tertiary: Loading and error states
const LoadingSkeleton = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
    </div>
);

const ErrorMessage = memo(({ error }: { error: string }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-lg p-3 text-sm text-red-600"
    >
        <AlertCircle className="w-4 h-4 inline-block mr-2" />
        {error}
    </motion.div>
));

ErrorMessage.displayName = 'ErrorMessage';

// Decorative elements moved to lowest visual priority
const BackgroundEffects = () => (
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[80px] opacity-20" />
    </div>
);

export const ReferralFlow = () => {
    const { state, actions } = useReferralFlow();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
            <div className="max-w-xl mx-auto">
                {/* Primary Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                        Begin Your Journey
                    </h1>
                </motion.div>

                {/* Secondary Content */}
                <div className="mb-8">
                    <StepProgress
                        currentStep={state.step}
                        completedSteps={state.completedSteps}
                    />
                </div>

                {/* Main Interactive Area */}
                <Card className="relative overflow-hidden border-2 border-primary/10">
                    <BackgroundEffects />

                    <div className="relative z-10 p-6">
                        {/* Status Indicators */}
                        {!state.loading && <StatusIndicators state={state} />}

                        {/* Loading State */}
                        {state.loading && <LoadingSkeleton />}

                        {/* Error Messages */}
                        <AnimatePresence>
                            {state.error && (
                                <ErrorMessage error={state.error} />
                            )}
                        </AnimatePresence>

                        {/* Primary Step Content */}
                        <AnimatePresence mode="wait">
                            <StepContent state={state} actions={actions} />
                        </AnimatePresence>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default memo(ReferralFlow);
