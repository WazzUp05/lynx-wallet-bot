import { useRawInitData } from "@telegram-apps/sdk-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearUser, setLoading, setUser } from "@/lib/redux/slices/userSlice";
import { useEffect } from "react";

export function useTelegramAuth() {
    const dispatch = useAppDispatch();
    const rawInitData = useRawInitData();

    useEffect(() => {
        if (!rawInitData) {
            dispatch(setLoading(false));
            return;
        }
        console.log("rawInitData", rawInitData);

        // Можно распарсить данные пользователя через @telegram-appс/init-data-node/web
        // import { parse } from "@telegram-apps/init-data-node/web";
        // const parsed = parse(rawInitData);

        dispatch(setLoading(true));
        fetch("/api/auth/telegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData: rawInitData }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok && data.user) {
                    dispatch(setUser(data.user));
                } else {
                    dispatch(clearUser());
                }
            })
            .catch(() => dispatch(clearUser()))
            .finally(() => dispatch(setLoading(false)));
    }, [rawInitData, dispatch]);
}
