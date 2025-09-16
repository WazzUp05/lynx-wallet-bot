import { useAppDispatch } from "@/lib/redux/hooks";
import { clearUser, setLoading, setUser } from "@/lib/redux/slices/userSlice";
import { useEffect } from "react";

export function useTelegramAuth() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const tg = (window as any).Telegram?.WebApp;
        const initData = tg?.initData;
        const initDataUnsafe = tg?.initDataUnsafe;

        if (initData && initDataUnsafe?.user) {
            dispatch(setLoading(true));

            fetch("/api/auth/telegram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initData }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.ok) {
                        dispatch(setUser(initDataUnsafe.user));
                    } else {
                        dispatch(clearUser());
                    }
                })
                .catch(() => dispatch(clearUser()))
                .finally(() => dispatch(setLoading(false)));
        } else {
            dispatch(setLoading(false));
        }
    }, [dispatch]);
}
