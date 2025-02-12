'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/database';

export function AuthCallback() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        const redirectPath = ref
            ? `/get-started/index.html?ref=${ref}`
            : '/get-started/index.html';

        if (ref) {
            localStorage.setItem(
                process.env.NEXT_PUBLIC_REFERRAL_CODE_KEY!,
                ref
            );
        }

        // Handle auth callback
        const handleCallback = async () => {
            const {
                data: { session },
            } = await db.supabase.auth.getSession();
            if (session) {
                window.location.href = redirectPath;
            } else {
                window.location.href = '/';
            }
        };

        handleCallback();
    }, [searchParams]);

    return <div>Processing authentication...</div>;
}
