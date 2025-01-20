import React, { useEffect, useState } from 'react';

import Hero from '@/sections/hero';
import Benefits from '@/sections/benefits';
import HowItWorks from '@/sections/how-it-works';
import Trust from '@/sections/trust';
import CTA from '@/sections/cta';
import Footer from '@/sections/footer';
import Navbar from '@/sections/navbar';
import { scrollToSection } from '@/lib/helpers';
import MintSupplyGraph from '@/sections/graph';

// Progress tracking hook
const useScrollProgress = () => {
    const [progress, setProgress] = useState({
        hero: true,
        benefits: false,
        howItWorks: false,
        trust: false,
    });

    useEffect(() => {
        const updateProgress = () => {
            const sections = {
                hero: document.getElementById('hero'),
                benefits: document.getElementById('benefits'),
                howItWorks: document.getElementById('how-it-works'),
                trust: document.getElementById('trust'),
            };

            const viewportHeight = window.innerHeight;
            const scrollPosition = window.scrollY + viewportHeight * 0.3;

            setProgress({
                hero: scrollPosition < (sections.benefits?.offsetTop || 0),
                benefits:
                    scrollPosition >= (sections.benefits?.offsetTop || 0) &&
                    scrollPosition < (sections.howItWorks?.offsetTop || 0),
                howItWorks:
                    scrollPosition >= (sections.howItWorks?.offsetTop || 0) &&
                    scrollPosition < (sections.trust?.offsetTop || 0),
                trust: scrollPosition >= (sections.trust?.offsetTop || 0),
            });
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress();
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return progress;
};

const Home = () => {
    const scrollProgress = useScrollProgress();

    return (
        <div className="min-h-screen bg-white">
            {/* Sticky Navigation */}
            <Navbar
                progress={scrollProgress}
                scrollToSection={scrollToSection}
            />

            {/* Hero Section */}
            <Hero />

            {/* Benefits Section */}
            <Benefits />

            {/* How It Works Section */}
            <HowItWorks />

            {/* Visual section */}
            <MintSupplyGraph />

            {/* Trust Section */}
            <Trust />

            {/* Final CTA */}
            <CTA />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
