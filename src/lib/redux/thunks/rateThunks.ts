import { createAsyncThunk } from "@reduxjs/toolkit";
import { setRates } from "../slices/rateSlice";

export const fetchRates = createAsyncThunk("rate/fetchRates", async (_, { dispatch }) => {
    const res = await fetch("https://stage.lynx-wallet.com/api/rate");
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
        dispatch(setRates(data.data));
    }
});
