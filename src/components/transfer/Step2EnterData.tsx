'use client';
import Input from '@/components/ui/Input';
import { Button } from '../ui/Button';
import Exclamation from '@/components/icons/exclamation.svg';
import Image from 'next/image';
import { useAppSelector } from '@/lib/redux/hooks';
import { getRatesQuoteRub } from '@/lib/redux/selectors/rateSelectors';


type Step2Props = {
    selectedNetwork: string;
    selectedCrypto: string;
    handleNextStep: () => void;
    balance_usdt: number | undefined;
    cryptos: {
        id: string;
        label: string;
        description: string;
        iconUrl: string;
    }[];
};

const Step2EnterData: React.FC<Step2Props> = ({
    selectedNetwork,
    selectedCrypto,
    handleNextStep,
    cryptos,
    balance_usdt,
}) => {

    const rate = useAppSelector(getRatesQuoteRub);
    const convertedBalance = balance_usdt && rate ? Number((balance_usdt * rate).toFixed(2)) : 0;
    const selected = cryptos.find((crypto) => crypto.id === selectedCrypto);

    return (
        <div className="flex flex-col justify-between min-h-[80dvh]">
            <div className='flex flex-col gap-[2rem]'>
                <div>
                    <p>Адрес</p>
                    <Input placeholder={`Адрес в сети ${selectedNetwork}`} />
                </div>
                <div>
                    <div>
                        <p>Сумма</p>
                        <Input placeholder={`0,00 ${selectedCrypto}`} />
                    </div>
                    <div className='flex bg-[var(--yellow-optional)] rounded-[1rem] p-[1rem] gap-[0.8rem] mt-[1rem] items-center'>
                        <Exclamation 
                            
                            alt='exclamation mark icon'
                            width={20}
                            height={20}
                            className='w-[2rem] h-[2rem] rounded-full'
                            />
                        <p className='fs-very-small'>Сейчас доступны переводы только внутри Lynx</p>
                    </div>
                </div>
                <div className=''>
                    <p>Баланс</p>
                    <div className='flex items-center w-full gap-[1rem]  p-[1.6rem] rounded-[2rem] box-shadow transition bg-[var(--bg-secondary)]'>
                        <Image
                            src={selected?.iconUrl || ''}
                            alt={selected?.label || ''}
                            width={40}
                            height={40}
                            className="w-[4rem] h-[4rem] rounded-full "
                        />
                        <div>
                            <p>{`${balance_usdt} ${selectedCrypto}`}</p>
                            <p>{`${convertedBalance} ₽`}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Button variant="yellow" fullWidth={true} onClick={handleNextStep}>
                Продолжить
            </Button>
        </div>
    );
};

export default Step2EnterData;
