'use client';
import React from 'react';
import Image from 'next/image';

interface ReferralLevelCardProps {
    levelImage: string;
    levelNumber?: number;
    title: string;
    description: string;
    isCurrent?: boolean;
    income?: string | null;
    className?: string;
}

const ReferralLevelCard: React.FC<ReferralLevelCardProps> = ({
    levelImage,
    levelNumber,
    title,
    description,
    isCurrent = false,
    income = null,
    className = '',
}) => {
    return (
        <div
            className={`flex min-w-fit center p-[1.6rem] bg-[var(--bg-secondary)] bg-[url('/refferal/bg.svg')] bg-cover bg-center rounded-[2rem] flex-col ${className}`}
        >
            <div className="flex mb-[1.6rem] gap-[1.6rem]">
                <Image
                    src={levelImage}
                    alt={`level-${levelNumber || 'unknown'}`}
                    className="w-[8.3rem] h-[8.3rem] pointer-events-none"
                    width={83}
                    height={83}
                />
                <div>
                    {isCurrent ? (
                        <span className="fs-very-small-bold text-[var(--green)] bg-[var(--green-secondary)] rounded-[0.7rem] px-[0.6rem] py-[0.3rem] mb-[0.4rem] inline-block">
                            Текущий
                        </span>
                    ) : levelNumber ? (
                        <span className="fs-very-small-bold text-[var(--text-main)] bg-[var(--dark-gray-main)] rounded-[0.7rem] px-[0.6rem] py-[0.3rem] mb-[0.4rem] inline-block">
                            Уровень {levelNumber}
                        </span>
                    ) : null}
                    <p className="fs-regular text-[var(--text-main)] mb-[0.4rem]">{title}</p>
                    <p
                        className="fs-very-small text-[var(--text-secondary)]"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </div>
            </div>
            <div className="bg-[var(--dark-gray-main)] rounded-[2rem] p-[1.6rem] flex items-center justify-between w-full">
                {income ? (
                    <div className="flex items-center gap-[0.4rem]">
                        <p className="fs-small text-[var(--text-secondary)]">Реферальный доход:</p>
                        <span className="fs-regular text-[var(--text-main)]">{income}</span>
                    </div>
                ) : (
                    <p className="fs-small text-[var(--text-secondary)]">Нет доходности</p>
                )}
            </div>
        </div>
    );
};

export default ReferralLevelCard;
