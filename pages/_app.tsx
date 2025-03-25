import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css'; // Add this import
import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer, toast } from 'react-toastify'; // Import toast and ToastContainer

function ErrorFallback({
    error,
    resetErrorBoundary,
}: {
    error: Error;
    resetErrorBoundary: () => void;
}) {
    return (
        <div className="p-4 text-center">
            <h3 className="text-lg font-medium">Something went wrong</h3>
            <p className="mt-2 text-gray-600">{error.message}</p>
            <button
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                onClick={resetErrorBoundary}
            >
                Try again
            </button>
        </div>
    );
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
                // Log error and show toast
                console.error('Caught an error:', error, info);
                toast.error(`Something went wrong: ${error.message}`);
            }}
        >
            <Component {...pageProps} />
            <ToastContainer position="top-right" autoClose={5000} />
        </ErrorBoundary>
    );
}
