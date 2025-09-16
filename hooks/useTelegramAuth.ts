"use client";

import { useRawInitData } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import { parse } from "@telegram-apps/init-data-node/web";
import { checkAndSyncMerchant } from "@/lib/api/merchant";

export function useTelegramAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Данные от Telegram
    const [initData, setInitData] = useState<string>("");

    useEffect(() => {
        try {
            const rawInitData = useRawInitData() ?? null;
            const devInitData =
                "user=%7B%22id%22%3A123456%2C%22first_name%22%3A%22Dev%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22devuser%22%7D";

            setInitData(rawInitData || (process.env.NODE_ENV === "development" ? devInitData : ""));
        } catch (e) {
            if (process.env.NODE_ENV === "development") {
                setInitData("");
            } else {
                console.error("useRawInitData error:", e);
                setError("Failed to read Telegram init data");
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (!initData) {
            setLoading(false);
            setUser(null);
            return;
        }

        async function auth() {
            setLoading(true);

            try {
                let telegramUser = null;
                try {
                    const parsed = parse(initData);
                    telegramUser = parsed.user || null;
                    console.log("Parsed Telegram user:", telegramUser);
                } catch (e) {
                    console.warn("Failed to parse Telegram user:", e);
                }

                const res = await fetch("/api/auth/telegram", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ initData }),
                });

                const data = await res.json();
                const finalUser = data.ok && data.user ? data.user : telegramUser;
                console.log("Auth user:", finalUser);

                if (finalUser) {
                    setUser(finalUser);

                    // Проверка/синхронизация мерчанта
                    try {
                        await checkAndSyncMerchant(finalUser);
                    } catch (err) {
                        console.error("Merchant sync error:", err);
                    }
                } else {
                    setUser(null);
                }
            } catch (err: any) {
                console.error("Auth error:", err);
                setError(err.message || "Auth failed");
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        auth();
    }, [initData]);

    return { user, loading, error };
}
