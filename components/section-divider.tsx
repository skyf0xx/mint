// components/section-divider.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SectionDividerProps {
    id?: string;
    label?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ id, label }) => {
    return (
        <div id={id} className="relative py-16 overflow-hidden">
            <div className="container mx-auto relative">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center justify-center"
                >
                    <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                    <div className="mx-6 relative">
                        <motion.div
                            initial={{ rotate: 0 }}
                            whileInView={{ rotate: 360 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center"
                        >
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary/30 to-violet-500/50"></div>
                        </motion.div>
                    </div>
                    <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                </motion.div>

                {label && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-center mt-4"
                    >
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                            {label}
                        </span>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SectionDivider;
