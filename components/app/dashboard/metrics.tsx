// components/app/dashboard/metrics.tsx
import React from 'react';
import { useStakingStore } from '@/store/staking-store';
import { ChartBarIcon, ShieldCheckIcon, Calendar, Layers } from 'lucide-react';

interface MetricsProps {
    address: string | null;
}

const DashboardMetrics = ({ address }: MetricsProps) => {
    const { dashboardMetrics } = useStakingStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <ChartBarIcon className="h-5 w-5 text-primary mr-2" />
                    <div className="text-sm text-gray-500">Total Staked</div>
                </div>
                <div className="font-medium text-xl text-gray-700">
                    {dashboardMetrics.totalStaked}
                </div>
                <div className="text-xs text-gray-500 mt-1 truncate">
                    {dashboardMetrics.totalTokens}
                </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <ShieldCheckIcon className="h-5 w-5 text-primary mr-2" />
                    <div className="text-sm text-gray-500">IL Protection</div>
                </div>
                <div className="font-medium text-xl text-gray-700">
                    {dashboardMetrics.averageILProtection.toFixed(1)}%{' '}
                    <span className="text-sm text-gray-500">coverage</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Vests to max 50% over 30 days
                </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <Layers className="h-5 w-5 text-primary mr-2" />
                    <div className="text-sm text-gray-500">Positions</div>
                </div>
                <div className="font-medium text-xl text-gray-700">
                    {dashboardMetrics.positionsCount}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Active staking positions
                </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <div className="text-sm text-gray-500">Oldest Position</div>
                </div>
                <div className="font-medium text-xl text-gray-700">
                    {dashboardMetrics.oldestPosition}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Affects IL protection vesting
                </div>
            </div>

            {address && (
                <div className="md:col-span-4 bg-gray-50 p-3 rounded-lg mt-2">
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
