import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { InfinityLogo } from './logo';

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
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50'
                    : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="h-16 flex justify-between items-center">
                    {/* Logo/Brand */}
                    <div className="flex items-center space-x-2">
                        {/* Adjusted positioning for vertical alignment */}
                        <div className="w-8 h-8 relative flex items-center">
                            <div className="transform scale-[0.4] origin-center absolute -left-4">
                                <InfinityLogo />
                            </div>
                        </div>
                        <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent pl-2">
                            MINT
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-1">
                        <NavButton
                            active={progress.hero}
                            onClick={() => scrollToSection('hero')}
                        >
                            Overview
                        </NavButton>
                        <NavButton
                            active={progress.benefits}
                            onClick={() => scrollToSection('benefits')}
                        >
                            Benefits
                        </NavButton>
                        <NavButton
                            active={progress.howItWorks}
                            onClick={() => scrollToSection('how-it-works')}
                        >
                            How It Works
                        </NavButton>
                    </div>

                    {/* Connect Wallet Button */}
                    <Button
                        size="sm"
                        className="relative group overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                    </Button>
                </div>
            </div>
        </nav>
    );
};

// Navigation Button Component
const NavButton = ({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`relative px-4 py-2 text-sm transition-all duration-300 ${
            active
                ? 'text-primary font-medium'
                : 'text-gray-600 hover:text-gray-900'
        }`}
    >
        {children}
        <span
            className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 transition-transform duration-300 ${
                active ? 'scale-x-100' : ''
            }`}
        />
    </button>
);

export default Navbar;
