// components/app/shared/token-badge.tsx
import React from 'react';

interface TokenBadgeProps {
    token: string;
    size?: 'sm' | 'md' | 'lg';
}

const TokenBadge = ({ token, size = 'md' }: TokenBadgeProps) => {
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1.5',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full bg-primary/10 text-primary font-medium ${sizeClasses[size]}`}
        >
            {token}
        </span>
    );
};

export default TokenBadge;
