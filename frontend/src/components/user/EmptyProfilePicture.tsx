import React from "react";

interface Params {
    username: string
}

const EmptyProfilePicture: React.FC<Params> = ({ username }) => {
    return (
        <div className="w-52 h-52 bg-blue-500 rounded-full flex flex-col items-center justify-center">
            <p className="text-[9rem] uppercase">{username.slice(0, 1)}</p>
        </div>
    )
}

export default EmptyProfilePicture;