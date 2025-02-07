import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function Terms() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                        Terms of Service
                    </h1>

                    <div className="prose prose-gray max-w-none space-y-6">
                        <p className="text-gray-600">
                            By using MINT, you agree to these terms. Please read
                            them carefully.
                        </p>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                1. Service Description
                            </h2>
                            <p className="text-gray-600">
                                MINT is a deflationary cryptocurrency token
                                deployed on the AO blockchain. The service
                                includes staking mechanisms, reward
                                distribution, and referral systems.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                2. User Responsibilities
                            </h2>
                            <p className="text-gray-600">
                                Users are responsible for:
                            </p>
                            <ul className="text-gray-600 list-disc pl-6">
                                <li>
                                    Maintaining the security of their wallet and
                                    credentials
                                </li>
                                <li>
                                    Providing accurate information for referrals
                                    and rewards
                                </li>
                                <li>
                                    Complying with all applicable laws and
                                    regulations
                                </li>
                                <li>
                                    Using the service in good faith and not for
                                    fraudulent purposes
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                3. Risks and Disclaimers
                            </h2>
                            <p className="text-gray-600">
                                Cryptocurrency investments carry inherent risks.
                                Users acknowledge that:
                            </p>
                            <ul className="text-gray-600 list-disc pl-6">
                                <li>
                                    Token values can fluctuate significantly
                                </li>
                                <li>
                                    Past performance doesn&apos;t guarantee
                                    future results
                                </li>
                                <li>
                                    Users should not stake more than they can
                                    afford to lose
                                </li>
                                <li>
                                    Smart contract interactions carry technical
                                    risks
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                4. Rewards and Staking
                            </h2>
                            <p className="text-gray-600">
                                Reward rates and staking mechanisms are subject
                                to the protocol&apos;s mathematical models and
                                may change based on supply and demand dynamics.
                                Permanent staking means tokens cannot be
                                unstaked once committed.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                5. Modifications
                            </h2>
                            <p className="text-gray-600">
                                We reserve the right to modify these terms at
                                any time. Continued use of MINT after changes
                                constitutes acceptance of new terms.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                6. Limitation of Liability
                            </h2>
                            <p className="text-gray-600">
                                MINT and its developers are not liable for any
                                losses or damages resulting from use of the
                                service, including but not limited to direct,
                                indirect, incidental, punitive, and
                                consequential damages.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                7. Governing Law
                            </h2>
                            <p className="text-gray-600">
                                These terms are governed by and construed in
                                accordance with applicable laws, without regard
                                to conflict of law principles.
                            </p>
                        </section>

                        <p className="text-sm text-gray-500 mt-8">
                            Last updated: February 7, 2025
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
    return <Terms />;
}
