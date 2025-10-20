import { RootState } from '../store';

const getOnboardingCompleted = (state: RootState) => state.app.onboardingCompleted;
const getHideBalance = (state: RootState) => state.app.hideBalance;

export { getOnboardingCompleted, getHideBalance };
