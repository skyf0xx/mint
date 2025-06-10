import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
    ArrowDownUp,
    Coins,
    Workflow,
    Shield,
    Wallet,
    LucideIcon,
    TrendingUp,
    Clock,
    BarChart3,
    ArrowUpRight,
    PieChart,
    CheckCircle2,
} from 'lucide-react';

interface FloatingDecorationProps {
    className?: string;
}

interface StepProps {
    icon: LucideIcon;
    title: string;
    description: string;
    delay: number;
    index: number;
    isHighlighted?: boolean;
    benefits?: Array<{ icon: LucideIcon; text: string }>;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const FloatingDecoration: React.FC<FloatingDecorationProps> = ({
    className,
}) => (
    <motion.div
        className={`absolute w-16 h-16 rounded-2xl border-2 border-primary/10 ${className}`}
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

const Step: React.FC<StepProps> = ({
    icon: Icon,
    title,
    description,
    delay,
    index,
    isHighlighted = false,
    benefits,
}) => (
    <motion.div variants={itemVariants} custom={delay} className="relative">
        <div
            className={`flex items-start gap-6 ${
                isHighlighted ? 'relative' : ''
            }`}
        >
            {isHighlighted && (
                <motion.div
                    className="absolute -inset-4 bg-primary/5 rounded-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                />
            )}

            {/* Enhanced icon container with gradient and animation */}
            <motion.div
                className={`p-4 rounded-2xl ${
                    isHighlighted
                        ? 'bg-gradient-to-br from-primary/20 to-primary/5'
                        : 'bg-gradient-to-br from-primary/10 to-transparent'
                } flex-shrink-0 relative z-10`}
                whileHover={{ scale: 1.05 }}
                initial={{ rotateY: 0 }}
                whileInView={{
                    rotateY: 360,
                    transition: {
                        duration: 1.5,
                        ease: 'easeOut',
                        delay: index * 0.2,
                    },
                }}
                viewport={{ once: true }}
            >
                <Icon
                    className={`w-8 h-8 ${
                        isHighlighted ? 'text-primary-600' : 'text-primary'
                    }`}
                />
            </motion.div>

            <div className="relative z-10">
                {/* Enhanced title with gradient text */}
                <h3
                    className={`text-xl font-bold mb-2 ${
                        isHighlighted
                            ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent'
                            : 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600'
                    }`}
                >
                    {title}
                </h3>
                {/* Enhanced description with better typography */}
                <p className="text-gray-600 text-lg leading-relaxed">
                    {description}
                </p>

                {/* Benefits list for highlighted steps */}
                {benefits && benefits.length > 0 && (
                    <motion.ul
                        className="mt-4 space-y-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, staggerChildren: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {benefits.map((benefit, i) => (
                            <motion.li
                                key={i}
                                className="flex items-center gap-2 text-gray-700"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <benefit.icon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                <span>{benefit.text}</span>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </div>
        </div>
    </motion.div>
);

const ArrowConnector = ({ delay }: { delay: number }) => (
    <motion.div
        variants={itemVariants}
        custom={delay}
        className="flex justify-center py-4"
    >
        <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            <ArrowDownUp className="w-8 h-8 text-primary/50" />
        </motion.div>
    </motion.div>
);

const RewardHighlight = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: delay }}
        viewport={{ once: true }}
        className="my-16 max-w-4xl mx-auto"
    >
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

            <h3 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent">
                Double Reward Advantage
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-primary/10"
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                            <BarChart3 className="w-6 h-6 text-primary-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">
                            99% Botega Fees
                        </h4>
                    </div>
                    <p className="text-gray-600">
                        Nearly all trading fees from Botega liquidity pools are
                        passed directly to you instead of the standard 0.3%
                        fee-sharing model.
                    </p>
                    <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2 text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-primary-600" />
                            <span>
                                Higher yield compared to traditional LP
                                positions
                            </span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-primary-600" />
                            <span>
                                Automatic fee collection—no manual claiming
                            </span>
                        </li>
                    </ul>
                </motion.div>

                <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-primary/10"
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-accent/10 flex-shrink-0">
                            <Clock className="w-6 h-6 text-accent" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">
                            5-Minute Rewards
                        </h4>
                    </div>
                    <p className="text-gray-600">
                        Liquidity mining MINT rewards are distributed
                        automatically every 5 minutes, providing continuous
                        passive income.
                    </p>
                    <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2 text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-accent" />
                            <span>
                                Frequent distribution instead of weekly/monthly
                            </span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-accent" />
                            <span>
                                Compounds faster than traditional mining
                                programs
                            </span>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    </motion.div>
);

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="relative py-32 overflow-hidden">
            {/* Enhanced background elements */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[120px] opacity-30" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] opacity-20" />
            </div>

            {/* Add floating decorations */}
            <FloatingDecoration className="top-20 left-[8%] opacity-60" />
            <FloatingDecoration className="top-48 right-[12%] w-20 h-20 opacity-40" />
            <FloatingDecoration className="bottom-40 left-[15%] w-24 h-24 opacity-50" />
            <FloatingDecoration className="top-1/3 right-[18%] w-12 h-12 opacity-70" />

            {/* Add accent squares */}
            <motion.div
                className="absolute top-1/4 right-[25%] w-8 h-8 rounded-lg border-2 border-accent/20"
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
                className="absolute bottom-1/3 left-[20%] w-10 h-10 rounded-lg border-2 border-accent/20"
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
                {/* Enhanced section header with animated underline */}
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-5xl font-bold mb-6">
                        <span className="relative">
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                                How Single-Sided Liquidity Works
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
                        Provide{' '}
                        <span className="font-bold">liquidity on Botega</span>{' '}
                        with just one token and{' '}
                        <span className="relative inline-flex font-semibold">
                            <span className="relative z-10">
                                earn double rewards every 5 minutes
                            </span>
                            <span className="absolute bottom-0 left-0 w-full h-2 bg-primary/20"></span>
                        </span>
                    </p>
                </motion.div>

                {/* Enhanced card with animations */}
                <Card className="max-w-4xl mx-auto border-2 border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-500">
                    <CardContent className="p-8 sm:p-10">
                        <motion.div
                            className="space-y-8"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <Step
                                icon={Wallet}
                                title="You provide your token"
                                description="Select and deposit any supported token (GAME, wAR, NAB, AO, USDC). You only need to provide one side of the pair."
                                delay={0.1}
                                index={0}
                            />

                            <ArrowConnector delay={0.2} />

                            <Step
                                icon={Coins}
                                title="We combine it with MINT"
                                description="The protocol automatically matches your deposit with the required amount of MINT tokens from our reserves."
                                delay={0.3}
                                index={1}
                            />

                            <ArrowConnector delay={0.4} />

                            <Step
                                icon={Workflow}
                                title="LP is created and staked automatically"
                                description="A complete LP position is created on Botega and staked on our platform without any additional steps required from you."
                                delay={0.5}
                                index={2}
                            />

                            <ArrowConnector delay={0.6} />

                            <Step
                                icon={TrendingUp}
                                title="Start earning premium rewards"
                                description="Maximize your earnings with our industry-leading dual reward structure, designed to generate higher returns than traditional liquidity provision."
                                delay={0.7}
                                index={3}
                                isHighlighted={true}
                                benefits={[
                                    {
                                        icon: PieChart,
                                        text: 'Earn 99% of Botega trading fees',
                                    },
                                    {
                                        icon: Clock,
                                        text: 'Receive $MINT liquidity mining rewards every 5 minutes',
                                    },
                                    {
                                        icon: ArrowUpRight,
                                        text: 'No claiming required—all rewards are automatically distributed',
                                    },
                                ]}
                            />

                            <ArrowConnector delay={0.8} />

                            <Step
                                icon={Shield}
                                title="Unstake with protection"
                                description="When you unstake, you receive your original tokens back plus trading fees, mining rewards, and IL compensation. We keep the MINT tokens from our side."
                                delay={0.9}
                                index={4}
                            />
                        </motion.div>
                    </CardContent>
                </Card>

                {/* New rewards highlight section */}
                <RewardHighlight delay={0.6} />

                {/* Enhanced benefit callout with better styling */}
                <motion.div
                    className="max-w-2xl mx-auto mt-12 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="flex items-center justify-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10">
                            <Coins className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-lg text-gray-700">
                            <span className="font-semibold text-primary-600">
                                Triple rewards system:{' '}
                            </span>
                            earn{' '}
                            <span className="font-bold text-primary-600">
                                99% of Botega trading fees
                            </span>
                            , receive{' '}
                            <span className="font-bold text-accent">
                                liquidity mining rewards every 5 minutes
                            </span>
                            , and build up to
                            <span className="font-bold text-primary">
                                {' '}
                                50% protection{' '}
                            </span>
                            against impermanent loss.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
