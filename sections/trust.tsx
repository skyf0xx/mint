import { Card, CardContent } from '@/components/ui/card';
import { Cpu, LucideIcon, Shield, Users } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface TrustCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    index: number;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const FloatingDecoration = ({ className }: { className?: string }) => (
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

const TrustCard = ({ icon: Icon, title, description }: TrustCardProps) => {
    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            viewport={{ once: true }}
            className="relative h-full" // Add h-full to ensure full height
        >
            <Card className="group relative h-full overflow-hidden hover:shadow-xl transition-all duration-500">
                {/* Gradient border effect */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{ padding: '1px' }}
                >
                    <div className="absolute inset-0 bg-white" />
                </div>

                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>

                <CardContent className="relative p-8 h-full flex flex-col">
                    <div className="flex flex-col items-center text-center space-y-4 h-full">
                        {/* Icon container */}
                        <motion.div
                            className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent"
                            whileHover={{ scale: 1.1 }}
                            initial={{ rotateY: 0 }}
                            whileInView={{
                                rotateY: 360,
                                transition: {
                                    duration: 1.5,
                                    ease: 'easeOut',
                                },
                            }}
                            viewport={{ once: true }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl animate-pulse" />

                            <div className="relative">
                                <div className="absolute inset-0 blur-sm bg-primary/20 rounded-full" />
                                <Icon className="w-10 h-10 text-primary relative z-10 transform transition-transform group-hover:scale-110" />
                            </div>
                        </motion.div>

                        {/* Title and description container */}
                        <div className="flex flex-col flex-1 justify-between">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600 transition-colors duration-300">
                                {title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed text-lg mt-4">
                                {description}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

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
        <section id="trust" className="relative py-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[120px] opacity-30" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] opacity-20" />
            </div>

            {/* Floating decorations */}
            <FloatingDecoration className="top-20 left-[10%]" />
            <FloatingDecoration className="bottom-40 right-[15%]" />
            <FloatingDecoration className="top-60 right-[20%]" />

            <div className="container mx-auto px-4 relative">
                {/* Section header */}
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
                                Built on Trust
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
                        Backed by proven technology and supported by a robust
                        ecosystem
                    </p>
                </motion.div>

                {/* Cards grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {trustItems.map((item, index) => (
                        <TrustCard key={index} {...item} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Trust;
