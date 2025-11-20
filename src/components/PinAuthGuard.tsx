'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { getPinAuthRequired, getBiometricEnabled, getBiometricCredentialId } from '@/lib/redux/selectors/appSelectors';
import { setPinAuthRequired } from '@/lib/redux/slices/appSlice';
import { authenticateBiometric } from '@/lib/utils/biometric';
import PinCodeScreen from '@/components/pin/PinCodeScreen';

interface PinAuthGuardProps {
    children: React.ReactNode;
}

/**
 * Компонент для глобальной проверки PIN-кода на всех страницах
 * Блокирует доступ к приложению, если требуется авторизация PIN
 *
 * pinAuthRequired устанавливается в appSlice.ts при инициализации на основе наличия pinHash
 * После успешной авторизации, PinCodeScreen устанавливает pinAuthRequired в false
 *
 * Автоматически запрашивает биометрию, если она включена
 */
export default function PinAuthGuard({ children }: PinAuthGuardProps) {
    const dispatch = useAppDispatch();
    const pinAuthRequired = useAppSelector(getPinAuthRequired);
    const biometricEnabled = useAppSelector(getBiometricEnabled);
    const biometricCredentialId = useAppSelector(getBiometricCredentialId);
    const [isMounted, setIsMounted] = useState(false);
    const biometricAttempted = useRef(false); // Флаг, чтобы не повторять попытку биометрии при каждом рендере

    // Предотвращаем ошибку гидратации - проверяем pinAuthRequired только после монтирования
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Автоматический запрос биометрии при монтировании, если требуется авторизация и биометрия включена
    useEffect(() => {
        if (!isMounted || !pinAuthRequired || biometricAttempted.current) {
            return;
        }

        // Если биометрия включена и есть credential ID, пытаемся аутентифицировать
        if (biometricEnabled && biometricCredentialId) {
            biometricAttempted.current = true;

            authenticateBiometric(biometricCredentialId)
                .then((success) => {
                    if (success) {
                        // Биометрия успешна - разблокируем приложение
                        dispatch(setPinAuthRequired(false));
                    }
                    // Если биометрия не удалась, показываем экран PIN (не сбрасываем biometricAttempted)
                })
                .catch((error) => {
                    console.error('Ошибка при биометрической аутентификации:', error);
                    // При ошибке показываем экран PIN
                });
        }
    }, [isMounted, pinAuthRequired, biometricEnabled, biometricCredentialId, dispatch]);

    // Сбрасываем флаг при изменении pinAuthRequired (при успешной авторизации)
    useEffect(() => {
        if (!pinAuthRequired) {
            biometricAttempted.current = false;
        }
    }, [pinAuthRequired]);

    // На сервере и до монтирования показываем children, чтобы избежать несоответствия HTML
    if (!isMounted) {
        return <>{children}</>;
    }

    // После монтирования на клиенте проверяем pinAuthRequired
    if (pinAuthRequired) {
        return <PinCodeScreen mode="auth" />;
    }

    // Иначе показываем дочерние компоненты (страницы)
    return <>{children}</>;
}
