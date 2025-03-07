// components/app/dashboard/positions-list.tsx
import React from 'react';

// This will be populated later with actual position data
interface Position {
    id: string;
    token: string;
    amount: string;
    stakedDate: Date;
    ilProtectionPercentage: number;
}

interface PositionsListProps {
    positions: Position[];
    onViewPosition: (id: string) => void;
    onUnstake: (id: string) => void;
}

const PositionsList = ({
    positions,
    onViewPosition,
    onUnstake,
}: PositionsListProps) => {
    // This is a placeholder - will be implemented fully later
    return (
        <div className="space-y-4">
            <div className="text-lg font-medium">Your Positions</div>
            <div className="space-y-3">
                {positions.map((position) => (
                    <div
                        key={position.id}
                        className="border border-gray-200 rounded-lg p-4"
                    >
                        {/* Position details will go here */}
                        <div>Position placeholder for {position.token}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PositionsList;
