import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
            <div
                className={`w-3 h-3 ${color}`}
                style={{
                    clipPath:
                        Math.random() > 0.5
                            ? 'polygon(50% 0%, 100% 100%, 0% 100%)'
                            : 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                }}
            />
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
        const timer = setTimeout(() => {
            setShowMessage(true);
        }, 500);

        const completionTimer = setTimeout(onComplete, 3000);

        return () => {
            clearTimeout(timer);
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
            {/* Improved backdrop with centered gradient */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            {/* Container for celebration content */}
            <div className="relative w-full max-w-md mx-auto px-4">
                {/* Confetti container with improved positioning */}
                <div className="absolute inset-0 -top-32 overflow-visible">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <ConfettiPiece
                            key={i}
                            delay={i * 0.02}
                            color={confettiColors[i % confettiColors.length]}
                        />
                    ))}
                </div>

                {/* Success message with enhanced animation */}
                <motion.div
                    className="relative z-10 text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/10"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={showMessage ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{
                        type: 'spring',
                        damping: 15,
                        stiffness: 300,
                        duration: 0.6,
                    }}
                >
                    <motion.h3
                        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600 mb-3"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Wallet Connected!
                    </motion.h3>
                    <motion.p
                        className="text-gray-600 text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        You&apos;re all set to start earning MINT rewards
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default WalletCelebration;
