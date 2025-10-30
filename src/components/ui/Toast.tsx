import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CheckIcon from '@/components/icons/check-green.svg';
import ErrorIcon from '@/components/icons/error.svg';
import ClockIcon from '@/components/icons/clock-bg.svg';
import WarrningIcon from '@/components/icons/warrning-mark.svg';
interface ToastProps {
    open: boolean;
    message: string;
    onClose: () => void;
    duration?: number; // ms
    type?: 'success' | 'error' | 'waiting' | 'warrning';
}

export const Toast: React.FC<ToastProps> = ({ open, message, onClose, duration = 2000, type = 'success' }) => {
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
                    className={`fixed top-[2.6rem] left-1/2 -translate-x-1/2 z-[9999] box-shadow rounded-[1.5rem] flex items-center gap-[0.5rem] py-[0.55rem] px-[0.7rem] text-[1.2rem] leading-[130%] font-semibold
                        ${
                            type === 'error'
                                ? 'bg-[#FFEAEA] text-[#D32F2F]'
                                : 'bg-[var(--dark-gray-secondary)] text-[var(--text-main)]'
                        }
                    `}
                >
                    <div className="center w-[2.4rem] h-[2.4rem]">
                        {type === 'error' ? (
                            <ErrorIcon width={20} height={20} />
                        ) : type === 'success' ? (
                            <CheckIcon width={20} height={20} />
                        ) : type === 'waiting' ? (
                            <ClockIcon className="text-[var(--yellow)]" width={20} height={20} />
                        ) : type === 'warrning' ? (
                            <WarrningIcon className="text-[#FF9000]" width={20} height={20} />
                        ) : null}
                    </div>

                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
