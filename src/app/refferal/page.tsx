'use client';
import Loader from '@/components/ui/Loader';
import { useAppSelector } from '@/lib/redux/hooks';
import { getLoading, getUser } from '@/lib/redux/selectors/userSelectors';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import InfoIcon from '@/components/icons/Info.svg';
import ArrowLeftIcon from '@/components/icons/arrow-left.svg';
import QrIcon from '@/components/icons/qr-icon.svg';
import { useMixpanel } from '@/lib/providers/MixpanelProvider';
import { useRouter } from 'next/navigation';
import QRCode from '@/components/QrCode';
import { Button } from '@/components/ui/Button';
import LinkCopy from '@/components/LinkCopy';
import ReferralLevelCard from '@/components/ReferralLevelCard';
import ReferralStats from '@/components/ReferralStats';
// Данные уровней
const REFERRAL_LEVELS = [
    {
        levelNumber: 1,
        levelImage: '/refferal/level1.png',
        title: 'Новичок',
        description: 'Нет рефералов.<br/>Пригласите друзей',
        income: null,
        minReferrals: 0,
        maxReferrals: 1,
    },
    {
        levelNumber: 2,
        levelImage: '/refferal/level2.png',
        title: 'Оператор',
        description: 'От 2 до 25<br/>активных рефералов',
        income: '20%',
        minReferrals: 2,
        maxReferrals: 25,
    },
    {
        levelNumber: 3,
        levelImage: '/refferal/level3.png',
        title: 'Инженер',
        description: 'От 26 до 100<br/>активных рефералов',
        income: '25%',
        minReferrals: 26,
        maxReferrals: 100,
    },
    {
        levelNumber: 4,
        levelImage: '/refferal/level4.png',
        title: 'Архитектор',
        description: 'Более 101<br/>активного реферала',
        income: '30%',
        minReferrals: 101,
        maxReferrals: Infinity,
    },
];

// Получить индекс текущего уровня
const getCurrentLevelIndex = (count: number): number => {
    return REFERRAL_LEVELS.findIndex((level) => count >= level.minReferrals && count <= level.maxReferrals);
};

