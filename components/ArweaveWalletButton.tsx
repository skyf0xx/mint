import React from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import {
    useArweaveWalletInit,
    useArweaveWalletStore,
} from '@/hooks/use-wallet';

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
            <button
                disabled
                className="bg-gray-400 text-black font-sour-gummy py-2 px-6 rounded-full text-lg transition-all flex items-center gap-2"
            >
                <Loader2 className="h-5 w-5 animate-spin" />
                connecting...
            </button>
        );
    }

    if (connected && address) {
        return (
            <button
                onClick={disconnect}
                className="bg-red-400 hover:bg-red-500 text-black font-sour-gummy py-2 px-6 rounded-full text-lg transition-all flex items-center gap-2"
            >
                <Wallet className="h-5 w-5" />
                {formatAddress(address)}
            </button>
        );
    }

    return (
        <button
            onClick={connect}
            className="bg-green-400 hover:bg-green-500 text-black font-sour-gummy py-2 px-6 rounded-full text-lg transition-all flex items-center gap-2"
        >
            <Wallet className="h-5 w-5" />
            connect wallet
        </button>
    );
};
