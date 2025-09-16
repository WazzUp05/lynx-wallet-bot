import { createAsyncThunk } from "@reduxjs/toolkit";
import { setRates } from "../slices/rateSlice";
import { API_URL } from "@/lib/helpers/url";

export const fetchRates = createAsyncThunk("rate/fetchRates", async (_, { dispatch }) => {
    const res = await fetch(`${API_URL}/rate`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
        dispatch(setRates(data.data));
    }
});
