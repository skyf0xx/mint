import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronRight, InfinityIcon, BarChart3, Users } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface BenefitCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    index: number;
}

const BenefitCard = ({
    icon: Icon,
    title,
    description,
    index,
}: BenefitCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
    >
        <Card className="group hover:shadow-lg transition-all duration-500 overflow-hidden">
            <CardHeader className="relative overflow-hidden pb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-start">
                    <div className="p-3 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500 mb-4">
                        <Icon className="w-8 h-8 text-primary transition-all duration-500 group-hover:scale-110 group-hover:text-primary-600" />
                    </div>
                    <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 leading-relaxed mb-6">
                    {description}
                </p>
                <Button
                    variant="ghost"
                    className="group/button relative overflow-hidden hover:text-primary transition-colors"
                >
                    <span className="relative z-10 flex items-center">
                        Learn more
                        <ChevronRight className="ml-2 transition-transform duration-300 group-hover/button:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
                </Button>
            </CardContent>
        </Card>
    </motion.div>
);

const Benefits = () => {
    return (
        <section
            id="benefits"
            className="relative bg-gradient-to-b from-gray-50/80 to-white py-24 overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-gray-900/5 mask-gradient-to-b" />

            <div className="container mx-auto px-4 relative">
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                        Core Benefits
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Discover how MINT token creates lasting value through
                        innovative tokenomics and sustainable rewards.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <BenefitCard
                        icon={InfinityIcon}
                        title="Perpetual NAB Generation"
                        description="Lock your MINT tokens once and receive NAB rewards forever. No complicated farming strategies needed."
                        index={0}
                    />
                    <BenefitCard
                        icon={BarChart3}
                        title="Deflationary By Design"
                        description="Watch your stake grow stronger as MINT's supply decreases through our guaranteed weekly burn rate."
                        index={1}
                    />
                    <BenefitCard
                        icon={Users}
                        title="Governance Rights"
                        description="Shape the future of the NAB ecosystem with growing influence as supply decreases."
                        index={2}
                    />
                </div>
            </div>
        </section>
    );
};

export default Benefits;
