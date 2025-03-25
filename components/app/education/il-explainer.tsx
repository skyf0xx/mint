// components/app/education/il-explainer.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    TooltipProps,
} from 'recharts';
import {
    NameType,
    ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

const ILExplainer = () => {
    // Generate data showing impermanent loss curve
    const generateILData = () => {
        const data = [];
        // Show price ratio changes from 0.1x to 10x
        for (let i = 0.1; i <= 10; i += 0.1) {
            // IL formula: IL = 2 * sqrt(priceRatio) / (1 + priceRatio) - 1
            const priceRatio = i;
            const impermanentLoss =
                (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1;
            const ilPercentage = impermanentLoss * 100;

            data.push({
                priceRatio: i,
                il: ilPercentage.toFixed(2),
                protected: (ilPercentage * 0.5).toFixed(2),
            });
        }
        return data;
    };

    const ilData = generateILData();

    // Example scenarios to explain IL
    const scenarios = [
        {
            title: 'No Price Change',
            priceChange: '1x (no change)',
            ilPercentage: '0%',
            holdValue: '$1,000',
            lpValue: '$1,000',
            difference: '$0',
        },
        {
            title: 'Moderate Price Change',
            priceChange: '2x increase',
            ilPercentage: '5.7%',
            holdValue: '$1,500',
            lpValue: '$1,414',
            difference: '$86',
        },
        {
            title: 'Large Price Change',
            priceChange: '5x increase',
            ilPercentage: '13.4%',
            holdValue: '$3,000',
            lpValue: '$2,598',
            difference: '$402',
        },
        {
            title: 'Extreme Price Change',
            priceChange: '10x increase',
            ilPercentage: '18.6%',
            holdValue: '$5,500',
            lpValue: '$4,472',
            difference: '$1,028',
        },
    ];

    // Custom tooltip for the chart
    const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
        active,
        payload,
    }) => {
        if (active && payload && payload.length) {
            const priceRatio = Number(payload[0].payload.priceRatio).toFixed(1);
            const il = Math.abs(parseFloat(payload[0].value as string));
            const protectedAmount = Math.abs(
                parseFloat(payload[1].value as string)
            );

            return (
                <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
                    <p className="text-sm font-medium">{`Price Change: ${priceRatio}x`}</p>
                    <p className="text-sm text-red-500">{`Impermanent Loss: ${il.toFixed(
                        2
                    )}%`}</p>
                    <p className="text-sm text-green-500">{`With 50% Protection: ${(
                        il - protectedAmount
                    ).toFixed(2)}%`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="border-2 border-primary/10 shadow-lg">
            <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl">
                    Visualizing Impermanent Loss
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <p className="text-gray-600 mb-6">
                    Impermanent loss occurs when the price ratio between tokens
                    in a liquidity pool changes. This chart shows how price
                    changes affect impermanent loss and how our protection
                    reduces the impact.
                </p>

                {/* IL Chart */}
                <div className="h-64 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={ilData}
                            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f0f0"
                            />
                            <XAxis
                                dataKey="priceRatio"
                                scale="log"
                                domain={[0.1, 10]}
                                tickCount={7}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `${value}x`}
                                label={{
                                    value: 'Price Change',
                                    position: 'insideBottom',
                                    offset: -5,
                                }}
                            />
                            <YAxis
                                tickFormatter={(value) => `${Math.abs(value)}%`}
                                tick={{ fontSize: 12 }}
                                label={{
                                    value: 'Loss %',
                                    angle: -90,
                                    position: 'insideLeft',
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine y={0} stroke="#888" />
                            <Line
                                type="monotone"
                                dataKey="il"
                                name="Impermanent Loss"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="protected"
                                name="With 50% Protection"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Example Scenarios */}
                <h3 className="text-lg font-medium mb-3">Example Scenarios</h3>
                <p className="text-gray-600 mb-4">
                    These examples show the impact of impermanent loss on a
                    $1,000 liquidity position ($500 in each token) with
                    different price changes:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {scenarios.map((scenario, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium">{scenario.title}</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                                <div className="text-gray-600">
                                    Price Change:
                                </div>
                                <div className="font-medium">
                                    {scenario.priceChange}
                                </div>

                                <div className="text-gray-600">
                                    IL Percentage:
                                </div>
                                <div className="font-medium text-red-500">
                                    {scenario.ilPercentage}
                                </div>

                                <div className="text-gray-600">HODL Value:</div>
                                <div className="font-medium">
                                    {scenario.holdValue}
                                </div>

                                <div className="text-gray-600">LP Value:</div>
                                <div className="font-medium">
                                    {scenario.lpValue}
                                </div>

                                <div className="text-gray-600">Difference:</div>
                                <div className="font-medium text-red-500">
                                    {scenario.difference}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="text-base font-medium mb-2">
                        Key Takeaways
                    </h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>
                            Impermanent loss increases as price divergence
                            increases
                        </li>
                        <li>
                            The relationship is non-linear - small price changes
                            have minimal impact
                        </li>
                        <li>
                            Fees earned from providing liquidity may offset
                            impermanent loss
                        </li>
                        <li>
                            Our protocol&apos;s 50% protection significantly
                            reduces the impact of impermanent loss
                        </li>
                        <li>
                            The protection is more valuable for volatile tokens
                            with larger price movements
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default ILExplainer;
