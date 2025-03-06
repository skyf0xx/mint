import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import BenefitCard from './benefits/BenefitCard';
import ComparisonContent from './benefits/ComparisonContent';
import ImpermanentLossEducation from './benefits/ImpermanentLossEducation';
import benefitsData from './benefits/benefitsData';

const Benefits = () => {
    const [activeTab, setActiveTab] = useState('benefits');

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
                    className="max-w-3xl mx-auto text-center mb-10"
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

                {/* Tab navigation */}
                <div className="max-w-6xl mx-auto mb-10">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-3 h-12 bg-primary/5 rounded-lg">
                            <TabsTrigger
                                value="benefits"
                                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
                            >
                                Core Benefits
                            </TabsTrigger>
                            <TabsTrigger
                                value="comparison"
                                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
                            >
                                LP Comparison
                            </TabsTrigger>
                            <TabsTrigger
                                value="education"
                                className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
                            >
                                IL Education
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="benefits">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                {benefitsData.map((benefit) => (
                                    <BenefitCard
                                        key={benefit.index}
                                        icon={benefit.icon}
                                        title={benefit.title}
                                        description={benefit.description}
                                        content={benefit.content}
                                        index={benefit.index}
                                        isHighlighted={benefit.isHighlighted}
                                    />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="comparison">
                            <ComparisonContent />
                        </TabsContent>

                        <TabsContent value="education">
                            <ImpermanentLossEducation />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    );
};

export default Benefits;
