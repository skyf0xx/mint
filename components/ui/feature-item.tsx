import { motion, Variants } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface FeatureItemProps {
    text: string;
    tooltip: string;
    variants: Variants;
}

const FeatureItem = ({ text, tooltip, variants }: FeatureItemProps) => (
    <motion.li variants={variants} className="flex items-center gap-4 group">
        <motion.div
            className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300"
            whileHover={{ scale: 1.1, rotate: 10 }}
        >
            <CheckCircle2 className="w-6 h-6 text-primary" />
        </motion.div>
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="text-lg text-gray-700 group-hover:text-gray-900 transition-colors duration-300 cursor-help">
                        {text}
                    </span>
                </TooltipTrigger>
                <TooltipContent
                    side="right"
                    className="max-w-[280px] p-4 bg-primary-600 text-white border-0 shadow-lg rounded-xl"
                    sideOffset={10}
                >
                    <div className="relative">
                        {/* Add a subtle gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 opacity-50 rounded-lg" />

                        {/* Tooltip content with improved text styling */}
                        <p className="relative z-10 text-base leading-relaxed">
                            {tooltip}
                        </p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </motion.li>
);

export default FeatureItem;
