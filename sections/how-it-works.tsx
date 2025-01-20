import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, ChevronRight, Lock } from 'lucide-react';

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                <p className="text-gray-600">
                    Choose your preferred staking strategy and start earning NAB
                    rewards.
                </p>
            </div>

            <Tabs defaultValue="direct" className="max-w-4xl mx-auto">
                <div className="w-full mb-8">
                    <TabsList className="w-full grid grid-cols-2 h-14">
                        <TabsTrigger
                            value="direct"
                            className="w-full flex items-center justify-center gap-2 px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white"
                        >
                            <Lock className="w-5 h-5" />
                            Direct Staking
                        </TabsTrigger>
                        <TabsTrigger
                            value="lp"
                            className="w-full flex items-center justify-center gap-2 px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white"
                        >
                            <BarChart3 className="w-5 h-5" />
                            LP Staking
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Rest of the component remains the same */}
                <TabsContent value="direct">
                    <Card className="border-2">
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 rounded-full bg-primary/10">
                                        <Lock className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">
                                            Direct MINT Staking
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Maximum rewards through permanent
                                            token lock-up.
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-primary/5">
                                            <ChevronRight className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>
                                            Permanent lock-up for maximum
                                            rewards
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-primary/5">
                                            <ChevronRight className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>Highest NAB generation rate</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-primary/5">
                                            <ChevronRight className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>
                                            Complete protection from weekly
                                            burns
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-primary/5">
                                            <ChevronRight className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>Full governance rights</span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="lp">
                    <Card className="border-2">
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 rounded-full bg-primary/10">
                                        <BarChart3 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">
                                            LP Staking (MINT/NAB)
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Flexible staking with additional
                                            liquidity benefits.
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-primary/5">
                                            <ChevronRight className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>
                                            Flexible staking with withdrawal
                                            options
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-primary/5">
                                            <ChevronRight className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>Competitive reward rates</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-primary/5">
                                            <ChevronRight className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>Market liquidity benefits</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-primary/5">
                                            <ChevronRight className="w-4 h-4 text-primary" />
                                        </div>
                                        <span>Partial burn protection</span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default HowItWorks;
