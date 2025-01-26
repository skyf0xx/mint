import { Check } from 'lucide-react';
import { Step } from '@/lib/referral';

interface StepIndicatorProps {
    step: Step;
    active: boolean;
    completed: boolean;
    label: string;
}

export const StepIndicator = ({
    step,
    active,
    completed,
    label,
}: StepIndicatorProps) => (
    <div className="flex flex-col items-center gap-2">
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
            {completed ? <Check className="w-4 h-4" /> : step}
        </div>
        <span
            className={`text-sm font-medium text-center transition-colors duration-300 ${
                active || completed ? 'text-primary' : 'text-gray-500'
            }`}
        >
            {label}
        </span>
    </div>
);

export const StepProgress = ({
    currentStep,
    completedSteps,
}: {
    currentStep: Step;
    completedSteps: { wallet: boolean; twitter: boolean };
}) => (
    <div className="flex items-center justify-center mb-12 relative max-w-2xl mx-auto px-4">
        <div className="flex items-start space-x-4">
            <StepIndicator
                step={Step.TWITTER_AUTH}
                active={currentStep === Step.TWITTER_AUTH}
                completed={
                    currentStep > Step.TWITTER_AUTH || completedSteps.twitter
                }
                label="Connect Twitter"
            />
            <div className="w-16 h-0.5 bg-gray-200 mt-4">
                <div
                    className={`h-full bg-primary transition-all duration-500 ${
                        currentStep > Step.TWITTER_AUTH ||
                        completedSteps.twitter
                            ? 'w-full'
                            : 'w-0'
                    }`}
                />
            </div>
            <StepIndicator
                step={Step.WALLET_CONNECT}
                active={currentStep === Step.WALLET_CONNECT}
                completed={
                    currentStep > Step.WALLET_CONNECT || completedSteps.wallet
                }
                label="Link Wallet"
            />
            <div className="w-16 h-0.5 bg-gray-200 mt-4">
                <div
                    className={`h-full bg-primary transition-all duration-500 ${
                        currentStep > Step.WALLET_CONNECT ||
                        completedSteps.wallet
                            ? 'w-full'
                            : 'w-0'
                    }`}
                />
            </div>
            <StepIndicator
                step={Step.TWITTER_FOLLOW}
                active={currentStep === Step.TWITTER_FOLLOW}
                completed={currentStep > Step.TWITTER_FOLLOW}
                label="Follow Us"
            />
            <div className="w-16 h-0.5 bg-gray-200 mt-4">
                <div
                    className={`h-full bg-primary transition-all duration-500 ${
                        currentStep > Step.TWITTER_FOLLOW ? 'w-full' : 'w-0'
                    }`}
                />
            </div>
            <StepIndicator
                step={Step.SHARE}
                active={currentStep === Step.SHARE}
                completed={currentStep > Step.SHARE}
                label="Get Rewards"
            />
        </div>
    </div>
);
