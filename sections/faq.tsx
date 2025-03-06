import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';

// Enhanced FAQ data array with single-sided LP questions
const faqItems = [
    {
        question: 'What is single-sided liquidity provision?',
        answer: 'Single-sided liquidity provision allows you to contribute to a liquidity pool using only one token instead of the traditional two. MINT automatically provides the matching token (MINT) to create a complete LP position, eliminating the need for you to own or provide both tokens in a pair.',
    },
    {
        question: 'How does impermanent loss protection work?',
        answer: "MINT's impermanent loss protection gradually vests over a 30-day period, starting at 0% and reaching a maximum of 50% protection. When you unstake your position, the protocol automatically calculates your impermanent loss and compensates you based on your vested protection percentage. This significantly reduces the risk traditionally associated with providing liquidity.",
    },
    {
        question: 'What happens to my tokens when I stake them?',
        answer: 'When you stake a token, the protocol automatically pairs it with MINT tokens to create a complete LP position. This position is then staked on Botega, allowing you to earn trading fees. Your original token exposure is maintained while the protocol handles the complexity of liquidity provision behind the scenes.',
    },
    {
        question: 'Can I unstake at any time?',
        answer: "Yes, you can unstake your position at any time. When you do, you'll receive your original tokens back plus any earned profits, along with impermanent loss compensation based on your vesting period. The longer you've staked, the higher percentage of protection you'll receive, up to 50% after 30 days.",
    },
    {
        question: 'What tokens can I use for single-sided staking?',
        answer: 'The protocol supports staking various tokens including qAR, wAR, NAB, AO, and USDC. You can provide any of these tokens, and the protocol will automatically match it with the appropriate amount of MINT tokens to create a complete LP position.',
    },
    {
        question: 'What is MINT token?',
        answer: 'MINT is a deflationary cryptocurrency token that allows holders to earn perpetual NAB rewards through staking. It features an innovative burn mechanism that reduces supply over time while providing sustainable yield generation through permanent staking.',
    },
    {
        question: 'How does permanent staking work?',
        answer: 'When you permanently stake MINT tokens at nabtoken.xyz, they become locked forever in exchange for continuous NAB rewards. These staked tokens are protected from the weekly burn mechanism and provide governance rights in the NAB ecosystem. The staking is irreversible, ensuring long-term alignment with the protocol.',
    },
    {
        question: 'What is the weekly burn rate?',
        answer: 'MINT has a fixed weekly burn rate of 0.25% that applies to all unstaked tokens. This controlled supply reduction continues until reaching the mathematical floor of 21M tokens from the initial 77M supply. Permanently staked tokens are exempt from these burns.',
    },
    {
        question: 'How do I earn with single-sided liquidity provision?',
        answer: 'You earn in multiple ways: 1) 99% of the standard trading fees from the Botega pool, 2) Appreciation of your underlying token, and 3) Protection from impermanent loss that gradually vests up to 50% over 30 days, reducing the risk traditionally associated with liquidity provision.',
    },
    {
        question: 'What happens if my token price changes while staked?',
        answer: 'If your staked token appreciates in value, you retain 99% of the profits. If the price changes cause impermanent loss, the protocol compensates you for a portion of that loss based on your vesting period (up to 50% after 30 days). This creates a more balanced risk/reward profile compared to traditional LP positions.',
    },
    {
        question: 'How does single-sided LP differ from traditional LP?',
        answer: 'Traditional LP requires you to provide equal value of two tokens, often forcing you to sell half your position and exposing you to full impermanent loss. Single-sided LP allows you to provide just one token, maintain full asset exposure, receive up to 50% IL protection, and enjoy a simplified one-click process without complex position calculations.',
    },
    {
        question: 'How do governance rights work?',
        answer: 'Staked MINT tokens grant proportional voting power in the NAB ecosystem. As the total supply decreases through burns while your staked amount remains constant, your governance influence naturally increases over time. This allows you to participate in crucial protocol decisions and shape the future of the ecosystem.',
    },
];

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
    index: number;
}

const FAQItem = ({
    question,
    answer,
    isOpen,
    onToggle,
    index,
}: FAQItemProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="w-full"
        >
            <Card className="overflow-hidden border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                    <button
                        onClick={onToggle}
                        className="w-full p-6 flex items-center justify-between text-left transition-colors duration-300 hover:bg-primary/5"
                    >
                        <span className="text-lg font-medium text-gray-900">
                            {question}
                        </span>
                        <div className="ml-4 flex-shrink-0">
                            {isOpen ? (
                                <Minus className="w-5 h-5 text-primary" />
                            ) : (
                                <Plus className="w-5 h-5 text-primary" />
                            )}
                        </div>
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="p-6 pt-0">
                                    <motion.div
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="text-gray-600 leading-relaxed">
                                            {answer}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const FloatingDecoration = ({ className }: { className?: string }) => (
    <motion.div
        className={`absolute w-16 h-16 rounded-2xl border-2 border-primary/10 ${className}`}
        animate={{
            y: [0, -20, 0],
            rotate: [0, 45, 0],
            scale: [1, 1.1, 1],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
        }}
    />
);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[120px] opacity-30" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] opacity-20" />
            </div>

            {/* Floating decorations */}
            <FloatingDecoration className="top-20 left-[10%]" />
            <FloatingDecoration className="bottom-40 right-[15%]" />
            <FloatingDecoration className="top-60 right-[20%]" />

            <div className="container mx-auto px-4 relative">
                {/* Section header */}
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl font-bold mb-6">
                        <span className="relative">
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                                Frequently Asked Questions
                            </span>
                            <motion.span
                                className="absolute inset-x-0 bottom-0 h-3 bg-accent/10 -rotate-1"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Everything you need to know about MINT token and
                        single-sided staking
                    </p>
                </motion.div>

                {/* FAQ items */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqItems.map((item, index) => (
                        <FAQItem
                            key={index}
                            question={item.question}
                            answer={item.answer}
                            isOpen={openIndex === index}
                            onToggle={() =>
                                setOpenIndex(openIndex === index ? null : index)
                            }
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
