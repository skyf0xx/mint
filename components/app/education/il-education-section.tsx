// components/app/education/il-education-section.tsx
import React from 'react';
import ILProtectionInfoCard from './il-protection-info-card';
import ILFaq from './il-faq';
import ILExplainer from './il-explainer';
import { Shield } from 'lucide-react';

interface ILEducationSectionProps {
    onShowDetailedModal: () => void;
}

const ILEducationSection = ({
    onShowDetailedModal,
}: ILEducationSectionProps) => {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary mr-2" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                        Understanding Impermanent Loss Protection
                    </span>
                </h2>
                <p className="text-xl text-gray-600">
                    Learn how our protocol protects your liquidity investments
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-primary/5 p-6 rounded-lg text-center">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <span className="text-2xl font-bold text-primary">
                            1
                        </span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                        Single-Sided Staking
                    </h3>
                    <p className="text-gray-600">
                        Provide liquidity with just one token - no need to split
                        your holdings or manage token pairs
                    </p>
                </div>

                <div className="bg-primary/5 p-6 rounded-lg text-center">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <span className="text-2xl font-bold text-primary">
                            2
                        </span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                        Vesting Protection
                    </h3>
                    <p className="text-gray-600">
                        Protection vests linearly over 30 days, reaching up to
                        50% coverage of any impermanent loss
                    </p>
                </div>

                <div className="bg-primary/5 p-6 rounded-lg text-center">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <span className="text-2xl font-bold text-primary">
                            3
                        </span>
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                        Automatic Compensation
                    </h3>
                    <p className="text-gray-600">
                        Receive protection automatically when you unstake - no
                        need to file claims or perform extra steps
                    </p>
                </div>
            </div>

            <div className="mb-10">
                <ILExplainer />
            </div>

            <div className="mb-10">
                <ILFaq />
            </div>

            <div className="mb-10">
                <div className="bg-primary/5 p-8 rounded-lg text-center">
                    <h3 className="text-2xl font-medium mb-4">
                        Ready to Start Staking?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Put your tokens to work with the confidence of
                        impermanent loss protection. Our single-sided staking
                        solution makes it easy to earn yields while minimizing
                        risk.
                    </p>
                    <ILProtectionInfoCard onLearnMore={onShowDetailedModal} />
                </div>
            </div>
        </div>
    );
};

export default ILEducationSection;
