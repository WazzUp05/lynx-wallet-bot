import React from 'react';
import WarrningLeftIcon from '@/components/icons/warrning-mark.svg';
import RightIcon from '@/components/icons/right-arrow.svg';

interface WarrningBlockProps {
    onClick?: () => void;
    text: string;
    className?: string;
}

const WarrningBlock = ({ onClick, text, className }: WarrningBlockProps) => {
    return (
        <div
            onClick={onClick}
            className={`w-full flex gap-[0.5rem] bg-[var(--yellow-optional)]  py-[1.6rem] px-[1.6rem] rounded-[1.5rem] mb-[1.2rem] text-[1.2rem] leading-[130%] ${className}`}
        >
            <div>
                <WarrningLeftIcon width={20} height={20} />
            </div>
            <span className="text-[var(--text-main)]">{text}</span>
            {onClick && typeof onClick === 'function' && (
                <div className="text-[var(--yellow)] ml-auto bg-[var(--yellow-secondary)] rounded-[1rem] min-w-[2.5rem] h-[2.5rem] center ">
                    <RightIcon width={16} height={16} />
                </div>
            )}
        </div>
    );
};

export default WarrningBlock;
