import telemetree from 'telemetree-io';

export const trackEvent = (event: string, props?: object) => {
    try {
        telemetree.track(event, props);
    } catch (e) {
        // Для разработки/дебага можно разкомментить:
        // console.warn('telemetry error', e);
    }
};
