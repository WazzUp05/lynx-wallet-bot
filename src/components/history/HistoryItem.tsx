'use client';
import React from 'react';
import { HistoryItemType } from './HistoryDay';
import SendIcon from '@/components/icons/send.svg';
import QrIcon from '@/components/icons/qr.svg';
import CardIcon from '@/components/icons/card.svg';
import PlusIcon from '@/components/icons/plus.svg';
import ArrowUpIcon from '@/components/icons/arrow-up.svg';
import ClockIcon from '@/components/icons/clock-small.svg';
import Link from 'next/link';
import { useMixpanel } from '@/lib/providers/MixpanelProvider';

type HistoryItemProps = {
    item: HistoryItemType;
};

const HistoryItem = ({ item }: HistoryItemProps) => {
    const { trackEvent } = useMixpanel();

    const getTypeImage = (type: string) => {
        switch (type) {
            case 'Вывод':
                return <ArrowUpIcon />;
            case 'Покупка':
                return <QrIcon />;
            case 'Пополнение':
                return <PlusIcon />;
            case 'Продажа':
                return <CardIcon />;
            case 'Перевод':
                return <SendIcon />;
            default:
                return null;
        }
    };
    return (
        <Link
            href={`/history/${item.transaction_hash}`}
            className="py-[1rem] px-[1.6rem] items-center bg-[var(--bg-secondary)] rounded-[1.5rem] box-shadow flex  gap-[1rem]"
            onClick={() => {
                trackEvent('history_transaction_clicked', {
                    transaction_hash: item.transaction_hash,
                    transaction_type: item.type,
                    transaction_status: item.status,
                });
            }}
        >
            <div className="w-[4rem] h-[4rem] text-[var(--yellow)] bg-[var(--yellow-secondary)] rounded-full center">
                {getTypeImage(item.type)}
            </div>
            <div className="flex flex-col ">
                <p className="text-[1.5rem] leading-[130%] text-[var(--text-main)]  font-semibold">{item.type}</p>
                <p className="text-[1.5rem] leading-[130%] text-[var(--text-secondary)] max-w-[11.3rem] truncate">
                    {item.receiver}
                </p>
            </div>
            <div className="flex flex-col items-end justify-between flex-1">
                {item.type !== 'Пополнение' && (
                    <div className="text-[1.5rem] leading-[130%] font-semibold">
                        - {item.amount.toFixed(2)} {item.type === 'Покупка' ? 'RUB' : 'USDT'}
                    </div>
                )}
                {item.type === 'Пополнение' && (
                    <div className="text-[1.5rem] leading-[130%] font-semibold">
                        + {item.sent_amount.toFixed(2)} USDT
                    </div>
                )}

                {item.status === 'В обработке' ? (
                    <div className="text-[1.2rem] flex items-center gap-[0.3rem] leading-[130%] text-[var(--yellow)]">
                        В обработке <ClockIcon />
                    </div>
                ) : item.status === 'Успешно' ? (
                    <div className="text-[1.2rem] leading-[130%] text-[var(--green)]">Успешно</div>
                ) : item.status === 'Отклонено' ? (
                    <div className="text-[1.2rem] leading-[130%] text-[var(--red)]">{item.status}</div>
                ) : (
                    <div className="text-[1.2rem] leading-[130%] text-[var(--text-main)]">{item.status}</div>
                )}
            </div>
        </Link>
    );
};

export default HistoryItem;
