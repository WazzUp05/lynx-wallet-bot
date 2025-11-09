'use client'
import { v4 as uuidv4 } from 'uuid';
import { TelegramUser } from '@/lib/telegram/types';
import avatar from '@/components/icons/Avatar.jpg';
import Image from 'next/image';
import { useCallback } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { getSupportChatMessages } from '@/lib/redux/selectors/SupportChatSelector';

export type MessageType = {
    type: 'user' | 'bot' | 'date' | 'buttons';
    text?: string;
    user?: TelegramUser;
    timestamp: Date ;
    relatedTo?: string;
    buttons?: ButtonsType
}

type ButtonsType = {
        id: string;
        text: string;
    }[]

// type ChatProps = {
//     messages?: MessageType[];
//     classNames?: string;
// }


const Chat = () => { 

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
    }

    const messages = useAppSelector(getSupportChatMessages);

    return (
        <div className='grow flex flex-col gap-[1rem] '>
           {messages.map((msg, index) => {
                const nextMsg = messages[index + 1];
                const showAvatar = msg.type === 'bot' && (!nextMsg || nextMsg.type !== msg.type);
          return (
          <div key={msg.user?.id} className='flex flex-col'> 
                {msg.type === 'date' && (
                    <div className='sticky top-0 z-50 flex justify-center py-2 backdrop-blur-[2px] backdrop-saturate-250'>
                    <span className='mx-auto glass rounded-full inline-block py-[0.4rem] px-[0.8rem] fs-very-small text-[var(--text-secondary)] self-center sticky bg-[var(--bg-optional-opacity)]'>
                        {formatDateLabel(msg.timestamp)}
                    </span>
                    </div>
                )}
                {msg.type === 'bot' && (
                    <div className='flex'>
                        {showAvatar ? (
                            <Image src={avatar} alt="Avatar" className='rounded-full w-[4rem] h-[4rem] self-end'/>
                        ) : (<div className='w-[4rem] h-[4rem]'></div>)}
                        <div className='bg-[var(--bg-secondary)] ml-[0.8rem] rounded-[1rem] pt-[0.8rem] pb-[1rem] px-[1.2rem] '>
                            <div className='text-[var(--text-secondary)] fs-very-small mb-[0.4rem]'>{msg.user?.first_name}</div>
                            <div className='text-[var(--text-main)] fs-very-small'>{msg.text}</div>
                        </div>
                    </div>
                )}
                {msg.type === 'buttons' && (
                    <div className='flex flex-wrap flex-row-reverse gap-[0.8rem] '>
                        {msg.buttons?.map((button) => (
                            <button key={button.id} className='rounded-[2rem] py-[0.8rem] px-[1.6rem] bg-[var(--dark-gray-main)] fs-xx-small'>
                                {button.text}
                            </button>
                        ))}
                    </div>
                )}
                {msg.type === 'user' && (
                    <div className='flex justify-between'>
                        <div className='w-[4rem] h-[4rem]'></div>
                        <div className='bg-[var(--text-additional)] rounded-[2rem] py-[0.8rem] px-[1.6rem] fs-very-small text-[var(--text-main)] whitespace-pre-wrap break-words max-w-[70%] ml-auto'>
                            {msg.text}
                        </div>
                    </div>
                )}
            </div>
            )})}
        </div>
    )
    
}

export default Chat