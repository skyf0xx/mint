/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
    assetPrefix: isProduction
        ? 'https://mithril-mint-token.ar.io'
        : 'http://localhost:3000',
    output: 'export',
    trailingSlash: true,
    basePath: '',
    images: {
        unoptimized: true,
    },
    reactStrictMode: true,
    async exportPathMap(defaultPathMap: Record<string, { page: string }>) {
        return {
            ...defaultPathMap,
        };
    },
};

module.exports = nextConfig;
