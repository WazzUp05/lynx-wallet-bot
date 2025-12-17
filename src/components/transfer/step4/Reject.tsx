import RejectIcon from "@/components/icons/reject.svg";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import ArrowRight from "@/components/icons/arrow-right.svg";
import Exclamation from "@/components/icons/exclamation-yellow.svg";
import { useAppDispatch } from "@/lib/redux/hooks";
import { resetTransfer } from "@/lib/redux/slices/transferSlice";
import { useMixpanel } from "@/lib/providers/MixpanelProvider";
import { useEffect } from "react";

interface RejectProps {
    amount: string;
    crypto: string;
    setStep: (step: number) => void;
    setIsOpenedDetails: (isOpen: boolean) => void;
}

const Reject: React.FC<RejectProps> = ({ crypto, amount, setStep, setIsOpenedDetails }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { trackEvent } = useMixpanel();

    useEffect(() => {
        trackEvent("transfer_step4_reject_opened");
    }, [trackEvent]);

    return (
        <div className="transfer-reject-bg">
            <div className="z-10 flex flex-col gap-[2rem] items-center p-[2rem] min-h-[100dvh]">
                <p className="fs-regular-bold">Перевод</p>
                <div className="flex flex-col justify-center items-center gap-[2rem] grow">
                    <div className="w-[4rem] h-[4rem] rounded-full bg-[var(--orange)] relative center">
                        <span className="animate-pulse reject-pulse-color-slow animate-pulse-slow "></span>
                        <span className="animate-pulse reject-pulse-color-slower animate-pulse-slower "></span>
                        <RejectIcon
                            alt="reject icon"
                            width={40}
                            height={40}
                            className="w-[2rem] h-[2rem] rounded-full z-10"
                        />
                    </div>
                    <p className="fs-bold text-[var(--text-main)] text-center">
                        Не удалось выполнить перевод
                    </p>
                </div>
                <div className="w-full bg-[var(--bg-secondary)] rounded-[1rem] p-[1.6rem] flex flex-col gap-[1.5rem]">
                    <div className="flex justify-between items-center">
                        <p className="text-[var(--text-secondary)] fs-small">Сумма</p>

                        <p className="fs-regular text-[var(--text-main)]">
                            {amount} {crypto}
                        </p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-[var(--text-secondary)] fs-small">Детали транзакции</p>
                        <button
                            type="button"
                            className="w-[3rem] h-[3rem] rounded-full bg-[var(--dark-gray-main)] center"
                            onClick={() => {
                                setIsOpenedDetails(true);
                                trackEvent("transfer_step4_reject_details_clicked");
                            }}
                        >
                            <ArrowRight
                                width={20}
                                height={20}
                                className="w-[1.5rem] h-[1.5rem] rounded-full"
                            />
                        </button>
                    </div>
                </div>
                <div className="flex py-[1rem] gap-[0.8rem] items-start bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem]">
                    <Exclamation
                        alt="exclamation mark icon"
                        width={20}
                        height={20}
                        className="w-[2.5rem] h-[2.5rem] rounded-full"
                    />
                    <p className="fs-very-small p-[0.7rem] text-[var(--yellow)]">
                        Перевод отклонён системой безопасности. Попробуйте позже или обратитесь в
                        поддержку.
                    </p>
                </div>
                <div className="flex flex-col gap-[1.5rem] w-full">
                    <Button
                        variant="yellow"
                        fullWidth={true}
                        onClick={() => {
                            setStep(1);
                            trackEvent("transfer_step4_reject_retry_transfer_clicked");
                        }}
                    >
                        Повторить перевод
                    </Button>
                    <Button
                        variant="yellow_secondary"
                        fullWidth={true}
                        onClick={() => {
                            dispatch(resetTransfer());
                            trackEvent("transfer_step4_reject_go_home_clicked");
                            router.push("/");
                        }}
                    >
                        На главную
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Reject;
