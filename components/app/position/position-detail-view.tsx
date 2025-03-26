import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, BarChart3, Info } from 'lucide-react';
import { StakingPosition } from '@/types/staking';
import ILProtectionIndicator from '@/components/app/shared/il-protection-indicator';
import TokenBadge from '@/components/app/shared/token-badge';
import { motion } from 'framer-motion';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface PositionDetailViewProps {
    position: StakingPosition;
    onBack: () => void;
    onUnstake: () => void;
    onShowILInfo: () => void;
    isInMaintenance?: boolean;
}

const PositionDetailView: React.FC<PositionDetailViewProps> = ({
    position,
    onBack,
    onUnstake,
    onShowILInfo,
    isInMaintenance = false,
}) => {
    // Calculate days staked
    const daysStaked = Math.floor(
        (new Date().getTime() - new Date(position.stakedDate).getTime()) /
            (1000 * 60 * 60 * 24)
    );

    // Calculate remaining days until full protection
    const remainingDays = Math.max(0, 30 - daysStaked);

    // Calculate estimated date for full protection
    const fullProtectionDate = new Date();
    fullProtectionDate.setDate(fullProtectionDate.getDate() + remainingDays);

    // Format date for display
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
        >
            <Card className="border-2 border-primary/10 shadow-lg overflow-hidden">
                <CardHeader className="border-b border-gray-100">
                    <div className="flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="flex items-center text-gray-600 px-2 -ml-2"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Dashboard
                        </Button>
                        <TokenBadge token={position.tokenSymbol} />
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">
                                Staked Amount
                            </div>
                            <div className="text-lg font-semibold">
                                {position.formattedTokenAmount}{' '}
                                {position.tokenSymbol}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">
                                Time Staked
                            </div>
                            <div className="text-lg font-semibold">
                                {daysStaked} days
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Since{' '}
                                {formatDate(new Date(position.stakedDate))}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">
                                IL Protection
                            </div>
                            <div className="text-lg font-semibold">
                                {position.ilProtectionPercentage}%
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {position.ilProtectionPercentage < 50
                                    ? `Full protection on ${formatDate(
                                          fullProtectionDate
                                      )}`
                                    : 'Fully protected'}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-medium">
                                Impermanent Loss Protection Progress
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 p-0 px-2 text-primary"
                                            onClick={onShowILInfo}
                                        >
                                            <Info className="h-4 w-4 mr-1" />
                                            Learn more
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-sm">
                                            View detailed information about
                                            impermanent loss protection
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <ILProtectionIndicator
                            percentage={position.ilProtectionPercentage}
                            daysStaked={daysStaked}
                            maxDays={30}
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-medium">Position Details</div>
                            <div className="flex items-center text-xs text-gray-500">
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Pool: {position.tokenSymbol}/MINT
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">
                                    LP Tokens
                                </div>
                                <div className="font-medium">
                                    {position.formattedLpTokens || '0.00'}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 mb-1">
                                    Initial Mint Amount
                                </div>
                                <div className="font-medium">
                                    {position.mintAmount || '0.00'} MINT
                                </div>
                            </div>
                        </div>
                    </div>

                    {isInMaintenance && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 flex items-start">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">
                                    Unstaking Temporarily Unavailable
                                </p>
                                <p className="text-sm mt-1">
                                    Unstaking is temporarily disabled during
                                    maintenance. Your position remains active
                                    and continues to earn rewards and accrue
                                    protection.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between p-6 border-t border-gray-100">
                    <Button variant="outline" onClick={onBack}>
                        Back to Dashboard
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onUnstake}
                        disabled={isInMaintenance}
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        {isInMaintenance ? (
                            <>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Maintenance Mode
                            </>
                        ) : (
                            'Unstake'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default PositionDetailView;
