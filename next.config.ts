import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        icon: true,
                    },
                },
            ],
        });
        return config;
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },

    allowedDevOrigins: [
        'http://192.168.0.101:3000', // или твой IP и порт
        'http://192.168.0.101:3001', // или твой IP и порт
        'http://localhost:3000',
    ],
};
export default nextConfig;
