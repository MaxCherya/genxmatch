import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

type Props = {
    durationSeconds: number;
    localStorageKey?: string;
    onComplete?: () => void;
    size?: 'sm' | 'md' | 'lg';
};

const CountdownTimer: React.FC<Props> = ({
    durationSeconds,
    localStorageKey = 'countdown_timer',
    onComplete,
    size = 'md',
}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        let endTime: number;

        const saved = localStorage.getItem(localStorageKey);
        if (saved) {
            endTime = parseInt(saved);
        } else {
            endTime = Date.now() + durationSeconds * 1000;
            localStorage.setItem(localStorageKey, endTime.toString());
        }

        const updateTimer = () => {
            const remaining = Math.floor((endTime - Date.now()) / 1000);
            if (remaining <= 0) {
                setTimeLeft(0);
                localStorage.removeItem(localStorageKey);
                onComplete?.();
                return;
            }
            setTimeLeft(remaining);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [durationSeconds, localStorageKey]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600)
            .toString()
            .padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');

        return `${hrs}:${mins}:${secs}`;
    };

    const sizeStyles = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-6 py-3',
    };

    if (timeLeft <= 0) return null;

    return (
        <div
            className={clsx(
                'bg-red-600 text-white font-semibold rounded-lg inline-block',
                sizeStyles[size]
            )}
        >
            ⏰ {formatTime(timeLeft)} {t('countdown_timer_left_to_grab')}
        </div>
    );
};

export default CountdownTimer;