import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Coins } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { useProtocolMetrics } from '@/hooks/use-protocol-metrics';
import Image from 'next/image';

// Utility function to strip the bracket part from token names
const formatTokenName = (name: string): string => {
    // Match any text followed by a space and then text in brackets at the end of the string
    const bracketRegex = /^(.*?)\s+\([^)]+\)$/;
    const match = name.match(bracketRegex);

    // If there's a match, return the part before the brackets, otherwise return the original name
    return match ? match[1] : name;
};

interface TokenCardProps {
    name: string;
    symbol: string;
    amount: string;
    activePositions: number;
    decimals: number;
    delay: number;
    loading: boolean;
    iconUrl?: string;
    inView: boolean;
}

const FormattedCountUp = ({
    end,
    decimals = 2,
    duration = 2.5,
    delay = 0,
    inView = false,
}: {
    end: number;
    decimals?: number;
    duration?: number;
    delay?: number;
    inView?: boolean;
}) => {
    // Use state to track if animation has completed
    const [hasAnimated, setHasAnimated] = React.useState(false);

    // Only animate if in view and hasn't animated yet
    const shouldAnimate = inView && !hasAnimated;

    React.useEffect(() => {
        if (inView && !hasAnimated) {
            // Set a timeout slightly longer than animation duration to mark as completed
            const timer = setTimeout(() => {
                setHasAnimated(true);
            }, (duration + delay) * 1000 + 500);

            return () => clearTimeout(timer);
        }
    }, [inView, hasAnimated, duration, delay]);

    return (
        <CountUp
            end={end}
            decimals={decimals}
            duration={duration}
            delay={delay}
            separator=","
            decimal="."
            prefix=""
            suffix=""
            useEasing={true}
            startOnMount={false}
            start={shouldAnimate ? 0 : end}
            preserveValue={true}
        />
    );
};

const TokenCard = ({
    name,
    symbol,
    amount,
    activePositions,
    decimals,
    delay,
    loading,
    iconUrl,
}: TokenCardProps) => {
    // Parse amount to number for CountUp
    const amountValue = parseFloat(amount);
    const [cardRef, cardInView] = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="h-full"
        >
            <Card className="h-full hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                        {iconUrl && (
                            <Image
                                src={iconUrl}
                                alt={symbol}
                                className="w-8 h-8 rounded-full"
                                width={32}
                                height={32}
                            />
                        )}
                        <div>
                            <h3 className="font-medium text-gray-900">
                                {name}
                            </h3>
                            <p className="text-sm text-gray-500">{symbol}</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center space-x-2 py-3">
                            <Loader2 className="w-5 h-5 animate-spin text-primary/50" />
                            <span className="text-primary/50">Loading...</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Total Staked
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    <FormattedCountUp
                                        end={amountValue}
                                        decimals={decimals}
                                        delay={delay * 0.5}
                                        inView={cardInView}
                                    />{' '}
                                    <span className="text-sm font-normal">
                                        {symbol}
                                    </span>
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-xs text-gray-500">
                                    Active Positions
                                </p>
                                <p className="text-lg font-semibold">
                                    <FormattedCountUp
                                        end={activePositions}
                                        decimals={0}
                                        delay={delay * 0.5}
                                        inView={cardInView}
                                    />
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

