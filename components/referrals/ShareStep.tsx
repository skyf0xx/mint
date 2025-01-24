import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Twitter, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { db, ReferralStats } from '@/lib/database';
import StatsCard from './StatsCard';

interface ShareStepProps {
    referralCode: string;
    walletAddress: string;
    onShare: () => void;
    stats?: ReferralStats | null; // Add this line, make it optional
}

export const ShareStep = ({
    referralCode,
    walletAddress,
    onShare,
}: ShareStepProps) => {
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [error, setError] = useState<string>('');
    const referralUrl = `https://mithril-mint-token.ar.io/ref/${referralCode}`;
    const shareText = 'Stake once, earn NAB forever with MINT token! 🚀';

    useEffect(() => {
        const loadStats = async () => {
            try {
                const referralStats = await db.getUserReferralStats(
                    walletAddress
                );
                setStats(referralStats);
            } catch (err) {
                setError((err as Error).message);
            }
        };

        loadStats();
    }, [walletAddress]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralUrl);
            setCopied(true);

            onShare();

            // Refresh stats after successful share
            const updatedStats = await db.getUserReferralStats(walletAddress);
            setStats(updatedStats);

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

            // Refresh stats after successful share
            const updatedStats = await db.getUserReferralStats(walletAddress);
            setStats(updatedStats);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                    <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
            )}

            <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="text-xl font-medium">Share & Earn</h3>
                <p className="text-gray-600">
                    Share your unique referral link to start earning rewards
                </p>
            </motion.div>

            <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="p-4 border-2 border-primary/10 hover:border-primary/20 transition-colors">
                    <div className="flex items-center space-x-3">
                        <code className="text-sm flex-1 text-gray-600 overflow-hidden text-ellipsis font-mono">
                            {referralUrl}
                        </code>
                        <AnimatePresence mode="wait">
                            {copied ? (
                                <motion.div
                                    key="check"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="text-green-500 px-3 py-1.5 bg-green-50 rounded-md flex items-center"
                                >
                                    <Check className="w-4 h-4 mr-1" />
                                    <span className="text-sm">Copied!</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="copy"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCopy}
                                        className="hover:bg-gray-100"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>

            <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className="py-6 group hover:border-primary/30 transition-colors"
                        onClick={() => socialShare('twitter')}
                    >
                        <Twitter className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
                        Tweet
                    </Button>
                    <Button
                        variant="outline"
                        className="py-6 group hover:border-primary/30 transition-colors"
                        onClick={() => socialShare('telegram')}
                    >
                        <Send className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
                        Telegram
                    </Button>
                </div>
            </motion.div>

            {stats && (
                <motion.div
                    className="mt-6 space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-sm text-gray-600">Your Referrals</p>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="grid grid-cols-3 gap-3">
                            <StatsCard
                                title="Total"
                                value={stats.totalReferrals}
                            />
                            <StatsCard
                                title="Completed"
                                value={stats.completedReferrals}
                            />
                            <StatsCard
                                title="Pending"
                                value={stats.pendingReferrals}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ShareStep;
