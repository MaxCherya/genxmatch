import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

type Props = {
    min?: number;
    max?: number;
    refreshInterval?: number; // in seconds
    size?: 'sm' | 'md' | 'lg';
};

const LiveVisitorsCounter: React.FC<Props> = ({
    min = 10,
    max = 30,
    refreshInterval = 15,
    size = 'md',
}) => {
    const { t } = useTranslation();
    const [count, setCount] = useState(() => getRandom(min, max));

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(getRandom(min, max));
        }, refreshInterval * 1000);

        return () => clearInterval(interval);
    }, [min, max, refreshInterval]);

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
    };

    return (
        <div
            className={clsx(
                'inline-flex items-center bg-blue-100 text-blue-900 font-medium rounded-full',
                sizeClasses[size]
            )}
        >
            👀 {t('live_visitors_message', { count })}
        </div>
    );
};

const getRandom = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export default LiveVisitorsCounter;