import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed top-[1.4rem] left-1/2 -translate-x-1/2 z-[9999] bg-white box-shadow rounded-[1.5rem] flex items-center gap-[0.5rem] p-[1.05rem] text-black text-[1.2rem] leading-[130%] font-semibold"
                >
                    <CheckIcon />
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
