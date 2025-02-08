import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        // Handle direct navigation to get-started
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            const search = window.location.search; // Get URL parameters

            if (path.endsWith('/get-started')) {
                // Create the static path for get-started.html
                const newPath = path.endsWith('/')
                    ? path + 'get-started/index.html'
                    : path + '/get-started/index.html';

                // Append the URL parameters to the new path
                window.location.href = newPath + search;
            }
        }
    }, []);

    return <Component {...pageProps} />;
}
