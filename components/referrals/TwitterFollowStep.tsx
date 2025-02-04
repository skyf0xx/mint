import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Twitter,
    Loader2,
    ArrowRight,
    Users,
    Bell,
    CheckCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [showSkipWarning, setShowSkipWarning] = useState(false);

    useEffect(() => {
        const checkTwitterStatus = async () => {
            try {
                const user = await db.getUserById(twitterUserId);
                if (user?.twitter_followed) {
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
                    Checking follow status...
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
                    onClick={onFollow}
                    className="w-full py-6 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 group"
                >
                    <span className="relative flex items-center justify-center text-lg">
                        <Twitter className="w-5 h-5 mr-2" />
                        Follow @mithril_labs
                        <ArrowRight className="w-5 h-5 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </span>
                </Button>

                <motion.div
                    className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/50 to-primary-600/50 blur-md -z-10"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>

            {/* Secondary Content: Benefits */}
            <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="text-center space-y-2 mb-6">
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                        Stay Informed, Earn More
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Follow for exclusive strategies, updates, and bonus
                        rewards
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-gradient-to-br from-white to-primary/5 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Bell className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">
                                    Instant Updates
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Never miss rewards
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-white to-primary/5 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">
                                    Community Access
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Join top earners
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </motion.div>

            {/* Tertiary Content: Skip Option with Warning */}
            <AnimatePresence>
                {showSkipWarning ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-amber-50/50 backdrop-blur-sm border border-amber-100 rounded-lg p-4"
                    >
                        <div className="flex items-start space-x-3">
                            <div className="p-1 bg-amber-100 rounded-full">
                                <CheckCircle className="w-4 h-4 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-amber-800">
                                    Are you sure you want to skip?
                                </p>
                                <p className="text-xs text-amber-600 mt-1">
                                    You may miss out on exclusive rewards and
                                    updates
                                </p>
                                <div className="flex space-x-3 mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setShowSkipWarning(false)
                                        }
                                        className="text-xs"
                                    >
                                        Go back
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onSkip}
                                        className="text-xs text-amber-600 hover:text-amber-700"
                                    >
                                        Skip anyway
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        <button
                            onClick={() => setShowSkipWarning(true)}
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Continue without following
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.p
                className="text-xs text-center text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Expected time: ~15 seconds
            </motion.p>
        </div>
    );
};

export default TwitterFollowStep;
