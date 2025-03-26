import React from 'react';
import ReviewStars from './ReviewStars';

type Props = {
    name: string;
    text: string;
    rating: number;
    avatarUrl?: string;
};

const ReviewCard: React.FC<Props> = ({ name, text, rating, avatarUrl }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow text-gray-800 max-w-md w-full h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
                        {name.charAt(0)}
                    </div>
                )}
                <div>
                    <div className="font-semibold">{name}</div>
                    <ReviewStars rating={rating} size="sm" />
                </div>
            </div>

            {/* Review text */}
            <div className="text-sm text-gray-700 leading-relaxed flex-grow min-h-[50px]">
                {text}
            </div>
        </div>
    );
};

export default ReviewCard;