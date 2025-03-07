// components/app/dashboard/metrics.tsx
import React from 'react';
import { useStakingStore } from '@/store/staking-store';
import { ChartBarIcon, ShieldCheckIcon, CurrencyIcon } from 'lucide-react';

interface MetricsProps {
    address: string | null;
}

const DashboardMetrics = ({ address }: MetricsProps) => {
    const { dashboardMetrics } = useStakingStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <ChartBarIcon className="h-5 w-5 text-primary mr-2" />
                    <div className="text-sm text-gray-500">Total Staked</div>
                </div>
                <div className="font-medium text-xl text-gray-700">
                    {dashboardMetrics.totalStaked}
                </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <ShieldCheckIcon className="h-5 w-5 text-primary mr-2" />
                    <div className="text-sm text-gray-500">IL Protection</div>
                </div>
                <div className="font-medium text-xl text-gray-700">
                    {dashboardMetrics.averageILProtection.toFixed(1)}%{' '}
                    <span className="text-sm text-gray-500">average</span>
                </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <CurrencyIcon className="h-5 w-5 text-primary mr-2" />
                    <div className="text-sm text-gray-500">Total Earned</div>
                </div>
                <div className="font-medium text-xl text-green-600">
                    {dashboardMetrics.totalEarned}
                </div>
            </div>

            {address && (
                <div className="md:col-span-3 bg-gray-50 p-3 rounded-lg mt-2">
                    <div className="text-xs text-gray-500">
                        Connected Address
                    </div>
                    <div className="font-mono text-sm text-gray-700 truncate">
                        {address}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardMetrics;
