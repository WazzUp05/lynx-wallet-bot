'use client';
import SelectCrypto from '@/components/SelectCrypto';
import { SelectCustom } from '@/components/ui/SelectCustom';
import { Button } from '../ui/Button';

type Step1Props = {
    // balance: number | undefined;
    cryptos: {
        id: string;
        label: string;
        description: string;
        iconUrl: string;
    }[];
    network: {
        id: string;
        label: string;
        description: string;
        iconUrl: string;
    }[];
    selectedNetwork: string;
    handlerChangeNetwork: (network: string) => void;
    setSelectedCrypto?: (crypto: string) => void;
    handleNextStep: () => void;
};

const Step1SelectCurrency: React.FC<Step1Props> = ({
    cryptos,
    network,
    selectedNetwork,
    handlerChangeNetwork,
    setSelectedCrypto,
    handleNextStep,
}) => {
    return (
        <div className="flex flex-col justify-between min-h-[80dvh]">
            <div>
                <div className="mb-[3rem]">
                    <p className="text-[1.4rem] leading-[130%] font-medium mb-[1rem] text-[var(--text-secondary)]">
                        Криптовалюта
                    </p>
                    <SelectCrypto cryptos={cryptos} setSelectedCrypto={setSelectedCrypto} />
                </div>
                <div className="mb-[3rem]">
                    <p className="text-[1.4rem] leading-[130%] font-medium mb-[1rem] text-[var(--text-secondary)]">
                        Сеть
                    </p>
                    <SelectCustom
                        options={network}
                        value={selectedNetwork}
                        onChange={handlerChangeNetwork}
                        className="mb-[3rem]"
                    />
                </div>
            </div>

            <Button variant="yellow" fullWidth={true} onClick={handleNextStep}>
                Продолжить
            </Button>
        </div>
    );
};

export default Step1SelectCurrency;
