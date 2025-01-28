import { useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { Button } from '../ui/button';
import { Twitter, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { TwitterAuthResponse } from '@/lib/database';
import { motion, AnimatePresence } from 'framer-motion';

interface TwitterAuthStepProps {
    onSuccess: (twitterData: TwitterAuthResponse) => void;
}

export const TwitterAuthStep = ({ onSuccess }: TwitterAuthStepProps) => {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
            await db.supabase.auth.signOut();
            const { error: authError } = await db.signInWithTwitter();
            if (authError)
                throw new Error(
                    'Twitter authentication failed. Please try again.'
                );
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
            <motion.div
                className="flex flex-col items-center justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
                <p className="text-sm text-gray-500 mt-4">
                    Checking previous session...
                </p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Primary Focus: Call to Action */}
            <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Button
                    onClick={handleTwitterLogin}
                    disabled={isLoading}
                    className="w-full py-6 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
                >
                    <span className="relative flex items-center justify-center text-lg">
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <Twitter className="w-5 h-5 mr-2" />
                        )}
                        {isLoading ? 'Connecting...' : 'Connect with Twitter'}
                        {!isLoading && (
                            <ArrowRight className="w-5 h-5 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        )}
                    </span>
                </Button>

                <motion.div
                    className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/50 to-primary-600/50 blur-md -z-10"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>

            {/* Secondary Content: Value Propositions */}
            <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="text-center space-y-2 mb-6">
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                        Join the MINT Community
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Connect your Twitter to start earning perpetual rewards
                    </p>
                </div>
            </motion.div>

            {/* Tertiary Content: Error States and Help Text */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-lg p-4 bg-red-50/50 border border-red-100 backdrop-blur-sm"
                    >
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-600">
                                    Connection Reset Needed
                                </p>
                                <p className="text-xs text-red-500 mt-1">
                                    Please try connecting again
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.p
                className="text-xs text-center text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Expected time: ~30 seconds
            </motion.p>
        </div>
    );
};

export default TwitterAuthStep;
