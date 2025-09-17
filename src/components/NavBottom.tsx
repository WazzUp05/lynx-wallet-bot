"use client";
import Link from "next/link";
import React from "react";
import ClockIcon from "@/components/icons/clock.svg";
import HomeIcon from "@/components/icons/home.svg";
import QrIcon from "@/components/icons/qr.svg";
import UserIcon from "@/components/icons/user.svg";
import { usePathname } from "next/navigation";
import { getLoading } from "@/lib/redux/selectors/userSelectors";
import { useAppSelector } from "@/lib/redux/hooks";

const NavBottom = () => {
    const pathname = usePathname();
    const loadingApp = useAppSelector(getLoading);

    const navItems = [
        { href: "/", label: "Главная", icon: <HomeIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" /> },
        {
            href: "/qr",
            label: "Оплата по QR",
            icon: <QrIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />,
        },
        {
            href: "/history",
            label: "История",
            icon: <ClockIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />,
        },
        {
            href: "/profile",
            label: "Профиль",
            icon: <UserIcon width={28} height={28} className="w-[2.8rem] h-[2.8rem]" />,
            disabled: true,
        },
    ];

    if (loadingApp) {
        return null;
    }

    return (
        <div className="flex items-center h-[var(--nav-bottom-height)] fixed bottom-0 left-0 border-t border-[#00000026] w-full py-[0.45] bg-white">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={
                        pathname === item.href
                            ? "text-[var(--blue)] font-semibold flex flex-col items-center justify-center gap-[0.4rem] flex-1 py-[0.6rem] text-[1.2rem] leading-[1.3rem]"
                            : "flex flex-col items-center justify-center gap-[0.4rem] flex-1 py-[0.6rem] text-[var(--gray)] text-[1.2rem] leading-[1.3rem]" +
                              (item.disabled ? " pointer-events-none opacity-50" : "")
                    }
                >
                    {item.icon}
                    <span>{item.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default NavBottom;
