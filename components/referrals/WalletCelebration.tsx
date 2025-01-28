import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface CelebrationProps {
    onComplete: () => void;
}

const ConfettiPiece = ({ delay, color }: { delay: number; color: string }) => {
    const randomRotation = Math.random() * 360;
    const xDistance = (Math.random() - 0.5) * 400;
    const yDistance = (Math.random() + 1) * -300;

    return (
        <motion.div
            className="absolute left-1/2 top-1/2"
            initial={{ x: 0, y: 0, rotate: 0, scale: 0 }}
            animate={{
                x: [0, xDistance],
                y: [0, yDistance, yDistance + 400],
                rotate: [0, randomRotation + 360 * 2],
                scale: [0, 1, 1, 0.5],
            }}
            transition={{
                duration: 2,
                delay,
                ease: [0.23, 0.51, 0.32, 0.95],
            }}
        >
            {/* Randomize confetti shapes for more variety */}
            {Math.random() > 0.6 ? (
                <div
                    className={`w-3 h-3 ${color}`}
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    }}
                />
            ) : Math.random() > 0.3 ? (
                <div className={`w-2 h-4 ${color} rounded-full`} />
            ) : (
                <div
                    className={`w-3 h-3 ${color}`}
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                    }}
                />
            )}
        </motion.div>
    );
};

const WalletCelebration = ({ onComplete }: CelebrationProps) => {
    const [showMessage, setShowMessage] = useState(false);
    const confettiColors = [
        'bg-primary',
        'bg-accent',
        'bg-primary-400',
        'bg-accent-400',
        'bg-primary-600',
        'bg-accent-600',
    ];

    useEffect(() => {
        // Show message with slight delay for better animation flow
        const messageTimer = setTimeout(() => {
            setShowMessage(true);
        }, 400);

        // Complete celebration after animation
        const completionTimer = setTimeout(onComplete, 3000);

        return () => {
            clearTimeout(messageTimer);
            clearTimeout(completionTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Enhanced backdrop with radial gradient */}
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md" />
                <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
            </motion.div>

            {/* Celebration content container */}
            <div className="relative w-full max-w-md mx-auto px-4">
                {/* Optimized confetti container */}
                <div className="absolute inset-0 -top-32 overflow-visible">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <ConfettiPiece
                            key={i}
                            delay={i * 0.02}
                            color={confettiColors[i % confettiColors.length]}
                        />
                    ))}
                </div>

                {/* Enhanced success message with icon and animation */}
                <motion.div
                    className="relative z-10 text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/10"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={showMessage ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{
                        type: 'spring',
                        damping: 12,
                        stiffness: 200,
                    }}
                >
                    {/* Animated success icon */}
                    <motion.div
                        className="mb-4 inline-block"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: 'spring',
                            damping: 10,
                            stiffness: 100,
                        }}
                    >
                        <div className="relative">
                            <CheckCircle2 className="w-16 h-16 text-primary" />
                            <motion.div
                                className="absolute inset-0"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            >
                                <Sparkles className="w-16 h-16 text-accent/50" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Enhanced success text with gradient */}
                    <motion.h3
                        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-accent mb-3"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Earning Power Activated! 🚀
                    </motion.h3>
                    <motion.p
                        className="text-gray-600 text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Your journey to perpetual rewards begins now
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default WalletCelebration;
