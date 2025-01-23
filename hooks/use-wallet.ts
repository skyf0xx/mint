// hooks/useWallet.ts
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useWallet = () => {
    const [address, setAddress] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);

    const connect = useCallback(async () => {
        try {
            setConnecting(true);

            if (!window.arweaveWallet) {
                toast({
                    title: 'ArConnect Not Found',
                    description: 'Please install ArConnect to continue',
                    variant: 'destructive',
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
            toast({
                title: 'Connection Failed',
                description: 'Failed to connect to ArConnect',
                variant: 'destructive',
            });
            return null;
        } finally {
            setConnecting(false);
        }
    }, []);

    return { address, connecting, connect };
};
