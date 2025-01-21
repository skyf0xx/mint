import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { createPortal } from 'react-dom';

interface LearnMoreProps {
    title: string;
    content: string[];
    isOpen: boolean;
    onClose: () => void;
    trigger?: React.RefObject<HTMLElement>; // Reference to the trigger element
}

const LearnMoreDialog = ({
    title,
    content,
    isOpen,
    onClose,
    trigger,
}: LearnMoreProps) => {
    const [position, setPosition] = useState({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    });

    // Calculate optimal position when dialog opens
    useEffect(() => {
        if (isOpen && trigger?.current) {
            const triggerRect = trigger.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Determine if we should position above or below the trigger
            const spaceBelow = viewportHeight - triggerRect.bottom;
            const spaceAbove = triggerRect.top;
            const preferredHeight = Math.min(viewportHeight * 0.8, 600); // Max height of dialog

            let top, transform;

            // Vertical positioning
            if (spaceBelow >= preferredHeight || spaceBelow > spaceAbove) {
                // Position below the trigger
                top = `${triggerRect.bottom + 16}px`;
                transform = 'translateX(-50%)';
            } else {
                // Position above the trigger
                top = `${triggerRect.top - 16}px`;
                transform = 'translate(-50%, -100%)';
            }

            // Horizontal positioning
            const left = `${Math.min(
                Math.max(triggerRect.left + triggerRect.width / 2, 400),
                viewportWidth - 400
            )}px`;

            setPosition({ top, left, transform });
        }
    }, [isOpen, trigger]);

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 isolate z-50">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed w-full max-w-2xl max-h-[80vh] overflow-auto"
                        style={position}
                    >
                        <Card className="relative bg-white shadow-xl border border-gray-200/50 overflow-hidden">
                            {/* Background decorations */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

                            {/* Content container */}
                            <div className="relative p-6 sm:p-8">
                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Title */}
                                <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-2xl sm:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600"
                                >
                                    {title}
                                </motion.h3>

                                {/* Content paragraphs */}
                                <div className="space-y-4">
                                    {content.map((paragraph, index) => (
                                        <motion.p
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    delay: 0.1 * index,
                                                },
                                            }}
                                            className="text-gray-600 leading-relaxed text-lg"
                                        >
                                            {paragraph}
                                        </motion.p>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default LearnMoreDialog;
