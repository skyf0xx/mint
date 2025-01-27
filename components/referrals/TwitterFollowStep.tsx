import { Button } from '@/components/ui/button';
import { Twitter, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/database';

interface TwitterFollowStepProps {
    onFollow: () => void;
    onSkip: () => void;
    twitterUserId: string;
}

export const TwitterFollowStep = ({
    onFollow,
    onSkip,
    twitterUserId,
}: TwitterFollowStepProps) => {
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkTwitterStatus = async () => {
            try {
                const user = await db.getUserById(twitterUserId);
                if (user?.twitter_followed) {
                    // If user has already followed, automatically advance
                    onSkip();
                }
            } catch (error) {
                console.error('Error checking Twitter status:', error);
            } finally {
                setChecking(false);
            }
        };

        if (twitterUserId) {
            checkTwitterStatus();
        }
    }, [twitterUserId, onSkip]);

    if (checking) {
        return (
            <div className="space-y-4 text-center">
                <h3 className="text-lg font-medium">Checking Twitter Status</h3>
                <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-center">
                Follow on Twitter
            </h3>
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
};
