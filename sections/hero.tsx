import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { scrollToSection } from '@/lib/helpers';
import { ChevronRight, ArrowDown } from 'lucide-react';
import { InfinityLogo } from './logo';

interface MetricCardProps {
    title: string;
    value: string;
    subtitle: string;
    className?: string;
}

const MetricCard = ({
    title,
    value,
    subtitle,
    className = '',
}: MetricCardProps) => (
    <Card
        className={`transition-all duration-300 hover:shadow-lg ${className}`}
    >
        <CardContent className="p-6">
            <dl className="space-y-1">
                <dt className="text-sm text-gray-600">{title}</dt>
                <dd className="text-3xl font-bold tracking-tight">{value}</dd>
                <dd className="text-sm text-gray-500">{subtitle}</dd>
            </dl>
        </CardContent>
    </Card>
);

const Hero = () => {
    return (
        <section
            id="hero"
            className="container mx-auto px-4 py-24 flex flex-col items-center text-center space-y-8"
        >
            <div className="space-y-4 max-w-3xl">
                <p className="text-primary font-medium">
                    Introducing MINT Token
                </p>
                <InfinityLogo />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Stake Once,{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                        Earn Forever
                    </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Transform your crypto strategy with MINT — the deflationary
                    token that rewards you with NAB tokens for life.
                </p>
            </div>

            {/* Metrics Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
                <MetricCard
                    title="Current Supply"
                    value="37.5M"
                    subtitle="MINT Tokens"
                />
                <MetricCard
                    title="Target Floor"
                    value="21M"
                    subtitle="MINT Tokens"
                />
                <MetricCard
                    title="Weekly Burn Rate"
                    value="0.25%"
                    subtitle="of unstaked supply"
                />
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <Button size="lg" className="text-lg px-8 group">
                    Start Staking
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 group"
                    onClick={() => scrollToSection('benefits')}
                >
                    Learn More
                    <ArrowDown className="ml-2 group-hover:translate-y-1 transition-transform" />
                </Button>
            </div>
        </section>
    );
};

export default Hero;
