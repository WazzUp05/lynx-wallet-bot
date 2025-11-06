'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '../../ui/Button';
import { useMixpanel } from '@/lib/providers/MixpanelProvider';

interface Step3Props {
    onNext: () => void;
}

const Step3: React.FC<Step3Props> = ({ onNext }) => {
    const { trackEvent } = useMixpanel();
    return (
        <div className="flex-1 flex flex-col items-center bg-[url('/onboarding/bg.png')] bg-cover bg-center justify-end">
            <div className="w-full flex flex-col items-center relative flex-1">
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[7.7rem] w-[25rem] h-[25rem] mb-[1rem]"
                >
                    <Image src="/onboarding/step3.png" alt="Step 3" fill loading="lazy" />
                </motion.div>

                {/* Content */}
                <div className="bg-[var(--bg-optional)] mt-auto rounded-t-[2rem] w-full relative pt-[2.4rem] pb-[calc(var(--safe-bottom)+1.6rem)] px-[1.6rem] flex flex-col items-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="fs-bold text-center mb-[0.8rem]"
                        dangerouslySetInnerHTML={{ __html: 'Пополните кошелёк и начните покупки в&nbsp;Lynx' }}
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="fs-regular text-[var(--text-secondary)] text-center mb-[4rem]"
                    >
                        <span
                            dangerouslySetInnerHTML={{
                                __html: 'Без регистрации и KYC просто переведите&nbsp;USDT на свой адрес.',
                            }}
                        />
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="w-full"
                    >
                        <Button
                            variant="yellow"
                            onClick={() => {
                                trackEvent('onboarding_step_passed', { step_number: 3 });
                                onNext();
                            }}
                        >
                            Пополнить
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Step3;
