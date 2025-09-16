"use client";
import dynamic from "next/dynamic";
import "./globals.css";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { Inter } from "next/font/google";
import NavBottom from "@/components/NavBottom";
const inter = Inter({ subsets: ["latin"] });

const TelegramAuthClient = dynamic(() => import("@/components/TelegramAuthClient"), { ssr: false });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased ${inter.className} `}>
                <ReduxProvider>
                    <TelegramAuthClient />
                    {children}
                    <NavBottom />
                </ReduxProvider>
            </body>
        </html>
    );
}
