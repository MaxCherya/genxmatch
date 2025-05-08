import React from "react";

interface Params {
    username: string | undefined;
    size?: "nav" | "base";
    onClick?: () => void;
    pointer?: boolean
}

const EmptyProfilePicture: React.FC<Params> = ({ username, size = "base", onClick, pointer = false }) => {
    const textSize = size === "nav" ? "text-[1rem]" : "text-[9rem]";
    const divSize = size === "nav" ? "w-6 h-6" : "w-52 h-52";

    return (
        <div onClick={onClick} className={`bg-blue-500 ${pointer && 'cursor-pointer'} rounded-full flex items-center justify-center ${divSize}`}>
            <p className={`${textSize} text-white uppercase font-semibold`}>
                {username?.slice(0, 1)}
            </p>
        </div>
    );
};

export default EmptyProfilePicture;