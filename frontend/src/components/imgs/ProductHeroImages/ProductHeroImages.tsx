import React from 'react';
import clsx from 'clsx';

type Image = {
    src: string;
    alt: string;
};

type Props = {
    images: Image[]; // Array of images (at least 3 recommended for the layout)
    className?: string; // Additional custom classes
};

const ProductHeroImages: React.FC<Props> = ({ images, className = '' }) => {
    if (images.length < 3) {
        return <div className="text-red-500">Please provide at least 3 images for the layout.</div>;
    }

    // Main image (largest, centered)
    const mainImage = images[0];
    // Secondary images (smaller, positioned around the main image)
    const secondaryImages = images.slice(1);

    return (
        <div
            className={clsx(
                'relative w-full max-w-4xl mx-auto h-[400px] md:h-[500px] flex items-center justify-center',
                className
            )}
        >
            {/* Main Image */}
            <div className="relative z-10">
                <img
                    src={mainImage.src}
                    alt={mainImage.alt}
                    className="w-[300px] md:w-[400px] h-[300px] md:h-[400px] object-cover rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Secondary Images */}
            {secondaryImages.map((image, index) => (
                <div
                    key={index}
                    className={clsx(
                        'absolute md:block',
                        index === 0 && 'top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 rotate-[-5deg] z-0',
                        index === 1 && 'bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 rotate-[5deg] z-0',
                        index === 2 && 'top-1/2 left-0 transform -translate-x-1/2 translate-y-[-50%] rotate-[3deg] z-0',
                        index === 3 && 'top-1/2 right-0 transform translate-x-1/2 translate-y-[-50%] rotate-[-3deg] z-0'
                    )}
                >
                    <img
                        src={image.src}
                        alt={image.alt}
                        className="w-[150px] h-[150px] object-cover rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:rotate-0"
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductHeroImages;