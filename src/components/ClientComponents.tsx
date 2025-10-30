'use client';
import dynamic from 'next/dynamic';
import { ReduxProvider } from '@/lib/providers/ReduxProvider';
import NavBottom from '@/components/NavBottom';
import UserAutoUpdater from '@/components/UserAutoUpdater';
import ServiceWorker from '@/components/ServiceWorker';
import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';
import { TrackGroups } from '@tonsolutions/telemetree-react';

const TelegramAuthClient = dynamic(() => import('@/components/TelegramAuthClient'), { ssr: false });
const TwaAnalyticsProvider = dynamic(
    () => import('@tonsolutions/telemetree-react').then((mod) => mod.TwaAnalyticsProvider),
    { ssr: false }
);

interface ClientComponentsProps {
    children: React.ReactNode;
}

export default function ClientComponents({ children }: ClientComponentsProps) {
    useEffect(() => {
        // Импортируем SDK только в браузере
        import('@twa-dev/sdk').then(({ default: WebApp }) => {
            WebApp.disableVerticalSwipes();
            WebApp.isClosingConfirmationEnabled = true;
        });
    }, []);

    return (
        <>
            <ServiceWorker />
            <ReduxProvider>
                <TelegramAuthClient />
                <UserAutoUpdater />
                <TwaAnalyticsProvider
                    projectId="d14f0c89-0266-4753-9e44-65dd94548add"
                    apiKey="908c65ba-093c-4a83-ac84-2e6b066c6ca3"
                    trackGroup={TrackGroups.MEDIUM}
                >
                    {children}
                    <NavBottom />
                </TwaAnalyticsProvider>
            </ReduxProvider>
        </>
    );
}
