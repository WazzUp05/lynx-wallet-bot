import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "@/lib/helpers/url";
import { setHistory } from "../slices/historySlice";

export const fetchHistory = createAsyncThunk("history/fetchHistory", async (_, { dispatch, getState }) => {
    const { user } = getState() as { user: { data: { telegram_id: number } } };
    const res = await fetch(`${API_URL}/merchant/history`, {
        headers: {
            Accept: "application/json",
            "X-Telegram-ID": user.data.telegram_id.toString(),
        },
    });
    const data = await res.json();

    if (data.success && Array.isArray(data.transactions)) {
        dispatch(setHistory(data.transactions));
    }
});
