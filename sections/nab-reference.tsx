import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, X } from 'lucide-react';

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

            {/* Animated popover */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                        />

                        {/* Popover content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute left-1/2 -translate-x-1/2 top-8 w-[320px] bg-white rounded-xl shadow-xl border border-gray-200/50 p-6 z-50"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* NAB content */}
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
                                        NAB is a token with one simple promise:
                                        the number goes up. It uses an
                                        innovative upward-stability mechanism to
                                        ensure the price floor can only increase
                                        over time.
                                    </p>
                                    <div className="pt-2">
                                        <span className="inline-block px-3 py-1 bg-primary/5 rounded-full text-primary text-sm">
                                            Floor can only go up 📈
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <a
                                        href="#"
                                        className="text-sm text-primary hover:text-primary-600 font-medium inline-flex items-center group"
                                    >
                                        Learn more about NAB
                                        <TrendingUp className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </span>
    );
};

export default NABReference;
