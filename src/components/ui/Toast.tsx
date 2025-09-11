import React, { useEffect } from "react";
import CheckIcon from "@/components/icons/check-green.svg";

interface ToastProps {
    open: boolean;
    message: string;
    onClose: () => void;
    duration?: number; // ms
}

export const Toast: React.FC<ToastProps> = ({ open, message, onClose, duration = 2000 }) => {
    useEffect(() => {
        if (!open) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [open, duration, onClose]);

    if (!open) return null;

    return (
        <div className="fixed top-[1.4rem] left-1/2 -translate-x-1/2 z-[9999] bg-white box-shadow rounded-[1.5rem] flex items-center gap-[0.5rem] p-[1.05rem] text-black text-[1.2rem] leading-[130%] font-semibold animate-fade-in">
            <CheckIcon />
            {message}
        </div>
    );
};
