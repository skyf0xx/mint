'use client';

import { useEffect, useState } from 'react';
import ReferralFlow from '@/components/referral-flow';
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

export default function ReferralPage() {
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Get referral code from URL query parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get('ref');

        if (!code) {
            // If no referral code is provided, redirect to home
            window.location.href = '/';
            return;
        }

        setReferralCode(code);
        // Store referral code in localStorage
        localStorage.setItem(process.env.NEXT_PUBLIC_REFERRAL_CODE_KEY!, code);
    }, []);

    // Don't render anything until we're on the client
    if (!isClient) {
        return null;
    }

    // Only show the referral flow if we have a referral code
    return referralCode ? <ReferralFlow /> : null;
}
