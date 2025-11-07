import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '@/lib/helpers/url';
import { setUser } from '../slices/userSlice';
import mixpanel from 'mixpanel-browser';

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
        const merchant = data.merchant;
        dispatch(setUser(merchant));

        // 👇 Добавляем идентификацию и сохранение пользователя
        try {
            mixpanel.identify(merchant.telegram_id.toString());
            mixpanel.people.set({
                name: merchant.name,
                username: merchant.username,
                telegram_id: merchant.telegram_id,
                joined_at: merchant.created_at,
                status: merchant.status,
                avatar: merchant.photo_url,
            });

            // Можно также отметить событие авторизации
            mixpanel.track('User Loaded', {
                telegram_id: merchant.telegram_id,
                username: merchant.username,
            });
        } catch (err) {
            console.error('Mixpanel identify error:', err);
        }
    }
});
