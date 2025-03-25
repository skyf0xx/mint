import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import BenefitCard from './benefits/BenefitCard';
import ComparisonContent from './benefits/ComparisonContent';
import ImpermanentLossEducation from './benefits/ImpermanentLossEducation';
import benefitsData from './benefits/benefitsData';

// Helper function to replace missing imports
const useAnimationPreferences = () => {
    return { isAnimationEnabled: true };
};

const Benefits = () => {
    const [activeTab, setActiveTab] = useState('benefits');
    const [previousTab, setPreviousTab] = useState('');
    const [isInView, setIsInView] = useState(false);
    const shouldReduceMotion = useReducedMotion();
    const { isAnimationEnabled } = useAnimationPreferences();

    // Handle tab change with animation direction tracking
    const handleTabChange = (value: string) => {
        setPreviousTab(activeTab);
        setActiveTab(value);
    };

    // Use IntersectionObserver to trigger animations when section comes into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('benefits');
        if (element) observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, []);

    // Determine animation direction based on tab order
    const getAnimationDirection = (tab: string) => {
        if (shouldReduceMotion) {
            return { enter: { opacity: 0 }, exit: { opacity: 0 } };
        }

        const tabOrder = ['benefits', 'comparison', 'education'];

        if (!previousTab)
            return {
                enter: { x: 50, opacity: 0 },
                exit: { x: -50, opacity: 0 },
            };

        const currentIndex = tabOrder.indexOf(tab);
        const previousIndex = tabOrder.indexOf(previousTab);

        if (currentIndex > previousIndex) {
            return {
                enter: { x: 50, opacity: 0 },
                exit: { x: -50, opacity: 0 },
            };
        } else {
            return {
                enter: { x: -50, opacity: 0 },
                exit: { x: 50, opacity: 0 },
            };
        }
    };

    // Transition shared between all tabs
    const tabTransition = {
        duration: shouldReduceMotion ? 0.2 : 0.4,
        ease: 'easeInOut',
    };

    // Header animation variants
    const headerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    // Floating decoration variants
    const floatingDecorationVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: isAnimationEnabled ? 0.7 : 0.5,
            scale: 1,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    const getFloatingAnimation = (duration: number) => {
        if (isAnimationEnabled && !shouldReduceMotion) {
            return {
                y: [0, -20, 0],
                rotate: [0, 45, 0],
                transition: { duration, repeat: Infinity },
            };
        }
        return {};
    };

    return (
        <section id="benefits" className="relative py-24 overflow-hidden">
            {/* Enhanced background elements with animations */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white" />

            <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 0.3 : 0 }}
                transition={{ duration: 1 }}
            />

            <motion.div
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 0.2 : 0 }}
                transition={{ duration: 1, delay: 0.3 }}
            />

            {/* Animated decorative elements */}
            <motion.div
                className="absolute top-1/3 right-[22%] w-8 h-8 rounded-lg border-2 border-accent/20 hidden sm:block"
                variants={floatingDecorationVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                whileInView={
                    isAnimationEnabled && !shouldReduceMotion
                        ? {
                              y: [0, -15, 0],
                              rotate: [0, -45, 0],
                              transition: {
                                  duration: 6,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                              },
                          }
                        : undefined
                }
            />

            {/* Floating geometric shapes with staggered animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-20 w-16 h-16 border-2 border-primary/10 rounded-lg hidden md:block"
                    variants={floatingDecorationVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    whileInView={getFloatingAnimation(8)}
                />

                <motion.div
                    className="absolute bottom-40 right-20 w-20 h-20 border-2 border-accent/10 rounded-full hidden md:block"
                    variants={floatingDecorationVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    whileInView={
                        isAnimationEnabled && !shouldReduceMotion
                            ? {
                                  y: [0, 20, 0],
                                  scale: [1, 1.1, 1],
                                  transition: { duration: 6, repeat: Infinity },
                              }
                            : undefined
                    }
                />

                <motion.div
                    className="absolute top-1/2 left-[15%] w-12 h-12 border border-primary/20 rounded-lg hidden lg:block"
                    variants={floatingDecorationVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    whileInView={
                        isAnimationEnabled && !shouldReduceMotion
                            ? {
                                  x: [0, 15, 0],
                                  y: [0, -10, 0],
                                  rotate: [0, -15, 0],
                                  transition: { duration: 7, repeat: Infinity },
                              }
                            : undefined
                    }
                />
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section header with animations */}
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-10"
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    {/* Enhanced title with gradient */}
                    <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                        Core Benefits
                    </h2>

                    {/* Subtitle with animated underline */}
                    <div className="relative">
                        <p className="text-gray-600 text-xl leading-relaxed">
                            Discover how MINT simplifies liquidity provision
                            while protecting your returns.
                        </p>

                        <motion.div
                            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary/20 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: '100px' }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        />
                    </div>
                </motion.div>

                {/* Tab navigation system with enhanced animations */}
                <div className="max-w-6xl mx-auto mb-10">
                    <Tabs
                        value={activeTab}
                        onValueChange={handleTabChange}
                        className="w-full"
                    >
                        {/* Tab buttons with enhanced hover and active states */}
                        <TabsList className="grid w-full grid-cols-3 h-14 md:h-12 bg-primary/5 rounded-lg">
                            <TabsTrigger
                                value="benefits"
                                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-600 data-[state=active]:text-white relative transition-all duration-300"
                            >
                                <motion.span className="hidden sm:inline-block">
                                    Core
                                </motion.span>{' '}
                                Benefits
                                {activeTab === 'benefits' && (
                                    <motion.div
                                        layoutId="tabHighlight"
                                        className="absolute inset-0 rounded-md z-[-1]"
                                        transition={{
                                            type: 'spring',
                                            bounce: 0.2,
                                            duration: 0.6,
                                        }}
                                    />
                                )}
                            </TabsTrigger>

                            <TabsTrigger
                                value="comparison"
                                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-600 data-[state=active]:text-white relative transition-all duration-300"
                            >
                                LP Comparison
                                {activeTab === 'comparison' && (
                                    <motion.div
                                        layoutId="tabHighlight"
                                        className="absolute inset-0 rounded-md z-[-1]"
                                        transition={{
                                            type: 'spring',
                                            bounce: 0.2,
                                            duration: 0.6,
                                        }}
                                    />
                                )}
                            </TabsTrigger>

                            <TabsTrigger
                                value="education"
                                className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-600 data-[state=active]:text-white relative transition-all duration-300"
                            >
                                <motion.span className="hidden sm:inline-block">
                                    What is
                                </motion.span>{' '}
                                Impermanent Loss
                                {activeTab === 'education' && (
                                    <motion.div
                                        layoutId="tabHighlight"
                                        className="absolute inset-0 rounded-md z-[-1]"
                                        transition={{
                                            type: 'spring',
                                            bounce: 0.2,
                                            duration: 0.6,
                                        }}
                                    />
                                )}
                            </TabsTrigger>
                        </TabsList>

                        {/* Animated tab indicator */}
                        <motion.div
                            className="border-b border-primary/10 my-4 relative"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="absolute h-0.5 bg-primary rounded-full -bottom-0"
                                animate={{
                                    left:
                                        activeTab === 'benefits'
                                            ? '0%'
                                            : activeTab === 'comparison'
                                            ? '33.33%'
                                            : '66.66%',
                                    width: '33.33%',
                                }}
                                transition={{
                                    type: 'spring',
                                    bounce: 0.2,
                                    duration: 0.6,
                                }}
                            />
                        </motion.div>

                        {/* Animated tab content with transitions */}
                        <div className="relative overflow-hidden mt-8">
                            <AnimatePresence mode="wait">
                                {activeTab === 'benefits' && (
                                    <motion.div
                                        key="benefits-tab"
                                        initial={
                                            getAnimationDirection('benefits')
                                                .enter
                                        }
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={
                                            getAnimationDirection('benefits')
                                                .exit
                                        }
                                        transition={tabTransition}
                                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                                    >
                                        {benefitsData.map((benefit) => (
                                            <BenefitCard
                                                key={benefit.index}
                                                icon={benefit.icon}
                                                title={benefit.title}
                                                description={
                                                    benefit.description
                                                }
                                                content={benefit.content}
                                                index={benefit.index}
                                                isHighlighted={
                                                    benefit.isHighlighted
                                                }
                                            />
                                        ))}
                                    </motion.div>
                                )}

                                {activeTab === 'comparison' && (
                                    <motion.div
                                        key="comparison-tab"
                                        initial={
                                            getAnimationDirection('comparison')
                                                .enter
                                        }
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={
                                            getAnimationDirection('comparison')
                                                .exit
                                        }
                                        transition={tabTransition}
                                    >
                                        <ComparisonContent />
                                    </motion.div>
                                )}

                                {activeTab === 'education' && (
                                    <motion.div
                                        key="education-tab"
                                        initial={
                                            getAnimationDirection('education')
                                                .enter
                                        }
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={
                                            getAnimationDirection('education')
                                                .exit
                                        }
                                        transition={tabTransition}
                                    >
                                        <ImpermanentLossEducation />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Tabs>
                </div>
            </div>
        </section>
    );
};

export default Benefits;
