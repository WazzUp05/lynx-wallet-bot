import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";

export const metadata: Metadata = {
  title: "Lynx Wallet Bot",
  description: "Telegram wallet bot powered by Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
