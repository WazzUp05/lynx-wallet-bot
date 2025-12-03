"use client";
import ArrowLeft from "@/components/icons/arrow-left.svg";
import Step1SelectCurrency from "@/components/transfer/Step1SelectCurrency";
import Step2EnterData from "@/components/transfer/Step2EnterData";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getWallet } from "@/lib/redux/selectors/userSelectors";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getCrypto, getNetworkType } from "@/lib/redux/selectors/walletSelectors";
import { NetworkType, setNetwork } from "@/lib/redux/slices/walletSlice";
import Step3Confirm from "@/components/transfer/Step3Confirm";

const Page = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const wallet = useAppSelector(getWallet);

    const balance_usdt = useCallback(() => wallet?.balance_usdt, [wallet])();
    const crypto = useAppSelector(getCrypto);
    const defaultNetwork = useAppSelector(getNetworkType);
    const [selectedNetwork, setSelectedNetwork] = useState<string>(defaultNetwork);
    const [selectedCrypto, setSelectedCrypto] = useState<string>(crypto?.id || "USDT");
    const dispatch = useAppDispatch();

    const MOCK_SELECT_CRYPTO = [
        {
            id: "USDT",
            label: "USDT",
            description: balance_usdt ? `${balance_usdt} USDT` : "0.00 USDT",
            iconUrl: "/icons/usdt.svg",
        },
        // {
        //     id: 'TON',
        //     label: 'TON',
        //     description: 'Комиссия 2.75 USDT',
        //     iconUrl: '/icons/ton.svg',
        // },
    ];

    const MOCK_SELECT_USDT = [
        {
            id: "TRC20",
            label: "TRC20",
            description: "Комиссия 2.75 USDT",
            iconUrl: "/icons/trc20.svg",
        },
    ];

    const MOCK_SELECT_TON = [
        {
            id: "TON",
            label: "TON",
            description: "Комиссия 0.2 TON",
            iconUrl: "/icons/ton.svg",
        },
    ];

    const network = crypto.id === "USDT" ? MOCK_SELECT_USDT : MOCK_SELECT_TON;

    const handlerChangeNetwork = (network: string) => {
        setSelectedNetwork(network);
        dispatch(setNetwork(network as NetworkType));
        // trackEvent('refill_network_selected', {
        //     network,
        //     crypto: crypto?.id || 'USDT',
        // });
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    return (
        <div className="p-[1.6rem] h-[100dvh] flex flex-col">
            <div className="flex h-[3.6rem] items-center justify-center relative text-[1.8rem] leading-[130%] mb-[4rem] font-semibold">
                <div
                    className="absolute left-[0] top-1/2 translate-y-[-50%] bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] center ml-auto text-[var(--text-secondary)]"
                    onClick={() => {
                        if (step === 1) router.back();
                        if (step > 1) setStep(step - 1);
                    }}
                >
                    <ArrowLeft />
                </div>
                <span className="text-white">Перевести</span>
            </div>

            {step === 1 && (
                <Step1SelectCurrency
                    cryptos={MOCK_SELECT_CRYPTO}
                    network={network}
                    selectedNetwork={selectedNetwork}
                    handlerChangeNetwork={handlerChangeNetwork}
                    setSelectedCrypto={setSelectedCrypto}
                    handleNextStep={handleNextStep}
                />
            )}

            {step === 2 && (
                <Step2EnterData
                    selectedNetwork={selectedNetwork}
                    selectedCrypto={selectedCrypto}
                    handleNextStep={handleNextStep}
                    cryptos={MOCK_SELECT_CRYPTO}
                    balance_usdt={balance_usdt}
                />
            )}

            {step === 3 && (
                <Step3Confirm
                    cryptos={MOCK_SELECT_CRYPTO}
                    selectedCrypto={selectedCrypto}
                    selectedNetwork={selectedNetwork}
                    handleNextStep={handleNextStep}
                />
            )}
        </div>
    );
};

export default Page;
