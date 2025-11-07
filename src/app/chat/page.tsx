"use client"
import { useRouter } from 'next/navigation'
import ArrowLeft from '@/components/icons/arrow-left.svg'
import Plus from '@/components/icons/plus-white.svg'
import {  getUser } from '@/lib/redux/selectors/userSelectors';
import { useAppSelector } from '@/lib/redux/hooks';
import InputChat from '@/components/ui/InputChat';

const Page = () => {

    const router = useRouter();
    const user = useAppSelector(getUser);
 

    return <div className="flex flex-col min-h-[100dvh] w-full px-[1.6rem] py-[2rem] pb-[calc(var(--safe-bottom)+1.6rem)] bg-[var(--bg-optional)]">
        <div className="relative">
            <div
                className="absolute top-0 left-0 bg-[var(--bg-secondary)] rounded-[1rem] w-[3.5rem] h-[3.5rem] center  text-[var(--text-secondary)]"
                onClick={() => {
                    router.back();
                }}
            >
                <ArrowLeft />
            </div> 
            <div className='m-auto flex justify-center flex-col items-center'>
                <p className='fs-regular-bold'>Чат</p>
                <p className='fs-very-small text-[var(--text-secondary)]'>{user.data?.first_name || ' '} {user.data?.last_name || ' '}</p>  
            </div> 
        </div>
        <div className="grow">chat window</div>
        <div className="flex items-center gap-[1rem]">
            <button className='w-[3rem] h-[3rem] rounded-[2rem] center glass' onClick={() => {}}>
                <Plus />
            </button>
            <InputChat />
        </div>
    </div>
}

export default Page