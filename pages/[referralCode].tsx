// pages/[referralCode].tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ReferralFlow from '@/components/referral-flow';

export default function ReferralPage() {
    const router = useRouter();
    const { referralCode } = router.query;

    useEffect(() => {
        // Store referral code in localStorage when user lands
        if (referralCode && typeof referralCode === 'string') {
            localStorage.setItem('pendingReferralCodeV1', referralCode);
        }
    }, [referralCode]);

    return <ReferralFlow />;
}
