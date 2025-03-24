import React, { useState } from 'react';
import clsx from 'clsx';

// styles
import '../../styles/BubbleImage.css'

type Image = {
    src: string;
    alt: string;
}

type Props = {
    images: Image[]; // Array of images (at least 3 recommended for the layout)
    className?: string; // Additional custom classes
};

const HeroImagesCarousel: React.FC<Props> = ({ images, className = '' }) => {

    if (images.length < 3) {
        return <div className="text-red-500">Please provide at least 3 images for the layout.</div>;
    }

    const [currentlySelected, setCurrentlySelected] = useState(0)

    return (
        <div className="w-full h-full flex flex-row items-center align-middle justify-center gap-7">
            {/* Main Image */}
            <img src={images[currentlySelected].src} className='w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] clip-curve-carousel object-fill' />
            <div className='flex flex-col items-center justify-center align-middle'>
                {images.map((img, index) =>
                    <div onClick={() => setCurrentlySelected(index)} className="relative w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px] mt-4 rounded-xl overflow-hidden cursor-pointer">
                        <img
                            src={img.src}
                            alt={img.alt}
                            className={clsx(
                                'w-full h-full object-cover transition-all duration-200',
                                index === currentlySelected ? 'brightness-50 blur-[1px]' : 'hover:brightness-95'
                            )}
                        />

                        {index === currentlySelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="rounded-full p-1 shadow">
                                    ✅
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default HeroImagesCarousel;