// components/app/dashboard/header.tsx
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { ArweaveWalletButton } from '@/components/ArweaveWalletButton';

interface DashboardHeaderProps {
    title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
    return (
        <div className="flex justify-between items-center">
            <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                {title}
            </CardTitle>
            <ArweaveWalletButton />
        </div>
    );
};

export default DashboardHeader;
