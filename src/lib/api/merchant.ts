import { API_URL } from '../helpers/url';
import { TelegramUser } from '../telegram/types';
import mixpanel from 'mixpanel-browser';

export async function checkAndSyncMerchant(user: TelegramUser) {
    // 1. Проверяем наличие мерчанта
    const checkRes = await fetch(`${API_URL}/check/${user.id}`);
    const checkData = await checkRes.json();
    console.log('checkData', checkData);

    let merchantData;

    if (checkData.success) {
        // 2. Если найден, получаем merchant/me
        const meRes = await fetch(`${API_URL}/merchant/me`, {
            headers: {
                Accept: 'application/json',
                'X-Telegram-ID': String(user.id),
            },
        });
        const meData = await meRes.json();
        merchantData = meData.merchant || meData;
    } else {
        // 3. Если не найден, регистрируем мерчанта
        const signupRes = await fetch(`${API_URL}/merchant/signup`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                telegram_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name || '',
                username: user.username || '',
                photo_url: user.photo_url || '',
            }),
        });
        const signupData = await signupRes.json();
        merchantData = signupData.merchant || signupData;
    }

    // === 🔹 Интеграция с Mixpanel ===
    try {
        if (merchantData?.telegram_id) {
            mixpanel.identify(String(merchantData.telegram_id));
            mixpanel.people.set({
                first_name: merchantData.first_name,
                last_name: merchantData.last_name,
                username: merchantData.username,
                telegram_id: merchantData.telegram_id,
                avatar_url: merchantData.photo_url,
                joined_at: merchantData.created_at || new Date().toISOString(),
                status: merchantData.status || 'active',
            });

            // Можно трекнуть событие авторизации
            mixpanel.track('Merchant Synced', {
                telegram_id: merchantData.telegram_id,
                username: merchantData.username,
            });
        }
    } catch (err) {
        console.error('Mixpanel error:', err);
    }

    return merchantData;
}