const ProtocolMetrics = () => {
    const { metrics, loading } = useProtocolMetrics();
    // Main section ref for overall visibility with triggerOnce
    const [sectionRef, sectionInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Treasury counter with triggerOnce
    const [treasuryRef, treasuryInView] = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    // Get array of token metrics - always sorted by positions
    const getTokenMetrics = () => {
        if (!metrics || !metrics.tokenMetrics) return [];

        // Convert object to array for easier sorting
        const tokenMetricsArray = Object.entries(metrics.tokenMetrics).map(
            ([tokenAddress, metric]) => ({
                tokenAddress,
                ...metric,
                amountNumber:
                    parseFloat(metric.totalStaked) /
                    Math.pow(10, metric.decimals || 8),
            })
        );

        // Always sort by positions
        return tokenMetricsArray.sort(
            (a, b) => b.activePositions - a.activePositions
        );
    };

    const tokenMetrics = getTokenMetrics();
    const treasuryBalance = metrics?.formattedTreasuryBalance || '0';
    const treasuryBalanceNumber = parseFloat(treasuryBalance.replace(/,/g, ''));

    // Get token icons map - in a real app, you would have a proper mapping
    const tokenIcons: Record<string, string> = {
        qAR: '/images/currencies/qar.png',
        wAR: '/images/currencies/war.png',
        NAB: '/images/currencies/nab.jpeg',
        AO: '/images/currencies/ao.png',
        USDC: '/images/currencies/usdc.svg',
        MINT: '/images/currencies/mint.png',
        TTT: '/images/currencies/ttt.svg',
        MATRIX: '/images/currencies/matrix.png',
    };

    function getIconFromAddress(tokenAddress: string) {
        switch (tokenAddress) {
            case 'NG-0lVX882MG5nhARrSzyprEK6ejonHpdUmaaMPsHE8':
                return tokenIcons['qAR'];
            case 'OsK9Vgjxo0ypX_HLz2iJJuh4hp3I80yA9KArsJjIloU':
                return tokenIcons['NAB'];
            case '7zH9dlMNoxprab9loshv3Y7WG45DOny_Vrq9KrXObdQ':
                return tokenIcons['USDC'];
            case 'xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10':
                return tokenIcons['wAR'];
            case '0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc':
                return tokenIcons['AO'];
            case 'U09Pg31Wlasc8ox5uTDm9sjFQT8XKcCR2Ru5lmFMe2A':
                return tokenIcons['TTT'];
            case 'XQhUXernOkcwzrNq5U1KlAhHsqLnT3kA4ccAxfQR7XM':
                return tokenIcons['MATRIX'];
            default:
                return '';
        }
    }

    function getSymbolFromAddress(tokenAddress: string) {
        switch (tokenAddress) {
            case 'NG-0lVX882MG5nhARrSzyprEK6ejonHpdUmaaMPsHE8':
                return 'qAR';
            case 'OsK9Vgjxo0ypX_HLz2iJJuh4hp3I80yA9KArsJjIloU':
                return 'NAB';
            case '7zH9dlMNoxprab9loshv3Y7WG45DOny_Vrq9KrXObdQ':
                return 'USDC';
            case 'xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10':
                return 'wAR';
            case '0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc':
                return 'AO';
            case 'U09Pg31Wlasc8ox5uTDm9sjFQT8XKcCR2Ru5lmFMe2A':
                return 'TTT';
            case 'XQhUXernOkcwzrNq5U1KlAhHsqLnT3kA4ccAxfQR7XM':
                return 'MATRIX';
            default:
                return '';
        }
    }

    return (
        <section
            id="metrics"
            ref={sectionRef}
            className="container mx-auto px-4 py-24 relative bg-gradient-to-b from-transparent to-gray-50/30"
        >
            {/* Centered section header - matches other sections */}
            <motion.div
                className="max-w-3xl mx-auto text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                        Protocol Metrics
                    </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                    Real-time data on the protocol&apos;s single-sided staking
                    activity
                </p>
            </motion.div>

            {/* Main dashboard card */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm max-w-6xl mx-auto">
                <CardContent className="pt-6">
                    {/* Main metrics summary - prominence and spacing adjusted */}
                    <motion.div
                        ref={treasuryRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <div className="flex items-center mb-4 justify-center">
                            {/* Treasury Title Section - centered */}
                            <div className="flex items-center">
                                <Image
                                    src={tokenIcons['MINT']}
                                    alt="MINT Token"
                                    className="w-6 h-6 mr-2"
                                    width={24}
                                    height={24}
                                />
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Treasury Balance
                                </h3>
                            </div>
                        </div>

                        {/* Treasury Value - Larger and centered */}
                        <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-xl mb-6 text-center">
                            {loading ? (
                                <div className="flex items-center justify-center space-x-3">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
                                    <span className="text-primary/50">
                                        Loading treasury data...
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                                        <FormattedCountUp
                                            end={treasuryBalanceNumber}
                                            duration={3}
                                            inView={treasuryInView}
                                        />
                                        <span className="text-xl font-semibold ml-2">
                                            MINT
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
                                        MINT tokens reserved for single sided
                                        staking &amp; impermanent loss
                                        protection
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Token breakdown section - centered header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-center sm:justify-start mb-6 border-b pb-4">
                            <Coins className="w-5 h-5 mr-2 text-primary" />
                            <h4 className="text-xl font-bold text-gray-800">
                                Currently Staked Tokens
                            </h4>
                        </div>

                        {tokenMetrics.length === 0 && !loading ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">
                                    No token data available
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {tokenMetrics.map((token, index) => (
                                    <TokenCard
                                        key={token.tokenAddress}
                                        name={formatTokenName(token.name)}
                                        symbol={getSymbolFromAddress(
                                            token.tokenAddress
                                        )}
                                        amount={(
                                            parseFloat(token.totalStaked) /
                                            Math.pow(10, token.decimals || 8)
                                        ).toString()}
                                        activePositions={token.activePositions}
                                        decimals={2}
                                        delay={0.1 + index * 0.05}
                                        loading={loading}
                                        iconUrl={getIconFromAddress(
                                            token.tokenAddress
                                        )}
                                        inView={sectionInView}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer section - centered on mobile, space-between on desktop */}
                    <div className="border-t pt-4 mt-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-center sm:text-left">
                            {metrics?.timestamp && (
                                <motion.div
                                    className="text-xs text-gray-400 mx-auto sm:mx-0"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    Last updated:{' '}
                                    {new Date(
                                        metrics.timestamp * 1000
                                    ).toLocaleString()}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

export default ProtocolMetrics;
