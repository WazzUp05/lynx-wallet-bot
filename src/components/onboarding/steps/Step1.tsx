'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '../../ui/Button';
import { useMixpanel } from '@/lib/providers/MixpanelProvider';

interface Step1Props {
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ onNext }) => {
  const { trackEvent } = useMixpanel();
  React.useEffect(() => {
    trackEvent('onboarding_started');
  }, []);
  return (
    <div className="flex-1 flex flex-col items-center bg-[url('/onboarding/bg.png')] bg-cover bg-center justify-end">
      <div className="w-full flex flex-col items-center relative flex-1">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-[2rem] w-[31.5rem] left-[1.5rem] h-[31.3rem] mb-[1rem]"
        >
          <Image src="/onboarding/step1.png" alt="Step 1" fill loading="lazy" />
        </motion.div>

        {/* Content */}
        <div className="bg-[var(--bg-optional)] mt-auto rounded-t-[2rem] w-full relative pt-[2.4rem] pb-[calc(var(--safe-bottom)+1.6rem)] px-[1.6rem] flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="fs-bold text-center mb-[0.8rem]"
            dangerouslySetInnerHTML={{ __html: 'Lynx ваш криптокошелёк в&nbsp;Telegram' }}
          />
          <motion.p
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="fs-regular text-[var(--text-secondary)] text-center mb-[4rem]"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: 'Храни и трать криптовалюту в России без лишних приложений и сложностей.',
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
                trackEvent('onboarding_step_passed', { step_number: 1 });
                onNext();
              }}
            >
              Классно!
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
