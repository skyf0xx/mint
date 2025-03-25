// components/app/shared/il-protection-indicator.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ILProtectionIndicatorProps {
    percentage: number;
    daysStaked: number;
    maxDays: number;
}

const ILProtectionIndicator = ({
    percentage,
    daysStaked,
    maxDays,
}: ILProtectionIndicatorProps) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
                <span>IL Protection Progress</span>
                <span>{percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage * 2}%` }} // Multiplying by 2 since max is 50%
                    transition={{ duration: 0.5 }}
                />
            </div>
            <div className="text-xs text-gray-500 text-right">
                {daysStaked} days of {maxDays}
            </div>
        </div>
    );
};

export default ILProtectionIndicator;
