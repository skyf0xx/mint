import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import {
    DiscordIcon,
    TelegramIcon,
    TwitterIcon,
} from '@/components/icons/social-icons';

interface SocialLinkProps {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface FooterLinkProps {
    href: string;
    children: ReactNode;
}

interface FooterLinksProps {
    section: 'About' | 'Community' | 'Resources';
}

const Footer = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <footer className="relative overflow-hidden border-t border-gray-200/50">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-30" />

            <div className="relative container mx-auto px-4 py-16">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8"
                >
                    {/* About MINT */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse" />
                            </div>
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                MINT
                            </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            The deflationary token that rewards you with NAB
                            tokens for life.
                        </p>
                        <div className="flex space-x-4">
                            <SocialLink href="#" icon={TwitterIcon} />
                            <SocialLink href="#" icon={DiscordIcon} />
                            <SocialLink href="#" icon={TelegramIcon} />
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    {['About', 'Community', 'Resources'].map((section) => (
                        <motion.div
                            key={section}
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            <h4 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                                {section}
                            </h4>
                            <FooterLinks
                                section={section as FooterLinksProps['section']}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom Section */}
                <motion.div
                    variants={itemVariants}
                    className="mt-16 pt-8 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
                >
                    <p className="text-gray-500 text-sm">
                        © 2025 MINT Token. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <FooterLink href="#">Privacy</FooterLink>
                        <FooterLink href="#">Terms</FooterLink>
                        <FooterLink href="#">Disclaimers</FooterLink>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon }) => (
    <a
        href={href}
        className="p-2 rounded-lg bg-gray-100 hover:bg-primary/10 text-gray-600 hover:text-primary transition-colors duration-300"
    >
        <Icon className="w-5 h-5" />
    </a>
);

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
    <a
        href={href}
        className="text-gray-500 hover:text-primary transition-colors duration-300 text-sm flex items-center space-x-1 group"
    >
        <span>{children}</span>
        <ExternalLink className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
    </a>
);

const FooterLinks: React.FC<FooterLinksProps> = ({ section }) => {
    const links: Record<FooterLinksProps['section'], string[]> = {
        About: ['Overview', 'Documentation', 'Tokenomics'],
        Community: ['Discord', 'Twitter', 'Telegram'],
        Resources: ['FAQ', 'Support', 'Blog'],
    };

    return (
        <ul className="space-y-3">
            {links[section].map((link) => (
                <li key={link}>
                    <FooterLink href="#">{link}</FooterLink>
                </li>
            ))}
        </ul>
    );
};

export default Footer;
