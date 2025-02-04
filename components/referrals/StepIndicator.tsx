import { Check } from 'lucide-react';
import { Step } from '@/lib/referral';
import { motion, AnimatePresence } from 'framer-motion';

interface StepIndicatorProps {
    step: Step;
    active: boolean;
    completed: boolean;
    label: string;
    timeEstimate?: string;
    description?: string;
}

// Individual step indicator with enhanced hierarchy
const StepIndicator = ({
    step,
    active,
    completed,
    label,
    timeEstimate,
    description,
}: StepIndicatorProps) => (
    <motion.div className="flex flex-col items-center relative">
        {/* Primary Focus: Step Circle */}
        <motion.div
            className={`
                w-14 h-14 rounded-full flex items-center justify-center
                relative cursor-pointer shadow-sm
                ${
                    completed
                        ? 'bg-gradient-to-br from-primary to-primary-600 text-white'
                        : active
                        ? 'bg-primary/10 text-primary border-2 border-primary'
                        : 'bg-gray-50 text-gray-400 border-2 border-gray-200'
                }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Number or Checkmark */}
            <AnimatePresence mode="wait">
                {completed ? (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                    >
                        <Check className="w-6 h-6" />
                    </motion.div>
                ) : (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="text-lg font-semibold"
                    >
                        {step}
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Active State Indicator */}
            {active && (
                <motion.div
                    className="absolute -inset-2 rounded-full border-2 border-primary/30"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}
        </motion.div>

        {/* Secondary Content: Label and Description */}
        <div className="mt-4 text-center max-w-[120px]">
            <motion.span
                className={`
                    block text-sm font-medium mb-1
                    ${active || completed ? 'text-primary' : 'text-gray-600'}
                `}
                animate={{
                    color:
                        active || completed
                            ? 'var(--primary)'
                            : 'var(--gray-600)',
                }}
            >
                {label}
            </motion.span>
            {description && (
                <motion.p
                    className="text-xs text-gray-500 leading-tight"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    {description}
                </motion.p>
            )}
        </div>

        {/* Tertiary Content: Time Estimate */}
        {timeEstimate && (
            <motion.div
                className="mt-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <span className="text-xs text-gray-400 whitespace-nowrap">
                    ~{timeEstimate}
                </span>
            </motion.div>
        )}
    </motion.div>
);

// Progress bar with enhanced visual connection
export const StepProgress = ({
    currentStep,
    completedSteps,
}: {
    currentStep: Step;
    completedSteps: { wallet: boolean; twitter: boolean };
}) => (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <div className="relative flex justify-between items-start">
            {/* Connection Lines */}
            <div className="absolute top-7 left-[7%] right-[7%] h-[2px] bg-gray-200">
                <motion.div
                    className="h-full bg-primary origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{
                        scaleX:
                            currentStep === Step.TWITTER_AUTH
                                ? 0
                                : currentStep === Step.WALLET_CONNECT
                                ? 0.33
                                : currentStep === Step.TWITTER_FOLLOW
                                ? 0.66
                                : 1,
                    }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Step Indicators */}
            <StepIndicator
                step={Step.TWITTER_AUTH}
                active={currentStep === Step.TWITTER_AUTH}
                completed={
                    currentStep > Step.TWITTER_AUTH || completedSteps.twitter
                }
                label="Join Community"
                timeEstimate="30 sec"
                description="Connect your Twitter"
            />
            <StepIndicator
                step={Step.WALLET_CONNECT}
                active={currentStep === Step.WALLET_CONNECT}
                completed={
                    currentStep > Step.WALLET_CONNECT || completedSteps.wallet
                }
                label="Activate Earnings"
                timeEstimate="45 sec"
                description="Link your wallet"
            />
            <StepIndicator
                step={Step.TWITTER_FOLLOW}
                active={currentStep === Step.TWITTER_FOLLOW}
                completed={currentStep > Step.TWITTER_FOLLOW}
                label="Maximize Benefits"
                timeEstimate="15 sec"
                description="Follow for updates"
            />
            <StepIndicator
                step={Step.SHARE}
                active={currentStep === Step.SHARE}
                completed={currentStep > Step.SHARE}
                label="Start Growing"
                timeEstimate="30 sec"
                description="Share with friends"
            />
        </div>
    </div>
);

export default StepProgress;
