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
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MINT Token | Stake Once, Earn Forever',
    description:
        'Transform your crypto strategy with MINT — the deflationary token that rewards you with NAB tokens for life. Join the future of sustainable yield generation.',
    openGraph: {
        type: 'website',
        url: 'https://mithril-mint-token.ar.io/',
        title: 'MINT Token | Stake Once, Earn Forever',
        description:
            'Transform your crypto strategy with MINT — the deflationary token that rewards you with NAB tokens for life.',
        siteName: 'MINT Token',
        images: [
            {
                url: '/og-image.jpg', // Make sure to add this image to your public folder
                width: 1200,
                height: 630,
                alt: 'MINT Token - Stake Once, Earn Forever',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@mithril_labs',
        creator: '@mithril_labs',
        title: 'MINT Token | Infinite Crypto Rewards',
        description:
            'Stake MINT once, earn NAB forever. Join the future of sustainable yield generation.',
        images: ['/twitter-card.jpg'],
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    keywords: [
        'MINT token',
        'crypto staking',
        'NAB token',
        'yield generation',
        'deflationary token',
        'crypto rewards',
        'perpetual earnings',
        'DeFi',
    ],
    authors: [
        { name: 'Mithril Labs', url: 'https://mithril-mint-token.ar.io/' },
    ],
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    robots: 'index, follow',
    themeColor: '#4338ca',
};

// Progress tracking hook
const useScrollProgress = () => {
    const [progress, setProgress] = useState({
        hero: true,
        benefits: false,
        howItWorks: false,
        trust: false,
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

            {/* Scarcity Mechanics Section */}
            <ScarcityMechanics />

            {/* Trust Section */}
            <Trust />

            {/* Final CTA */}
            <CTA />

            <FAQ />

            {/* Footer */}
            <Footer />

            {/* Back to Top Button */}
            <BackToTop />
        </div>
    );
};

export default Home;
