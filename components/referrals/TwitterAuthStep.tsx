import { db } from '@/lib/database';
import { Button } from '../ui/button';
import { Twitter } from 'lucide-react';
import { TwitterAuthResponse } from '@/lib/database';

interface TwitterAuthStepProps {
    onSuccess: (twitterData: TwitterAuthResponse) => void;
}

export const TwitterAuthStep = ({ onSuccess }: TwitterAuthStepProps) => {
    const handleTwitterLogin = async () => {
        // First get OAuth data
        const { data: authData, error } = await db.signInWithTwitter();
        console.log({ authData });
        if (error) throw error;

        // Get user data from session
        const session = await db.supabase.auth.getSession();
        if (!session.data.session?.user)
            throw new Error('Authentication failed');

        // Convert to TwitterAuthResponse format
        const twitterData: TwitterAuthResponse = {
            user: {
                id: session.data.session.user.id,
                username: session.data.session.user.user_metadata.user_name,
                name: session.data.session.user.user_metadata.full_name,
            },
        };

        onSuccess(twitterData);
    };

    return (
        <div className="space-y-4">
            <h3>Connect with Twitter</h3>
            <Button onClick={handleTwitterLogin}>
                <Twitter className="w-5 h-5 mr-2" />
                Continue with Twitter
            </Button>
        </div>
    );
};
