// components/icons/social-icons.tsx
import { siDiscord, siTelegram, siX } from 'simple-icons';

interface SocialIconProps {
    className?: string;
}

export const DiscordIcon = ({ className }: SocialIconProps) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
    >
        <title>Discord</title>
        <path d={siDiscord.path} />
    </svg>
);

export const TelegramIcon = ({ className }: SocialIconProps) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
    >
        <title>Telegram</title>
        <path d={siTelegram.path} />
    </svg>
);

export const TwitterIcon = ({ className }: SocialIconProps) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
    >
        <title>Twitter</title>
        <path d={siX.path} />
    </svg>
);
