"use client";
import ArrowLeft from "@/components/icons/arrow-left.svg";
import Step1SelectCurrency from "@/components/transfer/Step1SelectCurrency";
import Step2EnterData from "@/components/transfer/Step2EnterData";
import Step3Confirm from "@/components/transfer/Step3Confirm";
import Step4Result from "@/components/transfer/Step4Result";
import Loader from "@/components/ui/Loader";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getLoading, getWallet } from "@/lib/redux/selectors/userSelectors";
import { useRouter } from "next/navigation";
import { getCrypto, getNetworkType } from "@/lib/redux/selectors/walletSelectors";
import { NetworkType, setNetwork } from "@/lib/redux/slices/walletSlice";
import { useMixpanel } from "@/lib/providers/MixpanelProvider";

const Page = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const wallet = useAppSelector(getWallet);
    const { trackEvent } = useMixpanel();

    const balance_usdt = wallet?.balance_usdt;
    const crypto = useAppSelector(getCrypto);
    const defaultNetwork = useAppSelector(getNetworkType);
    const [selectedNetwork, setSelectedNetwork] = useState<string>(defaultNetwork || "TRC20");
    const [selectedCrypto, setSelectedCrypto] = useState<string>(crypto?.id || "USDT");
    const dispatch = useAppDispatch();
    const loadingApp = useAppSelector(getLoading);

    useEffect(() => {
        trackEvent("transfer_page_opened", {});
    }, [trackEvent]);

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

    const MOCK_COMMISSION_USDT = 2.75;

    const network = crypto?.id === "USDT" ? MOCK_SELECT_USDT : MOCK_SELECT_TON;

    const handlerChangeNetwork = (network: string) => {
        setSelectedNetwork(network);
        dispatch(setNetwork(network as NetworkType));
        trackEvent("transfer_network_selected", {
            network,
            crypto: crypto?.id || "USDT",
        });
        if (network === "TON" && selectedCrypto !== "TON") {
            setSelectedCrypto("TON");
        }
        if (network === "TRC20" && selectedCrypto !== "USDT") {
            setSelectedCrypto("USDT");
        }
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    if (loadingApp) {
        return <Loader className="h-[100dvh]" />;
    }

    return (
        <div className="h-[100dvh] flex flex-col">
            {step < 4 && (
                <div className="m-[1.6rem] flex h-[3.6rem] items-center justify-center relative fs-regular-bold mb-[4rem]">
                    <div
                        className="absolute left-[0] top-1/2 translate-y-[-50%] bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] center ml-auto text-[var(--text-secondary)]"
                        onClick={() => {
                            if (step === 1) {
                                trackEvent("transfer_page_closed");
                                router.back();
                            }
                            if (step > 1) setStep(step - 1);
                        }}
                    >
                        <ArrowLeft />
                    </div>
                    <span className="text-white">Перевести</span>
                </div>
            )}

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
                    commissionUsdt={MOCK_COMMISSION_USDT}
                />
            )}

            {step === 3 && (
                <Step3Confirm
                    cryptos={MOCK_SELECT_CRYPTO}
                    selectedCrypto={selectedCrypto}
                    selectedNetwork={selectedNetwork}
                    handleNextStep={handleNextStep}
                    commissionUsdt={MOCK_COMMISSION_USDT}
                />
            )}

            {step === 4 && <Step4Result setStep={setStep} commissionUsdt={MOCK_COMMISSION_USDT} />}
        </div>
    );
};

export default Page;
