import { configureStore } from "@reduxjs/toolkit";
import walletSlice from "../slices/walletSlice";
import appSlice from "../slices/appSlice";
import userSlice from "../slices/userSlice";
import rateSlice from "../slices/rateSlice";
import historySlice from "../slices/historySlice";
import SupportChatSlice from "../slices/SupportChatSlice";

export const store = configureStore({
    reducer: {
        app: appSlice,
        user: userSlice,
        wallet: walletSlice,
        rate: rateSlice,
        history: historySlice,
        supportChat: SupportChatSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
