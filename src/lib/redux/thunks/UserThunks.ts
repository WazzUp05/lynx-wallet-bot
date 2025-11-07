import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '@/lib/helpers/url';
import { setUser } from '../slices/userSlice';

export const fetchUser = createAsyncThunk('me/fetchUser', async (_, { dispatch, getState }) => {
    const { user } = getState() as { user: { data: { telegram_id: number } } };
    const res = await fetch(`${API_URL}/merchant/me`, {
        headers: {
            Accept: 'application/json',
            'X-Telegram-ID': user.data.telegram_id.toString(),
        },
    });
    const data = await res.json();

    if (data.success && data.merchant) {
        dispatch(setUser(data.merchant));
    }
});
