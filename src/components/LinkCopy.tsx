'use client';
import React from 'react';
import CopyIcon from '@/components/icons/copy.svg';
import { Toast } from '@/components/ui/Toast';
import { useCopyWithToast } from '@/hooks/useCopyWithToast';

interface LinkCopyProps {
    link: string;
    label?: string;
    className?: string;
}

const LinkCopy: React.FC<LinkCopyProps> = ({ link, label = 'Ссылка', className = '' }) => {
    const { copyWithToast, toastOpen, toastMessage, closeToast } = useCopyWithToast();

    const handleCopy = () => {
        copyWithToast(link, 'Ссылка скопирована');
    };

    return (
        <>
            <Toast open={toastOpen} message={toastMessage} onClose={closeToast} />
            <div
                className={`flex items-center justify-between p-[1.6rem] bg-[var(--dark-gray-main)] rounded-[1.5rem] ${className}`}
            >
                <div className="flex-1 min-w-0 mr-[2rem]">
                    <p className="text-[1.3rem] leading-[130%] text-[var(--text-secondary)] mb-[0.4rem]">{label}</p>
                    <p className="text-[1.4rem] leading-[130%] font-medium text-[var(--text-main)] truncate">{link}</p>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex-shrink-0 w-[2.5rem] h-[2.5rem] text-[var(--text-secondary)]  center rounded-[1.2rem] cursor-pointer transition-all hover:opacity-80 active:scale-95"
                    aria-label="Копировать ссылку"
                >
                    <CopyIcon className="w-[2.5rem] h-[2.5rem]" />
                </button>
            </div>
        </>
    );
};

export default LinkCopy;
