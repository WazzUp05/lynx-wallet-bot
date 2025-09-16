import React from "react";

interface LoaderProps {
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => (
    <div className={`flex justify-center items-center min-h-[200px] w-full ${className}`}>
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
);

export default Loader;
