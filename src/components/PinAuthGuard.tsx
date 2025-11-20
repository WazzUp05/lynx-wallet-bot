'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { getPinAuthRequired } from '@/lib/redux/selectors/appSelectors';
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
 */
export default function PinAuthGuard({ children }: PinAuthGuardProps) {
    const pinAuthRequired = useAppSelector(getPinAuthRequired);
    const [isMounted, setIsMounted] = useState(false);

    // Предотвращаем ошибку гидратации - проверяем pinAuthRequired только после монтирования
    useEffect(() => {
        setIsMounted(true);
    }, []);

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
