'use client';

import React, { useState } from 'react';
import ArrowDownIcon from '@/components/icons/arrow-down.svg';
import { useMixpanel } from '@/lib/providers/MixpanelProvider';

interface FaqItemProps {
    question: string;
    answer: string;
    defaultOpen?: boolean;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const { trackEvent } = useMixpanel();

    const handleToggle = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        if (newIsOpen) {
            trackEvent('faq_question_opened', { question });
        } else {
            trackEvent('faq_question_closed', { question });
        }
    };

    return (
        <div className=" py-[1.5rem] border-t mt-[-1px] border-b border-[var(--dark-gray-secondary)] overflow-hidden">
            <button
                onClick={handleToggle}
                className="w-full flex items-center  justify-between text-left transition-all"
            >
                <span className="text-[1.6rem] leading-[130%] font-semibold text-[var(--text-main)] pr-[1rem]">
                    {question}
                </span>
                <div
                    className={`w-[2.4rem] h-[2.4rem] center transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                >
                    <ArrowDownIcon
                        width={24}
                        height={24}
                        className="w-[2.4rem] h-[2.4rem] text-[var(--text-main)]"
                    />
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500rem]' : 'max-h-0'}`}
            >
                <div
                    className="mt-[3rem] text-[1.4rem] leading-[130%] text-[var(--text-secondary)]"
                    dangerouslySetInnerHTML={{ __html: answer }}
                />
            </div>
        </div>
    );
};

export default FaqItem;
