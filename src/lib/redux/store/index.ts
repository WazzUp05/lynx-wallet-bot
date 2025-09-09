import { configureStore } from "@reduxjs/toolkit";
import walletSlice from "../slices/walletSlice";
import telegramSlice from "../slices/telegramSlice";
import appSlice from "../slices/appSlice";

export const store = configureStore({
    reducer: {
        app: appSlice,
        wallet: walletSlice,
        telegram: telegramSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
