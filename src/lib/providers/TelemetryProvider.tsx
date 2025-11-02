// src/lib/providers/TelemetryProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTWAEvent } from '@tonsolutions/telemetree-react';

// Тип для свойств событий телеметрии (JSON-совместимые типы)
export type TelemetryEventProps = Record<string, string | number | boolean | null | undefined | string[] | number[]>;

type TelemetreeLike = {
    track: (eventName: string, eventProps: TelemetryEventProps) => Promise<void>;
};

type PatchedTelemetree = TelemetreeLike & {
    __lynxDeduperApplied?: boolean;
};

// Префиксы автособытий, которые нужно блокировать
const AUTO_EVENT_PREFIXES = ['TS Click', 'TS PageView', 'TS Error', 'TS Load'];

const TelemetryContext = createContext<{
    trackEvent: (event: string, props?: TelemetryEventProps) => Promise<void>;
}>({
    trackEvent: async () => {},
});

export const TelemetryProvider = ({ children }: { children: React.ReactNode }) => {
    // Хуки должны вызываться на верхнем уровне, не условно и не в try-catch
    // Если useTWAEvent может выбросить ошибку, она должна обрабатываться Error Boundary или выше по дереву
    const telemetree: TelemetreeLike | null = useTWAEvent();

    const appliedRef = useRef(false);

    // Блокируем все автособытия, оставляя только пользовательские
    useEffect(() => {
        if (!telemetree || appliedRef.current) {
            return;
        }

        const instance = telemetree as PatchedTelemetree;

        if (instance.__lynxDeduperApplied) {
            appliedRef.current = true;
            return;
        }

        const originalTrack = telemetree.track.bind(telemetree);

        telemetree.track = async (eventName: string, props: TelemetryEventProps = {}) => {
            // Блокируем все автособытия от Telemetree
            const isAutoEvent = AUTO_EVENT_PREFIXES.some((prefix) => eventName.includes(prefix));

            if (isAutoEvent) {
                if (process.env.NODE_ENV !== 'production') {
                    console.debug('[Telemetry] auto event blocked', eventName, props);
                }
                return;
            }

            return originalTrack(eventName, props ?? {});
        };

        instance.__lynxDeduperApplied = true;
        appliedRef.current = true;
    }, [telemetree]);

    const trackEvent = useCallback(
        async (event: string, props?: TelemetryEventProps) => {
            if (!telemetree) {
                if (process.env.NODE_ENV !== 'production') {
                    console.debug('[Telemetry] skipped', event, props);
                }
                return;
            }

            try {
                await telemetree.track(event, props ?? {});
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn('[Telemetry] track error', error);
                }
            }
        },
        [telemetree]
    );

    const value = useMemo(() => ({ trackEvent }), [trackEvent]);

    return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
};

export const useTelemetry = () => useContext(TelemetryContext);
