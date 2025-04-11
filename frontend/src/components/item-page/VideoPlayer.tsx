import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
    src: string;
    loop?: boolean;
    muted?: boolean;
    poster?: string;
    autoplay?: boolean;
    loopUntil?: number;
}

const VideoPlayer = ({
    src,
    loop = true,
    muted = true,
    poster,
    autoplay = true,
    loopUntil,
}: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Handle loading and error states
        const handleCanPlay = () => {
            setIsLoading(false);
            setHasError(false);
        };

        const handleError = () => {
            setIsLoading(false);
            setHasError(true);
            console.warn('Video failed to load:', src);
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);

        // Retry play on visibility change for WebViews
        const retryPlay = () => {
            if (
                document.visibilityState === 'visible' &&
                video.paused &&
                !hasError
            ) {
                video.play().catch((error) => {
                    console.warn('Retry play failed:', error);
                });
            }
        };

        document.addEventListener('visibilitychange', retryPlay);

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            document.removeEventListener('visibilitychange', retryPlay);
        };
    }, [src, hasError]);

    return (
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg bg-black">
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                muted={muted}
                autoPlay={muted && autoplay}
                playsInline
                loop={!loopUntil && loop}
                className={`w-full h-auto aspect-video object-cover rounded-xl transition-opacity duration-500 ${!isLoading && !hasError ? 'opacity-100' : 'opacity-0'
                    }`}
                onTimeUpdate={
                    loopUntil
                        ? (e) => {
                            const video = e.target as HTMLVideoElement;
                            if (video.currentTime >= loopUntil) {
                                video.currentTime = 0;
                                video.play().catch((error) => {
                                    console.warn('Loop replay failed:', error);
                                });
                            }
                        }
                        : undefined
                }
                onError={() => setHasError(true)}
            />
            {isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
            )}
            {poster && (isLoading || hasError) && (
                <img
                    src={poster}
                    alt="Video placeholder"
                    className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-300 ${hasError ? 'opacity-100' : 'opacity-50'
                        }`}
                />
            )}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm rounded-xl">
                    Unable to load video
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;