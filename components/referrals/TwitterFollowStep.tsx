// components/referral/steps/TwitterFollowStep.tsx
import { Button } from '@/components/ui/button';
import { Twitter } from 'lucide-react';

interface TwitterFollowStepProps {
    onFollow: () => void;
    onSkip: () => void;
}

export const TwitterFollowStep = ({
    onFollow,
    onSkip,
}: TwitterFollowStepProps) => (
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">Follow on Twitter</h3>
        <p className="text-gray-600 text-center">
            Follow @mithril_labs to continue
        </p>
        <Button className="w-full py-6" onClick={onFollow}>
            <Twitter className="w-5 h-5 mr-2" />
            Follow @mithril_labs
        </Button>
        <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors text-center w-full mt-4"
        >
            Skip for now
        </button>
    </div>
);
