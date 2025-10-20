import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
    onboardingCompleted: boolean;
    hideBalance: boolean;
    // Добавляй сюда другие глобальные состояния приложения
}

const initialState: AppState = {
    onboardingCompleted: true,
    hideBalance: false,
};

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
        // Добавляй другие редьюсеры по мере необходимости
    },
});

export const { setOnboardingCompleted, setHideBalance } = appSlice.actions;
export default appSlice.reducer;
