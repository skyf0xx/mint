// components/app/dashboard/empty-state.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface EmptyStateProps {
    onStartStaking: () => void;
}

const EmptyState = ({ onStartStaking }: EmptyStateProps) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg text-center border border-dashed border-gray-300">
            <p className="text-gray-500">
                You don&apos;t have any active staking positions
            </p>
            <Button
                className="mt-4 bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300"
                onClick={onStartStaking}
            >
                <span className="flex items-center">
                    Start Staking
                    <ChevronRight className="ml-2" />
                </span>
            </Button>
        </div>
    );
};

export default EmptyState;
