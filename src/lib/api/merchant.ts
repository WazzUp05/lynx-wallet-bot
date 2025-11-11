import { apiFetch } from '../helpers/url';
import { TelegramUser } from '../telegram/types';

export async function checkAndSyncMerchant(user: TelegramUser) {
    // 1. Проверяем наличие мерчанта
    const checkRes = await apiFetch(`/check/${user.id}`);
    const checkData = await checkRes.json();
    console.log('checkData', checkData);

    if (checkData.success) {
        // 2. Если найден, получаем merchant/me
        const meRes = await apiFetch('/merchant/me', {
            headers: {
                Accept: 'application/json',
                'X-Telegram-ID': String(user.id),
            },
        });
        const meData = await meRes.json();

        return meData;
    } else {
        // 3. Если не найден, регистрируем мерчанта
        const signupRes = await apiFetch('/merchant/signup', {
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
        return signupData;
    }
}
