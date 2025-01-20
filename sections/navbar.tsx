import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

interface NavbarProps {
    progress: {
        hero: boolean;
        benefits: boolean;
        howItWorks: boolean;
        trust: boolean;
    };
    scrollToSection: (id: string) => void;
}

const Navbar = ({ progress, scrollToSection }: NavbarProps) => {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex space-x-6">
                    <button
                        onClick={() => scrollToSection('hero')}
                        className={`text-sm transition-colors ${
                            progress.hero
                                ? 'text-primary font-medium'
                                : 'text-gray-600'
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => scrollToSection('benefits')}
                        className={`text-sm transition-colors ${
                            progress.benefits
                                ? 'text-primary font-medium'
                                : 'text-gray-600'
                        }`}
                    >
                        Benefits
                    </button>
                    <button
                        onClick={() => scrollToSection('how-it-works')}
                        className={`text-sm transition-colors ${
                            progress.howItWorks
                                ? 'text-primary font-medium'
                                : 'text-gray-600'
                        }`}
                    >
                        How It Works
                    </button>
                </div>
                <Button size="sm" className="gap-2">
                    <Wallet className="w-4 h-4" /> Connect Wallet
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
