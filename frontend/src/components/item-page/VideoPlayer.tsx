import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
    src: string;
    loop?: boolean;
    muted?: boolean;
    poster?: string;
    autoplay?: boolean;
    loopUntil?: number; // ⬅️ custom end time
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
    const playerRef = useRef<Player | null>(null);

    useEffect(() => {
        const cleanupFn = { current: () => { } };

        const timeout = setTimeout(() => {
            const videoElement = videoRef.current;
            if (!videoElement || playerRef.current) return;

            const player = videojs(videoElement, {
                autoplay: false,
                muted,
                loop: !loopUntil && loop,
                controls: false,
                preload: 'auto',
                playsinline: true,
                poster,
                sources: [{ src, type: 'video/mp4' }],
            });

            playerRef.current = player;

            // Manual loop logic
            if (loopUntil) {
                player.on('timeupdate', () => {
                    const currentTime = player.currentTime();
                    if (typeof currentTime === 'number' && currentTime >= loopUntil) {
                        player.currentTime(0);
                        const maybePromise = player.play();
                        if (maybePromise && typeof maybePromise.then === 'function') {
                            maybePromise.catch(() => { });
                        }
                    }
                });
            }

            // Try to play when ready
            player.ready(() => {
                const maybePromise = player.play();
                if (maybePromise && typeof maybePromise.then === 'function') {
                    maybePromise.catch((error: unknown) => {
                        if (error instanceof Error) {
                            console.warn('Autoplay blocked:', error.message);
                        }
                    });
                }
            });

            const retryPlay = () => {
                if (
                    document.visibilityState === 'visible' &&
                    !player.isDisposed() &&
                    player.paused()
                ) {
                    const maybePromise = player.play();
                    if (maybePromise && typeof maybePromise.then === 'function') {
                        maybePromise.catch((error: unknown) => {
                            if (error instanceof Error) {
                                console.warn('Retry autoplay failed:', error.message);
                            }
                        });
                    }
                }
            };

            document.addEventListener('visibilitychange', retryPlay);

            cleanupFn.current = () => {
                document.removeEventListener('visibilitychange', retryPlay);
                if (loopUntil) player.off('timeupdate');
                if (!player.isDisposed()) player.dispose();
                playerRef.current = null;
            };
        }, 0);

        return () => {
            clearTimeout(timeout);
            cleanupFn.current();
        };
    }, [src, autoplay, muted, loop, loopUntil, poster]);

    return (
        <div data-vjs-player className="w-full">
            <video
                ref={videoRef}
                className="video-js vjs-default-skin w-full h-auto rounded-xl"
            />
        </div>
    );
};

export default VideoPlayer;