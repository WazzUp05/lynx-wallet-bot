import './globals.css';
import { Inter } from 'next/font/google';
import ClientComponents from '@/components/ClientComponents';
import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    userScalable: false,
    maximumScale: 1,
    minimumScale: 1,
};

export const metadata: Metadata = {
    title: 'Lynx Wallet Bot',
    description: 'Современный Telegram кошелек с поддержкой криптовалют',
    themeColor: '#8B5CF6',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Lynx Wallet',
    },
    manifest: '/manifest.json',
    icons: {
        icon: '/logo_yellow.png',
        apple: '/logo_yellow.png',
    },
    other: {
        'mobile-web-app-capable': 'yes',
        'application-name': 'Lynx Wallet',
        'msapplication-TileColor': '#8B5CF6',
        'msapplication-tap-highlight': 'no',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <head>
                <script src="https://telegram.org/js/telegram-web-app.js"></script>
            </head>
            <body className={`antialiased ${inter.className} `}>
                <ClientComponents>{children}</ClientComponents>
            </body>
        </html>
    );
}
