import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import NABReference from './nab-reference';
import FeatureItem from '@/components/ui/feature-item';

// Animation variants for staggered animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

// Floating decoration component
const FloatingDecoration = ({ className }: { className?: string }) => (
    <motion.div
        className={`absolute w-12 h-12 rounded-xl border-2 border-primary/10 ${className}`}
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

const Tokenomics = () => {
    const directStakingFeatures = [
        {
            text: 'Permanent lock-up for maximum rewards',
            tooltip:
                'Once MINT tokens are staked, they cannot be unstaked. This permanent commitment ensures maximum NAB generation rates and complete protection from supply reduction burns. It also acts as a multiplier to your other staked tokens.',
        },
        {
            text: 'Highest NAB generation rate',
            tooltip:
                'Direct staking provides the highest possible NAB token reward rate, significantly higher than LP staking rewards. Your rewards continue indefinitely without degradation.',
        },
        {
            text: 'Complete protection from weekly burns',
            tooltip:
                'Staked MINT tokens are fully exempt from the weekly 0.25% burn mechanism, preserving your position while unstaked tokens decrease in supply.',
        },
        {
            text: 'Full governance rights',
            tooltip:
                'Staked tokens grant proportional voting power in the NAB ecosystem. As supply decreases through burns, your governance influence naturally increases over time.',
        },
        {
            text: 'Earn fees from NAB transactions (soon)',
            tooltip:
                'In an upcoming update, staked MINT holders will receive a portion of fees generated from NAB token transactions, creating an additional revenue stream.',
        },
    ];

    const lpStakingFeatures = [
        {
            text: 'Flexible staking with withdrawal options',
            tooltip:
                'Unlike direct staking, LP staking allows you to withdraw your tokens at any time. This flexibility comes with a lower NAB generation rate compared to direct staking.',
        },
        {
            text: 'Competitive reward rates',
            tooltip:
                'While lower than direct staking, LP staking still provides substantial NAB rewards plus additional earnings from trading fees in the MINT/NAB liquidity pool.',
        },
        {
            text: 'Market liquidity benefits',
            tooltip:
                'By providing liquidity to the MINT/NAB trading pair, you help maintain market stability and earn a share of trading fees generated from all transactions.',
        },
        {
            text: 'Earn from LP while earning NAB',
            tooltip:
                'Dual earning mechanism: receive NAB rewards from staking while simultaneously earning trading fees from your liquidity provision.',
        },
        {
            text: 'Earn fees from NAB transactions (soon)',
            tooltip:
                'Future update will allow LP stakers to earn a portion of NAB transaction fees, adding a third revenue stream to LP staking rewards.',
        },
    ];

    return (
        <section className="relative py-32 overflow-hidden">
            {/* Enhanced background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[120px] opacity-30" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] opacity-20" />

            {/* Floating decorative elements */}
            <FloatingDecoration className="top-20 left-[10%]" />
            <FloatingDecoration className="bottom-40 right-[15%]" />
            <FloatingDecoration className="top-60 right-[20%]" />

            <div className="container mx-auto px-4 relative">
                {/* Enhanced section header */}
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-5xl font-bold mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                            MINT Tokenomics
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        MINT Holders have a Stake Once - earn forever advantage.
                        Choose your preferred staking strategy and start earning{' '}
                        <NABReference /> rewards
                    </p>
                </motion.div>

                <Tabs defaultValue="direct" className="max-w-4xl mx-auto">
                    {/* Enhanced tab list with animations */}
                    <TabsList className="w-full grid grid-cols-2 h-20 p-1.5 mb-12 bg-gradient-to-r from-gray-100/50 to-gray-50/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
                        <TabsTrigger
                            value="direct"
                            className="h-full rounded-xl flex items-center justify-center gap-3 text-base font-medium transition-all duration-500
                                     data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-600 
                                     data-[state=active]:text-white data-[state=active]:shadow-lg relative group"
                        >
                            <Lock className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            <span className="relative">
                                Direct Staking
                                <motion.div
                                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/20"
                                    initial={false}
                                    animate={{ scaleX: 1, opacity: 1 }}
                                    exit={{ scaleX: 0, opacity: 0 }}
                                />
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="lp"
                            className="h-full rounded-xl flex items-center justify-center gap-3 text-base font-medium transition-all duration-500
                                     data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-600 
                                     data-[state=active]:text-white data-[state=active]:shadow-lg relative group"
                        >
                            <BarChart3 className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            <span className="relative">
                                LP Staking
                                <motion.div
                                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/20"
                                    initial={false}
                                    animate={{ scaleX: 1, opacity: 1 }}
                                    exit={{ scaleX: 0, opacity: 0 }}
                                />
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Enhanced tab content with animations */}
                    <TabsContent value="direct">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <Card className="border-2 border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-500">
                                <CardContent className="p-8">
                                    <div className="space-y-8">
                                        {/* Enhanced header with animations */}
                                        <div className="flex items-start space-x-6">
                                            <motion.div
                                                className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 300,
                                                }}
                                            >
                                                <Lock className="w-10 h-10 text-primary" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                                                    Direct MINT Staking
                                                </h3>
                                                <p className="text-gray-600 text-lg">
                                                    Maximum rewards through
                                                    permanent token lock-up
                                                </p>
                                            </div>
                                        </div>

                                        {/* Enhanced feature list with animations */}
                                        <ul className="space-y-6">
                                            {directStakingFeatures.map(
                                                (feature, index) => (
                                                    <FeatureItem
                                                        key={index}
                                                        text={feature.text}
                                                        tooltip={
                                                            feature.tooltip
                                                        }
                                                        variants={itemVariants}
                                                    />
                                                )
                                            )}
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
                            <Card className="border-2 border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-500">
                                <CardContent className="p-8">
                                    <div className="space-y-8">
                                        {/* Enhanced header with animations */}
                                        <div className="flex items-start space-x-6">
                                            <motion.div
                                                className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 300,
                                                }}
                                            >
                                                <BarChart3 className="w-10 h-10 text-primary" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                                                    LP Staking (MINT/NAB)
                                                </h3>
                                                <p className="text-gray-600 text-lg">
                                                    Flexible staking with
                                                    additional liquidity
                                                    benefits
                                                </p>
                                            </div>
                                        </div>

                                        {/* Enhanced feature list with animations */}
                                        <ul className="space-y-6">
                                            {lpStakingFeatures.map(
                                                (feature, index) => (
                                                    <FeatureItem
                                                        key={index}
                                                        text={feature.text}
                                                        tooltip={
                                                            feature.tooltip
                                                        }
                                                        variants={itemVariants}
                                                    />
                                                )
                                            )}
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

export default Tokenomics;
