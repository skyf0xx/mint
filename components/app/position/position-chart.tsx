// components/app/position/position-chart.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StakingPosition } from '@/types/staking';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface PositionChartProps {
    position: StakingPosition;
}

const PositionChart = ({ position }: PositionChartProps) => {
    // Calculate days staked
    const daysStaked = Math.floor(
        (new Date().getTime() - new Date(position.stakedDate).getTime()) /
            (1000 * 60 * 60 * 24)
    );

    // Generate mock data points showing price ratio history
    const generateChartData = () => {
        const data = [];
        const initialPrice = position.initialPriceRatio || 0.473; // Use provided or default value
        const currentPrice = position.finalPriceRatio || 0.512; // Use provided or default value

        // Ensure we have at least 2 data points even if position is new
        const points = Math.max(daysStaked + 1, 2);

        // Generate one data point per day
        for (let i = 0; i < points; i++) {
            // Create a realistic price curve between initial and current price
            const progress = daysStaked > 0 ? i / daysStaked : i;
            const basePrice =
                initialPrice +
                (currentPrice - initialPrice) * Math.min(progress, 1);

            // Add some randomness for realistic price movement
            // Make sure it's deterministic based on day and position ID to avoid chart regeneration on rerenders
            const seed = (i + 1) * (position.id.charCodeAt(0) || 1);
            const randomFactor = Math.sin(seed) * 0.02; // +/- 2%

            // Create a date for this data point
            const date = new Date(position.stakedDate);
            date.setDate(date.getDate() + i);

            data.push({
                day: i,
                date: date,
                price: basePrice * (1 + randomFactor),
            });
        }

        return data;
    };

    const chartData = generateChartData();

    // Custom tooltip component for the chart
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md text-sm">
                    <p className="font-medium">{`Day ${label}`}</p>
                    <p className="text-primary">{`Price Ratio: ${payload[0].value.toFixed(
                        4
                    )}`}</p>
                    <p className="text-gray-500">
                        {format(payload[0].payload.date, 'MMM d, yyyy')}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-700">
                    Price Change ({position.token}/MINT)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 5,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f0f0"
                            />
                            <XAxis
                                dataKey="day"
                                tickCount={5}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `Day ${value}`}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => value.toFixed(3)}
                                width={50}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="var(--primary)"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6, fill: 'var(--primary)' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                    <div>
                        <span className="text-gray-500">Initial:</span>{' '}
                        <span className="font-medium">
                            1 {position.token} ={' '}
                            {position.initialPriceRatio || '0.473'} MINT
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">Current:</span>{' '}
                        <span className="font-medium">
                            1 {position.token} ={' '}
                            {position.finalPriceRatio || '0.512'} MINT
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PositionChart;
