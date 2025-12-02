import React, { forwardRef, useState } from "react";

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
            placeholder = "Вставьте ссылку",
            buttonText = "Вставить",
            onButtonClick,
            error,
            className = "",
            inputClassName = "",
            buttonClassName = "",
            ...props
        },
        ref
    ) => {
        const [value, setValue] = useState(props.value || props.defaultValue || "");
        const [clipboardText, setClipboardText] = useState<string | null>(null);

        const handleCheckClipboard = async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (text.trim().length > 0) setClipboardText(text);
            } catch (err) {
                console.warn("Буфер недоступен:", err);
            }
        };

        const handlePaste = async () => {
            if (!clipboardText) return;
            setValue(clipboardText);
            props.onChange?.({
                target: { value: clipboardText },
            } as React.ChangeEvent<HTMLInputElement>);
            onButtonClick?.();
        };

        return (
            <div className={`flex flex-col gap-[0.8rem] ${className}`}>
                {label && (
                    <label className="text-[1.4rem] leading-[130%] text-[var(--text-main)] font-medium">
                        {label}
                    </label>
                )}

                <div className="relative">
                    <div
                        className={`flex items-center w-full h-[4.8rem] px-[1.6rem] rounded-[1.5rem] border transition-all duration-200 ${
                            error
                                ? "border-[var(--red-main)] bg-[var(--red-secondary)]"
                                : "border-[var(--bg-secondary)] bg-[var(--dark-gray-secondary)]"
                        }`}
                    >
                        <input
                            ref={ref}
                            type="text"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                props.onChange?.(e);
                            }}
                            placeholder={placeholder}
                            onClick={handleCheckClipboard} // 👈 важно — только по клику
                            className={`flex-1 bg-transparent text-[1.4rem] ${
                                error ? "text-[var(--red-main)]" : "text-[var(--text-main)]"
                            } placeholder:text-[var(--text-secondary)] outline-none ${inputClassName}`}
                            {...props}
                        />

                        {clipboardText && (
                            <button
                                type="button"
                                onClick={handlePaste}
                                className={`flex items-center gap-[0.8rem] px-[1.2rem] py-[0.8rem] rounded-[0.8rem] bg-transparent hover:bg-[var(--bg-hover)] transition-colors duration-200 text-[#FFD700] text-[1.4rem] ${buttonClassName}`}
                            >
                                {buttonText}
                            </button>
                        )}
                    </div>

                    {error && (
                        <p className="text-[1.4rem] leading-[130%] mt-[1rem] text-[var(--red-main)]">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
