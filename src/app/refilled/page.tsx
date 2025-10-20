'use client';
import React, { useCallback, useState } from 'react';
import ArrowLeft from '@/components/icons/arrow-left.svg';
import { SelectCustom } from '@/components/ui/SelectCustom';
import SelectCrypto from '@/components/SelectCrypto';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getCrypto, getNetworkType } from '@/lib/redux/selectors/walletSelectors';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { NetworkType, setNetwork } from '@/lib/redux/slices/walletSlice';
import { useRouter } from 'next/navigation';
import { getLoading, getWallet } from '@/lib/redux/selectors/userSelectors';
import Loader from '@/components/ui/Loader';

const MOCK_SELECT_USDT = [
    {
        id: 'TRC20',
        label: 'TRC20',
        description: 'Комиссия 2.75 USDT',
        iconUrl: '/icons/trc20.svg',
    },
    // {
    //     id: "TON",
    //     label: "TON",
    //     description: "Комиссия 2.75 USDT",
    //     iconUrl: "/icons/ton.svg",
    // },
];

const MOCK_SELECT_TON = [
    {
        id: 'TON',
        label: 'TON',
        description: 'Комиссия 0.2 TON',
        iconUrl: '/icons/ton.svg',
    },
];

const Page = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const defaultNetwork = useAppSelector(getNetworkType);
    const [selectedNetwork, setSelectedNetwork] = useState<string>(defaultNetwork);
    const crypto = useAppSelector(getCrypto);
    const wallet = useAppSelector(getWallet);
    const loadingApp = useAppSelector(getLoading);
    const balance_usdt = useCallback(() => wallet?.balance_usdt, [wallet])();

    const MOCK_SELECT_CRYPTO = [
        {
            id: 'USDT',
            label: 'USDT',
            description: balance_usdt ? `${balance_usdt} USDT` : '0.00 USDT',
            iconUrl: '/icons/usdt.svg',
        },
    ];

    const handlerChangeNetwork = (network: string) => {
        setSelectedNetwork(network);
        dispatch(setNetwork(network as NetworkType));
    };

    const network = crypto.id === 'USDT' ? MOCK_SELECT_USDT : MOCK_SELECT_TON;

    // Функция перехода на страницу с QR-кодом
    const handleContinue = () => {
        if (crypto?.id && selectedNetwork) {
            router.push(`/refilled/${crypto.id}/${selectedNetwork}`);
        }
    };

    if (loadingApp) {
        return <Loader className="h-[100dvh]" />;
    }

    return (
        <div className="p-[1.6rem] flex flex-col min-h-[100dvh]">
            <div className="flex h-[3.6rem] items-center justify-center relative text-[1.8rem] leading-[130%] mb-[4rem] font-semibold">
                <div
                    className="absolute left-[0] top-1/2 translate-y-[-50%] bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] flex items-center justify-center ml-auto text-[var(--text-secondary)]"
                    onClick={() => router.back()}
                >
                    <ArrowLeft />
                </div>
                <span className="text-white">Пополнить</span>
            </div>
            <div className="mb-[3rem]">
                <p className="text-[1.4rem] leading-[130%] font-medium mb-[1rem] text-[var(--text-secondary)]">
                    Криптовалюта
                </p>
                <SelectCrypto cryptos={MOCK_SELECT_CRYPTO} />
            </div>
            <div className="mb-[3rem]">
                <p className="text-[1.4rem] leading-[130%] font-medium mb-[1rem] text-[var(--text-secondary)]">Сеть</p>
                <SelectCustom
                    options={network}
                    value={selectedNetwork}
                    onChange={handlerChangeNetwork}
                    className="mb-[3rem]"
                />
            </div>
            {/* <div className="mb-[3rem]">
                <p className="text-[1.4rem] leading-[130%] font-medium mb-[1rem] text-[#08091C]">Скоро</p>
                <div
                    className={`flex items-center mb-[1rem] w-full gap-[1rem] py-[1rem] px-[1.6rem] rounded-[1.5rem] box-shadow transition
                        bg-white
                        hover:border-blue-400`}
                >
                    <Image
                        src="/icons/ber-20-gray.svg"
                        alt="BER-20 "
                        width={40}
                        height={40}
                        className="w-[4rem] h-[4rem] rounded-full "
                    />

                    <div className="flex-1 text-left">
                        <div className="font-semibold text-black text-[1.5rem] leading-[130%]">BER-20</div>
                    </div>
                </div>
                <div
                    className={`flex items-center w-full gap-[1rem] py-[1rem] px-[1.6rem] rounded-[1.5rem] box-shadow transition
                        bg-white
                        hover:border-blue-400`}
                >
                    <Image
                        src="/icons/ton-gray.svg"
                        alt="ton "
                        width={40}
                        height={40}
                        className="w-[4rem] h-[4rem] rounded-full filter grayscale "
                    />

                    <div className="flex-1 text-left">
                        <div className="font-semibold text-black text-[1.5rem] leading-[130%]">TON</div>
                    </div>
                </div>
            </div> */}
            <Button variant="yellow" className="mt-auto w-full" onClick={handleContinue}>
                Продолжить
            </Button>
        </div>
    );
};

export default Page;
