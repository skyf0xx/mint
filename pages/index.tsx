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

// Define the progress state type
type ProgressState = {
    hero: boolean;
    benefits: boolean;
    howItWorks: boolean;
    tokenomics: boolean;
    supply: boolean;
    scarcity: boolean;
    trust: boolean;
    faq: boolean;
};

// Progress tracking hook
const useScrollProgress = () => {
    const [progress, setProgress] = useState<ProgressState>({
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
                tokenomics: document.getElementById('tokenomics'),
                supply: document.getElementById('supply-graph'),
                scarcity: document.getElementById('scarcity'),
                trust: document.getElementById('trust'),
                faq: document.getElementById('faq'),
            };

            const viewportHeight = window.innerHeight;
            const scrollPosition = window.scrollY + viewportHeight * 0.3;

            // Get all section offsets
            const sectionOffsets = [
                { id: 'hero', offset: sections.hero?.offsetTop || 0 },
                {
                    id: 'benefits',
                    offset: sections.benefits?.offsetTop || Infinity,
                },
                {
                    id: 'howItWorks',
                    offset: sections.howItWorks?.offsetTop || Infinity,
                },
                {
                    id: 'tokenomics',
                    offset: sections.tokenomics?.offsetTop || Infinity,
                },
                {
                    id: 'supply',
                    offset: sections.supply?.offsetTop || Infinity,
                },
                {
                    id: 'scarcity',
                    offset: sections.scarcity?.offsetTop || Infinity,
                },
                { id: 'trust', offset: sections.trust?.offsetTop || Infinity },
                { id: 'faq', offset: sections.faq?.offsetTop || Infinity },
                { id: 'end', offset: document.body.scrollHeight },
            ].sort((a, b) => a.offset - b.offset);

            // Find active section
            let activeSection = 'hero';
            for (let i = 0; i < sectionOffsets.length - 1; i++) {
                const currentOffset = sectionOffsets[i].offset;
                const nextOffset = sectionOffsets[i + 1].offset;

                if (
                    scrollPosition >= currentOffset &&
                    scrollPosition < nextOffset
                ) {
                    activeSection = sectionOffsets[i].id;
                    break;
                }
            }

            // Create new progress state with only the active section set to true
            const newProgress: ProgressState = {
                hero: activeSection === 'hero',
                benefits: activeSection === 'benefits',
                howItWorks: activeSection === 'howItWorks',
                tokenomics: activeSection === 'tokenomics',
                supply: activeSection === 'supply',
                scarcity: activeSection === 'scarcity',
                trust: activeSection === 'trust',
                faq: activeSection === 'faq',
            };

            setProgress(newProgress);
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initialize on mount

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

            {/* Tokenomics Section */}
            <div id="tokenomics">
                <Tokenomics />
            </div>

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
