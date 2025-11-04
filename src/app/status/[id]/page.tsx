'use client';
import { Button } from '@/components/ui/Button';
import { useRouter, useParams } from 'next/navigation';
import ClockIcon from '@/components/icons/clock-bg.svg';
import CheckIcon from '@/components/icons/check-green.svg';
import CopyIcon from '@/components/icons/copy.svg';
import UsdtIcon from '@/components/icons/usdt.svg';
import RubleIcon from '@/components/icons/ruble.svg';
import ArrowRightIcon from '@/components/icons/right-arrow.svg';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import { Toast } from '@/components/ui/Toast';
import Image from 'next/image';
import Loader from '@/components/ui/Loader';
import { getLoading } from '@/lib/redux/selectors/userSelectors';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchUser } from '@/lib/redux/thunks/UserThunks';
import { API_URL } from '@/lib/helpers/url';
import { useCopyWithToast } from '@/hooks/useCopyWithToast';
import { useTelemetry } from '@/lib/providers/TelemetryProvider';

interface Order {
    id: number;
    uuid: string;
    status: string;
    status_label: string;
    amount: string;
    amount_formatted: string;
    amount_usdt: string;
    amount_usdt_formatted: string;
    rate: string;
    rate_formatted: string;
    url: string;
    merchant: {
        id: number;
        name: string;
        telegram_username: string;
        is_active: boolean;
    };
    trader: {
        id: number;
        name: string;
        login: string;
        is_active: boolean;
    };
    receiver: {
        id: number;
        name: string;
        uuid: string;
        is_active: boolean;
    };
    created_at: string;
    updated_at: string;
    created_at_human: string;
    updated_at_human: string;
}

