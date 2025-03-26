import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

interface Images {
    src: string
    alt: string
}

type Props = {
    images: Images[]
    asBG?: boolean
}

const PicturesSlider: React.FC<Props> = ({ images, asBG = false }) => {
    const shouldLoop = images.length >= 3;

    return (
        <div className={`w-full h-full ${asBG ? "absolute top-0" : ""}`}>
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                loop={shouldLoop}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[Autoplay]}
                className="w-full h-full"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className="w-full h-full">
                        <div className="w-full h-full">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className={`w-full h-full object-cover ${asBG ? "opacity-15" : "opacity-100"}`}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default PicturesSlider