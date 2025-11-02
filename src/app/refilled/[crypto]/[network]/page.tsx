'use client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import ArrowLeft from '@/components/icons/arrow-left.svg';
import WarrningLeftIcon from '@/components/icons/warrning-mark.svg';
import RightIcon from '@/components/icons/right-arrow.svg';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import TaxModal from '@/components/modals/TaxModal';
import { Toast } from '@/components/ui/Toast';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getLoading, getWallet } from '@/lib/redux/selectors/userSelectors';
import Loader from '@/components/ui/Loader';
import MinAmountModal from '@/components/modals/MinAmountModal';
import { useCopyWithToast } from '@/hooks/useCopyWithToast';
import { useTelemetry } from '@/lib/providers/TelemetryProvider';
import { useEffect } from 'react';

// Типизация для адресов
type NetworkData = {
    address: string;
    fee: string;
    min: string;
    networkLabel: string;
    icon: string;
};
type Addresses = {
    [crypto: string]: {
        [network: string]: NetworkData;
    };
};

export default function RefilledQrPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const wallet = useAppSelector(getWallet);
    const loadingApp = useAppSelector(getLoading);
    const { crypto, network } = params as { crypto: string; network: string };
    const { trackEvent } = useTelemetry();
    const [showMinAmountModal, setShowMinAmountModal] = useState(false);
    const [showTaxModal, setShowTaxModal] = useState(false);

    const { copyWithToast, isCopying, toastOpen, toastMessage, closeToast } = useCopyWithToast();

    // Событие при открытии страницы
    useEffect(() => {
        trackEvent('refill_qr_page_opened', {
            crypto,
            network,
        });
    }, [crypto, network, trackEvent]);

    // useEffect(() => {
    //     dispatch(fetchUser());
    // }, [dispatch]);

    // Моковые данные для примера
    const ADDRESSES: Addresses = {
        USDT: {
            TRC20: {
                address: wallet?.address || '',
                fee: '2.75 USDT',
                min: '5 USDT',
                networkLabel: 'TRC20',
                icon: '/icons/usdt.svg',
            },
            TON: {
                address: 'UQ...TONADDRESS',
                fee: '2.75 USDT',
                min: '1 USDT',
                networkLabel: 'TON',
                icon: '/icons/ton.svg',
            },
        },
        TON: {
            TON: {
                address: 'UQ...TONADDRESS',
                fee: '0.2 TON',
                min: '1 TON',
                networkLabel: 'TON',
                icon: '/icons/ton.svg',
            },
        },
    };

    const srcQr =
        network === 'TRC20' ? '/icons/USDT-TRC20.svg' : network === 'TON' ? '/icons/TON-TON.svg' : '/qr-demo.png';

    const upperCrypto = crypto?.toUpperCase();
    const upperNetwork = network?.toUpperCase();

    // Без any: используем типизацию Addresses
    const data: NetworkData | undefined =
        upperCrypto in ADDRESSES && upperNetwork in ADDRESSES[upperCrypto]
            ? ADDRESSES[upperCrypto][upperNetwork]
            : undefined;

    if (loadingApp || !wallet?.address) {
        return <Loader className="h-[100dvh]" />;
    }

    if (!data) return <div className="p-8">Данные не найдены</div>;

    return (
        <div className=" bg-[var(--bg-optional)] flex flex-col items-center p-[1.6rem] pb-[calc(var(--safe-bottom)+1.6rem)] min-h-[100dvh] ">
            <Toast open={toastOpen} onClose={closeToast} message={toastMessage} />
            <div className="flex h-[3.6rem] items-center justify-center relative text-[1.8rem] leading-[130%] mb-[3rem] font-semibold w-full">
                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] center ml-auto text-[var(--text-secondary)]"
                    onClick={() => {
                        trackEvent('refill_qr_page_closed', { crypto, network });
                        router.back();
                    }}
                >
                    <ArrowLeft />
                </button>
                <span className="flex items-center gap-[0.5rem] ">
                    <Image src={data.icon} alt={data.networkLabel} width={24} height={24} />
                    Пополнение {crypto}
                </span>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-[1.5rem] box-shadow py-[1.6rem] px-[1.6rem] w-full  flex flex-col items-center mb-[2.5rem]">
                <div className="mb-[2rem]">
                    <QRCodeSVG
                        value={data.address}
                        size={150}
                        bgColor="#EBECEF"
                        fgColor="#1C1C1E"
                        radius="50"
                        imageSettings={{
                            src: srcQr,
                            x: undefined,
                            y: undefined,

                            height: 35,
                            width: 35,
                            excavate: true,
                        }}
                    />
                </div>
                <p className="mb-[0.5rem] text-[var(--gray)] fs-very-small">
                    Ваш адрес <span className="uppercase">{crypto}</span> в сети {data.networkLabel}
                </p>
                <div className="text-[1.4rem] leading-[130%] font-semibold break-all text-center mb-[0.5rem]">
                    {data.address}
                </div>
                <div className="text-[1.2rem] max-w-[23.3rem] mx-auto leading-[130%] text-[var(--gray)] text-center mb-[1.6rem]">
                    Адрес принимает только <b>USDT в сети TRC20</b>. Отправка через другие сети{' '}
                    <b>приведёт к потере средств!</b>
                </div>
                <div
                    onClick={() => {
                        trackEvent('refill_min_amount_modal_opened', { crypto, network });
                        setShowMinAmountModal(true);
                    }}
                    className="w-full flex gap-[0.5rem] bg-[var(--yellow-optional)]  py-[1.6rem] px-[1.6rem] rounded-[1.5rem] mb-[1.2rem] text-[1.2rem] leading-[130%] "
                >
                    <div>
                        <WarrningLeftIcon width={20} height={20} />
                    </div>
                    <span className="text-[var(--text-main)]">
                        Переведите от <b>{data.min}</b>, чтобы средства зачислились на счёт
                    </span>
                    <div className="text-[var(--yellow)] ml-auto bg-[var(--yellow-secondary)] rounded-[1rem] min-w-[2.5rem] h-[2.5rem] center ">
                        <RightIcon width={16} height={16} />
                    </div>
                </div>
                <div
                    onClick={() => {
                        trackEvent('refill_tax_modal_opened', { crypto, network });
                        setShowTaxModal(true);
                    }}
                    className="w-full bg-[var(--yellow-optional)]  py-[1.6rem] px-[1.6rem] rounded-[1.5rem] text-[1.2rem] leading-[130%]  flex items-center gap-2"
                >
                    <div>
                        <WarrningLeftIcon width={20} height={20} />
                    </div>
                    <span className="text-[var(--text-main)]">
                        Комиссия — <b>{data.fee}</b>
                    </span>
                    <div className="text-[var(--yellow)] ml-auto bg-[var(--yellow-secondary)]  rounded-[1rem] w-[2.5rem] h-[2.5rem] center ">
                        <RightIcon width={16} height={16} />
                    </div>
                </div>
            </div>
            <Button
                className="w-full mt-auto mb-[1rem]"
                variant="yellow"
                onClick={() => {
                    trackEvent('refill_address_copied', {
                        crypto,
                        network,
                        address: data.address,
                    });
                    copyWithToast(data.address, 'Адрес скопирован');
                }}
                disabled={isCopying}
            >
                {isCopying ? 'Копирование...' : 'Копировать адрес'}
            </Button>
            <Button
                className="w-full"
                variant="ghost"
                onClick={() => {
                    trackEvent('refill_home_clicked', { crypto, network });
                    router.push('/');
                }}
            >
                Вернуться на главную
            </Button>
            <TaxModal
                showModal={showTaxModal}
                onClose={() => {
                    trackEvent('refill_tax_modal_closed', { crypto, network });
                    setShowTaxModal(false);
                }}
            />
            <MinAmountModal
                showModal={showMinAmountModal}
                onClose={() => {
                    trackEvent('refill_min_amount_modal_closed', { crypto, network });
                    setShowMinAmountModal(false);
                }}
            />
        </div>
    );
}
