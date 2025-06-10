// components/app/education/il-protection-modal.tsx
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

interface ILProtectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ILProtectionModal = ({ isOpen, onClose }: ILProtectionModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                        Understanding Impermanent Loss Protection
                    </DialogTitle>
                    <DialogDescription>
                        Learn how our protocol protects you from the risks of
                        providing liquidity
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full space-y-4"
                    >
                        <AccordionItem
                            value="item-1"
                            className="border rounded-lg px-4"
                        >
                            <AccordionTrigger className="text-lg font-medium py-4 flex items-center hover:no-underline">
                                <div className="flex items-center">
                                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                                    What is Impermanent Loss?
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        Impermanent Loss (IL) occurs when the
                                        price ratio between two tokens in a
                                        liquidity pool changes compared to when
                                        you deposited them. The greater the
                                        price change, the more IL you
                                        experience.
                                    </p>
                                    <div className="bg-amber-50 p-4 rounded-lg mt-2">
                                        <p className="text-amber-800">
                                            <strong>Example:</strong> If you
                                            deposit 100 GAME when 1 GAME = 0.5
                                            MINT, and later the price changes to
                                            1 GAME = 0.8 MINT, your position
                                            would be worth less than if you had
                                            simply held the tokens outside the
                                            pool.
                                        </p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-2"
                            className="border rounded-lg px-4"
                        >
                            <AccordionTrigger className="text-lg font-medium py-4 flex items-center hover:no-underline">
                                <div className="flex items-center">
                                    <Shield className="h-5 w-5 text-primary mr-2" />
                                    Our Protection Mechanism
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        Our protocol provides protection against
                                        impermanent loss that{' '}
                                        <strong>
                                            vests linearly over 30 days
                                        </strong>
                                        , reaching a maximum of 50% coverage.
                                    </p>

                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                                <span>Day 1</span>
                                            </div>
                                            <div className="font-medium">
                                                0% protection
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-0"></div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                                <span>Day 15</span>
                                            </div>
                                            <div className="font-medium">
                                                25% protection
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-1/2"></div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                                <span>Day 30+</span>
                                            </div>
                                            <div className="font-medium">
                                                50% protection (maximum)
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-3"
                            className="border rounded-lg px-4"
                        >
                            <AccordionTrigger className="text-lg font-medium py-4 flex items-center hover:no-underline">
                                <div className="flex items-center">
                                    <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                                    How Protection is Calculated
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        The protection follows this formula:
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <code className="text-xs font-mono block mb-2">
                                            MINT_compensation = min(IL_X *
                                            Coverage% * R_final, COMP_CAP)
                                        </code>
                                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                            <li>
                                                <strong>IL_X</strong>:
                                                Impermanent loss amount in
                                                tokens
                                            </li>
                                            <li>
                                                <strong>Coverage%</strong>:
                                                min(days_staked / 30, 1) * 50%
                                            </li>
                                            <li>
                                                <strong>R_final</strong>: Final
                                                price ratio of token/MINT
                                            </li>
                                            <li>
                                                <strong>COMP_CAP</strong>:
                                                Maximum compensation (50,000
                                                MINT)
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-4"
                            className="border rounded-lg px-4"
                        >
                            <AccordionTrigger className="text-lg font-medium py-4 flex items-center hover:no-underline">
                                Protection Examples
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <div className="space-y-2">
                                    <div className="bg-primary/5 p-4 rounded-lg space-y-4">
                                        <div>
                                            <h4 className="font-medium text-primary">
                                                Example 1: 15 Days Staked
                                            </h4>
                                            <p className="text-gray-600 mt-1">
                                                You stake 100 GAME and after 15
                                                days your position is worth 90
                                                GAME:
                                            </p>
                                            <ul className="list-disc pl-5 mt-1 text-gray-600">
                                                <li>
                                                    Impermanent loss: 10 GAME
                                                </li>
                                                <li>
                                                    Protection coverage: 25%
                                                    (15/30 days × 50%)
                                                </li>
                                                <li>
                                                    Compensation: 2.5 GAME
                                                    equivalent in MINT tokens
                                                </li>
                                                <li>
                                                    You receive: 90 GAME + MINT
                                                    compensation
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-primary">
                                                Example 2: 30 Days Staked
                                            </h4>
                                            <p className="text-gray-600 mt-1">
                                                You stake 100 GAME and after 30
                                                days your position is worth 85
                                                GAME:
                                            </p>
                                            <ul className="list-disc pl-5 mt-1 text-gray-600">
                                                <li>
                                                    Impermanent loss: 15 GAME
                                                </li>
                                                <li>
                                                    Protection coverage: 50%
                                                    (maximum)
                                                </li>
                                                <li>
                                                    Compensation: 7.5 GAME
                                                    equivalent in MINT tokens
                                                </li>
                                                <li>
                                                    You receive: 85 GAME + MINT
                                                    compensation
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mt-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                            <p className="text-sm text-blue-800 flex items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 mr-2 flex-shrink-0"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <span>
                                                    <strong>Note:</strong>{' '}
                                                    Impermanent loss protection
                                                    is paid in MINT tokens, not
                                                    in the original token. The
                                                    value is equivalent to the
                                                    calculated coverage amount.
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-5"
                            className="border rounded-lg px-4"
                        >
                            <AccordionTrigger className="text-lg font-medium py-4 flex items-center hover:no-underline">
                                Key Benefits
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-green-700">
                                            Reduced Risk
                                        </h4>
                                        <p className="text-green-600 text-sm mt-1">
                                            Partial protection against market
                                            volatility while still earning
                                            yields
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-blue-700">
                                            Single-Sided Convenience
                                        </h4>
                                        <p className="text-blue-600 text-sm mt-1">
                                            Provide{' '}
                                            <span className="font-bold">
                                                liquidity on Botega
                                            </span>{' '}
                                            with just one token - no need to
                                            split your holdings
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-purple-700">
                                            Incentivized Long-Term Staking
                                        </h4>
                                        <p className="text-purple-600 text-sm mt-1">
                                            The longer you stake, the more
                                            protection you receive
                                        </p>
                                    </div>
                                    <div className="bg-indigo-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-indigo-700">
                                            Transparent Mechanics
                                        </h4>
                                        <p className="text-indigo-600 text-sm mt-1">
                                            Clear formula and vesting schedule
                                            so you know exactly what to expect
                                        </p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-6"
                            className="border rounded-lg px-4"
                        >
                            <AccordionTrigger className="text-lg font-medium py-4 flex items-center hover:no-underline">
                                Important Notes
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                    <li>
                                        Protection applies only when you unstake
                                        your position
                                    </li>
                                    <li>
                                        The maximum protection is capped at 50%
                                        of your impermanent loss
                                    </li>
                                    <li>
                                        Total compensation per user is capped at
                                        50,000 MINT tokens
                                    </li>
                                    <li>
                                        The protection calculation uses the
                                        final price ratio at unstaking time
                                    </li>
                                    <li>
                                        Protection payments are limited by the
                                        available MINT in the{' '}
                                        <a
                                            href="#"
                                            className="text-primary hover:underline"
                                        >
                                            Protection Treasury
                                        </a>
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        className="bg-gradient-to-r from-primary to-primary-600 hover:to-primary transition-all duration-300"
                        onClick={onClose}
                    >
                        Got It
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ILProtectionModal;
