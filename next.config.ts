/** @type {import('next').NextConfig} */

const nextConfig = {
    assetPrefix: './',
    output: 'export',
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
