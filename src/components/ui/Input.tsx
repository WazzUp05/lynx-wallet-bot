import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    className?: string;
    inputClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', inputClassName = '', ...props }, ref) => {
        return (
            <div className={`flex flex-col gap-[0.8rem] ${className}`}>
                {label && (
                    <label className="text-[1.4rem] leading-[130%] text-[var(--text-main)] font-medium">{label}</label>
                )}

                <div className="relative">
                    <div
                        className={`flex items-center w-full h-[4.8rem] px-[1.6rem] rounded-[1.5rem] border transition-all duration-200 ${
                            error
                                ? 'border-[var(--red-main)] bg-[var(--red-secondary)]'
                                : 'border-[var(--bg-secondary)] bg-[var(--dark-gray-secondary)]'
                        }`}
                    >
                        <input
                            ref={ref}
                            type="text"
                            className={`flex-1 bg-transparent text-[1.4rem] ${
                                error ? 'text-[var(--red-main)]' : 'text-[var(--text-main)]'
                            } placeholder:text-[var(--text-secondary)] outline-none ${inputClassName}`}
                            {...props}
                        />
                    </div>
                    {error && <p className="text-[1.4rem] leading-[130%] mt-[1rem] text-[var(--red-main)]">{error}</p>}
                </div>
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
