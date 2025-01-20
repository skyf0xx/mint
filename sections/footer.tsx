const Footer = () => {
    return (
        <footer className="border-t py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h4 className="font-bold mb-4">About MINT</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Overview
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Tokenomics
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Community</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Discord
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Telegram
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Resources</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <a href="#" className="hover:text-primary">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Support
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary">
                                    Disclaimers
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t text-center text-gray-600">
                    <p>© 2025 MINT Token. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
