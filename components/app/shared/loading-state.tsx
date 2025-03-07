// components/app/shared/loading-state.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
}

const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-gray-600">{message}</p>
        </div>
    );
};

export default LoadingState;
