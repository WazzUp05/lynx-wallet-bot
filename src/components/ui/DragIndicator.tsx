import React from "react";

type DragIndicatorProps = {
    className?: string;
};

const DragIndicator = ({ className }: DragIndicatorProps) => (
    <div className={`mx-auto w-[5rem] h-[0.4rem] rounded-full bg-[#D9D9DD] ${className}`} aria-label="drag indicator" />
);

export default DragIndicator;
