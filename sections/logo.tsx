import Image from 'next/image';

export const InfinityLogo = () => (
    <div className="mx-auto mb-6 relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 p-4 border-2 border-primary/20 shadow-lg shadow-primary/10">
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-transparent" />

        {/* Logo container */}
        <div className="relative w-full h-full">
            <Image
                src="/images/infinity.png"
                alt="MINT Token Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    </div>
);
