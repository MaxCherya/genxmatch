import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

type Props = {
    min?: number;
    max?: number;
    refreshInterval?: number; // in seconds
    size?: 'sm' | 'md' | 'lg';
    theme?: 'light' | 'dark' | 'primary' | 'success' | 'warning' | 'danger';
};

const LiveVisitorsCounter: React.FC<Props> = ({
    min = 10,
    max = 30,
    refreshInterval = 15,
    size = 'md',
    theme = 'primary',
}) => {
    const { t } = useTranslation();
    const [displayedCount, setDisplayedCount] = useState(() => getRandom(min, max));
    const [_targetCount, setTargetCount] = useState(displayedCount);
    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    // Animation duration in milliseconds
    const animationDuration = 1000; // 1 second

    const animateCount = (start: number, end: number, timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const progress = Math.min((timestamp - startTimeRef.current) / animationDuration, 1);
        const easedProgress = easeInOutQuad(progress);
        const newCount = Math.round(start + (end - start) * easedProgress);

        setDisplayedCount(newCount);

        if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame((ts) => animateCount(start, end, ts));
        } else {
            startTimeRef.current = null;
            animationFrameRef.current = null;
        }
    };

    // Easing function for smoother animation (quadratic ease-in-out)
    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    useEffect(() => {
        const interval = setInterval(() => {
            const newTarget = getRandom(min, max);
            setTargetCount(newTarget);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            startTimeRef.current = null;
            animationFrameRef.current = requestAnimationFrame((timestamp) =>
                animateCount(displayedCount, newTarget, timestamp)
            );
        }, refreshInterval * 1000);

        return () => {
            clearInterval(interval);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [min, max, refreshInterval, displayedCount]);

    // Size classes
    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
    };

    // Theme classes
    const themeClasses = {
        light: 'bg-gray-100 text-gray-900',
        dark: 'bg-gray-800 text-white',
        primary: 'bg-blue-100 text-blue-900',
        success: 'bg-green-100 text-green-900',
        warning: 'bg-yellow-100 text-yellow-900',
        danger: 'bg-red-100 text-red-900',
    };

    return (
        <div
            className={clsx(
                'inline-flex items-center font-medium rounded-full',
                sizeClasses[size],
                themeClasses[theme]
            )}
        >
            <span className="mr-1 align-middle">👀</span>
            <span className="align-middle transition-all duration-200">
                {t('live_visitors_message', { count: displayedCount })}
            </span>
        </div>
    );
};

const getRandom = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export default LiveVisitorsCounter;