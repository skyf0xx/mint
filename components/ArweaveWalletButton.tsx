import React from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import {
    useArweaveWalletInit,
    useArweaveWalletStore,
} from '@/hooks/use-wallet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const ArweaveWalletButton: React.FC = () => {
    // Initialize wallet event listeners
    useArweaveWalletInit();

    // Get state and actions from the store
    const { address, connecting, connected, connect, disconnect } =
        useArweaveWalletStore();

    const formatAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    };

    if (connecting) {
        return (
            <Button
                disabled
                className="bg-gray-100 text-gray-600 opacity-80"
                size="sm"
            >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
            </Button>
        );
    }

    if (connected && address) {
        return (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    onClick={disconnect}
                    variant="outline"
                    size="sm"
                    className="group relative overflow-hidden border-primary/30 text-primary hover:text-white"
                >
                    <span className="relative z-10 flex items-center">
                        <Wallet className="h-4 w-4 mr-2" />
                        {formatAddress(address)}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
                onClick={connect}
                size="sm"
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300"
            >
                <span className="relative z-10 flex items-center">
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
        </motion.div>
    );
};
