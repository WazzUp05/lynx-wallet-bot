'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ArrowLeft from '@/components/icons/arrow-left.svg';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import WarrningLeftIcon from '@/components/icons/warrning-mark.svg';
import Modal from '@/components/Modal';
import RubleIcon from '@/components/icons/ruble.svg';
import UsdtIcon from '@/components/icons/usdt.svg';
import ArrowRightIcon from '@/components/icons/right-arrow.svg';
import SelectCrypto from '@/components/SelectCrypto';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getRatesQuoteRub } from '@/lib/redux/selectors/rateSelectors';
import { fetchRates } from '@/lib/redux/thunks/rateThunks';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import { getLoading, getUser, getWallet } from '@/lib/redux/selectors/userSelectors';
import { API_URL } from '@/lib/helpers/url';
import Input from '@/components/ui/Input';
import { useTelemetry } from '@/lib/providers/TelemetryProvider';

export default function LinkPage() {
    const [link, setLink] = useState<string>('');
    const [toast, setToast] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [timer, setTimer] = useState(30);
    const [loadingLink, setLoadingLink] = useState(false);
    const [linkInfo, setLinkInfo] = useState<{ rubAmount: number; usdtAmount: number } | null>(null);
    const [error, setError] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const loadingApp = useAppSelector(getLoading);
    const user = useAppSelector(getUser);
    const [toastMsg, setToastMsg] = useState('');
    const dispatch = useAppDispatch();
    const router = useRouter();
    const wallet = useAppSelector(getWallet);
    const balance_usdt = useCallback(() => wallet?.balance_usdt, [wallet])();
    const usdtRate = useAppSelector(getRatesQuoteRub);

    const merchant_id = user.data?.id;
    const { trackEvent } = useTelemetry();

    // Событие при открытии страницы
    useEffect(() => {
        trackEvent('link_payment_page_opened');
    }, [trackEvent]);

    const MOCK_SELECT_CRYPTO = [
        {
            id: 'USDT',
            label: 'USDT',
            description: balance_usdt ? `${balance_usdt} USDT` : '0.00 USDT',
            iconUrl: '/icons/usdt.svg',
        },
        // {
        //     id: "TON",
        //     label: "TON",
        //     description: "0.0 TON",
        //     iconUrl: "/icons/ton.svg",
        // },
    ];

    // Парсим сумму из ссылки и считаем итоговые значения
    const { rubAmount, usdtAmount } = useMemo(() => {
        let rub = 0;
        if (link) {
            const sumMatch = link.match(/sum=(\d+)/);
            const amountMatch = link.match(/amount=([\d.]+)/);

            if (sumMatch) {
                rub = parseInt(sumMatch[1], 10) / 100; // копейки → рубли
            } else if (amountMatch) {
                rub = parseFloat(amountMatch[1]); // уже в рублях
            }
        }
        const usdt = usdtRate && rub ? +(rub / usdtRate).toFixed(4) : 0;
        return { rubAmount: rub, usdtAmount: usdt };
    }, [link, usdtRate]);

    // Валидация ссылки
    const validateLink = (url: string) => {
        if (!url.trim()) {
            setError('Вставьте ссылку для перехода к оплате');
            trackEvent('link_validation_error', { error: 'empty_link' });
            return false;
        }

        if (!url.startsWith('https://qr.nspk.ru/')) {
            setError('Неверный формат ссылки. Ссылка должна начинаться: https://qr.nspk...');
            trackEvent('link_validation_error', { error: 'invalid_format' });
            return false;
        }

        setError('');
        return true;
    };

    // Обработка ссылки
    const handleLinkSubmit = async () => {
        if (!validateLink(link)) return;

        trackEvent('link_submitted', { has_url: !!link });
        setLoadingLink(true);
        setError('');

        // Проверяем sum (в копейках) или amount (в рублях)
        const sumMatch = link.match(/sum=(\d+)/);
        const amountMatch = link.match(/amount=([\d.]+)/);

        if (sumMatch || amountMatch) {
            // Вариант 1: сумма есть в ссылке
            let rub = 0;

            if (sumMatch) {
                // sum - в копейках, делим на 100
                rub = parseInt(sumMatch[1], 10) / 100;
            } else if (amountMatch) {
                // amount - в рублях (может быть с точкой), не делим
                rub = parseFloat(amountMatch[1]);
            }

            const usdt = usdtRate && rub ? +(rub / usdtRate).toFixed(4) : 0;
            setLinkInfo({ rubAmount: rub, usdtAmount: usdt });
            setModalOpen(true);
            setLoadingLink(false);
        } else {
            // Вариант 2: суммы нет, нужно запросить prepare
            const codeMatch = link.match(/qr\.nspk\.ru\/([^?]+)/);
            const code = codeMatch ? codeMatch[1] : null;
            if (code) {
                try {
                    const res = await fetch(`https://qr.lynx-wallet.com/prepare/${code}`);
                    const data = await res.json();
                    if (data.success && data.amount_rub) {
                        const rub = parseFloat(data.amount_rub);
                        const usdt = usdtRate && rub ? +(rub / usdtRate).toFixed(4) : 0;
                        setLinkInfo({ rubAmount: rub, usdtAmount: usdt });
                        setModalOpen(true);
                    } else {
                        setToastMsg('Не удалось получить сумму по ссылке');
                        setToast(true);
                        setTimeout(() => setToast(false), 2000);
                        trackEvent('link_prepare_error', { code, error: 'invalid_response' });
                    }
                } catch (e) {
                    let errorMsg = 'Ошибка запроса prepare';
                    if (e instanceof Error && e.message) {
                        errorMsg += `: ${e.message}`;
                    }
                    setToastMsg(errorMsg);
                    setToast(true);
                    setTimeout(() => setToast(false), 2000);
                    trackEvent('link_prepare_error', {
                        code,
                        error: e instanceof Error ? e.message : 'unknown_error',
                    });
                }
            } else {
                setToastMsg('Некорректная ссылка');
                setToast(true);
                setTimeout(() => setToast(false), 2000);
                trackEvent('link_validation_error', { error: 'invalid_link_format' });
            }
            setLoadingLink(false);
        }
    };

    // Запуск таймера и обновление курса
    useEffect(() => {
        if (!modalOpen) return;
        if (timer === 0) {
            dispatch(fetchRates());
            setTimer(30);
            return;
        }
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, modalOpen, dispatch]);

    // Сброс таймера при открытии модалки
    useEffect(() => {
        if (modalOpen && linkInfo) {
            setTimer(30);
            trackEvent('link_payment_modal_opened', {
                rub_amount: linkInfo.rubAmount,
                usdt_amount: linkInfo.usdtAmount,
            });
        }
    }, [modalOpen, linkInfo, trackEvent]);

    const handlePay = async () => {
        if (!linkInfo) return;

        setIsPaying(true);
        trackEvent('link_payment_initiated', {
            rub_amount: linkInfo.rubAmount,
            usdt_amount: linkInfo.usdtAmount,
            rate: usdtRate ? usdtRate.toFixed(2) : '0.00',
        });

        const order = {
            amount: linkInfo.rubAmount,
            amount_usdt: linkInfo.usdtAmount,
            merchant_id,
            rate: usdtRate ? usdtRate.toFixed(2) : '0.00',
            url: link,
        };

        // alert(JSON.stringify(order, null, 2));

        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(order),
            });
            const data = await res.json();

            if (data.success === false) {
                setToast(true);
                setTimeout(() => setToast(false), 2000);
                // Можно сохранить текст сообщения для Toast:
                setToastMsg(data.message || 'Ошибка при создании заявки');
                trackEvent('link_payment_order_error', {
                    rub_amount: linkInfo.rubAmount,
                    usdt_amount: linkInfo.usdtAmount,
                    error: data.message || 'unknown_error',
                });
                setIsPaying(false);
                return;
            }

            if (data.success && data.data?.uuid) {
                trackEvent('link_payment_order_created', {
                    order_uuid: data.data.uuid,
                    rub_amount: linkInfo.rubAmount,
                    usdt_amount: linkInfo.usdtAmount,
                });
                router.push(`/status/${data.data.uuid}`);
            }
        } catch (e) {
            console.error('Order error:', e);
            trackEvent('link_payment_order_error', {
                rub_amount: linkInfo.rubAmount,
                usdt_amount: linkInfo.usdtAmount,
                error: e instanceof Error ? e.message : 'network_error',
            });
            setIsPaying(false);
        }
    };

    if (loadingApp) {
        return <Loader className="h-[100dvh]" />;
    }

    return (
        <div className="p-[1.6rem] pb-[calc(var(--safe-bottom)+1.6rem)] flex flex-col min-h-[100dvh]">
            {toast && <Toast open={toast} message={toastMsg} type="error" onClose={() => setToast(false)} />}
            <div className="flex h-[3.6rem] items-center justify-center relative text-[1.8rem] leading-[130%] mb-[3.2rem] font-semibold">
                <div
                    className="absolute left-[0] top-1/2 translate-y-[-50%] bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] center ml-auto text-[var(--text-secondary)]"
                    onClick={() => {
                        trackEvent('link_payment_page_closed');
                        router.back();
                    }}
                >
                    <ArrowLeft />
                </div>
                <span className="text-white">Оплатить по ссылке</span>
            </div>
            <p className="text-[1.4rem] leading-[130%] font-medium mb-[0.8rem] text-[var(--text-secondary)]">
                Как оплатить по ссылке
            </p>
            <div className="flex flex-col mb-[1.2rem] gap-[1.6rem] bg-[var(--bg-secondary)] p-[1.6rem] rounded-[2rem]">
                <div className="flex items-start gap-[0.6rem]">
                    <span className="text-[1.2rem] text-[var(--bg-secondary)] font-semibold leading-[130%] bg-[var(--text-main)] min-w-[1.6rem] h-[1.6rem] rounded-full center">
                        1
                    </span>
                    <p className="text-[1.3rem] leading-[130%]  text-[var(--text-main)]">
                        На компьютере или другом устройстве выберите оплату по СБП.
                    </p>
                </div>
                <div className="flex items-start gap-[0.6rem]">
                    <span className="text-[1.2rem] text-[var(--bg-secondary)] font-semibold leading-[130%] bg-[var(--text-main)] min-w-[1.6rem] h-[1.6rem] rounded-full center">
                        2
                    </span>
                    <p className="text-[1.3rem] leading-[130%]  text-[var(--text-main)]">
                        Когда появится QR-код, наведите на него камеру телефона и откройте ссылку в браузере.
                    </p>
                </div>
                <div className="flex items-start gap-[0.6rem]">
                    <span className="text-[1.2rem] text-[var(--bg-secondary)] font-semibold leading-[130%] bg-[var(--text-main)] min-w-[1.6rem] h-[1.6rem] rounded-full center">
                        3
                    </span>
                    <p className="text-[1.3rem] leading-[130%]  text-[var(--text-main)]">
                        Откроется страница оплаты. Скопируйте ссылку (URL) из адресной строки — она должна начинаться с{' '}
                        <span className="text-[var(--yellow)]">https://qr.nspk.ru/.</span>
                    </p>
                </div>
                <div className="flex items-start gap-[0.6rem]">
                    <span className="text-[1.2rem] text-[var(--bg-secondary)] font-semibold leading-[130%] bg-[var(--text-main)] min-w-[1.6rem] h-[1.6rem] rounded-full center">
                        4
                    </span>
                    <p className="text-[1.3rem] leading-[130%]  text-[var(--text-main)]">
                        Вернитесь в Lynx, вставьте ссылку в поле ниже и нажмите «Продолжить».
                    </p>
                </div>
            </div>
            <div className="w-full flex gap-[0.5rem] bg-[var(--yellow-optional)]  py-[1.6rem] px-[1.6rem] rounded-[1.5rem] mb-[1.2rem] text-[1.2rem] leading-[130%] ">
                <div>
                    <WarrningLeftIcon width={20} height={20} />
                </div>
                <span className="text-[var(--text-main)]">
                    Этот способ работает только через QR-код, отсканированный с компьютера или другого устройства.
                </span>
            </div>
            <div className=" bg-[var(--bg-secondary)] px-[1.6rem] py-[2rem] rounded-[2rem]">
                <Input
                    label="Платёжная ссылка"
                    placeholder="Вставьте ссылку"
                    value={link}
                    onChange={(e) => {
                        const newLink = e.target.value;
                        setLink(newLink);
                        setError('');
                        if (newLink.trim()) {
                            trackEvent('link_pasted', { has_url: !!newLink });
                        }
                    }}
                    error={error}
                />
            </div>
            <Button
                variant="yellow"
                className="w-full mt-[1.6rem]"
                onClick={handleLinkSubmit}
                disabled={loadingLink || !link.trim()}
            >
                {loadingLink ? 'Обработка...' : 'Продолжить'}
            </Button>
            <Modal
                title="Оплатить"
                closable
                swipeToClose={false}
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    trackEvent('link_payment_modal_closed', {
                        rub_amount: linkInfo?.rubAmount || 0,
                        usdt_amount: linkInfo?.usdtAmount || 0,
                    });
                }}
            >
                <div className="flex flex-col items-center w-full">
                    {loadingLink || !linkInfo ? (
                        <Loader className="h-[10rem]" />
                    ) : (
                        <>
                            <div className="flex flex-col w-full mb-[1rem] gap-[1rem]  p-[1.6rem] rounded-[1.5rem] bg-[var(--bg-secondary)]">
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-[1.4rem] leading-[130%] text-[var(--[var(--text-secondary)])]">
                                        Сумма
                                    </p>
                                    <p className="text-[1.4rem] font-semibold leading-[130%]">
                                        {linkInfo.rubAmount ? linkInfo.rubAmount.toFixed(2) : '--'} RUB
                                    </p>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-[1.4rem] leading-[130%] text-[var(--[var(--text-secondary)])]">
                                        Курс обмена
                                    </p>
                                    <p className="text-[1.4rem] font-semibold leading-[130%] flex items-center gap-[0.4rem]">
                                        <span className="flex items-center gap-[0.4rem] text-[var(--text-main)]">
                                            <UsdtIcon /> 1 USDT
                                        </span>
                                        <ArrowRightIcon className="text-[var(--text-secondary)]" />
                                        <span className="flex items-center gap-[0.4rem] text-[var(--text-main)]">
                                            <RubleIcon /> {usdtRate ? usdtRate.toFixed(2) : '--'} RUB
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <SelectCrypto cryptos={MOCK_SELECT_CRYPTO} />
                            <div className="flex items-center justify-between w-full mt-[2rem] mb-[3rem]">
                                <div className="flex flex-col text-[1.5rem] leading-[130%]">
                                    <p className="font-semibold text-[var(--text-main)]">Итого:</p>
                                    <p className="text-[var(--[var(--text-secondary)])]">Комиссия 0%</p>
                                </div>
                                <p className="text-[2.5rem] font-semibold leading-[130%] text-[var(--text-main)]">
                                    {linkInfo.usdtAmount ? linkInfo.usdtAmount : '--'} USDT
                                </p>
                            </div>
                            <Button
                                variant="yellow"
                                onClick={handlePay}
                                disabled={isPaying || (balance_usdt ? balance_usdt < linkInfo.usdtAmount : true)}
                                className="mb-2"
                            >
                                {isPaying ? (
                                    <div className="flex items-center justify-center gap-[0.8rem]">
                                        <div className="w-[1.6rem] h-[1.6rem] border-2 border-[var(--yellow)] border-t-transparent rounded-full animate-spin" />
                                        <span>Обработка...</span>
                                    </div>
                                ) : (
                                    'Оплатить'
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}
