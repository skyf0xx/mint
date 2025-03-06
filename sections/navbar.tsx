import { useEffect, useState } from 'react';
import { InfinityLogo } from './logo';

interface NavbarProps {
    progress: {
        hero: boolean;
        benefits: boolean;
        howItWorks: boolean;
        tokenomics: boolean;
        supply: boolean;
        scarcity: boolean;
        trust: boolean;
        faq: boolean;
    };
    scrollToSection: (id: string) => void;
}

const Navbar = ({ progress, scrollToSection }: NavbarProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavClick = (sectionId: string) => {
        scrollToSection(sectionId);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50'
                    : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="h-16 flex items-center justify-between">
                    {/* Left section - Logo */}
                    <div className="flex-shrink-0">
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => scrollToSection('hero')}
                        >
                            <div className="w-8 h-8 relative flex items-center">
                                <div className="transform scale-[0.4] origin-center absolute -left-4">
                                    <InfinityLogo />
                                </div>
                            </div>
                            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent pl-2">
                                MINT
                            </span>
                        </div>
                    </div>

                    {/* Center section - Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center justify-center space-x-1">
                        <NavButton
                            active={progress.hero}
                            onClick={() => handleNavClick('hero')}
                        >
                            Home
                        </NavButton>
                        <NavButton
                            active={progress.benefits}
                            onClick={() => handleNavClick('benefits')}
                        >
                            Benefits
                        </NavButton>
                        <NavButton
                            active={progress.howItWorks}
                            onClick={() => handleNavClick('how-it-works')}
                        >
                            How It Works
                        </NavButton>
                        <NavButton
                            active={progress.tokenomics}
                            onClick={() => handleNavClick('how-it-works')}
                        >
                            Tokenomics
                        </NavButton>
                        <NavButton
                            active={progress.scarcity}
                            onClick={() => handleNavClick('scarcity')}
                        >
                            Scarcity
                        </NavButton>
                        <NavButton
                            active={progress.trust}
                            onClick={() => handleNavClick('trust')}
                        >
                            Trust
                        </NavButton>
                        <NavButton
                            active={progress.faq}
                            onClick={() => handleNavClick('faq')}
                        >
                            FAQ
                        </NavButton>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-md text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Right section - Call to Action */}
                    <div className="hidden md:block">
                        <button
                            onClick={() =>
                                (window.location.href =
                                    'https://app.mint.arweave.dev')
                            }
                            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                        >
                            Launch App
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <MobileNavButton
                            active={progress.hero}
                            onClick={() => handleNavClick('hero')}
                        >
                            Home
                        </MobileNavButton>
                        <MobileNavButton
                            active={progress.benefits}
                            onClick={() => handleNavClick('benefits')}
                        >
                            Benefits
                        </MobileNavButton>
                        <MobileNavButton
                            active={progress.howItWorks}
                            onClick={() => handleNavClick('how-it-works')}
                        >
                            How It Works
                        </MobileNavButton>
                        <MobileNavButton
                            active={progress.tokenomics}
                            onClick={() => handleNavClick('how-it-works')}
                        >
                            Tokenomics
                        </MobileNavButton>
                        <MobileNavButton
                            active={progress.scarcity}
                            onClick={() => handleNavClick('scarcity')}
                        >
                            Scarcity
                        </MobileNavButton>
                        <MobileNavButton
                            active={progress.trust}
                            onClick={() => handleNavClick('trust')}
                        >
                            Trust
                        </MobileNavButton>
                        <MobileNavButton
                            active={progress.faq}
                            onClick={() => handleNavClick('faq')}
                        >
                            FAQ
                        </MobileNavButton>
                        <div className="pt-2">
                            <button
                                onClick={() =>
                                    (window.location.href =
                                        'https://app.mint.arweave.dev')
                                }
                                className="w-full px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                Launch App
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

// Navigation Button Component for Desktop
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

// Navigation Button Component for Mobile
const MobileNavButton = ({
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
        className={`block w-full text-left px-3 py-2 rounded-md text-base ${
            active
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
        {children}
    </button>
);

export default Navbar;
