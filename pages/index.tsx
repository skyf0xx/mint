import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowRight,
    ArrowDown,
    InfinityIcon,
    Lock,
    BarChart3,
    Users,
} from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Immediate Value Proposition */}
            <section className="container mx-auto px-4 py-16 flex flex-col items-center text-center space-y-8">
                <h1 className="text-4xl md:text-6xl font-bold">
                    Stake Once, Earn Forever
                </h1>
                <p className="text-xl max-w-2xl">
                    Transform your crypto strategy with MINT — the deflationary
                    token that rewards you with NAB tokens for life.
                </p>

                {/* Key Metrics - Social Proof */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Current Supply
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">37,500,000</p>
                            <p className="text-sm">MINT</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Target Floor
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">21,000,000</p>
                            <p className="text-sm">MINT</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Weekly Burn Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">0.25%</p>
                            <p className="text-sm">of unstaked supply</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Primary CTA */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button size="lg" className="text-lg px-8">
                        Start Staking <ArrowRight className="ml-2" />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="text-lg px-8"
                    >
                        Learn More <ArrowDown className="ml-2" />
                    </Button>
                </div>
            </section>

            {/* Core Benefits - Progressive Disclosure */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Core Benefits
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <Card>
                            <CardHeader>
                                <InfinityIcon className="w-10 h-10 mb-4" />
                                <CardTitle>Perpetual NAB Generation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Lock your MINT tokens once and receive NAB
                                rewards forever. No complicated farming
                                strategies needed.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <BarChart3 className="w-10 h-10 mb-4" />
                                <CardTitle>Deflationary By Design</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Watch your stake grow stronger as MINT&apos;s
                                supply decreases through our guaranteed weekly
                                burn rate.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Users className="w-10 h-10 mb-4" />
                                <CardTitle>Governance Rights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Shape the future of the NAB ecosystem with
                                growing influence as supply decreases.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works - Detailed Understanding */}
            <section className="py-16 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    How It Works
                </h2>
                <Tabs defaultValue="direct" className="max-w-4xl mx-auto">
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="direct">Direct Staking</TabsTrigger>
                        <TabsTrigger value="lp">LP Staking</TabsTrigger>
                    </TabsList>
                    <TabsContent value="direct">
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">
                                        Direct MINT Staking
                                    </h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center">
                                            <Lock className="mr-2" /> Permanent
                                            lock-up for maximum rewards
                                        </li>
                                        <li className="flex items-center">
                                            <ArrowRight className="mr-2" />{' '}
                                            Highest NAB generation rate
                                        </li>
                                        <li className="flex items-center">
                                            <ArrowRight className="mr-2" />{' '}
                                            Complete protection from weekly
                                            burns
                                        </li>
                                        <li className="flex items-center">
                                            <ArrowRight className="mr-2" /> Full
                                            governance rights
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="lp">
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">
                                        LP Staking (MINT/NAB)
                                    </h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center">
                                            <ArrowRight className="mr-2" />{' '}
                                            Flexible staking with withdrawal
                                            options
                                        </li>
                                        <li className="flex items-center">
                                            <ArrowRight className="mr-2" />{' '}
                                            Competitive reward rates
                                        </li>
                                        <li className="flex items-center">
                                            <ArrowRight className="mr-2" />{' '}
                                            Market liquidity benefits
                                        </li>
                                        <li className="flex items-center">
                                            <ArrowRight className="mr-2" />{' '}
                                            Partial burn protection
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </section>

            {/* Trust Elements */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-12">Built on Trust</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold mb-2">
                                    AO Blockchain
                                </h3>
                                <p>
                                    Powered by secure and proven infrastructure
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold mb-2">
                                    Mithril Technology
                                </h3>
                                <p>Advanced staking and reward mechanics</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold mb-2">
                                    NAB Ecosystem
                                </h3>
                                <p>Integrated with established protocols</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 container mx-auto px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">
                        Ready to Start Earning?
                    </h2>
                    <p className="mb-8">
                        Join the future of sustainable yield generation today.
                    </p>
                    <Button size="lg" className="text-lg px-8">
                        Start Staking Now <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Home;
