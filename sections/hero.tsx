import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { scrollToSection } from '@/lib/helpers';
import { ChevronRight, ArrowDown } from 'lucide-react';
import { InfinityLogo } from './logo';
import { motion } from 'framer-motion';

interface MetricProps {
    title: string;
    value: string;
    subtitle: string;
    delay?: number;
    featured?: boolean;
}

const MetricCard = ({
    title,
    value,
    subtitle,
    delay = 0,
    featured = false,
}: MetricProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <Card
            className={`group transition-all duration-500 hover:shadow-lg ${
                featured ? 'border-2 border-primary/20 bg-primary/5' : ''
            }`}
        >
            <CardContent className="p-6">
                <dl className="space-y-2">
                    <dt
                        className={`text-sm font-medium ${
                            featured ? 'text-primary-600' : 'text-gray-600'
                        }`}
                    >
                        {title}
                    </dt>
                    <dd
                        className={`text-3xl font-bold tracking-tight ${
                            featured
                                ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600'
                                : 'text-gray-900'
                        }`}
                    >
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
            className="relative min-h-[90vh] flex flex-col justify-center"
        >
            {/* Enhanced gradient background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-white to-transparent" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] opacity-30" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[80px] opacity-20" />
            </div>

            <div className="container mx-auto px-4 pt-32 pb-24 relative">
                <div className="max-w-4xl mx-auto">
                    {/* Primary Content */}
                    <motion.div
                        className="text-center space-y-6 mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Token Name */}
                        <motion.h2
                            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            MINT
                        </motion.h2>

                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <InfinityLogo />
                        </motion.div>

                        {/* Main Value Proposition */}
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                                Stake Once,{' '}
                                <span className="relative inline-block">
                                    <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-accent">
                                        Earn Forever
                                    </span>
                                    <span className="absolute inset-x-0 bottom-2 h-3 bg-accent/10 -rotate-1" />
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                Transform your crypto strategy with MINT — the
                                deflationary token that rewards you with NAB
                                tokens for life.
                            </p>
                        </div>

                        {/* Primary CTAs */}
                        <motion.div
                            className="flex flex-col sm:flex-row justify-center gap-4 pt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Button
                                size="lg"
                                className="text-lg px-8 py-6 group relative overflow-hidden bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-500"
                            >
                                <span className="relative z-10 flex items-center">
                                    Start Staking Now
                                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg px-8 py-6 group border-2"
                                onClick={() => scrollToSection('benefits')}
                            >
                                Learn More
                                <ArrowDown className="ml-2 group-hover:translate-y-1 transition-transform" />
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Enhanced Metrics Display */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
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
                            featured={true}
                        />
                        <MetricCard
                            title="Weekly Burn Rate"
                            value="0.25%"
                            subtitle="of unstaked supply"
                            delay={0.7}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
