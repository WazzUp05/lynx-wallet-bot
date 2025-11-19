'use client';

import { getLoading } from '@/lib/redux/selectors/userSelectors';
import { useAppSelector } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import InputSupportChat from '@/components/ui/SupportChat/InputSupportChat';
import Chat from '@/components/ui/SupportChat/SupportChat';
import Loader from '@/components/ui/Loader';
import { useMixpanel } from '@/lib/providers/MixpanelProvider';

const Page = () => {
    const loadingApp = useAppSelector(getLoading);
    const { trackEvent } = useMixpanel();

    useEffect(() => {
        trackEvent('support_chat_opened');
    }, [trackEvent]);

    if (loadingApp) {
        return <Loader className="h-[100dvh]" />;
    }

    return (
        <div className="flex flex-col h-[100dvh] w-full px-[1.6rem] py-[2rem] pb-[calc(var(--safe-bottom)+1.6rem)] bg-[var(--bg-optional)] pt-[0] gap-[0.2rem]">
            <Chat />
            <InputSupportChat />
        </div>
    );
};

export default Page;
