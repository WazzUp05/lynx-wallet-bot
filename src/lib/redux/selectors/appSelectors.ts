import { RootState } from '../store';

const getOnboardingCompleted = (state: RootState): boolean => state.app.onboardingCompleted;
const getHideBalance = (state: RootState): boolean => state.app.hideBalance;
const getWaitingForDeposit = (state: RootState): boolean => state.app.isWaitingForDeposit;
const getNeedDeposit = (state: RootState): boolean => state.app.needDeposit;
const getOnboardingStep = (state: RootState): number => state.app.onboardingStep;
const getIsFirstTime = (state: RootState): boolean => state.app.isFirstTime;
const getHasPin = (state: RootState): boolean => Boolean(state.app.pinHash);
const getPinAuthRequired = (state: RootState): boolean => state.app.pinAuthRequired;
const getPinSalt = (state: RootState): string | null => state.app.pinSalt;
const getPinHash = (state: RootState): string | null => state.app.pinHash;
const getShowPinOfferModal = (state: RootState): boolean => state.app.showPinOfferModal;
const getPinChangeFlow = (state: RootState): boolean => state.app.pinChangeFlow;
const getBiometricEnabled = (state: RootState): boolean => state.app.biometricEnabled;
const getBiometricCredentialId = (state: RootState): string | null => state.app.biometricCredentialId;

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
    getHasPin,
    getPinAuthRequired,
    getPinSalt,
    getPinHash,
    getShowPinOfferModal,
    getPinChangeFlow,
    getBiometricEnabled,
    getBiometricCredentialId,
    getShouldDisableButtons,
};
