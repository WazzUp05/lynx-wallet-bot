import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
    onboardingCompleted: boolean;
    hideBalance: boolean;
    isWaitingForDeposit: boolean;
    needDeposit: boolean; // необходимо пополнить счет
    onboardingStep: number;
    isFirstTime: boolean; // первый раз зашел
    // Добавляй сюда другие глобальные состояния приложения
}

// Функция для загрузки состояния из localStorage
const loadStateFromStorage = (): Partial<AppState> => {
    if (typeof window === "undefined") return {};

    try {
        const savedState = localStorage.getItem("appState");
        if (savedState) {
            return JSON.parse(savedState);
        }
    } catch (error) {
        console.error("Ошибка при загрузке состояния из localStorage:", error);
    }
    return {};
};

const initialState: AppState = {
    onboardingCompleted: false,
    hideBalance: false,
    isWaitingForDeposit: false,
    needDeposit: false,
    onboardingStep: 0,
    isFirstTime: true,
    ...loadStateFromStorage(), // Загружаем сохранённое состояние
};

const appSlice = createSlice({
    name: "app",
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
        // Добавляй другие редьюсеры по мере необходимости
    },
    extraReducers: (builder) => {
        // Middleware для сохранения состояния в localStorage
        builder.addMatcher(
            (action) => action.type.startsWith("app/"),
            (state) => {
                if (typeof window !== "undefined") {
                    try {
                        localStorage.setItem(
                            "appState",
                            JSON.stringify({
                                onboardingCompleted: state.onboardingCompleted,
                                hideBalance: state.hideBalance,
                                isWaitingForDeposit: state.isWaitingForDeposit,
                                needDeposit: state.needDeposit,
                                onboardingStep: state.onboardingStep,
                                isFirstTime: state.isFirstTime,
                            })
                        );
                    } catch (error) {
                        console.error("Ошибка при сохранении состояния в localStorage:", error);
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
} = appSlice.actions;
export default appSlice.reducer;
