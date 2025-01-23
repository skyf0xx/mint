// components/referral/steps/ShareStep.tsx
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

interface ShareStepProps {
    referralCode: string;
    onShare: () => void;
}

export const ShareStep = ({ referralCode, onShare }: ShareStepProps) => (
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">Share & Earn</h3>
        <p className="text-gray-600 text-center">
            Share your referral link to earn rewards
        </p>
        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
            <code className="text-sm flex-1 text-gray-600 overflow-hidden text-ellipsis">
                {`https://mint.example.com/ref/${referralCode}`}
            </code>
            <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="w-4 h-4" />
            </Button>
        </div>
    </div>
);
