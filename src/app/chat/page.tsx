'use client';

import Plus from '@/components/icons/plus-white.svg';

import InputChat from '@/components/ui/SupportChat/InputSupportChat';
import Chat from '@/components/ui/SupportChat/SupportChat';

const Page = () => {
  return (
    <div className="flex flex-col h-[100dvh] w-full px-[1.6rem] py-[2rem] pb-[calc(var(--safe-bottom)+1.6rem)] bg-[var(--bg-optional)] pt-[0] gap-[0.2rem]">
      <div className="grow flex flex-col overflow-auto pt-[0]">
        <Chat />
      </div>
      <div className="flex items-center gap-[1rem]">
        <button className="w-[3rem] h-[3rem] rounded-[2rem] center glass" onClick={() => {}}>
          <Plus />
        </button>
        <InputChat />
      </div>
    </div>
  );
};

export default Page;
