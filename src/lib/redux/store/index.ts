import { configureStore } from "@reduxjs/toolkit";
import walletSlice from "../slices/walletSlice";
import appSlice from "../slices/appSlice";
import userSlice from "../slices/userSlice";
import rateSlice from "../slices/rateSlice";
import historySlice from "../slices/historySlice";

export const store = configureStore({
    reducer: {
        app: appSlice,
        user: userSlice,
        wallet: walletSlice,
        rate: rateSlice,
        history: historySlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
