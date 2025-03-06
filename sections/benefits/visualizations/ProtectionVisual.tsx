import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Shield } from 'lucide-react';

const ProtectionVisual = () => {
    const [day, setDay] = useState(15);
    const [isDragging, setIsDragging] = useState(false);
    const shouldReduceMotion = useReducedMotion();
    const protectionPercentage = Math.min(Math.floor((day / 30) * 50), 50);

    // Calculate the color based on the protection percentage
    const getGradientColor = () => {
        if (protectionPercentage <= 15) return 'from-primary/30 to-primary/40';
        if (protectionPercentage <= 30) return 'from-primary/40 to-primary/60';
        return 'from-primary/50 to-primary/80';
    };

    return (
        <div className="w-full space-y-6 py-2">
            <div className="flex justify-between items-center">
                <motion.div
                    className="text-sm text-gray-500 px-2 py-1 rounded"
                    animate={{
                        backgroundColor: isDragging
                            ? 'rgba(99, 102, 241, 0.1)'
                            : 'transparent',
                    }}
                    transition={{ duration: 0.3 }}
                >
                    Day {day}
                </motion.div>
                <motion.div
                    className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600 flex items-center gap-2"
                    animate={{
                        scale: isDragging ? 1.1 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                    <Shield className="h-5 w-5" />
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={protectionPercentage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {protectionPercentage}% Protected
                        </motion.span>
                    </AnimatePresence>
                </motion.div>
            </div>

            <div className="relative">
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        boxShadow: isDragging
                            ? '0 0 0 2px rgba(99, 102, 241, 0.3)'
                            : '0 0 0 0px rgba(99, 102, 241, 0)',
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ borderRadius: '9999px' }}
                />
                <motion.div
                    className={`relative h-3 w-full rounded-full bg-gradient-to-r ${getGradientColor()}`}
                    animate={{
                        scaleX: day / 30,
                        originX: 0,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: shouldReduceMotion ? 100 : 400,
                        damping: 15,
                    }}
                >
                    <motion.div
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center"
                        style={{
                            x: `calc(${(day / 30) * 100}% - ${
                                day > 0 ? '12px' : '0px'
                            })`,
                        }}
                        animate={{
                            scale: isDragging ? 1.2 : 1,
                            boxShadow: isDragging
                                ? '0 0 0 8px rgba(99, 102, 241, 0.2)'
                                : '0 0 0 0px rgba(99, 102, 241, 0)',
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 15,
                        }}
                    >
                        <Shield className="h-3 w-3 text-primary" />
                    </motion.div>
                </motion.div>

                <input
                    type="range"
                    min="0"
                    max="30"
                    value={day}
                    onChange={(e) => setDay(parseInt(e.target.value))}
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchEnd={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
            </div>

            <div className="flex justify-between text-xs">
                <motion.div
                    className={`py-1 px-2 rounded ${
                        day === 0
                            ? 'bg-primary/10 text-primary-600 font-medium'
                            : 'text-gray-500'
                    }`}
                    animate={{ scale: day === 0 ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    Day 0 (0%)
                </motion.div>
                <motion.div
                    className={`py-1 px-2 rounded ${
                        day === 15
                            ? 'bg-primary/10 text-primary-600 font-medium'
                            : 'text-gray-500'
                    }`}
                    animate={{ scale: day === 15 ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    Day 15 (25%)
                </motion.div>
                <motion.div
                    className={`py-1 px-2 rounded ${
                        day === 30
                            ? 'bg-primary/10 text-primary-600 font-medium'
                            : 'text-gray-500'
                    }`}
                    animate={{ scale: day === 30 ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    Day 30 (50%)
                </motion.div>
            </div>

            <AnimatePresence>
                {day === 30 && (
                    <motion.div
                        className="text-center text-sm bg-primary/10 text-primary-600 py-2 px-3 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        Maximum protection achieved! 🎉
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProtectionVisual;
