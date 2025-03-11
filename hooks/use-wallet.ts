// hooks/useWallet.ts
import { useState, useCallback, useEffect } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { toast } from 'react-toastify'; // Import toast from react-toastify

export const useWallet = () => {
    const [address, setAddress] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);

    const connect = useCallback(async () => {
        try {
            setConnecting(true);

            if (!window.arweaveWallet) {
                toast.error('Please install ArConnect to continue', {
                    autoClose: 5000,
                });
                window.open('https://arconnect.io', '_blank');
                return null;
            }

            await window.arweaveWallet.connect([
                'ACCESS_ADDRESS',
                'SIGN_TRANSACTION',
            ]);
            const addr = await window.arweaveWallet.getActiveAddress();
            setAddress(addr);
            return addr;
        } catch (error) {
            console.error('Error connecting:', error);
            toast.error('Failed to connect to ArConnect', {
                autoClose: 5000,
            });
            return null;
        } finally {
            setConnecting(false);
        }
    }, []);

    return { address, connecting, connect };
};

interface ArweaveWalletState {
    address: string | null;
    connecting: boolean;
    connected: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    checkConnection: () => Promise<void>;
    scrollToStakingDashboard: () => void;
}

export const useArweaveWalletStore = create<ArweaveWalletState>()(
    devtools(
        (set, get) => ({
            address: null,
            connecting: false,
            connected: false,

            checkConnection: async () => {
                try {
                    // Check if ArConnect is installed
                    if (!window.arweaveWallet) {
                        return;
                    }

                    const permissions =
                        await window.arweaveWallet.getPermissions();
                    if (permissions.includes('ACCESS_ADDRESS')) {
                        const address =
                            await window.arweaveWallet.getActiveAddress();
                        set({
                            address,
                            connecting: false,
                            connected: true,
                        });
                    }
                } catch (error) {
                    console.error('Error checking connection:', error);
                }
            },

            connect: async () => {
                try {
                    set({ connecting: true });

                    // Check if ArConnect is installed
                    if (!window.arweaveWallet) {
                        toast.error('Please install ArConnect to continue', {
                            autoClose: 5000,
                        });
                        window.open('https://arconnect.io', '_blank');
                        return;
                    }

                    // Request permissions
                    await window.arweaveWallet.connect([
                        'ACCESS_ADDRESS',
                        'SIGN_TRANSACTION',
                        'DISPATCH',
                    ]);

                    const address =
                        await window.arweaveWallet.getActiveAddress();

                    set({
                        address,
                        connecting: false,
                        connected: true,
                    });

                    // Scroll to staking dashboard after successful connection
                    get().scrollToStakingDashboard();

                    toast.success('Successfully connected to Arweave wallet', {
                        autoClose: 3000,
                    });
                } catch (error) {
                    console.error('Error connecting wallet:', error);
                    toast.error('Failed to connect to Arweave wallet', {
                        autoClose: 5000,
                    });
                } finally {
                    set({ connecting: false });
                }
            },

            disconnect: async () => {
                try {
                    await window.arweaveWallet?.disconnect();
                    set({
                        address: null,
                        connecting: false,
                        connected: false,
                    });

                    toast.info(
                        'Successfully disconnected from Arweave wallet',
                        {
                            autoClose: 3000,
                        }
                    );
                } catch (error) {
                    console.error('Error disconnecting wallet:', error);
                    toast.error('Failed to disconnect from Arweave wallet', {
                        autoClose: 5000,
                    });
                }
            },
        }),
        { name: 'arweave-wallet-store' }
    )
);

// Hook to initialize wallet event listeners
export const useArweaveWalletInit = () => {
    const checkConnection = useArweaveWalletStore(
        (state) => state.checkConnection
    );

    useEffect(() => {
        checkConnection();

        // Listen for wallet events
        window.addEventListener('arweaveWalletLoaded', checkConnection);
        window.addEventListener('walletSwitch', checkConnection);

        return () => {
            window.removeEventListener('arweaveWalletLoaded', checkConnection);
            window.removeEventListener('walletSwitch', checkConnection);
        };
    }, [checkConnection]);
};
