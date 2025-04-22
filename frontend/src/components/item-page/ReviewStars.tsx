import React from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';

type Props = {
    rating: number; // 0–5 (can be float like 4.5)
    size?: 'sm' | 'md' | 'lg';
    readOnly?: boolean;
    onChange?: (value: number) => void;
};

const ReviewStars: React.FC<Props> = ({
    rating,
    size = 'md',
    readOnly = true,
    onChange,
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < Math.floor(rating);
                const half = rating - i >= 0.5 && rating - i < 1;

                return (
                    <Star
                        key={i}
                        onClick={() => !readOnly && onChange?.(i + 1)}
                        className={clsx(
                            sizeClasses[size],
                            'transition',
                            filled
                                ? 'text-yellow-400 fill-yellow-400'
                                : half
                                    ? 'text-yellow-400 fill-yellow-200'
                                    : 'text-gray-300 fill-none',
                            readOnly ? 'cursor-default' : 'cursor-pointer'
                        )}
                    />
                );
            })}
        </div>
    );
};

export default ReviewStars;