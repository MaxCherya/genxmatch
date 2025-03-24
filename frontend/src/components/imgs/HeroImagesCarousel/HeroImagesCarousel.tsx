import React, { useState } from 'react';
import clsx from 'clsx';
import '../../styles/BubbleImage.css';

type Image = {
    src: string;
    alt: string;
};

type Props = {
    images: Image[];
    visibleCount?: number;
    className?: string;
};

const HeroImagesCarousel: React.FC<Props> = ({ images, visibleCount = 6, className = '' }) => {
    if (images.length < 3) {
        return <div className="text-red-500">Please provide at least 3 images for the layout.</div>;
    }

    const [currentlySelected, setCurrentlySelected] = useState(0);
    const [startIndex, setStartIndex] = useState(0);

    const canScrollBack = startIndex > 0;
    const canScrollForward = startIndex + visibleCount < images.length;

    const handleNext = () => {
        if (canScrollForward) {
            setStartIndex(startIndex + 1);
        }
    };

    const handlePrev = () => {
        if (canScrollBack) {
            setStartIndex(startIndex - 1);
        }
    };

    const visibleImages = images.slice(startIndex, startIndex + visibleCount);

    return (
        <div className={clsx(
            'w-full h-full flex flex-col lg:flex-row items-center justify-center gap-5',
            className
        )}>
            {/* Main Image */}
            <img
                src={images[currentlySelected].src}
                alt={images[currentlySelected].alt}
                className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] object-cover rounded-2xl"
            />

            {/* Desktop Thumbnail List */}
            <div className="hidden lg:flex flex-col items-center gap-3">
                {/* Up Arrow */}
                {images.length > visibleCount && (
                    <button
                        onClick={handlePrev}
                        disabled={!canScrollBack}
                        className={`text-base text-gray-600 disabled:opacity-30 ${!canScrollBack ? "cursor-not-allowed" : "cursor-pointer hover:text-gray-500"}`}
                    >
                        ▲
                    </button>
                )}

                {/* Thumbnails (vertical) */}
                {visibleImages.map((img, i) => {
                    const actualIndex = startIndex + i;
                    return (
                        <div
                            key={actualIndex}
                            onClick={() => setCurrentlySelected(actualIndex)}
                            className={clsx(
                                'relative rounded-xl overflow-hidden cursor-pointer',
                                'w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]'
                            )}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className={clsx(
                                    'w-full h-full object-cover transition-all duration-200',
                                    actualIndex === currentlySelected ? 'brightness-30 blur-[1px]' : 'hover:brightness-95'
                                )}
                            />
                        </div>
                    );
                })}

                {/* Down Arrow */}
                {images.length > visibleCount && (
                    <button
                        onClick={handleNext}
                        disabled={!canScrollForward}
                        className={`text-base text-gray-600 disabled:opacity-30 ${!canScrollForward ? "cursor-not-allowed" : "cursor-pointer hover:text-gray-500"}`}
                    >
                        ▼
                    </button>
                )}
            </div>

            {/* Mobile Thumbnail Row */}
            <div className="lg:hidden w-full flex flex-col items-center gap-2 mt-4">
                {/* Horizontal Arrows */}
                <div className="flex justify-center gap-4 text-gray-600 text-lg">
                    <button
                        onClick={handlePrev}
                        disabled={!canScrollBack}
                        className={clsx(
                            'transition hover:text-gray-400',
                            !canScrollBack && 'opacity-30 cursor-not-allowed'
                        )}
                    >
                        ◀
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!canScrollForward}
                        className={clsx(
                            'transition hover:text-gray-400',
                            !canScrollForward && 'opacity-30 cursor-not-allowed'
                        )}
                    >
                        ▶
                    </button>
                </div>

                {/* Scrollable Thumbnails */}
                <div className="flex overflow-x-auto gap-2 w-full justify-center px-2">
                    {visibleImages.map((img, i) => {
                        const actualIndex = startIndex + i;
                        return (
                            <div
                                key={actualIndex}
                                onClick={() => setCurrentlySelected(actualIndex)}
                                className={clsx(
                                    'relative rounded-xl overflow-hidden cursor-pointer shrink-0',
                                    'w-[50px] h-[50px]'
                                )}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className={clsx(
                                        'w-full h-full object-cover transition-all duration-200',
                                        actualIndex === currentlySelected ? 'brightness-30 blur-[1px]' : 'hover:brightness-95'
                                    )}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HeroImagesCarousel;