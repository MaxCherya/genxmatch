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
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) {
                emblaApi.scrollTo(index);
                setSelectedIndex(index);
                updateScrollState();
            }
        },
        [emblaApi, updateScrollState]
    );

    useEffect(() => {
        if (!emblaApi) return;

        emblaApi.on('scroll', updateScrollState);
        emblaApi.on('select', updateScrollState);

        updateScrollState(); // Initial call

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
                className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] object-cover rounded-2xl transition-all duration-300 shadow-md"
            />

            {/* Thumbnails Carousel */}
            <div className="relative w-full max-w-[400px]">
                {/* Fading edges */}
                {canScrollPrev && (
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/90 to-transparent pointer-events-none z-10" />
                )}
                {canScrollNext && (
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/90 to-transparent pointer-events-none z-10" />
                )}

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="min-w-[60px] sm:min-w-[70px] px-1 flex-shrink-0"
                                onClick={() => scrollTo(index)}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className={clsx(
                                        'rounded-xl object-cover w-full h-[60px] sm:h-[70px] cursor-pointer transition-all duration-200',
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