'use client';

import React, { useId } from 'react';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;
    name?: string;
    value?: string;
}

/**
 * Переключатель (Switch/Toggle)
 * Используется для включения/выключения опций
 * Основан на нативном radio/checkbox input для лучшей доступности
 */
export const Switch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    disabled = false,
    ariaLabel,
    className = '',
    name,
    value,
}) => {
    const id = useId();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
            onChange(e.target.checked);
        }
    };

    return (
        <label
            htmlFor={id}
            className={`relative inline-block w-[4.8rem] h-[2.8rem] rounded-full transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--yellow)] ${
                checked ? 'bg-[var(--yellow)]' : 'bg-[var(--text-secondary)]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        >
            <input
                type="checkbox"
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                aria-label={ariaLabel}
                className="sr-only"
            />
            <span
                className={`absolute top-[0.3rem] left-[0.3rem] w-[2.2rem] h-[2.2rem] bg-white rounded-full transition-transform ${
                    checked ? 'translate-x-[2rem]' : 'translate-x-0'
                }`}
            />
        </label>
    );
};

export default Switch;
