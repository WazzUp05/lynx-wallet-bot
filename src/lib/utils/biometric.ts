/**
 * Утилиты для работы с биометрической аутентификацией через WebAuthn API
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
 * Проверка поддержки биометрии через WebAuthn API
 * @returns Promise<boolean> - поддерживается ли биометрия
 */
export async function isBiometricSupported(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Проверяем наличие WebAuthn API
    if (!navigator.credentials || !navigator.credentials.create) {
        return false;
    }

    // Проверяем, поддерживается ли платформенный аутентификатор (встроенная биометрия)
    try {
        if ('PublicKeyCredential' in window) {
            const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            return available;
        }
    } catch (error) {
        console.error('Ошибка при проверке поддержки биометрии:', error);
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
        // Можно попытаться определить по модели, но проще просто вернуть 'face'
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

    try {
        const challenge = generateChallenge();
        const userIdBuffer = new TextEncoder().encode(userId.toString());

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
        })) as PublicKeyCredential | null;

        if (!credential || !credential.id) {
            return null;
        }

        // Сохраняем credential.id в base64 для удобства хранения
        return credential.id;
    } catch (error) {
        console.error('Ошибка при регистрации биометрии:', error);
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

    try {
        const challenge = generateChallenge();
        const credentialIdBuffer = base64ToArrayBuffer(credentialId);

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
        })) as PublicKeyCredential | null;

        return !!assertion;
    } catch (error) {
        console.error('Ошибка при биометрической аутентификации:', error);
        return false;
    }
}

/**
 * Удаление зарегистрированных биометрических данных
 * @param credentialId - ID учетных данных для удаления
 * @returns Promise<boolean> - успешно ли удаление
 */
export async function deleteBiometric(credentialId: string): Promise<boolean> {
    // WebAuthn не предоставляет прямого API для удаления учетных данных
    // Удаление происходит на уровне операционной системы
    // Здесь мы просто возвращаем успех, так как credential ID удалится из нашего хранилища
    // На самом устройстве пользователь может удалить учетные данные в настройках ОС
    return true;
}
