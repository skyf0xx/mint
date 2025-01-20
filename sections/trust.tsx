import { Card, CardContent } from '@/components/ui/card';
import { Cpu, LucideIcon, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrustCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    index: number;
}

const TrustCard = ({
    icon: Icon,
    title,
    description,
    index,
}: TrustCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
    >
        <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-500">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Animated border effect */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ padding: '1px' }}
            >
                <div className="absolute inset-0 bg-white" />
            </div>

            <CardContent className="relative p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon container with gradient background */}
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl animate-pulse" />
                        <Icon className="w-8 h-8 text-primary relative z-10" />
                    </div>

                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                        {title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                        {description}
                    </p>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const Trust = () => {
    const trustItems = [
        {
            icon: Cpu,
            title: 'AO Blockchain',
            description:
                'Built on secure and proven infrastructure, leveraging cutting-edge blockchain technology',
        },
        {
            icon: Shield,
            title: 'Mithril Technology',
            description:
                'Advanced staking and reward mechanics ensuring reliable and sustainable returns',
        },
        {
            icon: Users,
            title: 'NAB Ecosystem',
            description:
                'Seamlessly integrated with established protocols and growing community',
        },
    ];

    return (
        <section id="trust" className="relative py-24 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative">
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                            Built on Trust
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Backed by proven technology and supported by a robust
                        ecosystem
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {trustItems.map((item, index) => (
                        <TrustCard key={index} {...item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Trust;
