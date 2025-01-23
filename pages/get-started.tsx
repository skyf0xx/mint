import ReferralFlow from '@/components/referral-flow';
import { useSearchParams } from 'next/navigation';

export default function GetStartedPage() {
    const searchParams = useSearchParams();
    const referralCode = searchParams.get('ref');

    return <ReferralFlow initialReferralCode={referralCode} />;
}
