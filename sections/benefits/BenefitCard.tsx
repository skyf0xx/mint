import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info, ArrowRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SingleSidedVisual from './visualizations/SingleSidedVisual';
import ProtectionVisual from './visualizations/ProtectionVisual';
import ReturnsVisual from './visualizations/ReturnsVisual';
import LearnMoreDialog from '@/components/ui/learn-more';

export interface BenefitCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    index: number;
    content: string[];
    isHighlighted?: boolean;
}

const BenefitCard = ({
    icon: Icon,
    title,
    description,
    index,
    content,
    isHighlighted = false,
}: BenefitCardProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    // Function to get the appropriate visual component
    const getVisualComponent = () => {
        switch (index) {
            case 0:
                return <SingleSidedVisual />;
            case 1:
                return <ProtectionVisual />;
            case 2:
                return <ReturnsVisual />;
            default:
                return null;
        }
    };

    // Convert content array to paragraphs for the dialog
    const dialogContent = content.map((item) => `${item}`);

    // Card variants for animation
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                type: 'spring',
                stiffness: 100,
                damping: 15,
            },
        },
        hover: {
            y: shouldReduceMotion ? 0 : -8,
            scale: shouldReduceMotion ? 1 : 1.02,
            transition: {
                duration: 0.4,
                ease: 'easeOut',
            },
        },
    };

    // Content staggered animations
    const contentVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4 },
        },
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, margin: '-50px' }}
            className="h-full"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            layoutId={`card-${index}`}
        >
            <Card
                className={`group relative transition-all duration-500 overflow-hidden h-full flex flex-col ${
                    isHighlighted ? '' : ''
                }`}
            >
                {/* Pulsing highlight effect for highlighted card */}
                {isHighlighted && (
                    <motion.div
                        className="absolute inset-0 bg-primary/5 rounded-xl"
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                )}

                <div className="absolute inset-0 bg-white" />

                <CardHeader className="relative overflow-hidden pb-4 flex-shrink-0">
                    {/* Enhanced background effects */}
                    <div className="absolute inset-0">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent"
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.4 }}
                        />
                        <motion.div
                            className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl"
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                scale: isHovered ? 1.2 : 1,
                            }}
                            transition={{ duration: 0.6 }}
                        />
                    </div>

                    <motion.div
                        className="relative z-10 flex flex-col items-start"
                        variants={contentVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Animated icon with 3D rotation */}
                        <motion.div
                            className="p-4 rounded-xl bg-primary/5"
                            whileHover={{
                                scale: 1.1,
                                rotateY: shouldReduceMotion ? 0 : 15,
                                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                            }}
                            animate={{
                                background: isHovered
                                    ? 'rgba(99, 102, 241, 0.15)'
                                    : 'rgba(99, 102, 241, 0.05)',
                            }}
                            transition={{ duration: 0.4 }}
                            variants={itemVariants}
                        >
                            <motion.div
                                animate={
                                    isHovered
                                        ? {
                                              y: [0, -5, 0],
                                              transition: {
                                                  duration: 1.5,
                                                  repeat: Infinity,
                                                  ease: 'easeInOut',
                                              },
                                          }
                                        : { y: 0 }
                                }
                            >
                                <Icon className="w-12 h-12 text-primary transition-all duration-500" />
                            </motion.div>
                        </motion.div>

                        {/* Enhanced title with gradient */}
                        <motion.div variants={itemVariants}>
                            <CardTitle className="text-2xl mt-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                                {title}
                            </CardTitle>
                        </motion.div>
                    </motion.div>
                </CardHeader>

                <CardContent className="relative flex-grow flex flex-col justify-between">
                    {/* Description with improved typography */}
                    <motion.p
                        className="text-gray-600 leading-relaxed mb-6 text-lg"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {description}
                    </motion.p>

                    {/* Visual representation with entrance animation */}
                    <motion.div
                        className="mb-6"
                        variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: {
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    delay: 0.3,
                                    duration: 0.6,
                                    ease: 'easeOut',
                                },
                            },
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {getVisualComponent()}
                    </motion.div>

                    {/* Learn More Button with enhanced hover effect */}
                    <motion.div
                        className="mt-auto"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => setIsDialogOpen(true)}
                                className="w-full justify-between group/button hover:bg-primary/5 transition-all duration-300"
                            >
                                <span className="flex items-center text-primary">
                                    <Info className="mr-2 h-4 w-4" />
                                    Learn more
                                </span>
                                <motion.div
                                    animate={{ x: isHovered ? 5 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowRight className="h-4 w-4 text-primary opacity-70" />
                                </motion.div>
                            </Button>
                        </motion.div>
                    </motion.div>
                </CardContent>
            </Card>

            {/* Learn More Dialog */}
            <LearnMoreDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={title}
                content={dialogContent}
            />
        </motion.div>
    );
};

export default BenefitCard;
