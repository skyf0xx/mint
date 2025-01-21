import { motion } from 'framer-motion';
import {
    DiscordIcon,
    TelegramIcon,
    TwitterIcon,
} from '@/components/icons/social-icons';

interface SocialLinkProps {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}

const SocialLink = ({ href, icon: Icon, label }: SocialLinkProps) => (
    <motion.a
        target="_blank"
        href={href}
        className="p-3 rounded-lg hover:bg-primary/10 text-gray-600 hover:text-primary transition-all duration-300 relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={label}
    >
        <Icon className="w-5 h-5" />
    </motion.a>
);

const Footer = () => {
    const socialLinks = [
        {
            href: 'https://x.com/Mithril_Labs',
            icon: TwitterIcon,
            label: 'Follow us on Twitter',
        },
        {
            href: 'https://discord.gg/RSXg24mCrJ',
            icon: DiscordIcon,
            label: 'Join our Discord',
        },
        {
            href: 'https://t.me/+kbiXF8FXhI9hZTUx',
            icon: TelegramIcon,
            label: 'Join our Telegram',
        },
    ];

    return (
        <footer className="relative py-8 bg-gradient-to-b from-white to-gray-50/50 border-t border-gray-200/50">
            <div className="container mx-auto px-4">
                <motion.div
                    className="flex flex-col items-center justify-center space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center space-x-4">
                        {socialLinks.map((link) => (
                            <SocialLink
                                key={link.label}
                                href={link.href}
                                icon={link.icon}
                                label={link.label}
                            />
                        ))}
                    </div>

                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} MINT Token
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
