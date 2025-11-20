/**
 * Утилиты для работы с биометрической аутентификацией через WebAuthn API
 *
 * Подход 1: Web Authentication API (WebAuthn)
 * Стандарт W3C для безопасной аутентификации с использованием биометрии
 */

/**
 * Генерация случайного challenge (вызова) для WebAuthn
 */
function generateChallenge(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(32));
}

/**
 * Конвертация base64 строки в ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Конвертация ArrayBuffer в base64 строку
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

/**
 * Проверка, что мы находимся в Telegram WebView
 */
function isTelegramWebView(): boolean {
    if (typeof window === 'undefined') return false;

    // Проверяем наличие Telegram WebApp API
    const hasTelegramWebApp = !!window.Telegram?.WebApp;

    // Проверяем User-Agent на наличие Telegram
    const userAgent = navigator.userAgent || '';
    const isTelegramUA = /Telegram/i.test(userAgent);

    return hasTelegramWebApp || isTelegramUA;
}

/**
 * Проверка, что мы на мобильном устройстве (не desktop)
 */
function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;

    const userAgent = navigator.userAgent || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    // Также проверяем платформу через Telegram WebApp, если доступна
    const telegramWebApp = window.Telegram?.WebApp;
    if (telegramWebApp?.platform) {
        const platform = telegramWebApp.platform;
        // Платформы: ios, android, web, macos, windows, linux, tdesktop, weba, unigram, unknown
        return platform === 'ios' || platform === 'android';
    }

    return isMobile;
}

/**
 * Проверка поддержки биометрии через WebAuthn API
 *
 * ВАЖНО: WebAuthn может быть недоступен в Telegram WebView на некоторых платформах
 * (особенно на Android) из-за ограничений безопасности WebView.
 * В этом случае PublicKeyCredential может быть недоступен в window,
 * но navigator.credentials.create может работать.
 *
 * @returns Promise<boolean> - поддерживается ли биометрия
 */
export async function isBiometricSupported(): Promise<boolean> {
    if (typeof window === 'undefined') {
        return false;
    }

    const isDev = process.env.NODE_ENV === 'development';
    const isTelegram = isTelegramWebView();
    const isMobile = isMobileDevice();

    // ВАЖНО: Биометрия должна работать только в Telegram WebView на мобильных устройствах
    // На desktop (компьютере) биометрия не должна быть доступна
    // В dev режиме разрешаем проверку для тестирования
    if (!isDev && !isTelegram) {
        return false;
    }

    if (!isDev && !isMobile) {
        return false;
    }

    // Проверяем наличие WebAuthn API
    if (!navigator.credentials || !navigator.credentials.create) {
        return false;
    }

    // Проверяем, поддерживается ли платформенный аутентификатор (встроенная биометрия)
    try {
        // Стандартный путь: проверяем через PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        if ('PublicKeyCredential' in window) {
            const PublicKeyCred = (window as typeof window & { PublicKeyCredential?: typeof PublicKeyCredential })
                .PublicKeyCredential;
            if (PublicKeyCred && typeof PublicKeyCred.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
                const available = await PublicKeyCred.isUserVerifyingPlatformAuthenticatorAvailable();
                return available;
            }
        }

        // Обходной путь для Android WebView:
        // Если navigator.credentials.create доступен, но PublicKeyCredential не в window,
        // это может означать, что WebAuthn работает, но API скрыт в WebView
        // Разрешаем попытку регистрации для мобильных устройств в Telegram WebView
        if (isMobile && isTelegram) {
            // Возвращаем true, чтобы позволить попытку регистрации
            // Если регистрация не удастся, пользователь увидит ошибку
            return true;
        }
    } catch (error) {
        console.error('[Biometric] Ошибка при проверке поддержки:', error);
        return false;
    }

    return false;
}

/**
 * Определение типа биометрии на основе устройства
 * @returns 'face' | 'fingerprint' | 'unknown'
 */
export function getBiometricType(): 'face' | 'fingerprint' | 'unknown' {
    if (typeof window === 'undefined' || !navigator.userAgent) {
        return 'unknown';
    }

    const ua = navigator.userAgent.toLowerCase();

    // iOS - Face ID или Touch ID
    if (/iphone|ipad|ipod/.test(ua)) {
        // В большинстве современных iOS устройств это Face ID
        return 'face';
    }

    // Android - обычно отпечаток пальца или Face unlock
    if (/android/.test(ua)) {
        // Android чаще использует отпечаток пальца
        return 'fingerprint';
    }

    return 'unknown';
}

/**
 * Регистрация биометрической аутентификации
 * @param userId - уникальный идентификатор пользователя (telegram_id)
 * @param userName - имя пользователя для отображения
 * @returns Promise<string | null> - credential ID в base64 или null при ошибке
 */
