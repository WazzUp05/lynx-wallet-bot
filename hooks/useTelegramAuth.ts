'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { clearUser, setLoading, setUser } from '@/lib/redux/slices/userSlice';
import { useEffect } from 'react';
import { parse } from '@telegram-apps/init-data-node/web';
import { checkAndSyncMerchant } from '@/lib/api/merchant';
import { useRawInitData } from '@telegram-apps/sdk-react';
import { fetchUser } from '@/lib/redux/thunks/UserThunks';
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '', { debug: true }); // 👈 только один раз при старте

export function useTelegramAuth() {
    const dispatch = useAppDispatch();
    let rawInitData: string | null = null;

    try {
        const initData = useRawInitData();
        rawInitData = typeof initData === 'undefined' ? null : initData;
    } catch (e) {
        if (process.env.NODE_ENV === 'development') {
            rawInitData = null;
        } else {
            throw e;
        }
    }

    useEffect(() => {
        const devInitData =
            'user=%7B%22id%22%3A123456%2C%22first_name%22%3A%22Dev%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22devuser%22%7D';
        const isDev = process.env.NODE_ENV === 'development';
        const actualInitData = rawInitData || (isDev ? devInitData : '');

        if (!actualInitData) {
            dispatch(setLoading(false));
            dispatch(clearUser());
            return;
        }

        let telegramUser = null;
        let startParam = null;

        try {
            const parsed = parse(actualInitData);
            telegramUser = parsed.user || null;
            startParam = parsed.start_param || null;
            console.log('Telegram user:', telegramUser, 'start_param:', startParam);
        } catch (e) {
            console.error('Failed to parse Telegram user:', e);
        }

        dispatch(setLoading(true));

        fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData: actualInitData }),
        })
            .then((res) => res.json())
            .then(async (data) => {
                let user = data.ok && data.user ? data.user : telegramUser;
                if (user) {
                    try {
                        const merchantData = await checkAndSyncMerchant(user);
                        dispatch(setUser(merchantData.merchant));
                        dispatch(fetchUser());
                        dispatch(setLoading(false));

                        // === 🔹 Mixpanel интеграция ===
                        const mpId = String(user.id);
                        const alreadyIdentified = localStorage.getItem('mp_identified');

                        if (!alreadyIdentified) {
                            mixpanel.identify(mpId);
                            mixpanel.people.set({
                                first_name: user.first_name,
                                last_name: user.last_name,
                                username: user.username,
                                telegram_id: user.id,
                                avatar_url: user.photo_url,
                                joined_at: new Date().toISOString(),
                                source: startParam || 'unknown', // 👈 добавляем источник
                            });
                            mixpanel.track('User Authenticated', {
                                telegram_id: user.id,
                                username: user.username,
                                source: startParam || 'unknown', // 👈 фиксируем событие с источником
                            });
                            localStorage.setItem('mp_identified', mpId);
                        }
                    } catch (err) {
                        console.error('Merchant sync error:', err);
                    }
                } else {
                    dispatch(clearUser());
                }
            })
            .catch(() => {
                dispatch(clearUser());
            });
    }, [rawInitData, dispatch]);
}
