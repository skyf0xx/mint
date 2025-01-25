'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/database';

export function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        const redirectPath = ref ? `/get-started?ref=${ref}` : '/get-started';

        // Handle auth callback
        const handleCallback = async () => {
            const {
                data: { session },
            } = await db.supabase.auth.getSession();
            if (session) {
                router.push(redirectPath);
            } else {
                router.push('/');
            }
        };

        handleCallback();
    }, [searchParams]);

    return <div>Processing authentication...</div>;
}
