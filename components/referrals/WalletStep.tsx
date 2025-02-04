import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/use-wallet';
import { Wallet, Loader2, ArrowRight, Shield, Coins } from 'lucide-react';
import WalletCelebration from './WalletCelebration';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface WalletStepProps {
    onConnect: (address: string) => void;
    loading: boolean;
}

export const WalletStep = ({ onConnect, loading }: WalletStepProps) => {
    const { connecting, connect } = useWallet();
    const [showCelebration, setShowCelebration] = useState(false);
    const [connectedAddress, setConnectedAddress] = useState<string | null>(
        null
    );

    useEffect(() => {
        const checkConnection = async () => {
            try {
                if (!window.arweaveWallet) return null;
                const permissions = await window.arweaveWallet.getPermissions();
                if (permissions.includes('ACCESS_ADDRESS')) {
                    const addr = await window.arweaveWallet.getActiveAddress();
                    setConnectedAddress(addr);
                    onConnect(addr);
                    return addr;
                }
                return null;
            } catch (error) {
                console.error('Error checking connection:', error);
                return null;
            }
        };

        checkConnection();
    }, []);

    const handleConnect = async () => {
        const address = await connect();
        if (address) {
            setConnectedAddress(address);
            setShowCelebration(true);
        }
    };

    const handleCelebrationComplete = () => {
        setShowCelebration(false);
        if (connectedAddress) {
            onConnect(connectedAddress);
        }
    };

    return (
        <div className="space-y-8">
            <AnimatePresence>
                {showCelebration && (
                    <WalletCelebration onComplete={handleCelebrationComplete} />
                )}
            </AnimatePresence>

            {/* Primary Focus: Call to Action */}
            <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Button
                    onClick={handleConnect}
                    disabled={loading || connecting}
                    className="w-full py-6 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 group"
                >
                    <span className="relative flex items-center justify-center text-lg">
                        {loading || connecting ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <Wallet className="w-5 h-5 mr-2" />
                        )}
                        {loading || connecting
                            ? 'Connecting...'
                            : 'Connect ArConnect'}
                        {!loading && !connecting && (
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
                        Activate Perpetual Earnings
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Link your ArConnect wallet to start generating lifetime
                        rewards
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-gradient-to-br from-white to-primary/5 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Coins className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">
                                    Lifetime Earnings
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Forever NAB rewards
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-white to-primary/5 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Shield className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">
                                    Secure Storage
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Self-custody
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </motion.div>

            {/* Tertiary Content: Installation Help */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <p className="text-xs text-gray-400">
                    Don&apos;t have ArConnect?{' '}
                    <a
                        href="https://www.arconnect.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-600 transition-colors"
                    >
                        Install now
                    </a>
                </p>
            </motion.div>
        </div>
    );
};

export default WalletStep;
