import Image from "next/image";
import React from "react";
import InfoIcon from "@/components/icons/Info.svg";

interface HeaderProps {
    avatar?: string;
    name?: string;
}

const Header = ({ avatar, name }: HeaderProps) => {
    return (
        <div className="w-full h-[60px] flex items-center justify-between  mb-[2rem]">
            <div className="flex items-center gap-[1rem]">
                <Image
                    src={avatar ? avatar : "/avatar-placeholder.png"}
                    alt="Lynx Wallet Bot"
                    width={40}
                    height={40}
                    className="rounded-full w-[4rem] h-[4rem]"
                />
                {name && <p className="text-[1.6rem] fs-small text-white">{name}</p>}
            </div>
            <div className="text-white bg-[var(--white-15)] flex  items-center gap-[0.5rem] py-[0.3rem] px-[0.5rem] rounded-[0.7rem]">
                beta <InfoIcon />
            </div>
        </div>
    );
};

export default Header;
