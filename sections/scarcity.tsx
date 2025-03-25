import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Minus, Timer } from 'lucide-react';

// Reusable floating decoration component
const FloatingDecoration = ({ className }: { className?: string }) => (
    <motion.div
        className={`absolute w-16 h-16 rounded-2xl border-2 border-violet-500/15 ${className}`}
        animate={{
            y: [0, -20, 0],
            rotate: [0, 45, 0],
            scale: [1, 1.1, 1],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
        }}
    />
);

const ScarcityMechanics = () => {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* Enhanced background elements with violet tones */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-violet-50/30 to-white"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-gradient-to-br from-primary/5 via-violet-500/10 to-transparent rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tr from-violet-500/10 to-accent/5 rounded-full blur-[100px] opacity-20"></div>
            </div>

            {/* Add floating decorations */}
            <FloatingDecoration className="top-20 left-[5%] opacity-60" />
            <FloatingDecoration className="top-40 right-[10%] w-20 h-20 opacity-40" />
            <FloatingDecoration className="bottom-32 left-[15%] w-24 h-24 opacity-50" />
            <FloatingDecoration className="bottom-48 right-[8%] w-12 h-12 opacity-70" />

            {/* Add accent squares */}
            <motion.div
                className="absolute top-1/4 right-[22%] w-8 h-8 rounded-lg border-2 border-violet-500/20"
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, -45, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute bottom-1/3 left-[18%] w-10 h-10 rounded-lg border-2 border-violet-500/20"
                animate={{
                    y: [0, 15, 0],
                    rotate: [0, 45, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <div className="container mx-auto px-4 relative">
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-5xl font-bold mb-6">
                        <span className="relative">
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-600 to-primary-700">
                                Ultra Rare
                            </span>
                            <motion.span
                                className="absolute inset-x-0 bottom-0 h-3 bg-violet-500/10 -rotate-1"
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

                <motion.div
                    className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                        {/* Card gradient hover effect with violet tones */}
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-violet-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500"
                            style={{ padding: '1px' }}
                        >
                            <div className="absolute inset-0 bg-white" />
                        </div>

                        <CardContent className="p-8 relative">
                            <div className="space-y-6">
                                <motion.div
                                    className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent w-fit"
                                    whileHover={{ scale: 1.05 }}
                                    initial={{ rotateY: 0 }}
                                    whileInView={{
                                        rotateY: 360,
                                        transition: {
                                            duration: 1.5,
                                            ease: 'easeOut',
                                        },
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <Timer className="w-10 h-10 text-violet-600" />
                                </motion.div>

                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
                                    Weekly Burns
                                </h3>

                                <div className="space-y-4 text-gray-600">
                                    <p className="leading-relaxed">
                                        Every week, 0.25% of unstaked MINT
                                        tokens are automatically burned,
                                        permanently reducing the total supply.
                                    </p>
                                    <ul className="space-y-2">
                                        <motion.li
                                            className="flex items-center gap-2"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Minus className="w-5 h-5 text-violet-500/60" />
                                            <span>
                                                Mathematically guaranteed
                                                reduction
                                            </span>
                                        </motion.li>
                                        <motion.li
                                            className="flex items-center gap-2"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Minus className="w-5 h-5 text-violet-500/60" />
                                            <span>
                                                Cannot exceed 77M total supply
                                            </span>
                                        </motion.li>
                                        <motion.li
                                            className="flex items-center gap-2"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Minus className="w-5 h-5 text-violet-500/60" />
                                            <span>
                                                Supply floor of 21M tokens
                                            </span>
                                        </motion.li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                        {/* Card gradient hover effect with violet tones */}
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-violet-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500"
                            style={{ padding: '1px' }}
                        >
                            <div className="absolute inset-0 bg-white" />
                        </div>

                        <CardContent className="p-8 relative">
                            <div className="space-y-6">
                                <motion.div
                                    className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent w-fit"
                                    whileHover={{ scale: 1.05 }}
                                    initial={{ rotateY: 0 }}
                                    whileInView={{
                                        rotateY: 360,
                                        transition: {
                                            duration: 1.5,
                                            ease: 'easeOut',
                                        },
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <Lock className="w-10 h-10 text-violet-600" />
                                </motion.div>

                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
                                    Permanent Staking
                                </h3>

                                <div className="space-y-4 text-gray-600">
                                    <p className="leading-relaxed">
                                        Staked MINT tokens are permanently
                                        locked, removing them from circulation
                                        while generating perpetual NAB rewards.
                                    </p>
                                    <ul className="space-y-2">
                                        <motion.li
                                            className="flex items-center gap-2"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Minus className="w-5 h-5 text-violet-500/60" />
                                            <span>
                                                Tokens never re-enter
                                                circulation
                                            </span>
                                        </motion.li>
                                        <motion.li
                                            className="flex items-center gap-2"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Minus className="w-5 h-5 text-violet-500/60" />
                                            <span>
                                                Protected from weekly burns
                                            </span>
                                        </motion.li>
                                        <motion.li
                                            className="flex items-center gap-2"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Minus className="w-5 h-5 text-violet-500/60" />
                                            <span>
                                                Continuous NAB generation
                                            </span>
                                        </motion.li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    className="mt-12 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="border-2 border-violet-500/10 hover:shadow-xl transition-all duration-500">
                        <CardContent className="p-8">
                            <h4 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
                                Double Scarcity Effect
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
                </motion.div>
            </div>
        </section>
    );
};

export default ScarcityMechanics;
