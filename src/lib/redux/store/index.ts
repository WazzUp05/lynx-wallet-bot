import { configureStore } from "@reduxjs/toolkit";
import walletSlice from "../slices/walletSlice";
import appSlice from "../slices/appSlice";
import userSlice from "../slices/userSlice";
import rateSlice from "../slices/rateSlice";

export const store = configureStore({
    reducer: {
        app: appSlice,
        user: userSlice,
        wallet: walletSlice,
        rate: rateSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
