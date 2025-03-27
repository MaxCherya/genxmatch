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
};

const HeroImagesCarousel: React.FC<Props> = ({ images, className = '' }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ axis: 'x', align: 'center', loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

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

        updateScrollState(); // Initial state

        return () => {
            emblaApi.off('scroll', updateScrollState);
            emblaApi.off('select', updateScrollState);
        };
    }, [emblaApi, updateScrollState]);

    return (
        <div className={clsx('w-full flex flex-col items-center gap-4', className)}>
            {/* Main Image */}
            <img
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                className="w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] object-cover rounded-2xl transition-all duration-300 shadow-md"
            />

            {/* Thumbnail Carousel */}
            <div className="relative w-full max-w-[90vw] sm:max-w-[400px]">
                {/* Fade Left */}
                {canScrollPrev && (
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/90 to-transparent pointer-events-none z-10" />
                )}
                {/* Fade Right */}
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
    );
};

export default HeroImagesCarousel;