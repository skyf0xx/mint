// components/referral/StepIndicator.tsx
import { Check } from 'lucide-react';

interface StepIndicatorProps {
    number: number;
    active: boolean;
    completed: boolean;
}

export const StepIndicator = ({
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

export const StepProgress = ({
    currentStep,
    completedSteps,
}: {
    currentStep: number;
    completedSteps: { wallet: boolean; twitter: boolean };
}) => (
    <div className="flex items-center justify-center mb-8 relative">
        <div className="flex items-center space-x-4">
            <StepIndicator
                number={1}
                active={currentStep === 1}
                completed={completedSteps.wallet}
            />
            <div className="w-16 h-0.5 bg-gray-200">
                <div
                    className={`h-full bg-primary transition-all duration-500 ${
                        completedSteps.wallet ? 'w-full' : 'w-0'
                    }`}
                />
            </div>
            <StepIndicator
                number={2}
                active={currentStep === 2}
                completed={completedSteps.twitter}
            />
            <div className="w-16 h-0.5 bg-gray-200">
                <div
                    className={`h-full bg-primary transition-all duration-500 ${
                        completedSteps.twitter ? 'w-full' : 'w-0'
                    }`}
                />
            </div>
            <StepIndicator
                number={3}
                active={currentStep === 3}
                completed={false}
            />
        </div>
    </div>
);
