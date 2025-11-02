// src/lib/providers/TelemetryProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTWAEvent } from '@tonsolutions/telemetree-react';

type TelemetreeLike = {
    track: (eventName: string, eventProps: Record<string, any>) => Promise<void>;
};

type PatchedTelemetree = TelemetreeLike & {
    __lynxDeduperApplied?: boolean;
};

// Префиксы автособытий, которые нужно блокировать
const AUTO_EVENT_PREFIXES = ['TS Click', 'TS PageView', 'TS Error', 'TS Load'];

const TelemetryContext = createContext<{ trackEvent: (event: string, props?: Record<string, any>) => Promise<void> }>({
    trackEvent: async () => {},
});

export const TelemetryProvider = ({ children }: { children: React.ReactNode }) => {
    let telemetree: TelemetreeLike | null = null;

    try {
        telemetree = useTWAEvent();
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[Telemetry] provider not ready', error);
        }
    }

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

        telemetree.track = async (eventName: string, props: Record<string, any> = {}) => {
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
        async (event: string, props?: Record<string, any>) => {
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
