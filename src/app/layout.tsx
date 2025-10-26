'use client';
import dynamic from 'next/dynamic';
import './globals.css';
import { ReduxProvider } from '@/lib/providers/ReduxProvider';
import { Inter } from 'next/font/google';
import NavBottom from '@/components/NavBottom';
import UserAutoUpdater from '@/components/UserAutoUpdater';
const inter = Inter({ subsets: ['latin'] });

const TelegramAuthClient = dynamic(() => import('@/components/TelegramAuthClient'), { ssr: false });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="theme-color" content="#8B5CF6" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Lynx Wallet" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="application-name" content="Lynx Wallet" />
                <meta name="msapplication-TileColor" content="#8B5CF6" />
                <meta name="msapplication-tap-highlight" content="no" />

                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/logo_yellow.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/logo_yellow.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/logo_yellow.png" />

                <title>Lynx Wallet Bot</title>
                <meta name="description" content="Современный Telegram кошелек с поддержкой криптовалют" />

                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', function() {
                                    navigator.serviceWorker.register('/sw.js')
                                        .then(function(registration) {
                                            console.log('SW registered: ', registration);
                                        })
                                        .catch(function(registrationError) {
                                            console.log('SW registration failed: ', registrationError);
                                        });
                                });
                            }
                        `,
                    }}
                />
            </head>
            <body className={`antialiased ${inter.className} `}>
                <ReduxProvider>
                    <TelegramAuthClient />
                    <UserAutoUpdater />
                    {children}
                    <NavBottom />
                </ReduxProvider>
            </body>
        </html>
    );
}
