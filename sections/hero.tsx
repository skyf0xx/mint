import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { scrollToSection } from '@/lib/helpers';
import { ChevronRight, ArrowDown } from 'lucide-react';
import { InfinityLogo } from './logo';
import { motion } from 'framer-motion';

interface MetricCardProps {
    title: string;
    value: string;
    subtitle: string;
    delay?: number;
    className?: string;
}

const MetricCard = ({
    title,
    value,
    subtitle,
    delay = 0,
    className = '',
}: MetricCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <Card
            className={`group transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 ${className}`}
        >
            <CardContent className="p-6">
                <dl className="space-y-1">
                    <dt className="text-sm text-gray-600 font-medium">
                        {title}
                    </dt>
                    <dd className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                        {value}
                    </dd>
                    <dd className="text-sm text-gray-500">{subtitle}</dd>
                </dl>
            </CardContent>
        </Card>
    </motion.div>
);

const Hero = () => {
    return (
        <section
            id="hero"
            className="relative container mx-auto px-4 pt-32 pb-24 flex flex-col items-center text-center space-y-12 overflow-hidden"
        >
            {/* Background gradient effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full h-48 bg-primary/10 blur-3xl opacity-30 rounded-full" />

            <motion.div
                className="space-y-6 max-w-3xl relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.p
                    className="text-primary font-medium tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Introducing MINT Token
                </motion.p>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <InfinityLogo />
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                    Stake Once,{' '}
                    <span className="relative">
                        <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-accent">
                            Earn Forever
                        </span>
                        <span className="absolute inset-x-0 bottom-0 h-3 bg-accent/10 -rotate-1" />
                    </span>
                </h1>

                <motion.p
                    className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Transform your crypto strategy with MINT — the deflationary
                    token that rewards you with NAB tokens for life.
                </motion.p>
            </motion.div>

            {/* Metrics Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
                <MetricCard
                    title="Current Supply"
                    value="37.5M"
                    subtitle="MINT Tokens"
                    delay={0.5}
                />
                <MetricCard
                    title="Target Floor"
                    value="21M"
                    subtitle="MINT Tokens"
                    delay={0.6}
                />
                <MetricCard
                    title="Weekly Burn Rate"
                    value="0.25%"
                    subtitle="of unstaked supply"
                    delay={0.7}
                />
            </div>

            {/* Hero CTAs */}
            <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <Button
                    size="lg"
                    className="text-lg px-8 group relative overflow-hidden bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary transition-all duration-500"
                >
                    <span className="relative z-10 flex items-center">
                        Start Staking
                        <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 group border-2 hover:border-primary/50 transition-colors duration-300"
                    onClick={() => scrollToSection('benefits')}
                >
                    Learn More
                    <ArrowDown className="ml-2 group-hover:translate-y-1 transition-transform" />
                </Button>
            </motion.div>
        </section>
    );
};

export default Hero;
