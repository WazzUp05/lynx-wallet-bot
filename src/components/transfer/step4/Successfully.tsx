import Success from "@/components/icons/success.svg";
import { Button } from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import { useRouter } from "next/navigation";
import Details from "./Details";
import { useState } from "react";
import { resetTransfer } from "@/lib/redux/slices/transferSlice";
import { useAppDispatch } from "@/lib/redux/hooks";

interface SuccessfullyProps {
    crypto: string;
    amount: string;
    transactionId: string;
    date: string;
}

const Succsessfully: React.FC<SuccessfullyProps> = ({ crypto, amount, transactionId, date }) => {
    const router = useRouter();
    const slisedTransactionId = transactionId.slice(0, 9) + "...";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useAppDispatch();

    return (
        <div className="transfer-success-bg ">
            <div className="z-10 flex flex-col gap-[2rem] items-center p-[2rem] min-h-[100dvh]">
                <p className="fs-regular-bold">Перевод принят в работу</p>
                <div className="flex flex-col justify-center items-center gap-[2rem] grow">
                    <div className="w-[4rem] h-[4rem] rounded-full bg-[var(--green)] relative center">
                        <span className="animate-pulse success-pulse-color-slow animate-pulse-slow "></span>

                        <span className="animate-pulse success-pulse-color-slower animate-pulse-slower "></span>
                        <Success
                            alt="success icon"
                            width={40}
                            height={40}
                            className="w-[3rem] h-[3rem] rounded-full z-10"
                        />
                    </div>
                    <p className="fs-regular-bold text-[var(--text-main)]">{`${amount} ${crypto}`}</p>
                </div>
                <div className="w-full bg-[var(--bg-secondary)] rounded-[1rem] p-[1.6rem] flex justify-between items-center">
                    <p className="text-[var(--text-secondary)] fs-small">ID транзакции</p>
                    <div className="flex gap-[0.8rem]">
                        <p className="fs-regular text-[var(--text-main)]">{slisedTransactionId}</p>
                        <CopyButton text={transactionId} />
                    </div>
                </div>
                <div className="flex flex-col gap-[1.5rem] w-full">
                    <Button
                        variant="yellow"
                        fullWidth={true}
                        onClick={() => {
                            router.push("/");
                            dispatch(resetTransfer());
                        }}
                    >
                        На главную
                    </Button>
                    <Button
                        variant="yellow_secondary"
                        fullWidth={true}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Детали транзакции
                    </Button>
                </div>
            </div>
            <Details
                isOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                amount={amount}
                crypto={crypto}
                isSuccess={true}
                date={date}
                transactionId={transactionId}
            />
        </div>
    );
};

export default Succsessfully;
