import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { Inter } from "next/font/google";
import NavBottom from "@/components/NavBottom";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Lynx Wallet Bot",
    description: "Telegram wallet bot.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased ${inter.className} `}>
                <ReduxProvider>
                    {children}
                    <NavBottom />
                </ReduxProvider>
            </body>
        </html>
    );
}
