import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { useRef } from 'react';
import { InfinityLogo } from './logo';

const CTA = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

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
                                Earning Forever
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
                                className="text-lg px-8 py-6 group relative overflow-hidden bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-500"
                            >
                                <span className="relative z-10 flex items-center">
                                    Start Staking Now
                                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg px-8 py-6 group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500"
                            >
                                <span className="relative z-10 flex items-center">
                                    View Documentation
                                    <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
