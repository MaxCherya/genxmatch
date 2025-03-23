import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

type Props = {
    text?: string;
    icon?: string;
    color?: 'red' | 'orange' | 'yellow';
    animate?: boolean;
    size?: 'sm' | 'md' | 'lg';
};

const LimitedTimeBadge: React.FC<Props> = ({
    text,
    icon = '⏳',
    color = 'red',
    animate = true,
    size = 'md',
}) => {
    const { t } = useTranslation();

    const bgColors = {
        red: 'bg-red-600 text-white',
        orange: 'bg-orange-500 text-white',
        yellow: 'bg-yellow-400 text-black',
    };

    const sizeStyles = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2',
    };

    const iconSpacing = {
        sm: 'mr-1',
        md: 'mr-2',
        lg: 'mr-2.5',
    };

    const displayText = text || t('limited_time');

    return (
        <div
            className={clsx(
                'inline-flex items-center rounded-full font-semibold',
                bgColors[color],
                sizeStyles[size],
                animate && 'animate-pulse'
            )}
        >
            <span className={iconSpacing[size]}>{icon}</span>
            {displayText}
        </div>
    );
};

export default LimitedTimeBadge;