"use client";
import Main from "@/components/main/Main";
import Onboarding from "@/components/onboarding/Onboarding";
import Loader from "@/components/ui/Loader";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { getOnboardingCompleted } from "@/lib/redux/selectors/appSelectors";
import { setOnboardingCompleted } from "@/lib/redux/slices/appSlice";
import { useEffect } from "react";
import { getLoading } from "@/lib/redux/selectors/userSelectors";
import { getUser } from "@/lib/redux/selectors/userSelectors";
import { useTelegramAuth } from "../../hooks/useTelegramAuth";
import { clearUser, setLoading, setUser } from "@/lib/redux/slices/userSlice";

export default function Home() {
    const { user, loading, error } = useTelegramAuth();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setLoading(loading));
        if (user) {
            dispatch(setUser(user));
        } else {
            dispatch(clearUser());
        }
    }, [user, loading, dispatch]);

    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         const completed = localStorage.getItem("onboardingCompleted");
    //         if (completed === "true") {
    //             dispatch(setOnboardingCompleted(true));
    //         } else {
    //             dispatch(setOnboardingCompleted(false));
    //         }
    //     }
    // }, [dispatch]);

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <Onboarding />;

    return <Main user={user} />;
}
