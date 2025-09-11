import React from "react";
import Modal from "../Modal";
import ProcentIcon from "@/components/icons/procent.svg";
import GuadrdIcon from "@/components/icons/guard.svg";

interface TaxModalProps {
    showModal: boolean;
    onClose: () => void;
}

const TaxModal = ({ showModal, onClose }: TaxModalProps) => {
    return (
        <Modal open={showModal} onClose={onClose}>
            <div>
                <p className="mb-[1rem] text-white w-fit m-auto text-[1.6rem] leading-[130%] font-semibold py-[0.4rem] px-[0.8rem] rounded-[0.7rem] bg-[var(--blue)]">
                    2.5 + 0.25 =
                </p>
                <h2 className="text-[2.5rem] leading-[130%] text-center font-semibold mb-[3rem]">
                    Удобство + Безопасность
                </h2>
                <div className="mb-[3rem]">
                    <p className="flex items-center gap-[1rem] mb-[1.5rem] text-[1.4rem] leading-[130%] font-semibold">
                        <ProcentIcon /> Удобство
                    </p>
                    <p className="text-[1.4rem] leading-[130%] font-semibold mb-[1rem]">
                        Почему мы берём комиссию 2.5$?
                    </p>
                    <p>
                        Сеть Tron взимает комиссию за перевод USDT (14 TRX ≈ 2.5$). Вам не нужно пополнять баланс TRX —
                        мы сами оплачиваем эту комиссию, делая использование кошелька простым и удобным.
                    </p>
                </div>
                <div className="mb-[3rem]">
                    <p className="flex items-center gap-[1rem] mb-[1.5rem] text-[1.4rem] leading-[130%] font-semibold">
                        <GuadrdIcon /> Безопасность
                    </p>
                    <p className="text-[1.4rem] leading-[130%] font-semibold mb-[1rem]">Зачем дополнительно 0.25$?</p>
                    <p>Эти средства покрывают себестоимость AML-проверки, которая гарантирует безопасность.</p>
                </div>
                <p className="text-[1.2rem] leading-[130%] text-[var(--gray)]">
                    Lynx Wallet получает 0% прибыли за этот перевод (в последующих релизах запланировано снижение
                    комиссии для наших пользователей за счёт оптимизации работы с Tron).
                </p>
            </div>
        </Modal>
    );
};

export default TaxModal;
