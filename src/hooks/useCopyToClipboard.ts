import { useState } from 'react';

interface UseCopyToClipboardReturn {
    copyToClipboard: (text: string, successMessage?: string) => Promise<boolean>;
    isCopying: boolean;
    lastCopiedText: string | null;
}

export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
    const [isCopying, setIsCopying] = useState(false);
    const [lastCopiedText, setLastCopiedText] = useState<string | null>(null);

    const copyToClipboard = async (text: string, successMessage?: string): Promise<boolean> => {
        setIsCopying(true);
        setLastCopiedText(text);

        try {
            if (navigator.clipboard && window.isSecureContext) {
                // Современный API для HTTPS
                await navigator.clipboard.writeText(text);
                return true;
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
                return success;
            }
        } catch (error) {
            console.error('Ошибка копирования:', error);
            return false;
        } finally {
            setIsCopying(false);
        }
    };

    return {
        copyToClipboard,
        isCopying,
        lastCopiedText,
    };
};
