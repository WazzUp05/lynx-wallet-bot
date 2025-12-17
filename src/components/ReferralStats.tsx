'use client';
import React from 'react';

interface ReferralStatsProps {
    count: number;
}

// Уровни рефералов
const LEVELS = [
    { min: 0, max: 1, name: 'Новичок', income: null },
    { min: 2, max: 25, name: 'Оператор', income: '20%' },
    { min: 26, max: 100, name: 'Инженер', income: '25%' },
    { min: 101, max: Infinity, name: 'Архитектор', income: '30%' },
];

const getCurrentLevel = (count: number) => {
    return LEVELS.findIndex((level) => count >= level.min && count <= level.max);
};

const getNextLevelThreshold = (count: number): number | null => {
    if (count < 2) return 2;
    if (count <= 25) return 26;
    if (count <= 100) return 101;
    return null; // Максимальный уровень достигнут
};

const getProgressPercent = (count: number): number => {
    if (count === 0) return 0;
    if (count < 2) return (count / 2) * 100;
    if (count <= 25) return ((count - 2) / (25 - 2)) * 100;
    if (count <= 100) return ((count - 26) / (100 - 26)) * 100;
    return 100; // Максимальный уровень
};

const getReferralsToNextLevel = (count: number): number | null => {
    const nextThreshold = getNextLevelThreshold(count);
    if (nextThreshold === null) return null;
    return nextThreshold - count;
};

const ReferralStats: React.FC<ReferralStatsProps> = ({ count }) => {
    const isMaxLevel = count >= 101;
    const referralsToNext = getReferralsToNextLevel(count);
    const progressPercent = getProgressPercent(count);

    // Состояние: 0 рефералов
    if (count === 0) {
        return (
            <div className="p-[1.6rem] bg-[var(--bg-secondary)] rounded-[2rem] flex gap-[1.6rem]">
                <div className="flex center bg-[var(--dark-gray-main)] text-[1.4rem] leading-[130%] font-medium text-[var(--text-secondary)] rounded-[0.7rem] min-w-[5rem] h-[6rem]">
                    {count}
                </div>
                <div>
                    <h2 className="fs-small text-[var(--text-main)] mb-[0.4rem]">У вас пока нет рефералов</h2>
                    <p className="fs-very-small text-[var(--text-secondary)]">
                        Пригласите от 2-х друзей в Lynx для участия
                    </p>
                </div>
            </div>
        );
    }

    // Состояние: максимальный уровень (101+)
    if (isMaxLevel) {
        return (
            <div className="p-[1.6rem] bg-[var(--bg-secondary)] rounded-[2rem] flex gap-[1.6rem]">
                <div className="flex flex-col center bg-[var(--yellow-secondary)] text-[1.4rem] leading-[130%] font-medium text-[var(--yellow)] rounded-[0.7rem] min-w-[5rem] h-[6rem]">
                    {count}
                </div>
                <div className="flex-1">
                    <h2 className="fs-small text-[var(--text-main)] mb-[0.4rem]">Рефералов</h2>
                    {/* Прогресс-бар */}
                    <div className="h-[0.4rem] bg-[var(--dark-gray-main)] rounded-full overflow-hidden mb-[0.8rem]">
                        <div
                            className="h-full bg-[var(--yellow)] rounded-full transition-all duration-300"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <p className="fs-very-small text-[var(--text-secondary)]">
                        Достигнут <span className="text-[var(--text-main)]">максимальный уровень</span> комиссии с
                        операций друзей
                    </p>
                </div>
            </div>
        );
    }

    // Состояние: есть рефералы, но не максимум (1-100)
    return (
        <div className="p-[1.6rem] bg-[var(--bg-secondary)] rounded-[2rem] flex gap-[1.6rem]">
            <div className="flex flex-col center bg-[var(--yellow-secondary)] text-[1.4rem] leading-[130%] font-medium text-[var(--yellow)] rounded-[0.7rem] min-w-[5rem] h-[6rem]">
                {count}
            </div>
            <div className="flex-1">
                <h2 className="fs-small text-[var(--text-main)] mb-[0.4rem]">Рефералов</h2>
                {/* Прогресс-бар */}
                <div className="h-[0.4rem] bg-[var(--dark-gray-main)] rounded-full overflow-hidden mb-[0.8rem]">
                    <div
                        className="h-full bg-[var(--yellow)] rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p className="fs-very-small text-[var(--text-secondary)]">
                    Пригласите ещё{' '}
                    <span className="text-[var(--text-main)]">
                        {referralsToNext} {getDeclension(referralsToNext || 0, ['друга', 'друзей', 'друзей'])}
                    </span>{' '}
                    для повышения доходности
                </p>
            </div>
        </div>
    );
};

// Склонение слов
function getDeclension(number: number, titles: [string, string, string]): string {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[Math.min(number % 10, 5)]];
}

export default ReferralStats;
