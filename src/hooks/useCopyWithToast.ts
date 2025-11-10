import { useState } from 'react';

interface UseCopyWithToastReturn {
  copyWithToast: (text: string, successMessage?: string, errorMessage?: string) => Promise<void>;
  isCopying: boolean;
  toastOpen: boolean;
  toastMessage: string;
  closeToast: () => void;
}

export const useCopyWithToast = (): UseCopyWithToastReturn => {
  const [isCopying, setIsCopying] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const copyWithToast = async (
    text: string,
    successMessage: string = 'Скопировано в буфер обмена',
    errorMessage: string = 'Не удалось скопировать'
  ): Promise<void> => {
    setIsCopying(true);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Современный API для HTTPS
        await navigator.clipboard.writeText(text);
        setToastMessage(successMessage);
      } else {
        // Fallback для Safari/WebView и HTTP
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const success = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (success) {
          setToastMessage(successMessage);
        } else {
          setToastMessage(errorMessage);
        }
      }
    } catch (error) {
      console.error('Ошибка копирования:', error);
      setToastMessage(errorMessage);
    } finally {
      setIsCopying(false);
      setToastOpen(true);
    }
  };

  const closeToast = () => {
    setToastOpen(false);
  };

  return {
    copyWithToast,
    isCopying,
    toastOpen,
    toastMessage,
    closeToast,
  };
};
