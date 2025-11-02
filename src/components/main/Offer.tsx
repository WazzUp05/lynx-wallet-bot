'use client';
import Image from 'next/image';
import React from 'react';
import ExportIcon from '@/components/icons/export.svg';
import { useCopyWithToast } from '@/hooks/useCopyWithToast';
import { useAppSelector } from '@/lib/redux/hooks';
import { getNeedDeposit, getWaitingForDeposit } from '@/lib/redux/selectors/appSelectors';

const Offer = () => {
    const { copyWithToast, isCopying } = useCopyWithToast();
    const needDeposit = useAppSelector(getNeedDeposit);
    const waitingDeposit = useAppSelector(getWaitingForDeposit);
    const handleShare = async () => {
        const shareData = {
            title: 'Lynx Wallet Bot',
            text: 'Пригласи своих друзей на бета-тестирование Lynx Wallet Bot!',
            url: window.location.href,
        };

        try {
            // Проверяем поддержку Web Share API
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback: копируем ссылку в буфер обмена
                await copyWithToast(shareData.url, 'Ссылка скопирована в буфер обмена!');
            }
        } catch (error) {
            console.error('Ошибка при попытке поделиться:', error);
            // Fallback: копируем ссылку в буфер обмена
            await copyWithToast(shareData.url, 'Ссылка скопирована в буфер обмена!');
        }
    };

    if (needDeposit && !waitingDeposit) {
        return (
            <div className="offer-slider mb-[2.4rem] px-[1.6rem]">
                <div className="p-[1.6rem] bg-gradient-to-r from-[#000000] to-[#B406FF]  rounded-[2rem] w-full relative overflow-hidden">
                    <p className="text-[1.6rem] leading-[130%] max-w-[17.9rem] text-[var(--text-main)]">
                        Пополните счёт, чтобы активировать функции Lynx
                    </p>
                    <Image
                        src="/offer-robot-deposite.png"
                        priority
                        alt="Offer Image"
                        width={130 * 3}
                        height={90 * 3}
                        className="mx-auto w-[13rem] h-[9rem] absolute right-[1.5rem] bottom-[0rem] z-10"
                    />
                    <div className="absolute top-0 right-0 h-[12.8rem] w-[12.8rem] bg-white blur-[8rem] rounded-full" />
                </div>
            </div>
        );
    }

    if (needDeposit && waitingDeposit) {
        return null;
    }
    return (
        <div className="offer-slider mb-[2.4rem] px-[1.6rem]">
            <div className="p-[1.6rem] bg-gradient-to-r from-[#000000] to-[#061BFF]  rounded-[2rem] w-full relative overflow-hidden">
                <button
                    onClick={handleShare}
                    disabled={isCopying}
                    className="text-[1.2rem] bg-[var(--dark-gray-secondary)] text-[var(--text-main)] w-fit leading-[130%] mb-[1rem] flex gap-[0.5rem] items-center py-[0.3rem] px-[0.7rem] rounded-[1.5rem] font-medium hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
                >
                    Поделиться
                    <ExportIcon width={13} height={13} className="w-[1.3rem] h-[1.3rem]" />
                </button>
                <p className="text-[1.4rem] leading-[130%] max-w-[16.2rem] text-[var(--text-main)]">
                    Пригласи своих друзей на бета-тестирование
                </p>
                <Image
                    src="/offer-robot.png"
                    alt="Offer Image"
                    priority
                    width={234 * 3}
                    height={199 * 3}
                    className="mx-auto w-[13.4rem] h-[9.9rem] absolute right-0 top-[0rem] z-10"
                />
                <div className="absolute top-0 right-0 h-[12.8rem] w-[12.8rem] bg-white blur-[8rem] rounded-full" />
            </div>
        </div>
    );
};

export default Offer;
