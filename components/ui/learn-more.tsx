import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

interface LearnMoreDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string[];
}

const LearnMoreDialog: React.FC<LearnMoreDialogProps> = ({
    isOpen,
    onClose,
    title,
    content,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <AnimatePresence>
                {isOpen && (
                    <DialogContent className="sm:max-w-[600px] h-[80vh] sm:h-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                                    {title}
                                </DialogTitle>
                            </DialogHeader>

                            <ScrollArea className="mt-6 max-h-[60vh] pr-6">
                                <div className="space-y-4">
                                    {content.map((paragraph, index) => (
                                        <motion.p
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="text-gray-600 leading-relaxed"
                                        >
                                            {paragraph}
                                        </motion.p>
                                    ))}
                                </div>
                            </ScrollArea>
                        </motion.div>
                    </DialogContent>
                )}
            </AnimatePresence>
        </Dialog>
    );
};

export default LearnMoreDialog;
