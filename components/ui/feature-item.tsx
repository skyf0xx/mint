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
                    className="max-w-xs p-4 text-sm bg-white border-2 border-primary/10"
                >
                    {tooltip}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </motion.li>
);

export default FeatureItem;
