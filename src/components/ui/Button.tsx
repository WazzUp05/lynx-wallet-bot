import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost" | "black";
    fullWidth?: boolean;
}

const base =
    "rounded-[1.2rem] w-full fs-button py-[1.45rem] px-[2rem] transition focus:outline-none focus:ring-2 focus:ring-offset-2";
const variants = {
    primary: "bg-[var(--blue)] active:bg-[#1d4ed8] text-white",
    secondary: "bg-white border border-[var(--blue)] text-[var(--blue)] hover:bg-[#f1f5f9]",
    ghost: "bg-[var(--bg-blue)] text-[var(--blue)] hover:bg-[#f1f5f9] border border-transparent",
    black: "bg-black text-white hover:bg-[#1d4ed8] border border-transparent",
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    fullWidth = false,
    className = "",
    ...props
}) => {
    return (
        <button className={[base, variants[variant], fullWidth ? "w-full" : "", className].join(" ")} {...props}>
            {children}
        </button>
    );
};
