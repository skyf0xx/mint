// components/app/education/il-protection-info-card.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ILProtectionInfoCardProps {
    onLearnMore: () => void;
    compact?: boolean;
}

const ILProtectionInfoCard = ({
    onLearnMore,
    compact = false,
}: ILProtectionInfoCardProps) => {
    if (compact) {
        return (
            <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start">
                            <Shield className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium">
                                    Impermanent Loss Protection
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    Vests linearly to 50% over 30 days
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary h-8 px-2"
                            onClick={onLearnMore}
                        >
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    Impermanent Loss Protection
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-3">
                    Our protocol provides protection against impermanent loss
                    that vests linearly over 30 days, up to a maximum of 50%
                    coverage.
                </p>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                        <span>Day 1</span>
                        <span>0% protection</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-0"></div>
                    </div>

                    <div className="flex justify-between text-xs">
                        <span>Day 15</span>
                        <span>25% protection</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/2"></div>
                    </div>

                    <div className="flex justify-between text-xs">
                        <span>Day 30+</span>
                        <span>50% protection (max)</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-full"></div>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-primary border-primary/30 flex items-center justify-center"
                    onClick={onLearnMore}
                >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Learn More
                </Button>
            </CardContent>
        </Card>
    );
};

export default ILProtectionInfoCard;
