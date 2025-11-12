'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import QrScanner from '@/components/QrScanner';
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
import { apiFetch } from '@/lib/helpers/url';
import CloseIcon from '@/components/icons/close.svg';
import Image from 'next/image';
import { useMixpanel } from '@/lib/providers/MixpanelProvider';

export default function QrScanPage() {
    const [scanned, setScanned] = useState<string | null>(null);
    const [toast, setToast] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [timer, setTimer] = useState(30);
    const [loadingQr, setLoadingQr] = useState(false);
    const [qrInfo, setQrInfo] = useState<{ rubAmount: number; usdtAmount: number } | null>(null);
    const loadingApp = useAppSelector(getLoading);
    const user = useAppSelector(getUser);
    const [toastMsg, setToastMsg] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const wallet = useAppSelector(getWallet);
    const balance_usdt = useCallback(() => wallet?.balance_usdt, [wallet])();
    const usdtRate = useAppSelector(getRatesQuoteRub);
    const { trackEvent } = useMixpanel();

    const merchant_id = user.data?.id;

    // Событие при открытии страницы
    useEffect(() => {
        trackEvent('qr_scan_page_opened');
    }, [trackEvent]);

    const onBack = () => {
        trackEvent('qr_scan_page_closed');
        router.push('/');
    };

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

    // Парсим сумму из QR и считаем итоговые значения
    const { rubAmount, usdtAmount } = useMemo(() => {
        let rub = 0;
        if (scanned) {
            const sumMatch = scanned.match(/sum=(\d+)/);
            const amountMatch = scanned.match(/amount=([\d.]+)/);

            if (sumMatch) {
                rub = parseInt(sumMatch[1], 10) / 100; // копейки → рубли
            } else if (amountMatch) {
                rub = parseFloat(amountMatch[1]); // уже в рублях
            }
        }
        const usdt = usdtRate && rub ? +(rub / usdtRate).toFixed(4) : 0;
        return { rubAmount: rub, usdtAmount: usdt };
    }, [scanned, usdtRate]);

    // Открываем модалку при сканировании
    const handleScan = async (result: string) => {
        setScanned(result);
        trackEvent('qr_code_scanned', { has_url: !!result });

        // Проверяем sum (в копейках) или amount (в рублях)
        const sumMatch = result.match(/sum=(\d+)/);
        const amountMatch = result.match(/amount=([\d.]+)/);

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
            setQrInfo({ rubAmount: rub, usdtAmount: usdt });
            setModalOpen(true);
            setLoadingQr(false);
            setErrorModalOpen(false);
            trackEvent('qr_scan_success', {
                rub_amount: rub,
                usdt_amount: usdt,
                has_amount_in_url: true,
            });
        } else {
            // Вариант 2: суммы нет, нужно запросить prepare
            setLoadingQr(true);
            const codeMatch = result.match(/qr\.nspk\.ru\/([^?]+)/);
            const code = codeMatch ? codeMatch[1] : null;
            if (code) {
                try {
                    const res = await fetch(`https://qr.lynx-wallet.com/prepare/${code}`);
                    const data = await res.json();
                    if (data.success && data.amount_rub) {
                        const rub = parseFloat(data.amount_rub);
                        const usdt = usdtRate && rub ? +(rub / usdtRate).toFixed(4) : 0;
                        setQrInfo({ rubAmount: rub, usdtAmount: usdt });
                        setModalOpen(true);
                        trackEvent('qr_scan_success', {
                            rub_amount: rub,
                            usdt_amount: usdt,
                            has_amount_in_url: false,
                            prepare_required: true,
                        });
                    } else {
                        setToastMsg('Не удалось получить сумму по QR');
                        setToast(true);
                        setTimeout(() => setToast(false), 2000);
                        trackEvent('qr_prepare_error', { code, error: 'invalid_response' });
                    }
                } catch (e) {
                    let errorMsg = 'Ошибка запроса prepare';
                    if (e instanceof Error && e.message) {
                        errorMsg += `: ${e.message}`;
                    }
                    setToastMsg(errorMsg);
                    setToast(true);
                    setTimeout(() => setToast(false), 2000);
                    trackEvent('qr_prepare_error', {
                        code,
                        error: e instanceof Error ? e.message : 'unknown_error',
                    });
                }
            } else {
                setErrorModalOpen(true);
                trackEvent('qr_scan_error', { reason: 'invalid_qr_code' });
            }
            setLoadingQr(false);
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
        if (modalOpen) {
            setTimer(30);
            trackEvent('qr_payment_modal_opened', {
                rub_amount: qrInfo?.rubAmount || 0,
                usdt_amount: qrInfo?.usdtAmount || 0,
            });
        }
    }, [modalOpen, trackEvent, qrInfo]);

    const handlePay = async () => {
        if (!qrInfo) return;

        setIsPaying(true);
        trackEvent('qr_payment_initiated', {
            rub_amount: qrInfo.rubAmount,
            usdt_amount: qrInfo.usdtAmount,
            rate: usdtRate ? usdtRate.toFixed(2) : '0.00',
        });

        const order = {
            amount: qrInfo.rubAmount,
            amount_usdt: qrInfo.usdtAmount,
            merchant_id,
            rate: usdtRate ? usdtRate.toFixed(2) : '0.00',
            url: scanned,
        };

        // alert(JSON.stringify(order, null, 2));

        try {
            const res = await apiFetch('/orders', {
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
                trackEvent('qr_payment_order_error', {
                    rub_amount: qrInfo.rubAmount,
                    usdt_amount: qrInfo.usdtAmount,
                    error: data.message || 'unknown_error',
                });
                setIsPaying(false);
                return;
            }

            if (data.success && data.data?.uuid) {
                trackEvent('qr_payment_order_created', {
                    order_uuid: data.data.uuid,
                    rub_amount: qrInfo.rubAmount,
                    usdt_amount: qrInfo.usdtAmount,
                });
                router.push(`/status/${data.data.uuid}`);
            }
        } catch (e) {
            console.error('Order error:', e);
            trackEvent('qr_payment_order_error', {
                rub_amount: qrInfo.rubAmount,
                usdt_amount: qrInfo.usdtAmount,
                error: e instanceof Error ? e.message : 'network_error',
            });
            setIsPaying(false);
        }
    };

    if (loadingApp) {
        return <Loader className="h-[100dvh]" />;
    }

    return (
        <div className="flex flex-col items-center justify-center pt-[2rem] min-h-[80vh] p-[1.6rem] pb-[calc(var(--safe-bottom)+1.6rem)]">
            {toast && <Toast open={toast} message={toastMsg} type="error" onClose={() => setToast(false)} />}
            <div className="flex w-full items-center justify-between mb-[1rem]">
                <button
                    className="bg-[var(--bg-secondary)]  rounded-[1rem] w-[3.5rem] h-[3.5rem] center ml-auto text-[var(--text-secondary)]"
                    onClick={onBack}
                    aria-label="Закрыть"
                >
                    <CloseIcon width={15} height={15} className="w-[1.5rem] h-[1.5rem]" />
                </button>
            </div>
            <p className="text-[1.1rem] leading-[130%] max-w-[27rem] text-center   mb-[0.8rem] text-[var(--text-main)]">
                Мы можем распознавать только QR-коды от&nbsp;платёжных терминалов
            </p>
            <div className="rounded-2xl overflow-hidden mb-4 bg-[#e5e5e5]">
                <QrScanner onResult={handleScan} paused={loadingQr || qrInfo ? true : false} torch finder zoom={true} />
            </div>
            <p className="text-center text-[var(--text-secondary)] mb-2">Наведите камеру на QR-код</p>
            {/* <span className="flex items-center gap-[0.4rem]">
                <RubleIcon /> {usdtRate ? usdtRate.toFixed(2) : "--"} RUB
            </span> */}
            {loadingQr && <Loader className="h-[4rem]" />}
            <Modal
                closable
                swipeToClose={false}
                open={errorModalOpen}
                onClose={() => {
                    setErrorModalOpen(false);
                    trackEvent('qr_error_modal_closed');
                }}
            >
                <div className="flex flex-col items-center text-center">
                    <Image
                        src="/qr-error.png"
                        alt="Error"
                        width={80}
                        height={80}
                        className="mb-[1.6rem] w-[8rem] h-[8rem]"
                    />
                    <h2 className="text-[2.5rem] leading-[130%]  font-semibold mb-[0.8rem]">QR-код не подходит</h2>
                    <p className="text-[1.4rem] leading-[130%] text-[var(--[var(--text-secondary)])]">
                        Отсканированный QR-код не действителен. Попробуйте ещё раз или запросите новый QR-код для
                        оплаты.
                    </p>
                </div>
            </Modal>
            <Modal
                title="Оплатить"
                closable
                swipeToClose={false}
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    trackEvent('qr_payment_modal_closed', {
                        rub_amount: qrInfo?.rubAmount || 0,
                        usdt_amount: qrInfo?.usdtAmount || 0,
                    });
                }}
            >
                <div className="flex flex-col items-center w-full">
                    {loadingQr || !qrInfo ? (
                        <Loader className="h-[10rem]" />
                    ) : (
                        <>
                            <div className="flex flex-col w-full mb-[1rem] gap-[1rem]  p-[1.6rem] rounded-[1.5rem] bg-[var(--bg-secondary)]">
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-[1.4rem] leading-[130%] text-[var(--[var(--text-secondary)])]">
                                        Сумма
                                    </p>
                                    <p className="text-[1.4rem] font-semibold leading-[130%]">
                                        {qrInfo.rubAmount ? qrInfo.rubAmount.toFixed(2) : '--'} RUB
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
                                {/* <div className="flex items-center justify-between w-full">
                                    <p className="text-[1.4rem] leading-[130%] text-[var(--[var(--text-secondary)])]">Обновится через</p>
                                    <p className="text-[1.4rem] font-semibold leading-[130%] text-[#007AFF]">
                                        {timer} сек
                                    </p>
                                </div> */}
                            </div>
                            <SelectCrypto cryptos={MOCK_SELECT_CRYPTO} />
                            <div className="flex items-center justify-between w-full mt-[2rem] mb-[3rem]">
                                <div className="flex flex-col text-[1.5rem] leading-[130%]">
                                    <p className="font-semibold text-[var(--text-main)]">Итого:</p>
                                    <p className="text-[var(--[var(--text-secondary)])]">Комиссия 0%</p>
                                </div>
                                <p className="text-[2.5rem] font-semibold leading-[130%] text-[var(--text-main)]">
                                    {qrInfo.usdtAmount ? qrInfo.usdtAmount : '--'} USDT
                                </p>
                            </div>
                            <Button
                                variant="yellow"
                                onClick={handlePay}
                                disabled={isPaying || (balance_usdt ? balance_usdt < qrInfo.usdtAmount : true)}
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