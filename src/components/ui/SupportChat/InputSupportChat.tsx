'use client';
import Arrow from '@/components/icons/arrow.svg';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getSupportChatMessages } from '@/lib/redux/selectors/SupportChatSelector';
import { v4 as uuidv4 } from 'uuid';
import { addMessage } from '@/lib/redux/slices/SupportChatSlice';
import { getUser } from '@/lib/redux/selectors/userSelectors';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  className?: string;
}

const InputChat: React.FC<InputProps> = ({ placeholder = 'Сообщение...', onChange, ...props }) => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(getSupportChatMessages);
  const user = useAppSelector(getUser);

  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative glass grow rounded-[2rem] center">
      <input
        className="pl-[1rem] py-[0.8rem] fs-very-small pr-[3rem] 
                  focus:outline-none focus:ring-0 w-full bg-transparent wrap-normal text-wrap"
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        {...props}
        type="text"
        onKeyDown={handleKeyDown}
      />
      {value.trim().length > 0 && (
        <button
          className="w-[2.5rem] h-[2.5rem] rounded-[1.5rem] center bg-[var(--yellow)] absolute right-[0.3rem]"
          onClick={handleSend}
        >
          <Arrow />
        </button>
      )}
    </div>
  );
};

export default InputChat;
