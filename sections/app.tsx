import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    useArweaveWalletStore,
    useArweaveWalletInit,
} from '@/hooks/use-wallet';
import { ArweaveWalletButton } from '@/components/ArweaveWalletButton';
import { motion } from 'framer-motion';
import { ChevronRight, Shield } from 'lucide-react';

const App = () => {
    // Initialize wallet event listeners
    useArweaveWalletInit();

    // Get wallet state
    const { address, connected } = useArweaveWalletStore();

    return (
        <section
            id="app"
            className="py-24 bg-gradient-to-b from-white to-gray-50"
        >
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4">
                        <span className="relative">
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                                Single-Sided Staking
                            </span>
                            <motion.span
                                className="absolute inset-x-0 bottom-0 h-3 bg-accent/10 -rotate-1"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            />
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Provide liquidity with just one token and get protection
                        against impermanent loss
                    </p>
                </motion.div>

                {!connected ? (
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
                                    Connect your Arweave wallet to start staking
                                    and earning rewards with impermanent loss
                                    protection.
                                </p>

                                <div className="flex justify-center pt-4">
                                    <ArweaveWalletButton />
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-center gap-2 text-gray-500">
                                        <Shield className="w-5 h-5 text-primary" />
                                        <span>
                                            Your assets are secure and under
                                            your control
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Card className="border-2 border-primary/10 shadow-lg">
                            <CardHeader className="border-b border-gray-100">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                                        Your Staking Dashboard
                                    </CardTitle>
                                    <ArweaveWalletButton />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-primary/5 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">
                                            Connected Address
                                        </div>
                                        <div className="font-medium text-gray-700 truncate">
                                            {address}
                                        </div>
                                    </div>
                                    <div className="bg-primary/5 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">
                                            IL Protection Status
                                        </div>
                                        <div className="font-medium text-primary">
                                            Active - 50% Coverage Max
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="text-lg font-semibold">
                                        Your Staking Positions
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-lg text-center border border-dashed border-gray-300">
                                        <p className="text-gray-500">
                                            You don&apos;t have any active
                                            staking positions
                                        </p>
                                        <Button className="mt-4 bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300">
                                            <span className="flex items-center">
                                                Start Staking
                                                <ChevronRight className="ml-2" />
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default App;
