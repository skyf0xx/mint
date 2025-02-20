'use client';

import { useEffect, useState } from 'react';
import ReferralFlow from '@/components/referral-flow';

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
