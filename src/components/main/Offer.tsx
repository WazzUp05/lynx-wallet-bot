import Image from "next/image";
import React from "react";
import ThunderIcon from "@/components/icons/thunder.svg";

const Offer = () => {
    return (
        <div className="p-[1.6rem] bg-[var(--blue)] rounded-[2rem] w-full relative mb-[1rem] overflow-hidden">
            <h2 className="text-[1.4rem] bg-[var(--yellow)] w-fit leading-[130%] mb-[1rem] flex gap-[0.5rem] items-center py-[0.3rem] px-[0.7rem] rounded-[1.5rem] font-medium">
                <ThunderIcon />
                Предложение
            </h2>
            <p className="text-[1.4rem] leading-[130%] max-w-[16.2rem] text-white">
                Пригласи своих друзей на бета-тестирование
            </p>
            <Image
                src="/offer-robot.png"
                alt="Offer Image"
                width={234}
                height={199}
                className="mx-auto w-[13.4rem] h-[9.9rem] absolute right-0 top-[0.5rem] z-10"
            />
            <div className="absolute top-0 right-0  h-[12.8rem] w-[12.8rem] bg-white blur-[5rem] rounded-full" />
        </div>
    );
};

export default Offer;
