'use client';
import { TelegramUser } from '@/lib/telegram/types';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getSupportChatMessages } from '@/lib/redux/selectors/SupportChatSelector';
import { getUser } from '@/lib/redux/selectors/userSelectors';
import { useRouter } from 'next/navigation';
import { addMessage } from '@/lib/redux/slices/SupportChatSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { useMixpanel } from '@/lib/providers/MixpanelProvider';

import ArrowLeft from '@/components/icons/arrow-left.svg';
import ArrowDown from '@/components/icons/arrow-down.svg';
import Message from '@/components/ui/SupportChat/Message';

import { v4 as uuidv4 } from 'uuid';

export type MessageType = {
    type: 'user' | 'bot' | 'date' | 'buttons' | 'file' | 'image';
    timestamp: Date;
    msgId: string;
    text?: string;
    user?: TelegramUser;
    buttons?: ButtonsType;
    file?: File | string;
    fileSize?: number;
    image?: string;
};

type ButtonsType = {
    id: string;
    text: string;
}[];

const MOCK_BOT_MESSAGES: MessageType[] = [
    {
        type: 'bot',
        text: 'Здравствуйте!',
        timestamp: new Date(),
        msgId: uuidv4(),
        user: {
            id: uuidv4(),
            first_name: 'Линси',
        },
    },
    {
        type: 'bot',
        text: 'Что вас интересует? С удовольствием помогу найти информацию. Выберите кнопку снизу или напишите свой вопрос.',
        timestamp: new Date(),
        msgId: uuidv4(),
        user: {
            id: uuidv4(),
            first_name: 'Линси',
        },
    },
    {
        type: 'buttons',
        timestamp: new Date(),
        msgId: uuidv4(),
        buttons: [
            {
                id: uuidv4(),
                text: 'Где мои деньги?',
            },
            {
                id: uuidv4(),
                text: 'Сколько ждать зачисление?',
            },
            {
                id: uuidv4(),
                text: 'Где я могу платить?',
            },
            {
                id: uuidv4(),
                text: 'Какая комиссия?',
            },
            {
                id: uuidv4(),
                text: 'Когда появится TON?',
            },
        ],
    },
];

const Chat: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [stickyDate, setStickyDate] = useState<string | null>(null);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const messages = useAppSelector(getSupportChatMessages);
    const router = useRouter();
    const user = useAppSelector(getUser);
    const dispatch = useAppDispatch();
    const { trackEvent } = useMixpanel();

    const onBack = () => {
        trackEvent('support_chat_closed');
        router.push('/');
    };

    useEffect(() => {
        // моковые сообщения от бота при первом открытии чата
        const timers: NodeJS.Timeout[] = [];

        if (messages.length > 1) return;
        MOCK_BOT_MESSAGES.forEach((msg, i) => {
            const timeout = setTimeout(
                () => {
                    dispatch(addMessage(msg));
                },
                1000 * (i + 1)
            );

            timers.push(timeout);
        });

        return () => {
            timers.forEach(clearTimeout);
        };
    }, []);

    useEffect(() => {
        // прокрутка вниз при новом сообщении
        const elem = containerRef.current;
        if (!elem) return;
        requestAnimationFrame(() => {
            elem.scrollTo({
                top: elem.scrollHeight,
                behavior: 'smooth',
            });
        });
    }, [messages]);

    useEffect(() => {
        const elem = containerRef.current;
        if (!elem) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const ts = entry.target.getAttribute('data-timestamp');
                        if (ts) setStickyDate(formatDateLabel(new Date(Number(ts))));
                    }
                });
            },
            { root: elem, rootMargin: '-60% 0px -20% 0px' }
        );

        const msgEls = Array.from(elem.querySelectorAll<HTMLElement>('[data-timestamp]'));
        msgEls.forEach((el) => observer.observe(el));

        return () => msgEls.forEach((el) => observer.unobserve(el));
    }, [messages]);

    useEffect(() => {
        const elem = containerRef.current;
        if (!elem) return;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const isAtBottom = elem.scrollHeight - elem.scrollTop - elem.clientHeight < 50;
                    setShowScrollToBottom(!isAtBottom);
                    ticking = false;
                });
                ticking = true;
            }
        };

        elem.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => elem.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToBottom = () => {
        const elem = containerRef.current;
        if (!elem) return;
        elem.scrollTo({ top: elem.scrollHeight, behavior: 'smooth' });
    };

    const formatDateLabel = function formatDateLabel(date: Date): string {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isSameDay = (a: Date, b: Date) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();

        if (isSameDay(date, today)) {
            return 'Сегодня';
        }

        if (isSameDay(date, yesterday)) {
            return 'Вчера';
        }

        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
        }).format(date);
    };

    return (
        <div
            ref={containerRef}
            className="grow flex flex-col gap-[1rem] overflow-auto no-scrollbar relative mb-[0.5rem] "
        >
            <div className="sticky top-0 z-50 bg-[var(--bg-optional-opacity)] backdrop-blur-[2px] backdrop-saturate-250 py-[1rem] ">
                <div
                    className="absolute top-[1rem] left-0 bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] center"
                    onClick={onBack}
                >
                    <ArrowLeft />
                </div>
                <div className="m-auto flex justify-center flex-col items-center">
                    <p className="fs-regular-bold">Чат</p>
                    <p className="fs-very-small text-[var(--text-secondary)]">
                        {user.data?.first_name || ' '} {user.data?.last_name || ' '}
                    </p>
                </div>
            </div>

            {stickyDate && (
                <div className="sticky top-[5rem] z-40 pointer-events-none py-2 flex justify-center">
                    <span className="mx-auto glass rounded-full inline-block py-[0.4rem] px-[0.8rem] fs-very-small text-[var(--text-secondary)] bg-[var(--bg-optional-opacity)]">
                        {stickyDate}
                    </span>
                </div>
            )}

            {messages.map((msg, index) => {
                const nextMsg = messages[index + 1];
                const showAvatar = msg.type === 'bot' && (!nextMsg || nextMsg.type !== msg.type);

                return <Message key={msg.msgId} showAvatar={showAvatar} msg={msg} />;
            })}

            {showScrollToBottom && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className={`fixed glass z-50 bottom-[5rem] right-[3.5rem] w-[3.5rem] h-[3.5rem] center rounded-full fs-very-small`}
                        onClick={scrollToBottom}
                    >
                        <ArrowDown />
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default Chat;
