'use client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import ArrowLeft from '@/components/icons/arrow-left.svg';
import WarrningLeftIcon from '@/components/icons/warrning-mark.svg';
import RightIcon from '@/components/icons/right-arrow.svg';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import TaxModal from '@/components/modals/TaxModal';
import { Toast } from '@/components/ui/Toast';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getLoading, getWallet } from '@/lib/redux/selectors/userSelectors';
import Loader from '@/components/ui/Loader';
import MinAmountModal from '@/components/modals/MinAmountModal';
import { fetchUser } from '@/lib/redux/thunks/UserThunks';

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
    const [showMinAmountModal, setShowMinAmountModal] = useState(false);
    const [showTaxModal, setShowTaxModal] = useState(false);

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

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

    const handleCopy = (text: string, msg: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setToastMsg(msg);
                setToastOpen(true);
            });
        } else {
            // Fallback для Safari/WebView
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand('copy');
                setToastMsg(msg);
                setToastOpen(true);
            } catch (err) {
                setToastMsg('Не удалось скопировать');
                setToastOpen(true);
            }
            document.body.removeChild(textarea);
        }
    };

    if (loadingApp || !wallet?.address) {
        return <Loader className="h-[100dvh]" />;
    }

    if (!data) return <div className="p-8">Данные не найдены</div>;

    return (
        <div className=" bg-[var(--bg-optional)] flex flex-col items-center p-[1.6rem] min-h-[100dvh] ">
            <Toast open={toastOpen} onClose={() => setToastOpen(false)} message={toastMsg} />
            <div className="flex h-[3.6rem] items-center justify-center relative text-[1.8rem] leading-[130%] mb-[3rem] font-semibold w-full">
                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] center ml-auto text-[var(--text-secondary)]"
                    onClick={() => router.back()}
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
                <div className="text-[1.2rem] leading-[130%] text-[var(--gray)] text-center mb-[1rem]">
                    Адрес принимает только <b>USDT в сети TRC20</b>. Отправка через другие сети{' '}
                    <b>приведёт к потере средств!</b>
                </div>
                <div
                    onClick={() => setShowMinAmountModal(true)}
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
                    onClick={() => setShowTaxModal(true)}
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
                onClick={() => handleCopy(data.address, 'Адрес скопирован')}
            >
                Копировать адрес
            </Button>
            <Button className="w-full" variant="ghost" onClick={() => router.push('/')}>
                Вернуться на главную
            </Button>
            <TaxModal showModal={showTaxModal} onClose={() => setShowTaxModal(false)} />
            <MinAmountModal showModal={showMinAmountModal} onClose={() => setShowMinAmountModal(false)} />
        </div>
    );
}
