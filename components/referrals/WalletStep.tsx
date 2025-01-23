// components/referral/steps/WalletStep.tsx
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';

interface WalletStepProps {
    onConnect: () => Promise<void>;
    loading: boolean;
}

export const WalletStep = ({ onConnect, loading }: WalletStepProps) => (
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">Connect Your Wallet</h3>
        <p className="text-gray-600 text-center">
            Connect your ArConnect wallet to get started
        </p>
        <Button className="w-full py-6" onClick={onConnect} disabled={loading}>
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
                <Wallet className="w-5 h-5 mr-2" />
            )}
            Connect Wallet
        </Button>
    </div>
);
