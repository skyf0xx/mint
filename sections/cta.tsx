import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { InfinityLogo } from './logo';
import {
    useArweaveWalletStore,
    useArweaveWalletInit,
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

const CTA = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    // Initialize wallet
    useArweaveWalletInit();
    const { connected, connect } = useArweaveWalletStore();

    // Handle app launch click
    const handleLaunchAppClick = () => {
        if (connected) {
            // If already connected, scroll to app section
            const appSection = document.getElementById('app');
            if (appSection) {
                appSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If not connected, connect to wallet
            connect();
        }
    };

    // Parallax effects for background elements
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const opacityProgression = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [0, 1, 0]
    );

    // Floating animation variants
    const floatingAnimation = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section ref={containerRef} className="relative py-32 overflow-hidden">
            {/* Enhanced background elements */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent"
                style={{ y: backgroundY }}
            />

            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-50" />

            {/* Add floating decorations */}
            <FloatingDecoration className="top-20 left-[10%] opacity-50" />
            <FloatingDecoration className="bottom-16 right-[12%] w-20 h-20 opacity-40" />
            <FloatingDecoration className="top-1/2 left-[15%] w-12 h-12 opacity-60" />

            {/* Add accent squares */}
            <motion.div
                className="absolute top-1/3 right-[20%] w-8 h-8 rounded-lg border-2 border-accent/20"
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
                className="absolute bottom-1/4 left-[25%] w-10 h-10 rounded-lg border-2 border-accent/20"
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

            {/* Animated gradient orbs */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px]"
                style={{ opacity: opacityProgression }}
            >
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-accent/5 rounded-full blur-[100px] animate-pulse" />
            </motion.div>

            {/* Animated particles */}
            <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-8 h-8 rounded-full border-2 border-primary/10"
                        initial={{ opacity: 0.5, y: 0 }}
                        animate={{
                            opacity: [0.2, 0.5, 0.2],
                            y: [-20, 20, -20],
                            x: [-10, 10, -10],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            delay: i * 2,
                        }}
                        style={{
                            left: `${20 + i * 30}%`,
                            top: `${30 + i * 20}%`,
                        }}
                    />
                ))}
            </div>

            <div className="container relative mx-auto px-4">
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    {/* Enhanced logo animation */}
                    <motion.div
                        className="inline-block mb-8"
                        variants={floatingAnimation}
                    >
                        <motion.div
                            animate={{
                                y: [-10, 10, -10],
                                rotate: [-5, 5, -5],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="relative"
                        >
                            <div className="w-24 h-24">
                                <InfinityLogo />
                            </div>
                            <motion.div
                                className="absolute inset-0 bg-primary/10 rounded-full blur-xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Enhanced heading with animated underline */}
                    <motion.h2
                        className="text-5xl font-bold mb-6"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        Ready to Start{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-accent">
                                Earning Now
                            </span>
                            <motion.span
                                className="absolute inset-x-0 bottom-0 h-3 bg-accent/10 -rotate-1"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </span>
                        ?
                    </motion.h2>

                    {/* Enhanced description */}
                    <motion.p
                        className="text-xl text-gray-600 mb-12 leading-relaxed"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        Join the future of sustainable yield generation and
                        start earning NAB rewards today.
                    </motion.p>

                    {/* Enhanced CTA buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    delay: 0.2,
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="lg"
                                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 group relative overflow-hidden bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-500 w-full sm:w-auto"
                                onClick={handleLaunchAppClick}
                            >
                                <span className="relative z-10 flex items-center">
                                    {connected ? 'Open Dashboard' : 'Connect'}
                                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
