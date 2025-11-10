'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ReduxProvider } from '@/lib/providers/ReduxProvider';
import NavBottom from '@/components/NavBottom';
import UserAutoUpdater from '@/components/UserAutoUpdater';
import ServiceWorker from '@/components/ServiceWorker';

import { initMixpanel } from '@/lib/api/mixpanelClient';
import { MixpanelProvider } from '@/lib/providers/MixpanelProvider';

const TelegramAuthClient = dynamic(() => import('@/components/TelegramAuthClient'), { ssr: false });

interface ClientComponentsProps {
  children: React.ReactNode;
}

export default function ClientComponents({ children }: ClientComponentsProps) {
  useEffect(() => {
    initMixpanel(); // Initialize Mixpanel
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('@twa-dev/sdk').then(({ default: WebApp }) => {
      // Проверяем, что мы действительно в Telegram WebApp
      if (WebApp?.initDataUnsafe?.user) {
        WebApp.expand();
        WebApp.ready();
        WebApp.disableVerticalSwipes();
        WebApp.isClosingConfirmationEnabled = true;

        // Устанавливаем цвет шапки приложения
        // Можно использовать hex цвет (например: '#1a1a1a') или 'bg_color' для использования темы
        if (WebApp.setHeaderColor) {
          WebApp.setHeaderColor('#FFBE00');
        }
      } else {
        console.warn('⚠️ Not inside Telegram WebApp');
      }
    });
  }, []);

  return (
    <>
      <ServiceWorker />
      <ReduxProvider>
        <MixpanelProvider>
          <TelegramAuthClient />
          <UserAutoUpdater />

          {children}
          <NavBottom />
        </MixpanelProvider>
      </ReduxProvider>
    </>
  );
}
