import React from 'react';
import clsx from 'clsx';

type Props = {
    current: number;
    old?: number;
    currency?: string;
    size?: 'sm' | 'md' | 'lg';
};

const PriceTag: React.FC<Props> = ({ current, old, currency = '$', size = 'md' }) => {
    const isDiscount = old && old > current;
    const discount = isDiscount ? Math.round(((old - current) / old) * 100) : null;

    const sizeClasses = {
        sm: {
            current: 'text-xl',
            old: 'text-xs',
            badge: 'text-xs px-2 py-0.5',
        },
        md: {
            current: 'text-3xl',
            old: 'text-sm',
            badge: 'text-xs px-3 py-1',
        },
        lg: {
            current: 'text-5xl',
            old: 'text-base',
            badge: 'text-sm px-4 py-1.5',
        },
        xl: {
            current: 'text-9xl',
            old: 'text-2xl',
            badge: 'text-base px-5 py-2',
        },
    };

    const styles = sizeClasses[size || 'md'];

    return (
        <div className="flex flex-col items-center text-white">
            {/* Current Price */}
            <span className={clsx('font-bold text-green-500', styles.current)}>
                {current.toLocaleString()} {currency}
            </span>

            {/* Old Price + Discount */}
            {isDiscount && (
                <div className="flex items-center space-x-2 mt-1">
                    <span className={clsx('text-gray-400 line-through', styles.old)}>
                        {old.toLocaleString()} {currency}
                    </span>
                    <span className={clsx('bg-red-600 text-white rounded-full font-semibold', styles.badge)}>
                        -{discount}%
                    </span>
                </div>
            )}
        </div>
    );
};

export default PriceTag;