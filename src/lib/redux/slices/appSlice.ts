import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
    onboardingCompleted: boolean;
    hideBalance: boolean;
    isWaitingForDeposit: boolean;
    needDeposit: boolean; // необходимо пополнить счет
    onboardingStep: number;
    isFirstTime: boolean; // первый раз зашел
    pinHash: string | null;
    pinSalt: string | null;
    pinAuthRequired: boolean;
    showPinOfferModal: boolean; // показана ли модалка предложения PIN после онбординга
    pinChangeFlow: boolean; // флаг для потока изменения PIN (сначала auth, потом setup)
    biometricEnabled: boolean; // включена ли биометрическая разблокировка
    biometricCredentialId: string | null; // ID зарегистрированных биометрических данных (base64)
    // Добавляй сюда другие глобальные состояния приложения
}

// Функция для загрузки состояния из localStorage
const loadStateFromStorage = (): Partial<AppState> => {
    if (typeof window === 'undefined') return {};

    try {
        const savedState = localStorage.getItem('appState');
        if (savedState) {
            return JSON.parse(savedState);
        }
    } catch (error) {
        console.error('Ошибка при загрузке состояния из localStorage:', error);
    }
    return {};
};

const persistedState = loadStateFromStorage();

const initialState: AppState = {
    onboardingCompleted: false,
    hideBalance: false,
    isWaitingForDeposit: false,
    needDeposit: false,
    onboardingStep: 0,
    isFirstTime: true,
    pinHash: null,
    pinSalt: null,
    pinAuthRequired: false,
    showPinOfferModal: persistedState.showPinOfferModal ?? true, // по умолчанию показываем
    pinChangeFlow: false,
    biometricEnabled: persistedState.biometricEnabled ?? false,
    biometricCredentialId: persistedState.biometricCredentialId ?? null,
    ...persistedState, // Загружаем сохранённое состояние
};

// Важно: pinAuthRequired всегда должен быть true при перезагрузке, если есть pinHash (для безопасности)
// Это гарантирует, что даже если в persistedState был pinAuthRequired: false, мы всё равно потребуем авторизацию
if (initialState.pinHash) {
    initialState.pinAuthRequired = true;
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setOnboardingCompleted(state, action: PayloadAction<boolean>) {
            state.onboardingCompleted = action.payload;
        },
        setHideBalance(state, action: PayloadAction<boolean>) {
            state.hideBalance = action.payload;
        },
        setWaitingForDeposit(state, action: PayloadAction<boolean>) {
            state.isWaitingForDeposit = action.payload;
        },
        setOnboardingStep(state, action: PayloadAction<number>) {
            state.onboardingStep = action.payload;
        },
        setNeedDeposit(state, action: PayloadAction<boolean>) {
            state.needDeposit = action.payload;
        },
        setIsFirstTime(state, action: PayloadAction<boolean>) {
            state.isFirstTime = action.payload;
        },
        setOnboardingToStep5(state) {
            state.onboardingStep = 4; // Step5 имеет индекс 4
            state.onboardingCompleted = false;
        },
        setPinData(state, action: PayloadAction<{ hash: string; salt: string }>) {
            state.pinHash = action.payload.hash;
            state.pinSalt = action.payload.salt;
            state.pinAuthRequired = false;
        },
        clearPin(state) {
            state.pinHash = null;
            state.pinSalt = null;
            state.pinAuthRequired = false;
        },
        setPinAuthRequired(state, action: PayloadAction<boolean>) {
            state.pinAuthRequired = action.payload;
        },
        setShowPinOfferModal(state, action: PayloadAction<boolean>) {
            state.showPinOfferModal = action.payload;
        },
        setPinChangeFlow(state, action: PayloadAction<boolean>) {
            state.pinChangeFlow = action.payload;
        },
        setBiometricEnabled(state, action: PayloadAction<boolean>) {
            state.biometricEnabled = action.payload;
            // Если отключаем биометрию, удаляем credential ID
            if (!action.payload) {
                state.biometricCredentialId = null;
            }
        },
        setBiometricCredentialId(state, action: PayloadAction<string | null>) {
            state.biometricCredentialId = action.payload;
            // Если устанавливаем credential ID, включаем биометрию
            if (action.payload) {
                state.biometricEnabled = true;
            }
        },
        clearBiometric(state) {
            state.biometricEnabled = false;
            state.biometricCredentialId = null;
        },
        // Добавляй другие редьюсеры по мере необходимости
    },
    extraReducers: (builder) => {
        // Middleware для сохранения состояния в localStorage
        builder.addMatcher(
            (action) => action.type.startsWith('app/'),
            (state) => {
                if (typeof window !== 'undefined') {
                    try {
                        localStorage.setItem(
                            'appState',
                            JSON.stringify({
                                onboardingCompleted: state.onboardingCompleted,
                                hideBalance: state.hideBalance,
                                isWaitingForDeposit: state.isWaitingForDeposit,
                                needDeposit: state.needDeposit,
                                onboardingStep: state.onboardingStep,
                                isFirstTime: state.isFirstTime,
                                pinHash: state.pinHash,
                                pinSalt: state.pinSalt,
                                showPinOfferModal: state.showPinOfferModal,
                                biometricEnabled: state.biometricEnabled,
                                biometricCredentialId: state.biometricCredentialId,
                            })
                        );
                    } catch (error) {
                        console.error('Ошибка при сохранении состояния в localStorage:', error);
                    }
                }
            }
        );
    },
});

export const {
    setOnboardingCompleted,
    setHideBalance,
    setWaitingForDeposit,
    setOnboardingStep,
    setNeedDeposit,
    setIsFirstTime,
    setOnboardingToStep5,
    setPinData,
    clearPin,
    setPinAuthRequired,
    setShowPinOfferModal,
    setPinChangeFlow,
    setBiometricEnabled,
    setBiometricCredentialId,
    clearBiometric,
} = appSlice.actions;
export default appSlice.reducer;
