import React from 'react';
import InfoIcon from '@/components/icons/Info.svg';
import EyeIcon from '@/components/icons/eye.svg';
import EyeHiddenIcon from '@/components/icons/eye-hidden.svg';
import RefreshIcon from '@/components/icons/refresh.svg';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getHideBalance } from '@/lib/redux/selectors/appSelectors';
import { setHideBalance } from '@/lib/redux/slices/appSlice';

interface HeaderProps {
    name?: string;
}

const Header = ({ name }: HeaderProps) => {
    const dispatch = useAppDispatch();
    const hideBalance = useAppSelector(getHideBalance);

    const onToggleBalance = () => {
        dispatch(setHideBalance(!hideBalance));
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="w-full h-[3.5rem] flex items-center justify-between  mb-[3.2rem] relative">
            <div className="flex items-center gap-[1rem]">
                {name && <p className="text-[1.6rem] fs-small text-[var(--text-secondary)]">{name}</p>}
            </div>
            <div className="center-v gap-[1.6rem]">
                <button
                    onClick={onToggleBalance}
                    className=" cursor-pointer center w-[3.5rem] h-[3.5rem] rounded-[1rem] bg-[var(--bg-main)]  "
                >
                    {!hideBalance ? <EyeIcon width={15} height={15} /> : <EyeHiddenIcon width={15} height={15} />}
                </button>
                <button
                    onClick={handleRefresh}
                    className="center cursor-pointer w-[3.5rem] h-[3.5rem] rounded-[1rem] bg-[var(--bg-main)]"
                >
                    <RefreshIcon width={15} height={15} />
                </button>
            </div>
        </div>
    );
};

export default Header;
