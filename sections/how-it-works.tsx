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
} from 'lucide-react';

interface FloatingDecorationProps {
    className?: string;
}

interface StepProps {
    icon: LucideIcon;
    title: string;
    description: string;
    delay: number;
}

const FloatingDecoration: React.FC<FloatingDecorationProps> = ({
    className,
}) => (
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

const Step: React.FC<StepProps> = ({
    icon: Icon,
    title,
    description,
    delay,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="flex items-start gap-4"
    >
        <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    </motion.div>
);

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="relative py-24 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[120px] opacity-30" />

            {/* Floating decorations */}
            <FloatingDecoration className="top-20 left-[10%]" />
            <FloatingDecoration className="bottom-40 right-[15%]" />

            <div className="container mx-auto px-4 relative">
                {/* Section header */}
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                        How Single-Sided Staking Works
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Providing liquidity with just one token, simplified
                    </p>
                </motion.div>

                {/* Process explanation */}
                <Card className="max-w-4xl mx-auto border-2 border-primary/10">
                    <CardContent className="p-8">
                        <div className="space-y-10">
                            <Step
                                icon={Wallet}
                                title="You provide your token"
                                description="Select and deposit any supported token (qAR, wAR, NAB, AO, USDC). You only need to provide one side of the pair."
                                delay={0.1}
                            />

                            <motion.div
                                className="flex justify-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                <ArrowDownUp className="w-8 h-8 text-primary/50" />
                            </motion.div>

                            <Step
                                icon={Coins}
                                title="We combine it with MINT"
                                description="The protocol automatically matches your deposit with the required amount of MINT tokens from our reserves."
                                delay={0.3}
                            />

                            <motion.div
                                className="flex justify-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                            >
                                <ArrowDownUp className="w-8 h-8 text-primary/50" />
                            </motion.div>

                            <Step
                                icon={Workflow}
                                title="LP is created and staked automatically"
                                description="A complete LP position is created on Botega and staked on our platform without any additional steps required from you."
                                delay={0.5}
                            />

                            <motion.div
                                className="flex justify-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                            >
                                <ArrowDownUp className="w-8 h-8 text-primary/50" />
                            </motion.div>

                            <Step
                                icon={Shield}
                                title="Unstake with benefits"
                                description="When you unstake, you receive your original tokens back plus any profits earned and IL compensation. We keep the MINT tokens from our side."
                                delay={0.7}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Addition benefit callout */}
                <motion.div
                    className="max-w-xl mx-auto mt-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                >
                    <p className="text-gray-600 italic">
                        While your position is active, you&apos;re earning
                        trading fees from the Botega pool and building up to 50%
                        protection against impermanent loss.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
