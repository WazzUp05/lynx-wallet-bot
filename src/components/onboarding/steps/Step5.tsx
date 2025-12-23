'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getWallet } from '@/lib/redux/selectors/userSelectors';
import { Button } from '@/components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';
import { useCopyWithToast } from '@/hooks/useCopyWithToast';
import { Toast } from '@/components/ui/Toast';
import WarrningLeftIcon from '@/components/icons/warrning-mark.svg';
import RightIcon from '@/components/icons/right-arrow.svg';
import MinAmountModal from '@/components/modals/MinAmountModal';
import TaxModal from '@/components/modals/TaxModal';
import { setOnboardingCompleted, setWaitingForDeposit, setNeedDeposit } from '@/lib/redux/slices/appSlice';
import { useMixpanel } from '@/lib/providers/MixpanelProvider';

interface Step5Props {
    onNext: () => void;
}

const Step5: React.FC<Step5Props> = ({ onNext }) => {
    const dispatch = useAppDispatch();
    const { copyWithToast, isCopying, toastOpen, toastMessage, closeToast } = useCopyWithToast();
    const wallet = useAppSelector(getWallet);
    const srcQr = '/icons/USDT-TRC20.svg';
    const address = wallet?.address || '';
    const [showTaxModal, setShowTaxModal] = useState(false);
    const [showMinAmountModal, setShowMinAmountModal] = useState(false);
    const { trackEvent } = useMixpanel();

    React.useEffect(() => {
        trackEvent('wallet_deposit_screen_opened');
    }, []);

    const handleIDeposited = () => {
        // Переходим в состояние ожидания пополнения
        // dispatch(setOnboardingCompleted(true));
        dispatch(setWaitingForDeposit(true));
        dispatch(setNeedDeposit(true));
        onNext();
    };

    const handleLater = () => {
        // Устанавливаем необходимость пополнения
        dispatch(setOnboardingCompleted(true));
        dispatch(setNeedDeposit(true));
    };

    return (
        <div className="flex flex-1 flex-col p-[1.6rem] pb-[calc(var(--safe-bottom)+1.6rem)]  bg-[var(--bg-optional)] ">
            <Toast open={toastOpen} onClose={closeToast} message={toastMessage} />
            <h2 className="text-[2.2rem] text-[var(--text-main)] font-bold leading-[130%] mb-[0.8rem]">
                Пополните кошелёк
                <br />
                через QR или ссылку
            </h2>
            <p className="text-[1.5rem] leading-[130%] text-[var(--text-secondary)] mb-[2.4rem]">
                Отсканируйте QR или скопируйте адрес, чтобы перевести USDT с другого кошелька.
            </p>
            <div className="flex gap-[1rem] mb-[1.6rem]">
                <QRCodeSVG
                    value={address}
                    size={110}
                    bgColor="#EBECEF"
                    fgColor="#121214"
                    className="flex-shrink-0 w-[11rem] h-[11rem]"
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

                <div>
                    <p className="text-[1.2rem] leading-[130%]  mb-[0.4rem] text-[var(--text-secondary)]">
                        Ваш адрес USDT в сети TRC20
                    </p>
                    <p className="text-[1.4rem] leading-[130%] font-semibold break-all mb-[1.2rem] text-[var(--text-main)]">
                        {address}
                    </p>
                    <button
                        className="border border-[var(--text-main)] rounded-[1.5rem] px-[2.2rem] py-[1.2rem] text-[1.4rem] leading-[130%] text-[var(--text-main)]"
                        onClick={() => {
                            trackEvent('wallet_deposit_address_copied');
                            copyWithToast(address, 'Адрес скопирован');
                        }}
                        disabled={isCopying}
                    >
                        Скопировать адрес
                    </button>
                </div>
            </div>

            <div className="mb-[1.6rem] bg-[var(--yellow-optional)] rounded-[2rem] px-[1.6rem]">
                <div className="w-full py-[1.4rem] border-b border-[#363636] flex i gap-[0.5rem]   text-[1.2rem] leading-[130%] ">
                    <div className="text-[var(--yellow)]">
                        <WarrningLeftIcon width={20} height={20} />
                    </div>
                    <span className="text-[var(--text-main)]">
                        Адрес принимает только USDT (сеть TRC20). Отправка через другие сети приведёт к потере средств.
                    </span>
                </div>
                <div
                    onClick={() => setShowMinAmountModal(true)}
                    className="w-full flex items-center gap-[0.5rem] py-[1.4rem] border-b  border-[#363636]  text-[1.2rem] leading-[130%] "
                >
                    <div className="text-[var(--yellow)]">
                        <WarrningLeftIcon width={20} height={20} />
                    </div>
                    <span className="text-[var(--text-main)]">
                        Минимальная сумма перевода — <b>5 USDT</b>
                    </span>

                    <div className="text-[var(--yellow)] ml-auto bg-[var(--yellow-secondary)] rounded-[1rem] min-w-[2.5rem] h-[2.5rem] center ">
                        <RightIcon width={16} height={16} />
                    </div>
                </div>
                <div
                    // onClick={() => setShowTaxModal(true)}
                    className="w-full flex items-center gap-[0.5rem] py-[1.4rem]   text-[1.2rem] leading-[130%] "
                >
                    <div className="text-[var(--yellow)]">
                        <WarrningLeftIcon width={20} height={20} />
                    </div>
                    <span className="text-[var(--text-main)]">
                        Комиссия — <b>0 USDT</b>
                    </span>

                    {/* <div className="text-[var(--yellow)] ml-auto bg-[var(--yellow-secondary)] rounded-[1rem] min-w-[2.5rem] h-[2.5rem] center ">
                        <RightIcon width={16} height={16} />
                    </div> */}
                </div>
            </div>
            <TaxModal showModal={showTaxModal} onClose={() => setShowTaxModal(false)} />
            <MinAmountModal showModal={showMinAmountModal} onClose={() => setShowMinAmountModal(false)} />
            <Button
                variant="yellow"
                className="w-full mt-auto mb-[1.2rem]"
                onClick={() => {
                    trackEvent('wallet_deposit_confirmed');
                    handleIDeposited();
                }}
            >
                Я пополнил
            </Button>
            <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                    trackEvent('wallet_deposit_later');
                    handleLater();
                }}
            >
                Сделаю позже
            </Button>
        </div>
    );
};

export default Step5;
