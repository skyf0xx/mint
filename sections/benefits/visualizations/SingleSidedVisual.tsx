import { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const SingleSidedVisual = () => {
    const [isAnimating, setIsAnimating] = useState(true);
    const [cycle, setCycle] = useState(0);
    const shouldReduceMotion = useReducedMotion();

    // Restart animation cycle periodically
    useEffect(() => {
        if (!isAnimating) return;

        const timer = setTimeout(() => {
            setCycle((prev) => prev + 1);
        }, 3500);

        return () => clearTimeout(timer);
    }, [isAnimating, cycle]);

    const tokenVariants = {
        initial: { x: 0, opacity: 1, scale: 1 },
        animate: {
            x: shouldReduceMotion ? 50 : [0, 50, 50],
            opacity: [1, 1, 0],
            scale: [1, 1, 0.8],
            transition: {
                duration: 3,
                times: [0, 0.4, 1],
            },
        },
    };

    const arrowVariants = {
        initial: { width: 0, opacity: 0 },
        animate: {
            width: shouldReduceMotion ? 80 : [0, 80, 80],
            opacity: [0, 1, 0.5],
            transition: {
                duration: 3,
                times: [0, 0.4, 1],
            },
        },
    };

    const lpVariants = {
        initial: { opacity: 0.2, scale: 0.8 },
        animate: {
            opacity: [0.2, 1],
            scale: [0.8, 1],
            transition: {
                duration: 3,
                delay: 1.2,
            },
        },
    };

    const handleInteraction = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsAnimating(true);
            setCycle((prev) => prev + 1);
        }, 300);
    };

    return (
        <div
            className="relative h-32 w-full flex items-center justify-center"
            onClick={handleInteraction}
            onMouseEnter={() => setIsAnimating(false)}
            onMouseLeave={() => setIsAnimating(true)}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="absolute top-0 left-0 w-full h-full"
                    animate={{
                        backgroundColor: isAnimating
                            ? 'rgba(99, 102, 241, 0.02)'
                            : 'rgba(99, 102, 241, 0)',
                    }}
                    transition={{ duration: 0.5 }}
                    style={{ borderRadius: '0.5rem' }}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`token-${cycle}`}
                        className="absolute left-1/4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center cursor-pointer"
                        variants={tokenVariants}
                        initial="initial"
                        animate={isAnimating ? 'animate' : 'initial'}
                        whileHover={{
                            scale: 1.1,
                            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
                        }}
                    >
                        <div className="text-primary font-bold">Token</div>
                    </motion.div>
                </AnimatePresence>

                <motion.div
                    className="absolute h-0.5 bg-primary/50"
                    style={{ left: 'calc(25% + 24px)', top: '50%' }}
                    variants={arrowVariants}
                    initial="initial"
                    animate={isAnimating ? 'animate' : 'initial'}
                >
                    <motion.div
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                        animate={
                            isAnimating
                                ? {
                                      x: [0, 20, 0],
                                      opacity: [0, 1, 0],
                                  }
                                : { x: 0, opacity: 0 }
                        }
                        transition={{
                            duration: 1.5,
                            repeat: 1,
                            repeatType: 'reverse',
                            repeatDelay: 0.3,
                        }}
                    >
                        <ArrowRight className="w-4 h-4 text-primary" />
                    </motion.div>
                </motion.div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg border border-primary/20">
                    <motion.div
                        className="text-primary font-bold text-sm"
                        animate={
                            isAnimating
                                ? {
                                      scale: [1, 1.1, 1],
                                      transition: {
                                          duration: 1.5,
                                          delay: 0.7,
                                          repeat: 1,
                                          repeatType: 'reverse',
                                      },
                                  }
                                : {}
                        }
                    >
                        MINT
                    </motion.div>
                </div>

                <motion.div
                    className="absolute right-1/4 w-16 h-16 bg-accent/10 rounded-lg border border-accent/20 flex items-center justify-center cursor-pointer"
                    variants={lpVariants}
                    initial="initial"
                    animate={isAnimating ? 'animate' : 'initial'}
                    whileHover={{
                        scale: 1.1,
                        boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
                    }}
                >
                    <div className="text-accent font-bold text-sm">LP</div>
                </motion.div>
            </div>
        </div>
    );
};

export default SingleSidedVisual;
