'use client';
import Loader from '@/components/ui/Loader';
import { useAppSelector } from '@/lib/redux/hooks';
import { getLoading, getUser } from '@/lib/redux/selectors/userSelectors';
import Image from 'next/image';
import React from 'react';
import ApprovedIcon from '@/components/icons/approved.svg';
import Link from 'next/link';
import ArrowRightIcon from '@/components/icons/right-arrow.svg';
import QuestionIcon from '@/components/icons/message-question.svg';
const Page = () => {
    const user = useAppSelector(getUser);
    const loadingApp = useAppSelector(getLoading);
    if (loadingApp) {
        return <Loader className="h-[100dvh]" />;
    }

    return (
        <div className="px-[1.6rem] py-[2rem] w-full bg-[var(--bg-optional)] min-h-[100dvh] flex flex-col">
            <div className="flex items-center gap-[1.5rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem] mb-[4rem]">
                <Image
                    className="rounded-full w-[5rem] h-[5rem]"
                    src={user?.data?.photo_url || ''}
                    alt={user?.data?.first_name || ''}
                    width={50}
                    height={50}
                />
                <p className="text-[2rem] leading-[130%] font-medium text-[var(--text-secondary)]">
                    {user?.data?.first_name || ''} {user?.data?.last_name || ''}
                </p>
            </div>
            <div className="flex items-center gap-[1.5rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem] mb-[4rem]">
                <div className="w-[3.5rem] h-[3.5rem] bg-[var(--dark-gray-secondary)] rounded-[1rem] flex items-center justify-center">
                    <ApprovedIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                </div>
                <div className="flex flex-col gap-[0.5rem]">
                    <p className="text-[1.5rem] leading-[130%] font-medium text-[var(--text-main)]">KYC верификация</p>
                    <Link
                        href="/profile/kyc"
                        className="text-[1.4rem] flex items-center gap-[0.5rem] leading-[130%]  text-[var(--yellow)]"
                    >
                        Пройти <ArrowRightIcon width={12} height={12} className="w-[1.2rem] h-[1.2rem]" />
                    </Link>
                </div>
            </div>
            <div className="mb-[3.2rem]">
                <p className="text-[1.4rem] leading-[130%] font-medium text-[var(--text-secondary)] mb-[0.8rem]">
                    О нас
                </p>
                <Link
                    href="/faq"
                    className="flex items-center gap-[1rem] bg-[var(--bg-secondary)] rounded-[2rem] p-[1.6rem] mb-[4rem]"
                >
                    <div className="w-[3.5rem] h-[3.5rem] bg-[var(--yellow-secondary)] text-[var(--yellow)] rounded-[1rem] flex items-center justify-center">
                        <QuestionIcon width={20} height={20} className="w-[2rem] h-[2rem]" />
                    </div>
                    <p className="text-[1.5rem] leading-[130%] font-medium text-[var(--text-main)]">
                        Часто задаваемые вопросы
                    </p>
                    <span className="ml-auto text-[var(--text-secondary)]">
                        <ArrowRightIcon width={16} height={16} className="w-[1.6rem] h-[1.6rem]" />
                    </span>
                </Link>
            </div>
            <p className="text-[1.4rem] leading-[130%]  text-[var(--text-secondary)] text-center">v0.10.12</p>
        </div>
    );
};

export default Page;
