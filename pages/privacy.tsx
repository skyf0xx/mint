import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function Privacy() {
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
                        Privacy Policy
                    </h1>

                    <div className="prose prose-gray max-w-none space-y-6">
                        <p className="text-gray-600">
                            MINT respects and protects the privacy of all users.
                            This policy explains how we collect and use
                            information.
                        </p>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Information We Collect
                            </h2>
                            <p className="text-gray-600">
                                We collect wallet addresses and Twitter
                                information only when voluntarily provided
                                through our referral system. This information is
                                used solely for managing rewards and referral
                                tracking.
                            </p>
                            <p className="text-gray-600">
                                Once the reward period is completed, all
                                collected information will be deleted.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                How We Use Information
                            </h2>
                            <p className="text-gray-600">
                                Your information is used exclusively for:
                            </p>
                            <ul className="text-gray-600 list-disc pl-6">
                                <li>Processing rewards and referrals</li>
                                <li>Verifying eligibility for rewards</li>
                                <li>Preventing fraud and abuse</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Data Protection
                            </h2>
                            <p className="text-gray-600">
                                All collected information is stored securely. We
                                never sell or share your personal information
                                with third parties except when required by law.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Contact
                            </h2>
                            <p className="text-gray-600">
                                For privacy concerns or questions, please reach
                                out to us through our Discord community.
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
    return <Privacy />;
}
