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
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
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
