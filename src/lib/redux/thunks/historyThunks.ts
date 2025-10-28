import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '@/lib/helpers/url';
import { setHistory } from '../slices/historySlice';
import { RootState } from '@/lib/redux/store';

export const fetchHistory = createAsyncThunk('history/fetchHistory', async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const telegramId = state.user.data?.telegram_id;

    // Нет пользователя — нет запроса
    if (!telegramId) {
        return;
    }

    const res = await fetch(`${API_URL}/merchant/history`, {
        headers: {
            Accept: 'application/json',
            'X-Telegram-ID': telegramId.toString(),
        },
    });
    const data = await res.json();

    if (data.success && Array.isArray(data.transactions)) {
        dispatch(setHistory(data.transactions));
    }
});
