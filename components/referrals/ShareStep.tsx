import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Twitter, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface ShareStepProps {
    referralCode: string;
    onShare: () => void;
}

export const ShareStep = ({ referralCode, onShare }: ShareStepProps) => {
    const [copied, setCopied] = useState(false);
    const referralUrl = `https://mithril-mint-token.ar.io/ref/${referralCode}`;
    const shareText = 'Stake once, earn NAB forever with MINT token! 🚀';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralUrl);
            setCopied(true);
            onShare();
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const socialShare = (platform: 'twitter' | 'telegram') => {
        const text = encodeURIComponent(shareText);
        const url = encodeURIComponent(referralUrl);

        const links = {
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            telegram: `https://t.me/share/url?url=${url}&text=${text}`,
        };

        window.open(links[platform], '_blank');
        onShare();
    };

    return (
        <div className="space-y-6">
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
        </div>
    );
};
