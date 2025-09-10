"use client";
import Main from "@/components/main/Main";
import Onboarding from "@/components/onboarding/Onboarding";
import { useAppSelector } from "@/lib/redux/hooks";
import { getOnboardingCompleted } from "@/lib/redux/selectors/appSelectors";

export default function Home() {
    const onboardingCompleted = useAppSelector(getOnboardingCompleted);

    if (!onboardingCompleted) {
        return <Onboarding />;
    }

    return (
        <main>
            <Main />
        </main>
    );
}
