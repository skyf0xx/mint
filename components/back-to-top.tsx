import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scrollToSection } from '@/lib/helpers';

const BackToTop = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button when user scrolls down 500px
            setShow(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed bottom-8 right-8 z-50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Button
                        size="lg"
                        className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary-600 text-white p-0 group relative overflow-hidden"
                        onClick={() => scrollToSection('hero')}
                        aria-label="Back to top"
                    >
                        {/* Button gradient background */}
                        <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Arrow icon with animation */}
                        <motion.div
                            className="relative z-10"
                            animate={{ y: [2, -2, 2] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <ArrowUp className="w-5 h-5" />
                        </motion.div>

                        {/* Focus ring */}
                        <span className="absolute inset-0 rounded-full ring-4 ring-primary/20 group-hover:ring-accent/20 transition-all duration-300" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