export async function registerBiometric(userId: number, userName: string): Promise<string | null> {
    if (typeof window === 'undefined') {
        return null;
    }

    // Проверяем наличие navigator.credentials.create
    if (!navigator.credentials || !navigator.credentials.create) {
        console.error('[Biometric] Ошибка: navigator.credentials.create недоступен');
        return null;
    }

    try {
        const challenge = generateChallenge();
        const userIdBuffer = new TextEncoder().encode(userId.toString());

        // Используем navigator.credentials.create напрямую
        // Даже если PublicKeyCredential не в window, метод может работать в WebView
        const credential = (await navigator.credentials.create({
            publicKey: {
                challenge: new Uint8Array(challenge),
                rp: {
                    name: 'Lynx Wallet',
                    id: window.location.hostname || 'lynx-wallet.com',
                },
                user: {
                    id: userIdBuffer,
                    name: userId.toString(),
                    displayName: userName,
                },
                pubKeyCredParams: [{ alg: -7, type: 'public-key' }], // ES256 алгоритм
                authenticatorSelection: {
                    authenticatorAttachment: 'platform', // только встроенная биометрия
                    userVerification: 'required', // обязательная проверка биометрии
                },
                timeout: 60000, // 60 секунд на регистрацию
                attestation: 'none', // не требуем attestation для приватности
            },
        })) as Credential | null;

        // Проверяем, что credential имеет свойство id (характерно для PublicKeyCredential)
        if (!credential || !('id' in credential) || !credential.id) {
            console.error('[Biometric] Ошибка: credential не содержит id или не является PublicKeyCredential');
            return null;
        }

        // Сохраняем credential.id (может быть строкой или ArrayBuffer)
        // Преобразуем в строку, если это ArrayBuffer
        const credentialId = credential.id;
        if (typeof credentialId === 'string') {
            return credentialId;
        } else if (credentialId && typeof credentialId === 'object' && 'byteLength' in credentialId) {
            // Это ArrayBuffer или BufferSource, преобразуем в base64 строку
            return arrayBufferToBase64(credentialId as ArrayBuffer);
        }

        return String(credentialId);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorName = error instanceof Error ? error.name : 'UnknownError';
        console.error('[Biometric] Ошибка при регистрации биометрии:', errorName, errorMessage);

        // Детальная информация об ошибке для отладки
        if (errorName === 'NotSupportedError' || errorName === 'NotAllowedError' || errorName === 'SecurityError') {
            console.error(`[Biometric] WebAuthn ошибка: ${errorName} - ${errorMessage}`);
        }

        return null;
    }
}

/**
 * Аутентификация через биометрию
 * @param credentialId - ID зарегистрированных биометрических данных (base64)
 * @returns Promise<boolean> - успешна ли аутентификация
 */
export async function authenticateBiometric(credentialId: string): Promise<boolean> {
    if (typeof window === 'undefined') {
        return false;
    }

    // Проверяем наличие navigator.credentials.get
    if (!navigator.credentials || !navigator.credentials.get) {
        console.error('[Biometric] Ошибка: navigator.credentials.get недоступен');
        return false;
    }

    try {
        const challenge = generateChallenge();
        const credentialIdBuffer = base64ToArrayBuffer(credentialId);

        // Используем navigator.credentials.get напрямую
        // Даже если PublicKeyCredential не в window, метод может работать в WebView
        const assertion = (await navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array(challenge),
                allowCredentials: [
                    {
                        id: credentialIdBuffer,
                        type: 'public-key',
                    },
                ],
                timeout: 60000, // 60 секунд на аутентификацию
                userVerification: 'required', // обязательная проверка биометрии
            },
        })) as Credential | null;

        // Проверяем, что assertion получен (значит биометрия прошла успешно)
        if (!assertion) {
            return false;
        }

        // Дополнительная проверка: убеждаемся, что это PublicKeyCredential
        if ('id' in assertion && 'rawId' in assertion) {
            return true;
        }

        return false;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorName = error instanceof Error ? error.name : 'UnknownError';
        console.error('[Biometric] Ошибка при биометрической аутентификации:', errorName, errorMessage);
        return false;
    }
}

/**
 * Удаление зарегистрированных биометрических данных
 * @param credentialId - ID учетных данных для удаления
 * @returns Promise<boolean> - успешно ли удаление
 *
 * ВАЖНО: WebAuthn не предоставляет прямого API для удаления учетных данных.
 * Удаление происходит на уровне операционной системы.
 * Здесь мы просто возвращаем успех, так как credential ID удалится из нашего хранилища.
 * На самом устройстве пользователь может удалить учетные данные в настройках ОС.
 */
export async function deleteBiometric(credentialId: string): Promise<boolean> {
    // WebAuthn не предоставляет прямого API для удаления учетных данных
    // Удаление происходит на уровне операционной системы
    // Здесь мы просто возвращаем успех, так как credential ID удалится из нашего хранилища
    // На самом устройстве пользователь может удалить учетные данные в настройках ОС
    return true;
}
