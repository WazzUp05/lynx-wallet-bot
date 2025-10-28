'use client';
import dynamic from 'next/dynamic';
import { ReduxProvider } from '@/lib/providers/ReduxProvider';
import NavBottom from '@/components/NavBottom';
import UserAutoUpdater from '@/components/UserAutoUpdater';
import ServiceWorker from '@/components/ServiceWorker';

const TelegramAuthClient = dynamic(() => import('@/components/TelegramAuthClient'), { ssr: false });

interface ClientComponentsProps {
    children: React.ReactNode;
}

export default function ClientComponents({ children }: ClientComponentsProps) {
    return (
        <>
            <ServiceWorker />
            <ReduxProvider>
                <TelegramAuthClient />
                <UserAutoUpdater />
                {children}
                <NavBottom />
            </ReduxProvider>
        </>
    );
}
