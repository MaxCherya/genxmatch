import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import clsx from 'clsx';

type Image = {
    src: string;
    alt: string;
};

type Props = {
    images: Image[];
    className?: string;
    setIsFullscreen?: (value: boolean) => void; // Optional prop to sync with parent
};

const HeroImagesCarousel: React.FC<Props> = ({ images, className = '', setIsFullscreen }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ axis: 'x', align: 'center', loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const [isFullscreen, setIsFullscreenState] = useState(false);
    const [fullscreenEmblaRef, fullscreenEmblaApi] = useEmblaCarousel({ align: 'center', loop: false });

    // Handle fullscreen toggle and sync with parent if prop is provided
    const handleFullscreenToggle = useCallback((value: boolean) => {
        setIsFullscreenState(value);
        if (setIsFullscreen) setIsFullscreen(value);
    }, [setIsFullscreen]);

    const updateScrollState = useCallback(() => {
        if (!emblaApi) return;
        const progress = emblaApi.scrollProgress();
        setCanScrollPrev(progress > 0.01);
        setCanScrollNext(progress < 0.99);
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) {
                emblaApi.scrollTo(index);
                setSelectedIndex(index);
                setTimeout(() => {
                    updateScrollState();
                }, 0);
            }
        },
        [emblaApi, updateScrollState]
    );

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('scroll', updateScrollState);
        emblaApi.on('select', updateScrollState);
        updateScrollState();
        return () => {
            emblaApi.off('scroll', updateScrollState);
            emblaApi.off('select', updateScrollState);
        };
    }, [emblaApi, updateScrollState]);

    // ESC key to close fullscreen
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleFullscreenToggle(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [handleFullscreenToggle]);

    // Set correct fullscreen image when opening
    useEffect(() => {
        if (isFullscreen && fullscreenEmblaApi) {
            fullscreenEmblaApi.scrollTo(selectedIndex);
        }
    }, [isFullscreen, fullscreenEmblaApi, selectedIndex]);

    return (
        <>
            <div className={clsx('w-full flex flex-col items-center gap-4', className)}>
                {/* Main Image */}
                <img
                    src={images[selectedIndex].src}
                    alt={images[selectedIndex].alt}
                    className="w-[350px] h-[350px] sm:w-[400px] sm:h-[400px] md:w-[460px] md:h-[460px] lg:w-[500px] lg:h-[500px] object-cover rounded-2xl transition-all duration-300 shadow-md cursor-pointer"
                    onClick={() => handleFullscreenToggle(true)}
                />

                {/* Thumbnail Carousel */}
                <div className="relative w-full max-w-[90vw] sm:max-w-[400px]">
                    {canScrollPrev && (
                        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/90 to-transparent pointer-events-none z-10" />
                    )}
                    {canScrollNext && (
                        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/90 to-transparent pointer-events-none z-10" />
                    )}
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-2 px-1">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 cursor-pointer"
                                    onClick={() => scrollTo(index)}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className={clsx(
                                            'rounded-xl object-cover transition-all duration-200',
                                            'w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px]',
                                            index === selectedIndex
                                                ? 'brightness-30 blur-[1px]'
                                                : 'hover:brightness-95'
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Viewer */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[10000] bg-black bg-opacity-100 flex items-center justify-center p-4 md:p-6">
                    {/* Close button */}
                    <button
                        onClick={() => handleFullscreenToggle(false)}
                        className="absolute top-4 right-4 text-white text-4xl font-bold z-[10001] hover:text-gray-300 transition-colors duration-200 focus:outline-none"
                        aria-label="Close fullscreen"
                    >
                        ×
                    </button>

                    {/* Fullscreen Embla Carousel */}
                    <div
                        className="w-full max-w-7xl h-[90vh] overflow-hidden"
                        ref={fullscreenEmblaRef}
                    >
                        <div className="flex h-full gap-6">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="min-w-0 flex-[0_0_100%] flex items-center justify-center"
                                >
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="max-h-full max-w-full w-auto h-auto object-contain rounded-2xl shadow-lg"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HeroImagesCarousel;