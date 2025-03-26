import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const MaintenanceMessage = ({}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className=" mx-auto border-2 border-primary/10 shadow-lg overflow-hidden">
                <div className="bg-amber-50 p-4 flex items-center border-b border-amber-100">
                    <AlertTriangle className="h-6 w-6 text-amber-500 mr-3" />
                    <h3 className="text-lg font-medium text-amber-800">
                        Staking Temporarily Unavailable
                    </h3>
                </div>
                <CardContent className="pt-6 pb-8">
                    <div className="space-y-4">
                        <div className="bg-amber-50/50 p-4 rounded-lg">
                            <p className="text-amber-800">
                                We&apos;re currently performing maintenance on
                                our staking platform. Your funds are secure, and
                                all existing positions remain active. The
                                dashboard will be back online shortly.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-800">
                                What this means:
                            </h4>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2"></span>
                                    <span>
                                        All existing positions continue to earn
                                        rewards
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2"></span>
                                    <span>
                                        Impermanent loss protection continues to
                                        vest
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2"></span>
                                    <span>
                                        Creating new positions and unstaking are
                                        temporarily disabled
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-2">
                            <p className="text-gray-600 mb-4">
                                For the latest updates on maintenance status,
                                follow us on social media:
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        className="bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all duration-300"
                                        onClick={() =>
                                            window.open(
                                                'https://discord.com/invite/RSXg24mCrJ',
                                                '_blank'
                                            )
                                        }
                                    >
                                        <svg
                                            className="h-4 w-4 mr-2"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                        </svg>
                                        Discord
                                    </Button>

                                    <Button
                                        className="bg-[#1DA1F2] hover:bg-[#0d8bd4] text-white transition-all duration-300"
                                        onClick={() =>
                                            window.open(
                                                'https://x.com/Mithril_Labs',
                                                '_blank'
                                            )
                                        }
                                    >
                                        <svg
                                            className="h-4 w-4 mr-2"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                        Twitter
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default MaintenanceMessage;
