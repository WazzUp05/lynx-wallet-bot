"use client";
import Main from "@/components/main/Main";
import Onboarding from "@/components/onboarding/Onboarding";
import Loader from "@/components/ui/Loader";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { getOnboardingCompleted } from "@/lib/redux/selectors/appSelectors";
import { setOnboardingCompleted } from "@/lib/redux/slices/appSlice";
import { useEffect } from "react";
import { getLoading, getUser } from "@/lib/redux/selectors/userSelectors";

export default function Home() {
    const onboardingCompleted = useAppSelector(getOnboardingCompleted);
    const loadingApp = useAppSelector(getLoading);
    const user = useAppSelector(getUser);
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

    useEffect(() => {
        console.log(loadingApp, "loadingApp");
    }, [loadingApp]);

    return (
        <>
            {!onboardingCompleted && <Onboarding />}
            <main>{loadingApp ? <Loader className="h-[100dvh]" /> : <Main />}</main>
        </>
    );
}
