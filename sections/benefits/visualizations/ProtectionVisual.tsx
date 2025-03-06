import { useState } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const ProtectionVisual = () => {
    const [day, setDay] = useState(15);
    const protectionPercentage = Math.min(Math.floor((day / 30) * 50), 50);

    return (
        <div className="w-full space-y-6 py-2">
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Day {day}</div>
                <div className="text-lg font-bold text-primary">
                    {protectionPercentage}% Protected
                </div>
            </div>

            <div className="relative">
                <Progress value={(day / 30) * 100} className="h-3" />
                <motion.input
                    type="range"
                    min="0"
                    max="30"
                    value={day}
                    onChange={(e) => setDay(parseInt(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    whileTap={{ scale: 1.05 }}
                />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
                <div>Day 0 (0%)</div>
                <div>Day 15 (25%)</div>
                <div>Day 30 (50%)</div>
            </div>
        </div>
    );
};

export default ProtectionVisual;
