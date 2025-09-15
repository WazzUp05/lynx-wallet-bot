import { configureStore } from "@reduxjs/toolkit";
import walletSlice from "../slices/walletSlice";
import telegramSlice from "../slices/telegramSlice";
import appSlice from "../slices/appSlice";
import userSlice from "../slices/userSlice";

export const store = configureStore({
    reducer: {
        app: appSlice,
        user: userSlice,
        wallet: walletSlice,
        telegram: telegramSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
