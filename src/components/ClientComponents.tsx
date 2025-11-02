'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ReduxProvider } from '@/lib/providers/ReduxProvider';
import NavBottom from '@/components/NavBottom';
import UserAutoUpdater from '@/components/UserAutoUpdater';
import ServiceWorker from '@/components/ServiceWorker';
import { TrackGroups, type TelegramWebAppData } from '@tonsolutions/telemetree-react';
import { TelemetryProvider } from '@/lib/providers/TelemetryProvider';

const TelegramAuthClient = dynamic(() => import('@/components/TelegramAuthClient'), { ssr: false });
const TwaAnalyticsProvider = dynamic(
    () => import('@tonsolutions/telemetree-react').then((mod) => mod.TwaAnalyticsProvider),
    { ssr: false }
);

const TELEMETREE_CONFIG_URL = 'https://ebn.telemetree.io/public-api/v1/client/config';

declare global {
    interface Window {
        __lynxTelemetreeFetchPatched?: boolean;
    }
}

const patchTelemetreeConfigFetch = () => {
    if (typeof window === 'undefined') {
        return;
    }

    if (window.__lynxTelemetreeFetchPatched) {
        return;
    }

    const originalFetch = window.fetch.bind(window);
    let sharedConfigRequest: Promise<Response> | null = null;
    const CONFIG_CACHE_KEY = 'lynx_telemetree_config';
    const CONFIG_CACHE_TTL = 5 * 60 * 1000; // 5 минут кэширования
    const MAX_RETRY_DELAY = 60_000; // Максимальная задержка 60 секунд

    const getRequestUrl = (input: RequestInfo | URL) => {
        if (typeof input === 'string') return input;
        if (input instanceof URL) return input.toString();
        if (typeof Request !== 'undefined' && input instanceof Request) return input.url;
        return '';
    };

    const getRequestMethod = (input: RequestInfo | URL, init?: RequestInit) => {
        const method =
            init?.method || (typeof Request !== 'undefined' && input instanceof Request ? input.method : 'GET');
        return (method || 'GET').toUpperCase();
    };

    // Получить кэш из localStorage
    const getCachedConfig = (): { data: string; timestamp: number } | null => {
        try {
            const cached = localStorage.getItem(CONFIG_CACHE_KEY);
            if (!cached) return null;

            const parsed = JSON.parse(cached) as { data: string; timestamp: number };
            const age = Date.now() - parsed.timestamp;

            if (age < CONFIG_CACHE_TTL) {
                return parsed;
            }

            localStorage.removeItem(CONFIG_CACHE_KEY);
            return null;
        } catch {
            return null;
        }
    };

    // Сохранить конфигурацию в localStorage
    const setCachedConfig = (data: string) => {
        try {
            localStorage.setItem(
                CONFIG_CACHE_KEY,
                JSON.stringify({
                    data,
                    timestamp: Date.now(),
                })
            );
        } catch {
            // Игнорируем ошибки localStorage (может быть переполнен)
        }
    };

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const requestUrl = getRequestUrl(input);
        const method = getRequestMethod(input, init);

        if (requestUrl.startsWith(TELEMETREE_CONFIG_URL) && method === 'GET') {
            // Проверяем кэш
            const cached = getCachedConfig();
            if (cached) {
                if (process.env.NODE_ENV !== 'production') {
                    console.debug('[Telemetry] using cached config');
                }
                return new Response(cached.data, {
                    status: 200,
                    statusText: 'OK',
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Если уже есть активный запрос, ждём его
            if (sharedConfigRequest) {
                return sharedConfigRequest.then((response) => response.clone());
            }

            // Создаём новый запрос с обработкой ошибок
            sharedConfigRequest = originalFetch(input, init)
                .then((response) => {
                    if (response.ok) {
                        // Кэшируем успешный ответ
                        response
                            .clone()
                            .text()
                            .then((text) => {
                                setCachedConfig(text);
                            })
                            .catch(() => {
                                // Игнорируем ошибки кэширования
                            });

                        const resetDelay = CONFIG_CACHE_TTL;
                        setTimeout(() => {
                            sharedConfigRequest = null;
                        }, resetDelay);
                    } else if (response.status === 429) {
                        // При 429 используем экспоненциальный backoff
                        const retryDelay = Math.min(30_000, MAX_RETRY_DELAY); // До 30 секунд при 429
                        setTimeout(() => {
                            sharedConfigRequest = null;
                        }, retryDelay);

                        // Возвращаем кэш даже если он устарел, если он есть
                        const staleCache = localStorage.getItem(CONFIG_CACHE_KEY);
                        if (staleCache) {
                            try {
                                const parsed = JSON.parse(staleCache) as { data: string };
                                console.warn('[Telemetry] 429 error, using stale cache');
                                return new Response(parsed.data, {
                                    status: 200,
                                    statusText: 'OK',
                                    headers: { 'Content-Type': 'application/json' },
                                });
                            } catch {
                                // Если кэш невалидный, возвращаем оригинальную ошибку
                            }
                        }

                        // Если кэша нет, возвращаем оригинальную ошибку 429
                        return response;
                    } else {
                        // Для других ошибок сбрасываем запрос быстрее
                        const resetDelay = 10_000;
                        setTimeout(() => {
                            sharedConfigRequest = null;
                        }, resetDelay);
                    }

                    return response;
                })
                .catch((error) => {
                    // При сетевых ошибках также используем кэш если есть
                    const staleCache = localStorage.getItem(CONFIG_CACHE_KEY);
                    if (staleCache) {
                        try {
                            const parsed = JSON.parse(staleCache) as { data: string };
                            console.warn('[Telemetry] network error, using stale cache');
                            sharedConfigRequest = null;
                            return new Response(parsed.data, {
                                status: 200,
                                statusText: 'OK',
                                headers: { 'Content-Type': 'application/json' },
                            });
                        } catch {
                            // Если кэш невалидный, пробрасываем ошибку
                        }
                    }

                    sharedConfigRequest = null;
                    throw error;
                });

            return sharedConfigRequest.then((response) => response.clone());
        }

        return originalFetch(input, init);
    };

    window.__lynxTelemetreeFetchPatched = true;
};

interface ClientComponentsProps {
    children: React.ReactNode;
}

export default function ClientComponents({ children }: ClientComponentsProps) {
    const [telegramData, setTelegramData] = useState<TelegramWebAppData | null>(null);

    if (typeof window !== 'undefined') {
        patchTelemetreeConfigFetch();
    }

    useEffect(() => {
        if (typeof window === 'undefined') return;

        import('@twa-dev/sdk').then(({ default: WebApp }) => {
            // Проверяем, что мы действительно в Telegram WebApp
            if (WebApp?.initDataUnsafe?.user) {
                WebApp.ready();
                WebApp.disableVerticalSwipes();
                WebApp.isClosingConfirmationEnabled = true;
                setTelegramData({
                    ...WebApp.initDataUnsafe,
                    platform: WebApp.platform || 'unknown',
                });
            } else {
                console.warn('⚠️ Not inside Telegram WebApp — Telemetree disabled');
            }
        });
    }, []);

    return (
        <>
            <ServiceWorker />
            <ReduxProvider>
                <TelegramAuthClient />
                <UserAutoUpdater />
                {telegramData ? (
                    <TwaAnalyticsProvider
                        projectId="d14f0c89-0266-4753-9e44-65dd94548add"
                        apiKey="908c65ba-093c-4a83-ac84-2e6b066c6ca3"
                        trackGroup={TrackGroups.LOW}
                        telegramWebAppData={telegramData}
                    >
                        <TelemetryProvider>
                            {children}
                            <NavBottom />
                        </TelemetryProvider>
                    </TwaAnalyticsProvider>
                ) : (
                    <>
                        {children}
                        <NavBottom />
                    </>
                )}
            </ReduxProvider>
        </>
    );
}
