'use client';

import { MessageType } from '@/components/ui/SupportChat/SupportChat';
import avatar from '@/components/icons/Avatar.jpg';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getUser } from '@/lib/redux/selectors/userSelectors';
import { addMessage } from '@/lib/redux/slices/SupportChatSlice';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import FileMessage from '@/components/ui/SupportChat/FileMessage';
import React from 'react';

type MessageProps = {
    showAvatar: boolean;
    msg: MessageType;
};

const Message: React.FC<MessageProps> = React.memo(({ msg, showAvatar }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const [hidden, setHidden] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        dispatch(
            addMessage({
                type: 'user',
                text: e.currentTarget.textContent || '',
                msgId: uuidv4(),
                timestamp: new Date(),
                user: {
                    id: user.data?.id ?? uuidv4(),
                    first_name: user.data?.first_name || '',
                    last_name: user.data?.last_name || '',
                    username: user.data?.username || '',
                },
            })
        );
        setHidden(true);
    };

    return (
        <div data-timestamp={String(msg.timestamp.valueOf())} className="flex flex-col">
            {msg.type === 'bot' && (
                <div className="flex">
                    {showAvatar ? (
                        <Image
                            src={avatar}
                            alt="Avatar"
                            className="rounded-full w-[4rem] h-[4rem] self-end"
                        />
                    ) : (
                        <div className="w-[4rem] h-[4rem]"></div>
                    )}
                    <div className="flex flex-col gap-[-0.8rem] bg-[var(--bg-secondary)] ml-[0.8rem] rounded-[1rem] pt-[0.8rem] pb-[1rem] px-[1.2rem]">
                        <div className="self-start pr-[2em] ">
                            <div className="text-[var(--text-secondary)] fs-very-small  mb-[0.4rem]">
                                {msg.user?.first_name}
                            </div>
                            <div className="text-[var(--text-main)] fs-very-small ">{msg.text}</div>
                        </div>
                        <div className="self-end fs-xx-small text-[var(--text-secondary)]">
                            {msg.timestamp.getHours().toString().padStart(2, '0')}:
                            {msg.timestamp.getMinutes().toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>
            )}
            {msg.type === 'buttons' && !hidden && (
                <div className="flex flex-wrap flex-row-reverse gap-[0.8rem] ">
                    {msg.buttons?.map((button) => (
                        <button
                            key={button.id}
                            onClick={handleClick}
                            className="rounded-[2rem] py-[0.8rem] px-[1.6rem] bg-[var(--dark-gray-main)] fs-very-small-bold"
                        >
                            {button.text}
                        </button>
                    ))}
                </div>
            )}
            {msg.type === 'user' && (
                <div className="ml-[4em] flex justify-end">
                    <div className="flex flex-col gap-[-0.8rem] bg-[var(--text-additional)] rounded-[2rem] px-[1.2rem] py-[1rem]">
                        <div className="self-end fs-very-small text-[var(--text-main)] whitespace-pre-wrap break-all pr-[3em]">
                            {msg.text}
                        </div>
                        <div className="self-end fs-xx-small text-[var(--text-secondary)]">
                            {msg.timestamp.getHours().toString().padStart(2, '0')}:
                            {msg.timestamp.getMinutes().toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>
            )}
            {msg.type === 'file' && <FileMessage msg={msg} />}
            {msg.type === 'image' && msg.image && (
                <div className="ml-[4em] flex justify-end">
                    <div className="flex flex-col gap-[-0.8rem] bg-[var(--text-additional)] rounded-[2rem] px-[1.2rem] py-[1rem]">
                        <div className="self-end flex flex-col gap-[1rem]">
                            <Image
                                src={msg.image}
                                alt={msg.text || 'image'}
                                width={240}
                                height={0}
                                loading="lazy"
                                placeholder="blur"
                                className="rounded-[2rem] object-cover max-w-full h-auto max-h-[50vh]"
                            />
                            <div className="fs-very-small text-[var(--text-main)] whitespace-pre-wrap break-all pr-[3em]">
                                {msg.text}
                            </div>
                        </div>

                        <div className="self-end fs-xx-small text-[var(--text-secondary)]">
                            {msg.timestamp.getHours().toString().padStart(2, '0')}:
                            {msg.timestamp.getMinutes().toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
Message.displayName = 'Message';
export default Message;
