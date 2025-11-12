'use client';

import Arrow from '@/components/icons/arrow.svg';
import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// import { getSupportChatMessages } from '@/lib/redux/selectors/SupportChatSelector';
import { v4 as uuidv4 } from 'uuid';
import { addMessage } from '@/lib/redux/slices/SupportChatSlice';
import { getUser } from '@/lib/redux/selectors/userSelectors';

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  className?: string;
}

const InputChat: React.FC<InputProps> = ({ placeholder = 'Сообщение...', onChange, ...props }) => {
  const dispatch = useAppDispatch();
  // const messages = useAppSelector(getSupportChatMessages);
  const user = useAppSelector(getUser);

  const [value, setValue] = useState('');
  const refTextArea = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  const handleSend = () => {
    if (!value.trim()) return;
    setValue('');
    dispatch(
      addMessage({
        type: 'user',
        text: value.trim(),
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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log(document.activeElement);
    if (e.metaKey || e.ctrlKey) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return;
    }
  };

  useEffect(() => {
  const el = refTextArea.current;
  if (!el) return;
  el.addEventListener('paste', () => console.log('native paste event'));
  el.addEventListener('keydown', (e) => console.log('native keydown', e.key));
  return () => {
    el.removeEventListener('paste', () => {});
    el.removeEventListener('keydown', () => {});
  };
}, []);

  const resizeTextArea = () => {
    const elem = refTextArea.current;
    if (!elem) return;
    elem.style.height = 'auto';
    const scrollHeight = elem.scrollHeight;
    const lineHeight = parseInt(window.getComputedStyle(elem).lineHeight || '20', 10);

    // вычисляем максимальную высоту (13 строк)
    const maxHeight = lineHeight * 13;

    // применяем высоту: растёт до maxHeight, потом появляется внутренний скролл
    elem.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    elem.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  };
  

  useEffect(() => {
    resizeTextArea();
  }, [value]);

  return (
    <div className="relative glass grow rounded-[2rem] center">
      <textarea
        ref={refTextArea}
        className="pl-[1rem] py-[0.8rem] fs-very-small pr-[3rem] 
                  focus:outline-none focus:ring-0 w-full bg-transparent text-wrap resize-none overflow-hidden transition-all duration-200 no-scrollbar"
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        onKeyDown={handleKeyDown}
        rows={1}
        {...props}
      />
      {value.trim().length > 0 && (
        <button
          className="w-[2.5rem] h-[2.5rem] rounded-[1.5rem] center bg-[var(--yellow)] absolute right-[0.3rem] bottom-[0.3rem]"
          onClick={handleSend}
        >
          <Arrow />
        </button>
      )}
    </div>
  );
};

export default InputChat;
