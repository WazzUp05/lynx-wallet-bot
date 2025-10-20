import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'black' | 'yellow';
    fullWidth?: boolean;
}

const base =
    'rounded-[1.2rem] w-full fs-button py-[1.45rem] px-[2rem] transition focus:outline-none focus:ring-2 focus:ring-offset-2';
const variants = {
    primary: 'bg-[var(--blue)] active:bg-[#1d4ed8] text-white',
    secondary: 'bg-white border border-[var(--blue)] text-[var(--blue)] hover:bg-[#f1f5f9]',
    ghost: 'bg-[var(--yellow-secondary)] text-[var(--yellow)] hover:bg-[var(--yellow-secondary)]/80 border border-transparent',
    black: 'bg-[var(--bg-secondary)] text-[var(--text-main)] hover:bg-[#1d4ed8] border border-transparent',
    yellow: 'bg-[var(--yellow)] text-[var(--bg-secondary)] hover:bg-[var(--yellow)]/80 border border-transparent',
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    return (
        <button
            className={[
                base,
                variants[variant],
                fullWidth ? 'w-full' : '',
                'disabled:bg-[#E9EAEE] disabled:text-[#9D9DA5]  disabled:cursor-not-allowed',
                className,
            ].join(' ')}
            {...props}
        >
            {children}
        </button>
    );
};
