import { useRawInitData } from "@telegram-apps/sdk-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearUser, setLoading, setUser } from "@/lib/redux/slices/userSlice";
import { useEffect } from "react";
import { parse } from "@telegram-apps/init-data-node/web";

export function useTelegramAuth() {
    const dispatch = useAppDispatch();
    let rawInitData: string | null = null;

    try {
        rawInitData = useRawInitData() ?? null;
    } catch (e) {
        // В dev-режиме игнорируем ошибку
        if (process.env.NODE_ENV === "development") {
            rawInitData = null;
        } else {
            throw e;
        }
    }

    // Моковые данные для dev-режима
    const devInitData =
        "user=%7B%22id%22%3A123456%2C%22first_name%22%3A%22Dev%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22devuser%22%7D";
    const isDev = process.env.NODE_ENV === "development";
    const actualInitData = rawInitData || (isDev ? devInitData : "");

    useEffect(() => {
        if (!actualInitData) {
            dispatch(setLoading(false));
            dispatch(clearUser());
            return;
        }
        console.log("rawInitData", actualInitData);

        // Парсим пользователя из initData
        let telegramUser = null;
        try {
            const parsed = parse(actualInitData);
            telegramUser = parsed.user || null;
            console.log("Telegram user:", telegramUser);
        } catch (e) {
            console.error("Failed to parse Telegram user:", e);
        }

        dispatch(setLoading(true));
        fetch("/api/auth/telegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData: actualInitData }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok && data.user) {
                    dispatch(setUser(data.user));
                } else if (telegramUser) {
                    dispatch(setUser(telegramUser));
                } else {
                    dispatch(clearUser());
                }
            })
            .catch(() => {
                if (telegramUser) {
                    dispatch(setUser(telegramUser));
                } else {
                    dispatch(clearUser());
                }
            })
            .finally(() => dispatch(setLoading(false)));
    }, [actualInitData, dispatch]);
}
