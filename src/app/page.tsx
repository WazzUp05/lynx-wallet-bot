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

export default function Home() {
    useTelegramAuth(); // подгружаем юзера при старте
    const { data: user, loading } = useAppSelector(getUser);
    const onboardingCompleted = useAppSelector(getOnboardingCompleted);
    const loadingApp = useAppSelector(getLoading);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const completed = localStorage.getItem("onboardingCompleted");
            if (completed === "true") {
                dispatch(setOnboardingCompleted(true));
            } else {
                dispatch(setOnboardingCompleted(false));
            }
        }
    }, [dispatch]);

    if (!onboardingCompleted) {
        return <Onboarding />;
    }

    return <main>{loadingApp ? <Loader className="h-[100dvh]" /> : <Main user={user} />}</main>;
}
