// components/app/connect-card.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { ArweaveWalletButton } from '@/components/ArweaveWalletButton';

const ConnectCard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg mx-auto text-center"
        >
            <Card className="border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                    <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                        Connect Your Wallet
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                    <p className="text-lg text-gray-600">
                        Connect your Arweave wallet to start staking and earning
                        rewards with impermanent loss protection.
                    </p>

                    <div className="flex justify-center pt-4">
                        <ArweaveWalletButton />
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                            <Shield className="w-5 h-5 text-primary" />
                            <span>
                                Your assets are secure and under your control
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ConnectCard;
