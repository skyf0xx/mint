import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowRight } from 'lucide-react';

const CTA = () => {
    return (
        <section className="py-24 container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold mb-6">
                    Ready to Start Earning?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                    Join the future of sustainable yield generation today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="text-lg px-8 group">
                        Start Staking Now
                        <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="text-lg px-8 group"
                    >
                        View Documentation
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default CTA;
