import { useRawInitData } from "@telegram-apps/sdk-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearUser, setLoading, setUser } from "@/lib/redux/slices/userSlice";
import { useEffect } from "react";
import { parse } from "@telegram-apps/init-data-node/web"; // добавь импорт

export function useTelegramAuth() {
    const dispatch = useAppDispatch();
    const rawInitData = useRawInitData();

    useEffect(() => {
        if (!rawInitData) {
            dispatch(setLoading(false));
            return;
        }
        console.log("rawInitData", rawInitData);

        // Парсим пользователя из initData
        let telegramUser = null;
        try {
            const parsed = parse(rawInitData);
            telegramUser = parsed.user || null;
            console.log("Telegram user:", telegramUser);
        } catch (e) {
            console.error("Failed to parse Telegram user:", e);
        }

        dispatch(setLoading(true));
        fetch("/api/auth/telegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData: rawInitData }),
        })
            .then((res) => res.json())
            .then((data) => {
                // Если сервер вернул пользователя — используем его, иначе используем распарсенного
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
    }, [rawInitData, dispatch]);
}
