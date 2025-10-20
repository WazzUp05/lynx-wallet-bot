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
    experimental: {
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        },
    },
    // Убираем allowedDevOrigins для продакшена
    ...(process.env.NODE_ENV === 'development' && {
        allowedDevOrigins: ['http://192.168.0.101:3000', 'http://192.168.0.101:3001', 'http://localhost:3000'],
    }),
    // Дополнительные настройки для стабильности
    output: 'standalone',
    poweredByHeader: false,
    compress: true,
};
export default nextConfig;