export default function QrStatusPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params as { id: string };
    const dispatch = useAppDispatch();
    const loadingApp = useAppSelector(getLoading);
    const { copyWithToast, isCopying, toastOpen, toastMessage, closeToast } = useCopyWithToast();
    const { trackEvent } = useTelemetry();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const prevStatusRef = React.useRef<string | null>(null);
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    // Событие при открытии страницы
    useEffect(() => {
        trackEvent('payment_status_page_opened', { order_id: id });
    }, [trackEvent, id]);

    // Запрашиваем статус раз в 5 секунд
    useEffect(() => {
        let first = true;
        const fetchStatus = async () => {
            if (first) setLoading(true);
            try {
                setError(null);
                const res = await fetch(`${API_URL}/order/${id}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setOrder((prev: Order | null) => {
                        if (!prev || prev.status !== data.data.status) {
                            // Статус изменился
                            if (prev && prev.status !== data.data.status) {
                                trackEvent('payment_status_refreshed', {
                                    order_id: id,
                                    old_status: prev.status,
                                    new_status: data.data.status,
                                });
                            }
                            return data.data;
                        }
                        return {
                            ...prev,
                            created_at_human: data.data.created_at_human,
                            updated_at_human: data.data.updated_at_human,
                        };
                    });
                } else {
                    setError('Заявка не найдена');
                    trackEvent('payment_status_error', { order_id: id, error: 'order_not_found' });
                }
            } catch (e) {
                setError('Ошибка загрузки');
                trackEvent('payment_status_error', {
                    order_id: id,
                    error: e instanceof Error ? e.message : 'network_error',
                });
            } finally {
                if (first) setLoading(false);
                first = false;
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [id, trackEvent]);

    // Отслеживаем изменение статуса на успешный
    useEffect(() => {
        if (order?.status === 'success' && prevStatusRef.current !== 'success') {
            trackEvent('payment_status_success', {
                order_id: id,
                order_uuid: order.uuid,
                amount: order.amount,
                amount_usdt: order.amount_usdt,
            });
            prevStatusRef.current = 'success';
            dispatch(fetchUser());
        } else if (order?.status) {
            prevStatusRef.current = order.status;
        }
    }, [order?.status, order?.uuid, order?.amount, order?.amount_usdt, id, trackEvent, dispatch]);

    if (loadingApp || loading) {
        return <Loader className="h-[100dvh]" />;
    }

    if (error || !order) return <div className="p-8">{error || 'Заявка не найдена'}</div>;

    return (
        <div className="min-h-[100dvh] relative bg-[var(--bg-main)] overflow-hidden flex flex-col items-center px-[1.6rem] pb-[calc(var(--safe-bottom)+1.6rem)] py-[2rem]">
            <Toast open={toastOpen} message={toastMessage} onClose={closeToast} />
            {order.status === 'success' ? (
                <>
                    <div className="w-[60rem] h-[60rem] absolute top-[7.4rem] left-[-33.4rem] bg-[#34C85A4D] blur-[10rem] rounded-[50%]" />
                    <div className="w-[60rem] h-[50rem] absolute top-[7.4rem] right-[-33.4rem] bg-[#34C85A4D] blur-[10rem] rounded-[50%]" />
                </>
            ) : (
                <>
                    <div className="w-[60rem] h-[60rem] absolute top-[7.4rem] left-[-33.4rem] bg-[#007AFF4D] blur-[10rem] rounded-[50%]" />
                    <div className="w-[60rem] h-[50rem] absolute top-[7.4rem] right-[-33.4rem] bg-[#007AFF4D] blur-[10rem] rounded-[50%]" />
                </>
            )}
            <div className="w-full max-w-[400px] mx-auto relative ">
                <div className="flex flex-col items-center  mb-[8rem]">
                    <div className=" text-[1.8rem] mb-[1rem] font-semibold text-[var(--text-main)]">
                        Оплата по QR-коду
                    </div>
                    <div className="text-[var(--text-secondary)] text-[1.4rem] mb-[6.5rem]">
                        {dateFormatter.format(new Date(order.created_at))}
                    </div>
                    <div className="w-[8rem] h-[8rem] rounded-full bg-[#EBECEF1A] center mb-[1rem]">
                        {order.status === 'success' ? (
                            <Image src="/tick-circle-big.svg" alt="Paid" width={40} height={40} />
                        ) : (
                            <Image src="/loading.gif" alt="Waiting" width={100} height={100} />
                        )}
                    </div>
                    <div className="text-[2.5rem] text-[var(--text-main)] font-semibold mb-[1rem]">
                        {order.amount_usdt_formatted}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        {order.status === 'processing' && (
                            <span className="bg-[var(--dark-gray-main)] text-[var(--yellow)] flex items-center gap-[0.5rem] font-semibold rounded-full p-[0.7rem] text-[1.2rem] box-shadow leading-[130%]">
                                <ClockIcon width={20} height={20} /> Ожидание
                            </span>
                        )}
                        {order.status === 'success' && (
                            <span className="bg-[var(--dark-gray-main)] text-[var(--green)] flex items-center gap-[0.5rem] font-semibold rounded-full p-[0.7rem] text-[1.2rem] box-shadow leading-[130%]">
                                <CheckIcon width={20} height={20} /> Успешно
                            </span>
                        )}
                    </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-[1.5rem] box-shadow p-[1.5rem] mb-[1rem]">
                    <div className="flex justify-between mb-[1rem]">
                        <span className="text-[var(--text-secondary)] text-[1.4rem] leading-[130%]">Сумма</span>
                        <span className="font-semibold text-[1.4rem] text-[var(--text-main)] leading-[130%]">
                            {order.amount_formatted}
                        </span>
                    </div>
                    <div className="flex items-center justify-between w-full  ">
                        <p className="text-[1.4rem] leading-[130%] text-[var(--text-secondary)]">Курс обмена</p>
                        <p className="text-[1.4rem] font-semibold leading-[130%] flex items-center gap-[0.4rem]  text-[var(--text-main)]">
                            <span className="flex items-center gap-[0.4rem]">
                                <UsdtIcon width={15} height={15} /> 1 USDT
                            </span>
                            <ArrowRightIcon />{' '}
                            <span className="flex items-center gap-[0.4rem]">
                                <RubleIcon width={15} height={15} /> {order.rate_formatted} RUB
                            </span>{' '}
                        </p>
                    </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-[1.5rem] box-shadow p-[1.5rem] mb-[2rem]">
                    <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)] text-[1.4rem] leading-[130%]">ID заявки</span>
                        <span className="font-semibold text-[1.4rem] leading-[130%] flex items-center gap-[0.5rem]  text-[var(--text-main)]">
                            <span className="max-w-[14.4rem] truncate">{order.uuid}</span>
                            <button
                                className="text-[var(--text-secondary)]"
                                onClick={() => {
                                    trackEvent('payment_status_order_id_copied', {
                                        order_id: id,
                                        order_uuid: order.uuid,
                                    });
                                    copyWithToast(order.uuid, 'ID скопировано');
                                }}
                                disabled={isCopying}
                            >
                                <CopyIcon width={20} height={20} />
                            </button>
                        </span>
                    </div>
                </div>
                <Button
                    variant="yellow"
                    className="w-full mb-[1rem]"
                    onClick={() => {
                        trackEvent('payment_status_home_clicked', {
                            order_id: id,
                            order_uuid: order.uuid,
                            status: order.status,
                        });
                        router.push('/');
                    }}
                >
                    На главную
                </Button>
                {/* <Button className="w-full" variant="ghost" onClick={() => router.push(`/history/${order.uuid}`)}>
                    Детали транзакции
                </Button> */}
            </div>
        </div>
    );
}
