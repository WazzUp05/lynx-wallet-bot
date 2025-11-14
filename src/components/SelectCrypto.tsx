import Image from 'next/image';
import Modal from './Modal';
import { useState } from 'react';
import { SelectCustom } from './ui/SelectCustom';
import { CryptoItem, setCrypto } from '@/lib/redux/slices/walletSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getCrypto } from '@/lib/redux/selectors/walletSelectors';

interface TypeCryptoProps {
    cryptos: {
        id: string;
        label: string;
        description: string;
        iconUrl: string;
    }[];
}

const SelectCrypto = ({ cryptos }: TypeCryptoProps) => {
    const dispatch = useAppDispatch();
    const crypto = useAppSelector(getCrypto);
    const [modalOpen, setModalOpen] = useState(false);
    const selectedId = crypto?.id || cryptos[0].id; // по умолчанию первая

    const closeModal = () => setModalOpen(false);

    const handleSelect = (id: string) => {
        const found = cryptos.find((opt) => opt.id === id);
        if (found) {
            dispatch(setCrypto(found as CryptoItem));
            setModalOpen(false);
        }
    };

    const selected = cryptos.find((opt) => opt.id === selectedId) || cryptos[0];

    return (
        <>
            <button
                type="button"
                // onClick={() => setModalOpen(true)}
                className={`flex items-center w-full gap-[1rem]  p-[1.6rem] rounded-[2rem] box-shadow transition bg-[var(--bg-secondary)] `}
            >
                {selected?.iconUrl && (
                    <Image
                        src={selected.iconUrl}
                        alt={selected.label}
                        width={40}
                        height={40}
                        className="w-[4rem] h-[4rem] rounded-full "
                    />
                )}
                <div className="flex-1 text-left">
                    <div className="font-semibold text-[var(--text-main)] text-[1.5rem] leading-[130%]">
                        {selected?.label}
                    </div>
                    <div className="text-[1.5rem] text-[var(--text-secondary)] leading-[130%]">
                        {selected?.description}
                    </div>
                </div>
                {/* <RightArrowIcon /> */}
            </button>
            <Modal swipeToClose={false} open={modalOpen} onClose={closeModal}>
                <div className="flex items-center justify-between w-full mb-[3rem] text-[1.8rem] font-semibold">
                    Выберите криптовалюту
                </div>
                <SelectCustom options={cryptos} value={selectedId} onChange={handleSelect} />
            </Modal>
        </>
    );
};

export default SelectCrypto;