const Refferal = () => {
    const router = useRouter();
    const user = useAppSelector(getUser);
    const loadingApp = useAppSelector(getLoading);
    const { trackEvent } = useMixpanel();
    const countReferrals = 0;
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Текущий уровень и отфильтрованные уровни (текущий + следующие)
    const currentLevelIndex = getCurrentLevelIndex(countReferrals);
    const visibleLevels = REFERRAL_LEVELS.filter((_, index) => index >= currentLevelIndex);

    // Событие при открытии страницы
    useEffect(() => {
        trackEvent('profile_Refferal_opened');
    }, [trackEvent]);

    // Обработчик клика на ссылку поддержки
    const handleSupportClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const supportUrl = 'https://t.me/Lynx_help';

        // Показываем стандартный диалог подтверждения
        const confirmed = window.confirm('Вы хотите перейти в чат поддержки?');

        if (confirmed) {
            trackEvent('support_link_opened');

            if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                // Если в Telegram, используем openLink
                window.Telegram.WebApp.openLink(supportUrl);
            } else {
                // Иначе открываем в новой вкладке
                window.open(supportUrl, '_blank');
            }
        }
    };

    // Drag to scroll handlers
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Скорость скролла
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    if (loadingApp) {
        return <Loader className="h-[100dvh]" />;
    }

    return (
        <div className="px-[1.6rem] py-[2rem] w-full bg-[var(--bg-optional)] min-h-[100dvh] flex flex-col pb-[calc(var(--safe-bottom)+1.6rem)]">
            <div className="flex h-[3.6rem] items-center justify-center relative text-[1.8rem] leading-[130%]  font-semibold">
                <div
                    className="absolute cursor-pointer left-[0] top-1/2 translate-y-[-50%] bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] center ml-auto text-[var(--text-secondary)]"
                    onClick={() => {
                        trackEvent('refill_page_closed');
                        router.back();
                    }}
                >
                    <ArrowLeftIcon />
                </div>
            </div>
            <div className="center relative">
                <Image
                    className="rounded-full w-[25rem] h-[25rem] relative z-10"
                    src={'/refferal/friends.png'}
                    alt={'friends'}
                    width={250}
                    height={250}
                />

                <div className="w-[25rem] h-[25rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[11.4rem] bg-[#FFFFFF80] rounded-[5rem] blur-[4rem] rotate-[135deg]" />
                    <Image
                        className="rounded-full w-[22.6rem] h-[22.6rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        src={'/refferal/elipses.png'}
                        alt={'elipses'}
                        width={226}
                        height={226}
                    />
                    <div className="w-full h-full absolute top-0 left-0 animate-orbit-fast">
                        <div className="w-[1.6rem] h-[1.6rem] absolute left-[5.9rem] bottom-[7rem] animate-counter-fast">
                            <Image
                                className="rounded-full w-[1.6rem] h-[1.6rem]"
                                src={'/refferal/coin.png'}
                                alt={'coin'}
                                width={16}
                                height={16}
                            />
                        </div>
                    </div>
                    <div className="w-full h-full absolute top-0 left-0 animate-orbit-medium">
                        <div className="w-[3rem] h-[3rem] absolute bottom-[3.4rem] right-[5.9rem] animate-counter-medium">
                            <Image
                                className="rounded-full w-[3rem] h-[3rem]"
                                src={'/refferal/coin.png'}
                                alt={'coin'}
                                width={30}
                                height={30}
                            />
                        </div>
                    </div>
                    <div className="w-full h-full absolute top-0 left-0 animate-orbit-slow">
                        <div className="w-[5rem] h-[5rem] absolute top-[1.5rem] right-[2.6rem] animate-counter-slow">
                            <Image
                                className="rounded-full w-[5rem] h-[5rem]"
                                src={'/refferal/coin.png'}
                                alt={'coin'}
                                width={50}
                                height={50}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <h1 className="fs-bold text-[var(--text-main)] text-center mb-[1rem]">
                Расскажите друзьям <br /> и зарабатывайте в Lynx
            </h1>
            <p className="fs-regular text-[var(--text-secondary)] text-center mb-[2.4rem]">
                до 30% от комиссии сервиса с пополнений и выводов приглашённых.
            </p>
            <div className="flex gap-[0.5rem] p-[1.6rem] bg-[var(--yellow-optional)] rounded-[1.5rem] mb-[2.4rem]">
                <InfoIcon />
                <p className="fs-very-small text-[var(--text-main)] ">
                    Операции без комиссии (обмены, QR <br />и внутренние переводы) не участвуют <br />в программе.
                </p>
            </div>
            <div className="p-[1.6rem] bg-[var(--bg-secondary)] rounded-[2rem] mb-[2.4rem]">
                <div className="flex gap-[1.2rem] mb-[2.4rem]">
                    <QRCode data="https://t.me/lynx_wallet_bot/app?startapp_ref=1234567890" size={120} />
                    <div>
                        <h2 className="text-[1.6rem] leading-[130%] font-semibold text-[var(--text-main)] mb-[0.8rem]">
                            Реферальная ссылка
                        </h2>
                        <p className="text-[1.4rem] leading-[130%] text-[var(--text-secondary)]">
                            Отправьте её друзьям при помощи ссылки или&nbsp;отсканируйте QR.
                        </p>
                    </div>
                </div>
                <LinkCopy
                    link={`https://t.me/lynx_wallet_bot/app?startapp_ref=${user.data?.id}`}
                    className="mb-[1.6rem]"
                />
                <Button className="w-full" variant="yellow">
                    Поделиться ссылкой
                </Button>
            </div>
            <div className="mb-[3rem]">
                <p className="fs-regular text-[var(--text-secondary)] mb-[0.8rem]">Статистика</p>
                <ReferralStats count={countReferrals} />
            </div>
            <div className="mb-[3rem]">
                <p className="fs-regular text-[var(--text-secondary)] mb-[0.8rem]">Уровни</p>
                <div
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className="flex flex-nowrap overflow-x-auto gap-[1.6rem] no-scrollbar cursor-grab active:cursor-grabbing"
                    style={{ userSelect: 'none' }}
                >
                    {visibleLevels.map((level, index) => (
                        <ReferralLevelCard
                            key={level.levelNumber}
                            levelImage={level.levelImage}
                            levelNumber={level.levelNumber}
                            title={level.title}
                            description={level.description}
                            isCurrent={index === 0}
                            income={level.income}
                        />
                    ))}
                </div>
            </div>
            <h2 className="fs-bold text-[var(--text-main)] text-center mb-[2.4rem]">Как это работает?</h2>
            <div className="p-[1.6rem] bg-[var(--bg-secondary)] rounded-[2rem] flex flex-col gap-[1.6rem]">
                <div className="flex bg-[var(--bg-optional)] rounded-[1.5rem] p-[1.6rem] gap-[0.8rem]">
                    <span className="fs-very-small-bold center min-w-[1.6rem] h-[1.6rem] rounded-full center bg-[var(--yellow)] text-[var(--bg-secondary)]">
                        1
                    </span>
                    <div>
                        <p className="fs-regular text-[var(--text-main)] mb-[0.4rem]">Пригласите друзей</p>
                        <p className="fs-very-small text-[var(--text-secondary)]">
                            Пригласите друзей в Lynx и получайте процент от их транзакций.
                        </p>
                    </div>
                </div>
                <div className="flex bg-[var(--bg-optional)] rounded-[1.5rem] p-[1.6rem] gap-[0.8rem]">
                    <span className="fs-very-small-bold center min-w-[1.6rem] h-[1.6rem] rounded-full center bg-[var(--yellow)] text-[var(--bg-secondary)]">
                        2
                    </span>
                    <div>
                        <p className="fs-regular text-[var(--text-main)] mb-[0.4rem]">Друзья пользуются Lynx</p>
                        <p className="fs-very-small text-[var(--text-secondary)]">
                            Они пополняют или выводят средства в Lynx.
                        </p>
                    </div>
                </div>
                <div className="flex bg-[var(--bg-optional)] rounded-[1.5rem] p-[1.6rem] gap-[0.8rem]">
                    <span className="fs-very-small-bold center  min-w-[1.6rem] h-[1.6rem] rounded-full center bg-[var(--yellow)] text-[var(--bg-secondary)]">
                        3
                    </span>
                    <div>
                        <p className="fs-regular text-[var(--text-main)] mb-[0.4rem]">Вы получаете доход</p>
                        <p className="fs-very-small text-[var(--text-secondary)]">
                            Часть комиссии сервиса за их операции поступает на ваш реферальный баланс.
                        </p>
                    </div>
                </div>
                <p className="fs-very-small text-[var(--text-secondary)] ">
                    Если у вас остались вопросы, вы можете{' '}
                    <a href="https://t.me/Lynx_help" className="link" onClick={handleSupportClick}>
                        написать в поддержку
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Refferal;
