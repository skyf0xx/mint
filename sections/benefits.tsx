import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronRight, Shield, ArrowRight, TrendingUp } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import LearnMoreDialog from '@/components/ui/learn-more';
import { useRef, useState } from 'react';

interface BenefitCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    index: number;
    content: string[];
}

// Enhanced BenefitCard with new animations and visual improvements
const BenefitCard = ({
    icon: Icon,
    title,
    description,
    index,
    content,
}: BenefitCardProps) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="h-full" // Ensure the motion div takes full height
        >
            <Card className="group relative hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col">
                {/* Animated gradient border */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{ padding: '1px' }}
                >
                    <div className="absolute inset-0 bg-white" />
                </div>

                <CardHeader className="relative overflow-hidden pb-4 flex-shrink-0">
                    {/* Enhanced background effects */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>

                    <div className="relative z-10 flex flex-col items-start">
                        {/* Enlarged icon with animations */}
                        <motion.div
                            className="p-4 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-all duration-500"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Icon className="w-12 h-12 text-primary transition-all duration-500 group-hover:text-primary-600" />
                        </motion.div>

                        {/* Enhanced title with gradient */}
                        <CardTitle className="text-2xl mt-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                            {title}
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="relative flex-grow flex flex-col justify-between">
                    {/* Description with improved typography */}
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                        {description}
                    </p>

                    <LearnMoreDialog
                        isOpen={isDialogOpen}
                        onClose={() => setDialogOpen(false)}
                        title={title}
                        content={content}
                    />

                    {/* Enhanced button with animations */}
                    <div className="mt-auto pt-4">
                        <Button
                            ref={buttonRef}
                            onClick={() => setDialogOpen(true)}
                            variant="ghost"
                            className="group/button relative overflow-hidden hover:text-primary transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center">
                                Learn more
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                    }}
                                >
                                    <ChevronRight className="ml-2" />
                                </motion.div>
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover/button:opacity-100 transition-all duration-300" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const Benefits = () => {
    const benefitsData = [
        {
            icon: ArrowRight,
            title: 'Single-Sided Simplicity',
            description:
                'Provide liquidity on Botega with just one token. MINT automatically creates complete LP positions without requiring paired tokens.',
            content: [
                'No paired tokens required - stake your preferred token directly',
                'Maintain 100% exposure to your asset of choice',
                'MINT provides the other side of the LP position',
                'The LP is created on Botega and staked on MINT automatically',
                'You can withdraw at anytime',
            ],
            index: 0,
        },
        {
            icon: Shield,
            title: 'Impermanent Loss Protection',
            description:
                'Up to 50% protection against impermanent loss that vests linearly over 30 days of staking.',
            content: [
                'Protection vests linearly from 0% to 50% over 30 days',
                'Automatically calculated and applied when you unstake',
                'Coverage follows you through market volatility',
                'Protection paid in MINT tokens up to 50,000 MINT per position',
                'Formula: min(IL × Coverage% × Final Price Ratio, 50,000 MINT)',
            ],
            index: 1,
        },
        {
            icon: TrendingUp,
            title: 'Optimized Returns',
            description:
                'Keep 99% of profits when your token appreciates while still benefiting from reduced impermanent loss when markets fluctuate.',
            content: [
                '99% profit sharing when your token value increases',
                'Coverage keeps you safer from impermanent loss',
            ],
            index: 2,
        },
    ];

    return (
        <section id="benefits" className="relative py-24 overflow-hidden">
            {/* Enhanced background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-2xl opacity-20" />

            <motion.div
                className="absolute top-1/3 right-[22%] w-8 h-8 rounded-lg border-2 border-accent/20"
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

            {/* Floating geometric shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-20 left-20 w-16 h-16 border-2 border-primary/10 rounded-lg"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 45, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-40 right-20 w-20 h-20 border-2 border-accent/10 rounded-full"
                    animate={{
                        y: [0, 20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
            </div>

            <div className="container mx-auto px-4 relative">
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                        Core Benefits
                    </h2>
                    <p className="text-gray-600 text-xl leading-relaxed">
                        Discover how MINT simplifies liquidity provision while
                        protecting your returns.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {benefitsData.map((benefit) => (
                        <BenefitCard
                            key={benefit.index}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            content={benefit.content}
                            index={benefit.index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
