'use client';
import Link from 'next/link';
import React from 'react';
import ClockIcon from '@/components/icons/clock.svg';
import ClockActiveIcon from '@/components/icons/clock-active.svg';
import HomeIcon from '@/components/icons/home.svg';
import HomeActiveIcon from '@/components/icons/home-active.svg';
import ChatIcon from '@/components/icons/chat.svg';
import ChatActiveIcon from '@/components/icons/chat-active.svg';
import UserIcon from '@/components/icons/user.svg';
import UserDisableIcon from '@/components/icons/user-disable.svg';
import UserActiveIcon from '@/components/icons/user-active.svg';
import { usePathname } from 'next/navigation';
import { getLoading } from '@/lib/redux/selectors/userSelectors';
import { useAppSelector } from '@/lib/redux/hooks';
import { getShouldDisableButtons } from '@/lib/redux/selectors/appSelectors';

const NavBottom = () => {
    const pathname = usePathname();
    const loadingApp = useAppSelector(getLoading);
    const shouldDisableButtons = useAppSelector(getShouldDisableButtons);

    // Страницы, на которых показывать NavBottom
    const allowedPages = ['/', '/history', '/profile'];

    // Не показывать NavBottom на других страницах
    if (!allowedPages.includes(pathname)) {
        return null;
    }

    const navItems = [
        {
            href: '/',
            label: 'Главная',
            icon:
                pathname === '/' ? (
                    <HomeActiveIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />
                ) : (
                    <HomeIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />
                ),
        },
        {
            href: '/history',
            label: 'История',
            disabled: shouldDisableButtons,
            icon:
                pathname === '/history' ? (
                    <ClockActiveIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />
                ) : (
                    <ClockIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />
                ),
        },
        {
            href: 'https://t.me/Lynxwalletsupport_bot',
            label: 'Чат',
            icon:
                pathname === '/qr' ? (
                    <ChatActiveIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />
                ) : (
                    <ChatIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />
                ),
        },
        {
            href: '/profile',
            label: 'Профиль',
            disabled: shouldDisableButtons,
            icon:
                pathname === '/profile' ? (
                    <UserActiveIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />
                ) : shouldDisableButtons ? (
                    <UserDisableIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />
                ) : (
                    <UserIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />
                ),
        },
    ];

    if (loadingApp) {
        return null;
    }

    return (
        <div
            className="flex items-center mix-blend-plus-lighter h-[var(--nav-bottom-height)] rounded-[10rem] bg-[var(--bg-secondary)] fixed left-1/2 -translate-x-1/2 border-t border-[#00000026] z-10 glass py-[0.45rem] px-[1rem] w-[calc(100%-3.2rem)] "
            style={{
                bottom: 'max(0.5rem, var(--safe-bottom))',
            }}
        >
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={
                        pathname === item.href
                            ? 'text-[var(--yellow)] font-semibold flex flex-col items-center justify-center gap-[0.4rem] flex-1 py-[0.6rem] text-[1rem] leading-[1.2rem] relative'
                            : `flex flex-col items-center justify-center gap-[0.4rem] flex-1 py-[0.6rem] ${
                                  item.disabled
                                      ? 'text-[#121214] cursor-not-allowed pointer-events-none'
                                      : 'text-[var(--text-secondary)]'
                              } text-[1rem] leading-[1.2rem] relative`
                    }
                >
                    <div
                        className={`w-[9rem] h-[5.8rem] transition-all duration-300 ${
                            pathname === item.href ? 'bg-[#303030CC]' : 'bg-transparent'
                        } rounded-[10rem] center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]`}
                    />

                    {item.icon}
                    <span className="font-semibold">{item.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default NavBottom;
