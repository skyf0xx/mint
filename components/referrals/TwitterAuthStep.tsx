import { useState } from 'react';
import { db } from '@/lib/database';
import { Button } from '../ui/button';
import { Twitter, AlertCircle, Loader2 } from 'lucide-react';
import { TwitterAuthResponse } from '@/lib/database';
import { motion, AnimatePresence } from 'framer-motion';

interface TwitterAuthStepProps {
    onSuccess: (twitterData: TwitterAuthResponse) => void;
}

export const TwitterAuthStep = ({ onSuccess }: TwitterAuthStepProps) => {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTwitterLogin = async () => {
        setIsLoading(true);
        setError('');

        try {
            // First get OAuth data
            await db.supabase.auth.signOut();
            const { error: authError } = await db.signInWithTwitter();
            if (authError) {
                throw new Error(
                    'Twitter authentication failed. Please try again.'
                );
            }

            // Get user data from session
            const session = await db.supabase.auth.getSession();
            if (!session.data.session?.user) {
                throw new Error(
                    'Unable to retrieve user session. Please try again.'
                );
            }

            // Convert to TwitterAuthResponse format
            const twitterData: TwitterAuthResponse = {
                user: {
                    id: session.data.session.user.id,
                    username: session.data.session.user.user_metadata.user_name,
                    name: session.data.session.user.user_metadata.full_name,
                },
            };

            onSuccess(twitterData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'An unexpected error occurred'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-center">
                Connect with Twitter
            </h3>
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-600 text-sm">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
            <Button
                onClick={handleTwitterLogin}
                disabled={isLoading}
                className="w-full py-6"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                    <Twitter className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Connecting...' : 'Continue with Twitter'}
            </Button>
        </div>
    );
};
