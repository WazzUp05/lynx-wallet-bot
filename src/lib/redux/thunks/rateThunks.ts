import { createAsyncThunk } from '@reduxjs/toolkit';
import { setRates } from '../slices/rateSlice';
import { apiFetch } from '@/lib/helpers/url';

export const fetchRates = createAsyncThunk('rate/fetchRates', async (_, { dispatch }) => {
    const res = await apiFetch('/rate');
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
        dispatch(setRates(data.data));
    }
});
