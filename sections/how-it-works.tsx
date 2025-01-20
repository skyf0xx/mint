import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <section id="how-it-works" className="relative py-24">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative">
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-600">
                        Choose your preferred staking strategy and start earning
                        NAB rewards
                    </p>
                </motion.div>

                <Tabs defaultValue="direct" className="max-w-4xl mx-auto">
                    <TabsList className="w-full grid grid-cols-2 h-16 p-1 mb-8 bg-gray-100/50 backdrop-blur-sm rounded-2xl">
                        <TabsTrigger
                            value="direct"
                            className="h-full rounded-xl flex items-center justify-center gap-3 text-base font-medium transition-all duration-300
                                     data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-600 
                                     data-[state=active]:text-white data-[state=active]:shadow-lg"
                        >
                            <Lock className="w-5 h-5" />
                            Direct Staking
                        </TabsTrigger>
                        <TabsTrigger
                            value="lp"
                            className="h-full rounded-xl flex items-center justify-center gap-3 text-base font-medium transition-all duration-300
                                     data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-600 
                                     data-[state=active]:text-white data-[state=active]:shadow-lg"
                        >
                            <BarChart3 className="w-5 h-5" />
                            LP Staking
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="direct">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <Card className="border-2 border-primary/10 overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="space-y-8">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                                                <Lock className="w-8 h-8 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                                                    Direct MINT Staking
                                                </h3>
                                                <p className="text-gray-600">
                                                    Maximum rewards through
                                                    permanent token lock-up
                                                </p>
                                            </div>
                                        </div>
                                        <ul className="space-y-4">
                                            {[
                                                'Permanent lock-up for maximum rewards',
                                                'Highest NAB generation rate',
                                                'Complete protection from weekly burns',
                                                'Full governance rights',
                                            ].map((item, index) => (
                                                <motion.li
                                                    key={index}
                                                    variants={itemVariants}
                                                    className="flex items-center gap-4 group"
                                                >
                                                    <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
                                                        <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                                                    </div>
                                                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                                                        {item}
                                                    </span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="lp">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <Card className="border-2 border-primary/10 overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="space-y-8">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                                                <BarChart3 className="w-8 h-8 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                                                    LP Staking (MINT/NAB)
                                                </h3>
                                                <p className="text-gray-600">
                                                    Flexible staking with
                                                    additional liquidity
                                                    benefits
                                                </p>
                                            </div>
                                        </div>
                                        <ul className="space-y-4">
                                            {[
                                                'Flexible staking with withdrawal options',
                                                'Competitive reward rates',
                                                'Market liquidity benefits',
                                                'Partial burn protection',
                                            ].map((item, index) => (
                                                <motion.li
                                                    key={index}
                                                    variants={itemVariants}
                                                    className="flex items-center gap-4 group"
                                                >
                                                    <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
                                                        <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                                                    </div>
                                                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                                                        {item}
                                                    </span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default HowItWorks;
