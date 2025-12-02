'use client';
import Input from '@/components/ui/Input';
import { Button } from '../ui/Button';

type Step2Props = {
    selectedNetwork: string;
    selectedCrypto: string;
    handleNextStep: () => void;
};

const Step2EnterData: React.FC<Step2Props> = ({
    selectedNetwork,
    selectedCrypto,
    handleNextStep,
}) => {
    return (
        <div className="flex flex-col justify-between min-h-[80dvh]">
            <div>
                <div>
                    <p>Адрес</p>
                    <Input placeholder={`Адрес в сети ${selectedNetwork}`} />
                </div>
                <div>
                    <p>Сумма</p>
                    <Input placeholder={`0,00 ${selectedCrypto}`} />
                </div>
                <div>
                    <p>Баланс</p>
                </div>
            </div>

            <Button variant="yellow" fullWidth={true} onClick={handleNextStep}>
                Продолжить
            </Button>
        </div>
    );
};

export default Step2EnterData;
