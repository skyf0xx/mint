import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        // Handle direct navigation to get-started
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            if (path.endsWith('/get-started')) {
                // Create the static path for get-started.html
                const newPath = path.endsWith('/')
                    ? path + 'get-started.html'
                    : path + '/get-started.html';
                window.location.href = newPath;
            }
        }
    }, []);

    return <Component {...pageProps} />;
}
