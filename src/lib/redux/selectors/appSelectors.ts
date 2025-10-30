import { RootState } from '../store';

const getOnboardingCompleted = (state: RootState): boolean => state.app.onboardingCompleted;
const getHideBalance = (state: RootState): boolean => state.app.hideBalance;
const getWaitingForDeposit = (state: RootState): boolean => state.app.isWaitingForDeposit;
const getNeedDeposit = (state: RootState): boolean => state.app.needDeposit;
const getOnboardingStep = (state: RootState): number => state.app.onboardingStep;
const getIsFirstTime = (state: RootState): boolean => state.app.isFirstTime;
const getWaitingSince = (state: RootState): number | null => state.app.waitingSince;

const getShouldDisableButtons = (state: RootState): boolean => {
    return state.app.isWaitingForDeposit || state.app.needDeposit;
};

export {
    getOnboardingCompleted,
    getHideBalance,
    getWaitingForDeposit,
    getNeedDeposit,
    getOnboardingStep,
    getIsFirstTime,
    getWaitingSince,
    getShouldDisableButtons,
};
