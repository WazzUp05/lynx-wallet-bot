import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
    onboardingCompleted: boolean;
    // Добавляй сюда другие глобальные состояния приложения
}

const initialState: AppState = {
    onboardingCompleted: false,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setOnboardingCompleted(state, action: PayloadAction<boolean>) {
            state.onboardingCompleted = action.payload;
        },
        // Добавляй другие редьюсеры по мере необходимости
    },
});

export const { setOnboardingCompleted } = appSlice.actions;
export default appSlice.reducer;
