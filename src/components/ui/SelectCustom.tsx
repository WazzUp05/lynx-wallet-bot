"use client";
import Image from "next/image";
import React from "react";
import CheckIcon from "@/components/icons/check.svg";

interface SelectCustomOption {
    id: string;
    label: string;
    description?: string;
    iconUrl?: string;
}

interface SelectCustomProps {
    options: SelectCustomOption[];
    value: string;
    onChange: (id: string) => void;
    className?: string;
}

export const SelectCustom: React.FC<SelectCustomProps> = ({ options, value, onChange, className = "" }) => {
    return (
        <div className={`flex flex-col gap-[1rem] w-full ${className}`}>
            {options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => onChange(option.id)}
                    className={`flex items-center gap-[1rem] py-[1rem] px-[1.6rem] rounded-[1.5rem] box-shadow transition
                        bg-white
                        hover:border-blue-400`}
                >
                    {option.iconUrl && (
                        <Image
                            src={option.iconUrl}
                            alt={option.label}
                            width={40}
                            height={40}
                            className="w-[4rem] h-[4rem] rounded-full "
                        />
                    )}
                    <div className="flex-1 text-left">
                        <div className="font-semibold text-black text-[1.5rem] leading-[130%]">{option.label}</div>
                        {option.description && (
                            <div className="text-[1.5rem] text-gray-400 leading-[130%]">{option.description}</div>
                        )}
                    </div>

                    <div
                        className={`flex items-center transition justify-center w-[2.5rem] h-[2.5rem] ${
                            value === option.id ? "bg-blue-500 text-white" : "bg-[#F2F3F4] text-transparent"
                        } rounded-full`}
                    >
                        <CheckIcon />
                    </div>
                </button>
            ))}
        </div>
    );
};
