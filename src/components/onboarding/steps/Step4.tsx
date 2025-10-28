'use client';

import React, { useCallback } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { getWallet } from '@/lib/redux/selectors/userSelectors';
import SelectCrypto from '@/components/SelectCrypto';
import { SelectCustom } from '@/components/ui/SelectCustom';
import WarrningBlock from '@/components/WarrningBlock';
import { Button } from '@/components/ui/Button';

interface Step4Props {
    onNext: () => void;
}

const Step4: React.FC<Step4Props> = ({ onNext }) => {
    const wallet = useAppSelector(getWallet);
    const balance_usdt = useCallback(() => wallet?.balance_usdt, [wallet])();

    const MOCK_SELECT_CRYPTO = [
        {
            id: 'USDT',
            label: 'USDT',
            description: balance_usdt ? `${balance_usdt} USDT` : '0.00 USDT',
            iconUrl: '/icons/usdt.svg',
        },
    ];
    const network = [
        {
            id: 'TRC20',
            label: 'TRC20',
            description: 'Комиссия 2.75 USDT',
            iconUrl: '/icons/trc20.svg',
        },
    ];

    return (
        <div className="flex flex-1 flex-col p-[1.6rem] bg-[var(--bg-optional)] ">
            <h2 className="text-[2.2rem] text-[var(--text-main)] font-bold leading-[130%] mb-[0.8rem]">
                Пополнение кошелька
            </h2>
            <p className="text-[1.5rem] leading-[130%] text-[var(--text-secondary)] mb-[2.4rem]">
                {' '}
                Адрес для перевода появится на следующем экране.
            </p>
            <div className="mb-[3rem]">
                <p className="text-[1.4rem] leading-[130%] font-medium mb-[1rem] text-[var(--text-secondary)]">
                    Криптовалюта
                </p>
                <SelectCrypto cryptos={MOCK_SELECT_CRYPTO} />
            </div>
            <div className="mb-[1.2rem]">
                <p className="text-[1.4rem] leading-[130%] font-medium mb-[1rem] text-[var(--text-secondary)]">Сеть</p>
                <SelectCustom options={network} value={'TRC20'} onChange={() => {}} />
            </div>
            <WarrningBlock
                className="mb-[1.6rem]"
                text="Сейчас кошелёк поддерживает только USDT, другие валюты появятся позже."
            />
            <Button variant="yellow" className="w-full mt-auto " onClick={onNext}>
                Продолжить
            </Button>
        </div>
    );
};

export default Step4;
