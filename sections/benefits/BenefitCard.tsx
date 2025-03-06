import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Card
                className={`group relative hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col ${
                    isHighlighted ? 'ring-2 ring-primary/30 shadow-lg' : ''
                }`}
            >
                {/* Pulsing highlight effect for protection card */}
                {isHighlighted && (
                    <motion.div
                        className="absolute inset-0 bg-primary/5 rounded-xl"
                        animate={{
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                )}

                {/* Animated gradient border */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{ padding: '1px' }}
                >
                    <div className="absolute inset-0 bg-white" />
                </div>

                <CardHeader className="relative overflow-hidden pb-4 flex-shrink-0">
                    {/* Enhanced background effects */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>

                    <div className="relative z-10 flex flex-col items-start">
                        {/* Enlarged icon with animations */}
                        <motion.div
                            className="p-4 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-all duration-500"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Icon className="w-12 h-12 text-primary transition-all duration-500 group-hover:text-primary-600" />
                        </motion.div>

                        {/* Enhanced title with gradient */}
                        <CardTitle className="text-2xl mt-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                            {title}
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="relative flex-grow flex flex-col justify-between">
                    {/* Description with improved typography */}
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                        {description}
                    </p>

                    {/* Visual representation */}
                    <div className="mb-6">{getVisualComponent()}</div>

                    {/* Learn More Button */}
                    <div className="mt-auto">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(true)}
                            className="w-full justify-between group/button hover:bg-primary/5 transition-all duration-300"
                        >
                            <span className="flex items-center text-primary">
                                <Info className="mr-2 h-4 w-4" />
                                Learn more about {title}
                            </span>
                        </Button>
                    </div>
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
