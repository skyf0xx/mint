import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronRight, InfinityIcon, BarChart3, Users } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

const BenefitCard = ({ icon: Icon, title, description }: BenefitCardProps) => (
    <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon className="w-10 h-10 mb-4 text-primary transition-transform group-hover:scale-110" />
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-gray-600">{description}</p>
            <Button
                variant="ghost"
                className="mt-4 transition-transform group-hover:translate-x-2"
            >
                Learn more <ChevronRight className="ml-2" />
            </Button>
        </CardContent>
    </Card>
);
const Benefits = () => {
    return (
        <section id="benefits" className="bg-gray-50/50 py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Core Benefits</h2>
                    <p className="text-gray-600">
                        Discover how MINT token creates lasting value through
                        innovative tokenomics.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <BenefitCard
                        icon={InfinityIcon}
                        title="Perpetual NAB Generation"
                        description="Lock your MINT tokens once and receive NAB rewards forever. No complicated farming strategies needed."
                    />
                    <BenefitCard
                        icon={BarChart3}
                        title="Deflationary By Design"
                        description="Watch your stake grow stronger as MINT's supply decreases through our guaranteed weekly burn rate."
                    />
                    <BenefitCard
                        icon={Users}
                        title="Governance Rights"
                        description="Shape the future of the NAB ecosystem with growing influence as supply decreases."
                    />
                </div>
            </div>
        </section>
    );
};

export default Benefits;
