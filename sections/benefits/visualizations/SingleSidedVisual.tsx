import { motion } from 'framer-motion';

const SingleSidedVisual = () => (
    <div className="relative h-32 w-full flex items-center justify-center">
        <motion.div
            className="absolute left-1/4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center"
            animate={{
                x: [0, 50, 50],
                opacity: [1, 1, 0],
                scale: [1, 1, 0.8],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                times: [0, 0.4, 1],
            }}
        >
            <div className="text-primary font-bold">Token</div>
        </motion.div>

        <motion.div
            className="absolute h-0.5 bg-primary/30 w-0"
            animate={{ width: [0, 80, 80] }}
            transition={{
                duration: 3,
                repeat: Infinity,
                times: [0, 0.4, 1],
            }}
            style={{ left: 'calc(25% + 24px)', top: '50%' }}
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-primary font-bold text-sm">MINT</div>
        </div>

        <motion.div
            className="absolute right-1/4 w-16 h-16 bg-accent/10 rounded-lg border border-accent/20 flex items-center justify-center"
            animate={{
                opacity: [0.2, 1],
                scale: [0.8, 1],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                delay: 1.2,
            }}
        >
            <div className="text-accent font-bold text-sm">LP</div>
        </motion.div>
    </div>
);

export default SingleSidedVisual;
