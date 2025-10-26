'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '../../ui/Button';

interface Step2Props {
    onNext: () => void;
}

const Step2: React.FC<Step2Props> = ({ onNext }) => {
    return (
        <div className="flex-1 flex flex-col items-center bg-[url('/onboarding/bg.png')] bg-cover bg-center justify-end">
            <div className="w-full flex flex-col items-center">
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[13.2rem] w-[26rem] h-[53.8rem] mb-[1rem]"
                >
                    <Image src="/onboarding/step2.png" alt="Step 2" fill loading="lazy" />
                </motion.div>

                {/* Content */}
                <div className="bg-[var(--bg-optional)] rounded-t-[2rem] w-full relative pt-[2.4rem] pb-[1.6rem] px-[1.6rem] flex flex-col items-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="fs-bold text-center mb-[0.8rem]"
                        dangerouslySetInnerHTML={{ __html: 'Платите криптой<br>по QR или ссылке' }}
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="fs-regular text-[var(--text-secondary)] text-center mb-[4rem]"
                    >
                        <span
                            dangerouslySetInnerHTML={{
                                __html: 'Совершайте покупки криптой по&nbsp;СБП&nbsp;быстро и безопасно.',
                            }}
                        />
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="w-full"
                    >
                        <Button variant="yellow" onClick={onNext}>
                            Далее
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Step2;
