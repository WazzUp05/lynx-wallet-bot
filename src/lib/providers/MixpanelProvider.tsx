// src/lib/providers/TelemetryProvider.tsx
"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import mixpanel from "mixpanel-browser";

// Тип для свойств событий телеметрии (JSON-совместимые типы)
export type TelemetryEventProps = Record<
    string,
    string | number | boolean | null | undefined | string[] | number[]
>;

const MixpanelContext = createContext<{
    trackEvent: (event: string, props?: TelemetryEventProps) => Promise<void>;
}>({
    trackEvent: async () => {},
});

export const MixpanelProvider = ({ children }: { children: React.ReactNode }) => {
    const trackEvent = useCallback(async (event: string, props?: TelemetryEventProps) => {
        try {
            mixpanel.track(event, props ?? {});
        } catch (error) {
            if (process.env.NODE_ENV !== "production") {
                console.warn("[Telemetry] track error", error);
            }
        }
    }, []);

    const value = useMemo(() => ({ trackEvent }), [trackEvent]);

    return <MixpanelContext.Provider value={value}>{children}</MixpanelContext.Provider>;
};

export const useMixpanel = () => useContext(MixpanelContext);
