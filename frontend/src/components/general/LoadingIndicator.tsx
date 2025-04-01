import React from 'react';
import clsx from 'clsx';

interface LoadingIndicatorProps {
    theme?: 'light' | 'dark';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ theme = 'light' }) => {
    const themeStyles = {
        light: 'text-gray-500',
        dark: 'text-gray-400',
    };

    return (
        <div
            className={clsx(
                'flex items-center justify-center p-2',
                themeStyles[theme]
            )}
        >
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}
            />
            <span className="ml-2 text-sm">Loading...</span>
        </div>
    );
};

export default LoadingIndicator;