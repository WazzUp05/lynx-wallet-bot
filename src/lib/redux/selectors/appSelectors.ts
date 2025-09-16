import { RootState } from "../store";

const getOnboardingCompleted = (state: RootState) => state.app.onboardingCompleted;

export { getOnboardingCompleted };
