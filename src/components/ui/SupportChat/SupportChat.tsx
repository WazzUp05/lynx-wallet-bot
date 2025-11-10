'use client';
import { TelegramUser } from '@/lib/telegram/types';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getSupportChatMessages } from '@/lib/redux/selectors/SupportChatSelector';

import { getUser } from '@/lib/redux/selectors/userSelectors';
import { useRouter } from 'next/navigation';
import ArrowLeft from '@/components/icons/arrow-left.svg';
import Message from './Message';
import { v4 as uuidv4 } from 'uuid';
import { addMessage } from '@/lib/redux/slices/SupportChatSlice';

export type MessageType = {
  type: 'user' | 'bot' | 'date' | 'buttons';
  timestamp: Date;
  msgId: string;
  text?: string;
  user?: TelegramUser;
  relatedTo?: string;
  buttons?: ButtonsType;
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

const Chat = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [stickyDate, setStickyDate] = useState<string | null>(null);
  const messages = useAppSelector(getSupportChatMessages);
  const router = useRouter();
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
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
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const scrollTop = el.scrollTop;
      // Находим все элементы сообщений (они помечены data-ts)
      const msgEls = Array.from(el.querySelectorAll<HTMLElement>('[data-ts]'));
      let current: HTMLElement | null = null;
      for (const m of msgEls) {
        // offsetTop относительно контейнера — выбираем последний элемент, который уже выше порога
        if (m.offsetTop <= scrollTop + 10) current = m;
      }
      // если ничего не найдено — покажем дату первого сообщения (вверху)
      if (!current && msgEls.length) current = msgEls[0];

      if (current) {
        const ts = current.getAttribute('data-ts');
        if (ts) {
          const date = new Date(Number(ts));
          const label = formatDateLabel(date);
          setStickyDate(label);
          return;
        }
      }
      setStickyDate(null);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [messages]); // пересчитываем при изменении списка сообщений

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
      className="grow flex flex-col gap-[1rem] overflow-auto relative pr-[1rem] "
    >
      <div className="sticky top-0 z-50 bg-[var(--bg-optional-opacity)] backdrop-blur-[2px] backdrop-saturate-250 py-[1rem] ">
        <div
          className="absolute top-[1rem] left-0 bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] center text-[var(--text-secondary)]"
          onClick={() => {
            router.back();
          }}
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
        return <Message key={msg.msgId} messages={messages} msg={msg} index={index} />;
      })}
    </div>
  );
};

export default Chat;
