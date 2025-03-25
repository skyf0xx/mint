// components/app/education/il-faq.tsx
import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const ILFaq = () => {
    return (
        <Card className="border-2 border-primary/10 shadow-lg">
            <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl flex items-center">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    Impermanent Loss Protection FAQ
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="what-is-il">
                        <AccordionTrigger>
                            What is impermanent loss and why does it happen?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-700 mb-2">
                                Impermanent loss occurs when you provide
                                liquidity to an AMM (Automated Market Maker) and
                                the price of your tokens changes compared to
                                when you deposited them.
                            </p>
                            <p className="text-gray-700">
                                This happens because AMMs use a mathematical
                                formula (usually x*y=k) to maintain a balance
                                between tokens. When prices change, the AMM
                                automatically adjusts the ratio of tokens in the
                                pool, which can result in a different value than
                                if you had simply held your tokens outside the
                                pool. The larger the price change, the greater
                                the impermanent loss.
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="single-sided">
                        <AccordionTrigger>
                            How does single-sided staking work?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-700">
                                With our single-sided staking, you only need to
                                provide one token (e.g., qAR, wAR, NAB, etc.).
                                The protocol automatically provides matching
                                MINT tokens as the other side of the liquidity
                                pair. This creates a complete LP position
                                without requiring you to hold both tokens or
                                sell half your tokens to create a balanced
                                position. It significantly lowers the barrier to
                                entry for providing liquidity while still
                                earning trading fees.
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="protection-vesting">
                        <AccordionTrigger>
                            How does the protection vesting work?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-700 mb-2">
                                Our IL protection vests linearly over 30 days:
                            </p>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-2">
                                <li>
                                    Day 1: 0% protection (1.67% per day vesting
                                    starts)
                                </li>
                                <li>Day 15: 25% protection (15/30 × 50%)</li>
                                <li>
                                    Day 30 and beyond: 50% protection (maximum)
                                </li>
                            </ul>
                            <p className="text-gray-700">
                                The longer you stake, the more protection you
                                receive, up to the maximum of 50%. This
                                incentivizes longer-term liquidity provision
                                while still allowing flexibility to unstake at
                                any time.
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="protection-calculation">
                        <AccordionTrigger>
                            How is the protection amount calculated?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-700 mb-2">
                                The protection amount follows this formula:
                            </p>
                            <div className="bg-gray-50 p-3 rounded-lg mb-2">
                                <code className="font-mono text-sm">
                                    MINT_comp = min(IL_X * Coverage% * R_final,
                                    COMP_CAP)
                                </code>
                            </div>
                            <p className="text-gray-700 mb-2">Where:</p>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>
                                    <strong>IL_X</strong> is your impermanent
                                    loss amount
                                </li>
                                <li>
                                    <strong>Coverage%</strong> is your vested
                                    protection percentage (0-50%)
                                </li>
                                <li>
                                    <strong>R_final</strong> is the final price
                                    ratio of token/MINT
                                </li>
                                <li>
                                    <strong>COMP_CAP</strong> is the maximum
                                    compensation per user (50,000 MINT)
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="early-unstake">
                        <AccordionTrigger>
                            What happens if I unstake early?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-700">
                                You can unstake at any time, but your IL
                                protection will be proportional to how long
                                you&apos;ve been staked. For example, if you
                                unstake after 10 days, you&apos;ll receive
                                approximately 16.7% protection (10/30 × 50%).
                                There are no penalties for early unstaking
                                beyond the reduced protection percentage.
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="when-compensation">
                        <AccordionTrigger>
                            When do I receive the IL compensation?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-700">
                                You receive IL compensation at the time of
                                unstaking. The protection is automatically
                                calculated based on your position&apos;s
                                performance, days staked, and current market
                                conditions. The compensation is added to your
                                unstaking proceeds in a single transaction, so
                                you don&apos;t need to claim it separately.
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="protection-caps">
                        <AccordionTrigger>
                            Are there any limits to the protection?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-700">
                                Yes, there are two caps on the protection:
                            </p>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>
                                    The maximum protection percentage is 50% of
                                    your impermanent loss
                                </li>
                                <li>
                                    There&apos;s a total compensation cap of
                                    50,000 MINT tokens per user
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="profit-impact">
                        <AccordionTrigger>
                            How does IL protection affect my profits?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-700 mb-2">
                                IL protection helps reduce potential losses but
                                doesn&apos;t affect profits directly. Your total
                                returns from staking will consist of:
                            </p>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>
                                    Trading fees earned from liquidity provision
                                </li>
                                <li>Any token appreciation/depreciation</li>
                                <li>
                                    IL protection compensation (if you
                                    experienced impermanent loss)
                                </li>
                            </ul>
                            <p className="text-gray-700 mt-2">
                                You&apos;ll receive 99% of profits when your
                                token appreciates in value, plus you benefit
                                from the protection if prices move unfavorably.
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="compare-traditional">
                        <AccordionTrigger>
                            How does this compare to traditional liquidity
                            provision?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-700 mb-2">
                                Compared to traditional LP strategies, our
                                protocol offers several advantages:
                            </p>
                            <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                <li>
                                    Only need one token to provide{' '}
                                    <span className="font-bold">
                                        liquidity on Botega
                                    </span>
                                    (vs. balanced pairs)
                                </li>
                                <li>
                                    Protection against impermanent loss (up to
                                    50%)
                                </li>
                                <li>
                                    No need to calculate or maintain optimal
                                    token ratios
                                </li>
                                <li>
                                    Reduced complexity and lower barrier to
                                    entry
                                </li>
                                <li>
                                    Incentivized long-term staking through
                                    vesting protection
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="token-rebasing">
                        <AccordionTrigger>
                            How does MINT rebasing affect my position?
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="text-gray-700">
                                MINT token undergoes a weekly 0.25% rebasing
                                (burn rate). This is designed to create token
                                scarcity over time. While this may affect the
                                token supply and potentially its value, the IL
                                protection calculation takes the final price
                                ratio into account. The rebasing mechanism
                                generally benefits long-term stakers as it can
                                increase the value of the MINT tokens used in
                                your liquidity pool.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
};

export default ILFaq;
