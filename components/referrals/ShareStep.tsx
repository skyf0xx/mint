import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Check,
    Copy,
    Twitter,
    Send,
    Share2,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { db, ReferralStats } from '@/lib/database';
import { ReferralState } from '@/lib/referral';
import StatsDash from './Stats';
import { referalLink } from '@/lib/helpers';

interface ShareStepProps {
    referralCode: string;
    state: ReferralState;
    onShare: () => void;
    stats?: ReferralStats | null;
}

export const ShareStep = ({ referralCode, state, onShare }: ShareStepProps) => {
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const referralUrl = referalLink(referralCode);
    const shareText = 'Stake once, earn NAB forever with MINT token! 🚀';

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            try {
                const referralStats = await db.getUserReferralStats(
                    state.twitterData?.user.id || ''
                );
                setStats(referralStats);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [state.twitterData?.user.id]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralUrl);
            setCopied(true);
            onShare();
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const socialShare = async (platform: 'twitter' | 'telegram') => {
        try {
            const text = encodeURIComponent(shareText);
            const url = encodeURIComponent(referralUrl);
            const links = {
                twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                telegram: `https://t.me/share/url?url=${url}&text=${text}`,
            };
            window.open(links[platform], '_blank');
            onShare();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="space-y-8">
            {/* Primary Focus: Main Share Action */}
            <motion.div
                className="space-y-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                    Multiply Your Earnings
                </h3>
                <p className="text-gray-600 text-sm">
                    Share your unique link to grow stronger together
                </p>
            </motion.div>

            {/* Primary Action: Copy Link Card */}
            <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="p-4 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-white to-primary/5">
                    <div className="flex items-center space-x-3">
                        <code className="text-sm flex-1 overflow-hidden text-ellipsis font-mono bg-primary/5 p-3 rounded-lg">
                            {referralUrl}
                        </code>
                        <AnimatePresence mode="wait">
                            {copied ? (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="flex items-center space-x-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg"
                                >
                                    <Check className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        Copied!
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="copy"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <Button
                                        onClick={handleCopy}
                                        className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary-600"
                                        size="lg"
                                    >
                                        <Copy className="w-5 h-5 mr-2" />
                                        Copy Link
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>

            {/* Secondary Action: Social Share Buttons */}
            <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="py-6 group border-2 hover:border-primary/30 transition-all duration-300"
                        onClick={() => socialShare('twitter')}
                    >
                        <Twitter className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
                        Share on Twitter
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="py-6 group border-2 hover:border-primary/30 transition-all duration-300"
                        onClick={() => socialShare('telegram')}
                    >
                        <Send className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
                        Share on Telegram
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                </div>
            </motion.div>

            {/* Tertiary Content: Stats Dashboard */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex justify-center py-8"
                    >
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </motion.div>
                ) : stats ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="p-6 border-2 border-primary/10 bg-gradient-to-br from-white to-primary/5">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-medium text-gray-700">
                                    Your Impact
                                </h4>
                                <Share2 className="w-5 h-5 text-primary/60" />
                            </div>
                            <StatsDash stats={stats} />
                        </Card>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            {/* Error Handling */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-lg p-4 bg-red-50 border border-red-100"
                    >
                        <p className="text-sm text-red-600">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShareStep;
