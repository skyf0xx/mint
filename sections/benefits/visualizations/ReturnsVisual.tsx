import { motion } from 'framer-motion';

const ReturnsVisual = () => (
    <div className="relative h-32 w-full flex items-center justify-center">
        <div className="absolute left-0 w-full h-20">
            <motion.div
                className="absolute left-1/4 top-0 h-full w-1 bg-primary/30"
                initial={{ height: 0 }}
                animate={{ height: [0, 60, 30, 50] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    times: [0, 0.3, 0.7, 1],
                }}
            >
                <div className="absolute -right-10 -top-6 text-xs text-gray-500">
                    Token Price
                </div>
            </motion.div>

            <motion.div
                className="absolute right-1/4 top-0 h-full w-1 bg-accent/50"
                initial={{ height: 0 }}
                animate={{ height: [0, 20, 40, 30] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    times: [0, 0.3, 0.7, 1],
                }}
            >
                <div className="absolute -left-16 -top-6 text-xs text-gray-500">
                    IL Impact
                </div>
                <motion.div
                    className="absolute -left-10 w-8 h-4 rounded-sm bg-primary/80 flex items-center justify-center"
                    animate={{
                        top: [15, 5, 15],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: 2,
                    }}
                >
                    <span className="text-white text-xs">-50%</span>
                </motion.div>
            </motion.div>

            <div className="absolute bottom-0 w-full h-0.5 bg-gray-300" />
        </div>
    </div>
);

export default ReturnsVisual;
