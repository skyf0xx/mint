import { useState, useEffect } from 'react';
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
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const {
                    data: { session },
                } = await db.supabase.auth.getSession();

                if (session?.user) {
                    const twitterData: TwitterAuthResponse = {
                        user: {
                            id: session.user.id,
                            twitter_id: session.user.identities?.[0]?.id || '',
                            username: session.user.user_metadata.user_name,
                            name: session.user.user_metadata.full_name,
                        },
                    };
                    onSuccess(twitterData);
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to check authentication status'
                );
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [onSuccess]);

    const handleTwitterLogin = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Clear any existing session
            await db.supabase.auth.signOut();
            const { error: authError } = await db.signInWithTwitter();

            if (authError) {
                throw new Error(
                    'Twitter authentication failed. Please try again.'
                );
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'An unexpected error occurred'
            );
            setIsLoading(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

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
