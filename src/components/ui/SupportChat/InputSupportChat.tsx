'use client';

import Arrow from '@/components/icons/arrow.svg';
import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { v4 as uuidv4 } from 'uuid';
import { addMessage } from '@/lib/redux/slices/SupportChatSlice';
import { getUser } from '@/lib/redux/selectors/userSelectors';
import { useRouter, usePathname } from 'next/navigation';
import AddFileModal from '@/components/modals/AddFileModal';
import Plus from '@/components/icons/plus-white.svg';
import { MessageType } from '@/components/ui/SupportChat/SupportChat';

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    placeholder?: string;
    mode?: string;
    imgSrc?: string;
}

const InputSupportChat: React.FC<InputProps> = ({
    placeholder = 'Сообщение...',
    onChange,
    mode,
    imgSrc,
    ...props
}) => {
    const router = useRouter();
    const path = usePathname();
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);

    const [value, setValue] = useState('');
    const refTextArea = useRef<HTMLTextAreaElement>(null);

    const [showModal, setShowModal] = useState(false);
    const handleClick = () => {
        setShowModal(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        onChange?.(e);
    };

    const handleSend = (text?: string, fileOrImage?: File | string) => {
        const hasText = text && text.trim() !== '';
        const hasFile = !!fileOrImage;

        if (!hasText && !hasFile) return;

        const baseMessage = {
            user: {
                id: user.data?.id ?? uuidv4(),
                first_name: user.data?.first_name || '',
                last_name: user.data?.last_name || '',
                username: user.data?.username || '',
            },
            timestamp: new Date(),
        };

        if (hasFile) {
            const isImage =
                typeof fileOrImage === 'string' ||
                (fileOrImage instanceof File && fileOrImage.type.startsWith('image/'));

            let fileName = '';
            let fileSize;
            if (typeof fileOrImage === 'string') {
                const now = new Date();
                const formattedDate = now
                    .toISOString()
                    .replace(/T/, '_')
                    .replace(/:/g, '-')
                    .split('.')[0];
                fileName = `${formattedDate}.jpg`;
            } else if (fileOrImage instanceof File) {
                fileName = fileOrImage.name;
                fileSize = fileOrImage.size;
            }

            const message: MessageType = {
                ...baseMessage,
                msgId: uuidv4(),
                text: fileName,
                fileSize,
                type: isImage ? 'image' : 'file',
                image:
                    typeof fileOrImage === 'string'
                        ? fileOrImage
                        : isImage
                          ? URL.createObjectURL(fileOrImage)
                          : undefined,
                file:
                    fileOrImage instanceof File && !isImage
                        ? URL.createObjectURL(fileOrImage)
                        : undefined,
            };

            dispatch(addMessage(message));
        }

        if (hasText) {
            const textMessage: MessageType = {
                ...baseMessage,
                msgId: uuidv4(),
                type: 'user',
                text: text.trim(),
            };

            dispatch(addMessage(textMessage));
        }

        setValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.metaKey || e.ctrlKey) return;

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(value, undefined);
            return;
        }
    };

    const resizeTextArea = () => {
        const elem = refTextArea.current;
        if (!elem) return;
        elem.style.height = 'auto';
        const scrollHeight = elem.scrollHeight;
        const lineHeight = parseInt(window.getComputedStyle(elem).lineHeight || '20', 10);

        const maxHeight = lineHeight * 13;

        elem.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        elem.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    };

    useEffect(() => {
        resizeTextArea();
    }, [value]);

    return (
        <div className="center-v gap-[1rem] w-full">
            <button
                className="w-[3rem] h-[3rem] rounded-[2rem] center glass self-end"
                onClick={handleClick}
            >
                <Plus />
            </button>
            <AddFileModal
                showModal={showModal}
                setShowModal={setShowModal}
                onSendFile={(file) => handleSend(undefined, file)}
            />
            <div className="relative glass grow rounded-[2rem] center-v">
                <textarea
                    ref={refTextArea}
                    className="pl-[1rem] py-[0.8rem] text-[1.2rem] leading-[1.3] font-[400] pr-[3rem] 
                    focus:outline-none focus:ring-0 w-full bg-transparent text-wrap resize-none overflow-hidden transition-all duration-200 no-scrollbar"
                    placeholder={placeholder}
                    onChange={handleChange}
                    value={value}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    {...props}
                />
                {(value.trim().length > 0 || mode === 'preview') && (
                    <button
                        className="w-[2.5rem] h-[2.5rem] rounded-[1.5rem] center bg-[var(--yellow)] absolute right-[0.35rem] bottom-[0.25rem]"
                        onClick={() => {
                            handleSend(value, imgSrc);
                            if (path !== '/chat') router.push('/chat');
                        }}
                    >
                        <Arrow />
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputSupportChat;
