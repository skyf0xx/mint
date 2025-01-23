// components/referral/ConnectedWallet.tsx
import { motion } from 'framer-motion';

interface ConnectedWalletProps {
    address: string;
}

const ConnectedWallet = ({ address }: ConnectedWalletProps) => {
    const shortenAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10"
        >
            <motion.div
                className="w-1.5 h-1.5 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-gray-500 font-medium">
                Connected: {shortenAddress(address)}
            </span>
        </motion.div>
    );
};

export default ConnectedWallet;
