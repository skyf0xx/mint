import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const NABReference = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <span className="inline-block relative">
            {/* NAB text with subtle indicator */}
            <button
                onClick={() => setIsOpen(true)}
                className="font-medium text-primary hover:text-primary-600 transition-colors relative group inline-flex items-center"
            >
                NAB
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform" />
                <TrendingUp className="w-4 h-4 ml-1 inline-block opacity-50 group-hover:opacity-100" />
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-6"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">
                                    Number Always Bigger
                                </h3>
                            </div>

                            <div className="space-y-3 text-gray-600">
                                <p className="leading-relaxed">
                                    NAB is a token with one simple promise: the
                                    number goes up. It uses an innovative
                                    upward-stability mechanism to ensure the
                                    price floor can only increase over time.
                                </p>
                            </div>

                            <div className="pt-2">
                                <a
                                    target="_blank"
                                    href="https://number-always-bigger.ar.io/"
                                    className="text-sm text-primary hover:text-primary-600 font-medium inline-flex items-center group"
                                >
                                    Learn more about NAB
                                    <TrendingUp className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </DialogContent>
            </Dialog>
        </span>
    );
};

export default NABReference;
