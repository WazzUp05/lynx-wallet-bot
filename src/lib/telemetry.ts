import { useTWAEvent } from '@tonsolutions/telemetree-react';

export const useTelemetry = () => {
    const telemetree = useTWAEvent();
    const trackEvent = (event: string, props?: object) => {
        try {
            telemetree.track(event, props || {});
        } catch (e) {
            // console.warn('telemetry error', e);
        }
    };
    return { trackEvent };
};
