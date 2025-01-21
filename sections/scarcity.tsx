import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Minus, Timer } from 'lucide-react';

const ScarcityMechanics = () => {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-30" />

            <div className="container mx-auto px-4 relative">
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="relative">
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                                Double Scarcity Effect
                            </span>
                            <motion.span
                                className="absolute inset-x-0 bottom-0 h-3 bg-accent/10 -rotate-1"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        MINT&apos;s unique tokenomics create perpetual scarcity
                        through two simultaneous mechanisms
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <Card className="group hover:shadow-xl transition-all duration-500">
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                <motion.div
                                    className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent w-fit"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Timer className="w-10 h-10 text-primary" />
                                </motion.div>

                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                                    Weekly Burns
                                </h3>

                                <div className="space-y-4 text-gray-600">
                                    <p className="leading-relaxed">
                                        Every week, 0.25% of unstaked MINT
                                        tokens are automatically burned,
                                        permanently reducing the total supply.
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <Minus className="w-5 h-5 text-primary/60" />
                                            <span>
                                                Mathematically guaranteed
                                                reduction
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Minus className="w-5 h-5 text-primary/60" />
                                            <span>
                                                Cannot exceed 37.5M total supply
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Minus className="w-5 h-5 text-primary/60" />
                                            <span>
                                                Supply floor of 21M tokens
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-500">
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                <motion.div
                                    className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent w-fit"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Lock className="w-10 h-10 text-primary" />
                                </motion.div>

                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                                    Permanent Staking
                                </h3>

                                <div className="space-y-4 text-gray-600">
                                    <p className="leading-relaxed">
                                        Staked MINT tokens are permanently
                                        locked, removing them from circulation
                                        while generating perpetual NAB rewards.
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <Minus className="w-5 h-5 text-primary/60" />
                                            <span>
                                                Tokens never re-enter
                                                circulation
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Minus className="w-5 h-5 text-primary/60" />
                                            <span>
                                                Protected from weekly burns
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Minus className="w-5 h-5 text-primary/60" />
                                            <span>
                                                Continuous NAB generation
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-12 max-w-3xl mx-auto">
                    <Card className="border-2 border-primary/10">
                        <CardContent className="p-8">
                            <h4 className="text-xl font-semibold mb-4 text-primary">
                                Ultra Rare
                            </h4>
                            <p className="text-gray-600 leading-relaxed">
                                As more tokens are permanently staked for NAB
                                generation, fewer tokens remain in circulation.
                                These remaining tokens are then subject to
                                weekly burns, creating a compounding scarcity
                                effect that mathematically guarantees decreasing
                                supply over time.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default ScarcityMechanics;
