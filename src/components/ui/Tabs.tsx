import React from "react";

interface Tab {
    label: string;
    value: string;
}

interface TabsProps {
    tabs: Tab[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, value, onChange, className = "" }) => {
    return (
        <div className={`flex gap-[1.6rem] overflow-auto py-[0.5rem] ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    type="button"
                    onClick={() => onChange(tab.value)}
                    className={`text-[1.4rem] leading-[130$] px-[1rem] py-[0.7rem] rounded-full ${
                        value === tab.value
                            ? "bg-[var(--yellow)] text-[var(--bg-secondary)]"
                            : "glass text-[var(--text-secondary)] "
                    }
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
