// src/components/UserAutoUpdater.tsx
"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchUser } from "@/lib/redux/thunks/UserThunks";
import { getUser } from "@/lib/redux/selectors/userSelectors";

const UserAutoUpdater = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);

    useEffect(() => {
        if (user) {
            const interval = setInterval(() => {
                dispatch(fetchUser());
            }, 120_000); // 2 минуты

            return () => clearInterval(interval);
        }
    }, [dispatch, user?.data?.telegram_id]);

    return null;
};

export default UserAutoUpdater;
