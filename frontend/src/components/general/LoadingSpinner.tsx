import React from 'react';
import clsx from 'clsx';

interface LoadingSpinnerProps {
    isLoading?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading = true }) => {
    if (!isLoading) return null;

    return (
        <div
            className={clsx(
                'fixed inset-0 z-50 flex items-center justify-center',
                'bg-black/70 backdrop-blur-sm transition-all duration-300'
            )}
            aria-label="Loading"
        >
            <div className="relative flex flex-col items-center gap-6">
                {/* Orbiting Circles Animation */}
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 animate-orbit">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
                    </div>
                    <div className="absolute inset-0 animate-orbit-reverse">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
                    </div>
                    {/* Center Pulse */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 animate-ping" />
                    </div>
                </div>

                {/* Loading Text with Bounce */}
                <div className="flex space-x-2">
                    <span className="text-white text-2xl font-semibold animate-bounce-short delay-0">L</span>
                    <span className="text-white text-2xl font-semibold animate-bounce-short delay-100">o</span>
                    <span className="text-white text-2xl font-semibold animate-bounce-short delay-200">a</span>
                    <span className="text-white text-2xl font-semibold animate-bounce-short delay-300">d</span>
                    <span className="text-white text-2xl font-semibold animate-bounce-short delay-400">i</span>
                    <span className="text-white text-2xl font-semibold animate-bounce-short delay-500">n</span>
                    <span className="text-white text-2xl font-semibold animate-bounce-short delay-600">g</span>
                </div>
            </div>

            {/* Optional decorative background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute w-[200%] h-[200%] bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-transparent animate-slow-spin" />
            </div>
        </div>
    );
};

export default LoadingSpinner;