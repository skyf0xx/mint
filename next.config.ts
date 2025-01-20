/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: './',
    output: 'export',
    basePath: '',
    images: {
        unoptimized: true,
    },
    reactStrictMode: true,
};

module.exports = nextConfig;
