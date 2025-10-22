import React, { forwardRef, useState, useEffect } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    placeholder?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    error?: string;
    className?: string;
    inputClassName?: string;
    buttonClassName?: string;
}

/**
 * Кастомный инпут с кнопкой для вставки из буфера обмена
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            placeholder = 'Вставьте ссылку',
            buttonText = 'Вставить',
            onButtonClick,
            error,
            className = '',
            inputClassName = '',
            buttonClassName = '',
            ...props
        },
        ref
    ) => {
        const [value, setValue] = useState(props.value || props.defaultValue || '');
        const [hasClipboardText, setHasClipboardText] = useState(false);

        // Проверяем буфер обмена при монтировании и при фокусе
        const checkClipboard = async () => {
            try {
                // Проверяем поддержку Clipboard API
                if (!navigator.clipboard || !navigator.clipboard.readText) {
                    // На мобильных устройствах показываем кнопку всегда
                    setHasClipboardText(true);
                    return;
                }

                const text = await navigator.clipboard.readText();
                setHasClipboardText(text.trim().length > 0);
            } catch (err) {
                // На мобильных устройствах или в небезопасном контексте показываем кнопку всегда
                console.log('Clipboard API недоступен:', err);
                setHasClipboardText(true);
            }
        };

        useEffect(() => {
            checkClipboard();
        }, []);

        const handlePaste = async () => {
            try {
                // Проверяем поддержку Clipboard API
                if (!navigator.clipboard || !navigator.clipboard.readText) {
                    // Fallback для старых браузеров или мобильных устройств
                    const text = prompt('Вставьте текст из буфера обмена:');
                    if (text) {
                        setValue(text);
                        if (props.onChange) {
                            props.onChange({
                                target: { value: text },
                            } as React.ChangeEvent<HTMLInputElement>);
                        }
                        if (onButtonClick) {
                            onButtonClick();
                        }
                    }
                    return;
                }

                const text = await navigator.clipboard.readText();
                setValue(text);
                if (props.onChange) {
                    props.onChange({
                        target: { value: text },
                    } as React.ChangeEvent<HTMLInputElement>);
                }
                if (onButtonClick) {
                    onButtonClick();
                }
            } catch (err) {
                console.error('Ошибка при вставке:', err);
                // Fallback для случаев, когда Clipboard API заблокирован
                const text = prompt('Вставьте текст из буфера обмена:');
                if (text) {
                    setValue(text);
                    if (props.onChange) {
                        props.onChange({
                            target: { value: text },
                        } as React.ChangeEvent<HTMLInputElement>);
                    }
                    if (onButtonClick) {
                        onButtonClick();
                    }
                }
            }
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
            if (props.onChange) {
                props.onChange(e);
            }
        };

        const handleFocus = () => {
            checkClipboard();
        };

        const handlePasteEvent = (e: React.ClipboardEvent<HTMLInputElement>) => {
            const text = e.clipboardData.getData('text');
            if (text) {
                setValue(text);
                if (props.onChange) {
                    props.onChange({
                        target: { value: text },
                    } as React.ChangeEvent<HTMLInputElement>);
                }
                if (onButtonClick) {
                    onButtonClick();
                }
            }
        };

        return (
            <div className={`flex flex-col gap-[0.8rem] ${className}`}>
                {label && (
                    <label className="text-[1.4rem] leading-[130%]  text-[var(--text-main)] font-medium">{label}</label>
                )}

                <div className="relative">
                    <div
                        className={`flex items-center w-full h-[4.8rem] px-[1.6rem] rounded-[1.5rem]  border  border-[var(--bg-secondary)] focus-within:border-[var(--yellow)] transition-all duration-200 ${
                            error
                                ? 'border-[var(--red-main)] bg-[var(--red-secondary)]'
                                : 'border-[var(--bg-secondary)] bg-[var(--dark-gray-secondary)]'
                        }`}
                    >
                        <input
                            ref={ref}
                            type="text"
                            value={value}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onPaste={handlePasteEvent}
                            placeholder={placeholder}
                            className={`flex-1 bg-transparent text-[1.4rem] ${
                                error ? 'text-[var(--red-main)]' : 'text-[var(--text-main)]'
                            } placeholder:text-[var(--text-secondary)] outline-none ${inputClassName}`}
                            {...props}
                        />

                        {hasClipboardText && (
                            <button
                                type="button"
                                onClick={handlePaste}
                                className={`flex items-center gap-[0.8rem] px-[1.2rem] py-[0.8rem] rounded-[0.8rem] bg-transparent hover:bg-[var(--bg-hover)] transition-colors duration-200 text-[#FFD700]  text-[1.4rem] ${buttonClassName}`}
                            >
                                {buttonText}
                            </button>
                        )}
                    </div>

                    {error && <p className="text-[1.4rem] leading-[130%] mt-[1rem] text-[var(--red-main)]">{error}</p>}
                </div>
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
