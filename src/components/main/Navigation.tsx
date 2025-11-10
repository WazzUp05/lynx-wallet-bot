import React, { useEffect } from 'react';
import PlusIcon from '@/components/icons/plus.svg';
import P2PIcon from '@/components/icons/p2p.svg';
import QrIcon from '@/components/icons/qr.svg';
import LinkIcon from '@/components/icons/link.svg';
import Link from 'next/link';
import { useAppSelector } from '@/lib/redux/hooks';
import {
  getNeedDeposit,
  getShouldDisableButtons,
  getWaitingForDeposit,
} from '@/lib/redux/selectors/appSelectors';

interface NavigationProps {
  onTopUp?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onTopUp }) => {
  const shouldDisableButtons = useAppSelector(getShouldDisableButtons);
  const waitingDeposit = useAppSelector(getWaitingForDeposit);
  const needDeposit = useAppSelector(getNeedDeposit);

  return (
    <div className="flex px-[1.6rem] gap-[1.7rem] items-center justify-between mb-[2.4rem]">
      <button className={`w-[7.3rem] text-[var(--text-main)]`} onClick={onTopUp}>
        <div
          className={`bg-[#2A2E3633] glass glass-btn ${
            !waitingDeposit && needDeposit
              ? 'gradient text-[var(--bg-secondary)]'
              : 'text-[var(--yellow)]'
          } w-full h-[5.5rem] rounded-[2rem] center mb-[0.5rem]`}
        >
          <PlusIcon width={30} height={30} className="w-[3rem] h-[3rem]" />
        </div>
        <p className={`text-[1.1rem] leading-[130%] font-medium text-[var(--text-main)]`}>
          Пополнить <br /> кошелёк
        </p>
      </button>
      <button className="w-[7.3rem] text-[var(--text-main)] pointer-events-none  relative">
        <p className="absolute right-0 top-0  z-10 rounded-[2rem] translate-y-[-50%] text-[1rem] font-medium leading-[130%] bg-[var(--bg-secondary)] py-[0.2rem] text-[var(--text-optional)] px-[0.7rem] ">
          Скоро
        </p>
        <div className="bg-[#252525] glass glass-btn text-[var(--dark-gray-secondary)]  w-full  h-[5.5rem] rounded-[2rem] center mb-[0.5rem]">
          <P2PIcon width={30} height={30} className="w-[3rem] h-[3rem]" />
        </div>
        <p className="text-[1.1rem] text-[var(--text-optional)] leading-[130%] font-medium">
          Продать <br /> P2P
        </p>
      </button>
      <Link
        href="/qr"
        className={`w-[7.3rem] text-[var(--text-main)] text-center relative ${
          shouldDisableButtons ? 'pointer-events-none ' : ''
        }`}
      >
        <div
          className={`bg-[#2A2E3633] glass glass-btn ${
            shouldDisableButtons ? 'text-[var(--dark-gray-secondary)]' : 'text-[var(--yellow)]'
          } w-full  h-[5.5rem] rounded-[2rem] center  mb-[0.5rem]`}
        >
          <QrIcon width={30} height={30} className="w-[3rem] h-[3rem]" />
        </div>
        <p
          className={`text-[1.1rem] leading-[130%] font-medium ${
            shouldDisableButtons ? 'text-[var(--text-optional)]' : ''
          }`}
        >
          Сканировать <br /> QR-код
        </p>
      </Link>

      <Link
        href="/link"
        className={`w-[7.3rem] text-[var(--text-main)] text-center ${
          shouldDisableButtons ? 'pointer-events-none ' : ''
        }`}
      >
        <div
          className={`bg-[#2A2E3633] glass glass-btn ${
            shouldDisableButtons ? 'text-[var(--dark-gray-secondary)]' : 'text-[var(--yellow)]'
          } w-full  h-[5.5rem] rounded-[2rem] center mb-[0.5rem]`}
        >
          <LinkIcon width={30} height={30} className="w-[3rem] h-[3rem]" />
        </div>
        <p
          className={`text-[1.1rem] leading-[130%] font-medium ${
            shouldDisableButtons ? 'text-[var(--text-optional)]' : ''
          }`}
        >
          Оплатить <br /> по ссылке
        </p>
      </Link>
    </div>
  );
};

export default Navigation;
