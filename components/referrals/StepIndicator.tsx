import { Check } from 'lucide-react';
import { Step } from '@/lib/referral';

interface StepIndicatorProps {
    step: Step;
    active: boolean;
    completed: boolean;
}

export const StepIndicator = ({
    step,
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
        {completed ? <Check className="w-4 h-4" /> : step}
    </div>
);

export const StepProgress = ({
    currentStep,
    completedSteps,
}: {
    currentStep: Step;
    completedSteps: { wallet: boolean; twitter: boolean };
}) => (
    <div className="flex items-center justify-center mb-8 relative">
        <div className="flex items-center space-x-4">
            <StepIndicator
                step={Step.TWITTER_AUTH}
                active={currentStep === Step.TWITTER_AUTH}
                completed={
                    currentStep > Step.TWITTER_AUTH || completedSteps.twitter
                }
            />
            <div className="w-16 h-0.5 bg-gray-200">
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
            />
            <div className="w-16 h-0.5 bg-gray-200">
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
            />
            <div className="w-16 h-0.5 bg-gray-200">
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
            />
        </div>
    </div>
);
