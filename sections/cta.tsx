import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

const CTA = () => {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-50" />

            <motion.div
                className="container relative mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-2xl mx-auto text-center">
                    {/* Floating sparkle icon */}
                    <motion.div
                        className="inline-block mb-6"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Start{' '}
                        <span className="relative">
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-accent">
                                Earning Forever?
                            </span>
                            <span className="absolute inset-x-0 bottom-0 h-3 bg-accent/10 -rotate-1" />
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                        Join the future of sustainable yield generation and
                        start earning NAB rewards today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="text-lg px-8 py-6 group relative overflow-hidden bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary transition-all duration-500"
                        >
                            <span className="relative z-10 flex items-center">
                                Start Staking Now
                                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-6 group border-2 hover:border-primary/50 transition-colors duration-300 relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center">
                                View Documentation
                                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default CTA;
