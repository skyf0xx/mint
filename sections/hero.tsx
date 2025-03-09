import { Button } from '@/components/ui/button';
import { scrollToSection } from '@/lib/helpers';
import { ChevronRight, ArrowDown } from 'lucide-react';
import { InfinityLogo } from './logo';
import { motion } from 'framer-motion';
import {
    useArweaveWalletInit,
    useArweaveWalletStore,
} from '@/hooks/use-wallet';

const FloatingDecoration = ({ className }: { className?: string }) => (
    <motion.div
        className={`absolute w-16 h-16 rounded-2xl border-2 border-primary/10 ${className}`}
        animate={{
            y: [0, -20, 0],
            rotate: [0, 45, 0],
            scale: [1, 1.1, 1],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
        }}
    />
);

const Hero = () => {
    // Initialize wallet
    useArweaveWalletInit();
    const { connected, connect } = useArweaveWalletStore();

    const handleLaunchAppClick = () => {
        if (connected) {
            scrollToSection('app');
        } else {
            connect();
        }
    };

    return (
        <section id="hero" className="relative w-full overflow-x-hidden">
            {/* Enhanced gradient background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-white to-transparent" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] opacity-30" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[80px] opacity-20" />
            </div>

            {/* Add floating decorations */}
            <FloatingDecoration className="top-32 left-[8%] opacity-60 hidden sm:block" />
            <FloatingDecoration className="top-48 right-[12%] w-20 h-20 opacity-40 hidden sm:block" />
            <FloatingDecoration className="bottom-40 left-[15%] w-24 h-24 opacity-50 hidden sm:block" />
            <FloatingDecoration className="top-1/3 right-[18%] w-12 h-12 opacity-70 hidden sm:block" />

            {/* Add accent squares */}
            <motion.div
                className="absolute top-1/4 right-[25%] w-8 h-8 rounded-lg border-2 border-accent/20 hidden sm:block"
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, -45, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute bottom-1/3 left-[20%] w-10 h-10 rounded-lg border-2 border-accent/20 hidden sm:block"
                animate={{
                    y: [0, 15, 0],
                    rotate: [0, 45, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <div className="w-full max-w-[100vw] overflow-hidden">
                {/* Main hero content - Now with more vertical space */}
                <div className="container mx-auto px-4 pt-24 sm:pt-32 min-h-[90vh] flex flex-col justify-center relative">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            className="text-center space-y-6 sm:space-y-8"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Brand logo */}
                            <div className="relative">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    <InfinityLogo />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-4 sm:mt-6"
                                >
                                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-accent mb-4">
                                        MINT
                                    </h1>
                                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-primary to-accent rounded-full" />
                                </motion.div>
                            </div>

                            {/* Updated value proposition */}
                            <motion.div
                                className="space-y-4 sm:space-y-6 px-4 sm:px-0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                                    <span className="relative inline-block">
                                        <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-accent">
                                            Single Sided Liquidity
                                        </span>
                                        <span className="absolute inset-x-0 bottom-2 h-3 bg-accent/10 -rotate-1" />
                                    </span>
                                    <p className="mt-2">Made Simple.</p>
                                </h2>
                                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                    Skip token pairing. Let MINT supply the
                                    other side <strong>and</strong> reduce your
                                    exposure to impermanent loss.
                                </p>
                            </motion.div>

                            {/* Updated Call to Action buttons */}
                            <motion.div
                                className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-6 sm:pt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Button
                                    size="lg"
                                    className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 group relative overflow-hidden bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-500 w-full sm:w-auto"
                                    onClick={handleLaunchAppClick}
                                >
                                    <span className="relative z-10 flex items-center justify-center">
                                        {connected
                                            ? 'Open Dashboard'
                                            : 'Launch App'}
                                        <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 group border-2 w-full sm:w-auto"
                                    onClick={() => scrollToSection('metrics')}
                                >
                                    Explore Protection
                                    <ArrowDown className="ml-2 group-hover:translate-y-1 transition-transform" />
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
