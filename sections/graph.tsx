import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    AreaChart,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

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

const MintSupplyGraph = () => {
    // Calculate supply evolution data
    const generateSupplyData = () => {
        const weeks = 520; // 10 years
        const initialSupply = 37500000;
        const targetFloor = 21000000;
        const weeklyBurnRate = 0.0025; // 0.25%

        const data = [];
        let currentSupply = initialSupply;

        for (let week = 0; week <= weeks; week += 13) {
            // Sample every quarter (13 weeks)
            // Calculate remaining burnable supply
            const burnableSupply = currentSupply - targetFloor;

            data.push({
                week: Math.floor((week / 52) * 2) / 2, // Show in years with half-year precision
                supply: Math.round(currentSupply),
                floor: targetFloor,
            });

            // Apply weekly burn to burnable supply
            currentSupply =
                targetFloor + burnableSupply * Math.pow(1 - weeklyBurnRate, 13);
        }

        return data;
    };

    const data = generateSupplyData();

    return (
        <motion.section
            className="py-24 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-30" />

            {/* Add floating decorations */}
            <FloatingDecoration className="top-20 left-[5%] opacity-60" />
            <FloatingDecoration className="top-40 right-[10%] w-20 h-20 opacity-40" />
            <FloatingDecoration className="bottom-32 left-[15%] w-24 h-24 opacity-50" />
            <FloatingDecoration className="bottom-48 right-[8%] w-12 h-12 opacity-70" />
            <FloatingDecoration className="top-1/2 left-[8%] w-16 h-16 opacity-60" />

            {/* Add accent squares */}
            <motion.div
                className="absolute top-1/4 right-[22%] w-8 h-8 rounded-lg border-2 border-accent/20"
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, -45, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute bottom-1/3 left-[18%] w-10 h-10 rounded-lg border-2 border-accent/20"
                animate={{
                    y: [0, 15, 0],
                    rotate: [0, 45, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <div className="container mx-auto px-4 relative">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-700">
                                Supply Evolution
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            MINT&apos;s supply decreases over time through our
                            mathematically guaranteed burn mechanism
                        </p>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Permanetly staked tokens are protected from the
                            burn.
                        </p>
                    </motion.div>

                    <Card className="overflow-hidden border-2 border-primary/10">
                        <CardContent className="p-6">
                            <div className="h-[600px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={data}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 40,
                                            bottom: 20,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#E2E8F0"
                                        />
                                        <XAxis
                                            dataKey="week"
                                            label={{
                                                value: 'Years',
                                                position: 'bottom',
                                                offset: -10,
                                            }}
                                            tick={{ fill: '#64748B' }}
                                        />
                                        <YAxis
                                            domain={[20000000, 40000000]}
                                            label={{
                                                value: 'Supply',
                                                angle: -90,
                                                position: 'insideLeft',
                                                offset: -20,
                                            }}
                                            tick={{ fill: '#64748B' }}
                                            tickFormatter={(value) =>
                                                `${(value / 1000000).toFixed(
                                                    1
                                                )}M`
                                            }
                                        />
                                        <Tooltip
                                            formatter={(value) => [
                                                `${(
                                                    Number(value) / 1000000
                                                ).toFixed(2)}M MINT`,
                                                'Supply',
                                            ]}
                                            labelFormatter={(value) =>
                                                `Year ${value}`
                                            }
                                        />
                                        <ReferenceLine
                                            y={21000000}
                                            stroke="#6366F1"
                                            strokeDasharray="3 3"
                                            label={{
                                                value: '21M',
                                                fill: '#6366F1',
                                                position: 'right',
                                            }}
                                        />
                                        <defs>
                                            <linearGradient
                                                id="supplyGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="rgb(99, 102, 241)"
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="rgb(99, 102, 241)"
                                                    stopOpacity={0.05}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="supply"
                                            stroke="#6366F1"
                                            strokeWidth={2}
                                            fill="url(#supplyGradient)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="p-4 rounded-xl bg-primary/5">
                                    <h4 className="text-sm font-medium text-gray-600 mb-1">
                                        Initial Supply
                                    </h4>
                                    <p className="text-2xl font-bold text-primary">
                                        37.5M MINT
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-primary/5">
                                    <h4 className="text-sm font-medium text-gray-600 mb-1">
                                        Supply Floor
                                    </h4>
                                    <p className="text-2xl font-bold text-primary">
                                        21M MINT
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-primary/5">
                                    <h4 className="text-sm font-medium text-gray-600 mb-1">
                                        Weekly Burn Rate
                                    </h4>
                                    <p className="text-2xl font-bold text-primary">
                                        0.25%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.section>
    );
};

export default MintSupplyGraph;
