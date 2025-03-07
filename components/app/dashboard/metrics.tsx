// components/app/dashboard/metrics.tsx
import React from 'react';

interface MetricsProps {
    address: string | null;
}

const DashboardMetrics = ({ address }: MetricsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-primary/5 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">
                    Connected Address
                </div>
                <div className="font-medium text-gray-700 truncate">
                    {address}
                </div>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">
                    IL Protection Status
                </div>
                <div className="font-medium text-primary">
                    Active - 50% Coverage Max
                </div>
            </div>
        </div>
    );
};

export default DashboardMetrics;
