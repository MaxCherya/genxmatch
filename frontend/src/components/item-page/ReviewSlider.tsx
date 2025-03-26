import ReviewCard from './ReviewCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { useTranslation } from "react-i18next";
import 'swiper/css'
import 'swiper/css/pagination'

interface Review {
    name: string
    rating: number
    text: string
    avatar?: string
}

interface ReviewSliderProps {
    title?: string
    reviews: Review[]
}

const ReviewSlider: React.FC<ReviewSliderProps> = ({ title, reviews }) => {

    const { t } = useTranslation();

    title = title || `${t('customers_review')} 💬`;

    return (
        <div className="w-full bg-white py-16 px-4 text-black">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
                {title}
            </h2>
            <Swiper
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                modules={[Autoplay, Pagination]}
                className="w-full max-w-7xl mx-auto"
            >
                {reviews.map((review, index) => (
                    <SwiperSlide key={index}>
                        <div className="p-4 mb-6 min-h-fill h-full flex items-center justify-center">
                            <ReviewCard
                                name={review.name}
                                rating={review.rating}
                                text={review.text}
                                avatarUrl={review.avatar}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default ReviewSlider