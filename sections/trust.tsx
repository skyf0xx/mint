import { Card, CardContent } from '@/components/ui/card';
interface TrustCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    index: number;
}

const TrustCard = ({
    icon: Icon,
    title,
    description,
    index,
}: TrustCardProps) => (

const Trust = () => {
    return (
        <section id="trust" className="bg-gray-50/50 py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-12">Built on Trust</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg mb-2">
                                AO Blockchain
                            </h3>
                            <p className="text-gray-600">
                                Powered by secure and proven infrastructure
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-all duration-duration-300">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg mb-2">
                                Mithril Technology
                            </h3>
                            <p className="text-gray-600">
                                Advanced staking and reward mechanics
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg mb-2">
                                NAB Ecosystem
                            </h3>
                            <p className="text-gray-600">
                                Integrated with established protocols
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default Trust;
