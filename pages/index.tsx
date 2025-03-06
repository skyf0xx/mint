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
import BackToTop from '@/components/back-to-top';
import FAQ from '@/sections/faq';
import ScarcityMechanics from '@/sections/scarcity';
import Tokenomics from '@/sections/tokenomics';

// Progress tracking hook
const useScrollProgress = () => {
    const [progress, setProgress] = useState({
        hero: true,
        benefits: false,
        howItWorks: false,
        tokenomics: false,
        supply: false,
        scarcity: false,
        trust: false,
        faq: false,
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const path = params.get('p');
        if (path) {
            window.location.href = path;
        }
    }, []);

    useEffect(() => {
        const updateProgress = () => {
            const sections = {
                hero: document.getElementById('hero'),
                benefits: document.getElementById('benefits'),
                howItWorks: document.getElementById('how-it-works'),
                tokenomics: document.getElementById('how-it-works'), // Uses same section ID
                supply: document.getElementById('supply-graph'),
                scarcity: document.getElementById('scarcity'),
                trust: document.getElementById('trust'),
                faq: document.getElementById('faq'),
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
                    scrollPosition < (sections.tokenomics?.offsetTop || 0),
                tokenomics:
                    scrollPosition >= (sections.tokenomics?.offsetTop || 0) &&
                    scrollPosition < (sections.supply?.offsetTop || 0),
                supply:
                    scrollPosition >= (sections.supply?.offsetTop || 0) &&
                    scrollPosition < (sections.scarcity?.offsetTop || 0),
                scarcity:
                    scrollPosition >= (sections.scarcity?.offsetTop || 0) &&
                    scrollPosition < (sections.trust?.offsetTop || 0),
                trust:
                    scrollPosition >= (sections.trust?.offsetTop || 0) &&
                    scrollPosition < (sections.faq?.offsetTop || 0),
                faq: scrollPosition >= (sections.faq?.offsetTop || 0),
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

            {/* How It Works Section */}
            <HowItWorks />

            {/* Benefits Section */}
            <Benefits />

            {/* Tokenomics Section */}
            <Tokenomics />

            {/* Visual section */}
            <div id="supply-graph">
                <MintSupplyGraph />
            </div>

            {/* Scarcity Mechanics Section */}
            <div id="scarcity">
                <ScarcityMechanics />
            </div>

            {/* Trust Section */}
            <Trust />

            {/* FAQ Section */}
            <div id="faq">
                <FAQ />
            </div>

            {/* Final CTA */}
            <CTA />

            {/* Footer */}
            <Footer />

            {/* Back to Top Button */}
            <BackToTop />
        </div>
    );
};

export default Home;
