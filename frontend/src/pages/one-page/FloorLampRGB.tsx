// styles
import '../../components/styles/AnimatedBGGradient.css'

// components
import BubbleBackground from '../../components/bg/BubbleGradient/BubbleGradient';
import LanguageSwitcher from '../../components/general/LanguageSwitcher';
import LiveVisitorsCounter from '../../components/item-page/LiveVisitorsCounter';
import ProductHeroImages from '../../components/imgs/ProductHeroImages/ProductHeroImages';
import HeroImagesCarousel from '../../components/imgs/HeroImagesCarousel/HeroImagesCarousel';
import PriceTag from '../../components/item-page/PriceTag';
import CTAButton from '../../components/btns/CTAButton';
import ReviewStars from '../../components/item-page/ReviewStars';
import LowStockWarning from '../../components/item-page/LowStockWarning';
import CountdownTimer from '../../components/item-page/CountdownTimer';

const FloorLampRGB: React.FC = () => {

    const productImages = [
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223073_napolnaya-uglovaya-rgb.jpg', alt: 'Image 1' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223071_napolnaya-uglovaya-rgb.jpg', alt: 'Image 2' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223075_napolnaya-uglovaya-rgb.jpg', alt: 'Image 3' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223074_napolnaya-uglovaya-rgb.jpg', alt: 'Image 4' },
        { src: 'https://ae01.alicdn.com/kf/S9952a643f0bf41279f3482ce245ed31d2.png', alt: "Image 5" },
        { src: 'https://ae01.alicdn.com/kf/Sb8fb8243a7b2468e8a7e6b23ed4977c1p.jpg', alt: "Image 6" },
        { src: 'https://ae01.alicdn.com/kf/S79f98bd4731c4437b8291d9fcea41d65P.png', alt: 'Image 7' },
        { src: 'https://ae01.alicdn.com/kf/S368465b6141c497ca587779956652da7j.jpg', alt: 'Image 8' },
        { src: 'https://ae01.alicdn.com/kf/Sc3267ad41343454aa4b8ecc626ad1427d.jpg', alt: 'Image 9' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/ezgif.com-video-to-gif_1_480x480_60688bf3-472c-47e1-8e42-867b36901351_480x480.webp', alt: 'Image 10' }
    ];

    const productImagesHero = [
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/ezgif.com-video-to-gif_1_480x480_60688bf3-472c-47e1-8e42-867b36901351_480x480.webp', alt: 'Hero 1' },
        { src: 'https://ae01.alicdn.com/kf/S368465b6141c497ca587779956652da7j.jpg', alt: 'Hero 2' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223073_napolnaya-uglovaya-rgb.jpg', alt: 'Hero 3' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223071_napolnaya-uglovaya-rgb.jpg', alt: 'Hero 4' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223075_napolnaya-uglovaya-rgb.jpg', alt: 'Hero 5' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223074_napolnaya-uglovaya-rgb.jpg', alt: 'Hero 6' },
        { src: 'https://ae01.alicdn.com/kf/Sc3267ad41343454aa4b8ecc626ad1427d.jpg', alt: 'Hero 7' },
    ]

    return (
        <div className="relative w-screen min-h-screen h-auto overflow-x-hidden flex flex-col items-center justify-center p-16 md:p-16 sm:p-2">
            {/* Live Viewers */}
            <div className="fixed bottom-4 right-4 z-50">
                <LiveVisitorsCounter min={10} max={30} refreshInterval={5} size="sm" theme="dark" />
            </div>

            {/* Language Switcher */}
            <div className="absolute top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>

            {/* Background */}
            <BubbleBackground className="fixed inset-0 z-0" />

            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
                <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-10">

                    {/* Left: Image Carousel */}
                    <div className="w-[90svw] xs:w-1/2 flex justify-center">
                        <HeroImagesCarousel visibleCount={5} images={productImagesHero} />
                    </div>

                    {/* Right: Product Info */}
                    <div className="w-[90svw] xs:w-1/2 rounded-2xl bg-[#111] max-w-xl p-6 flex flex-col gap-4 shadow-lg">
                        {/* Title */}
                        <h1 className="text-orange-500 text-2xl sm:text-3xl font-semibold text-center leading-snug">
                            Напольная угловая RGB лампа торшер с пультом управления 1,2м <br />
                            Угловой напольный ночник светильник
                        </h1>

                        {/* Divider */}
                        <hr className="w-full h-[4px] bg-orange-600 border-none rounded-full" />

                        {/* Rating */}
                        <div className="flex items-center justify-center gap-3">
                            <ReviewStars rating={4.5} />
                            <p className="text-white text-sm">4.57 | 1034 оцінки</p>
                        </div>

                        {/* Shipping Info */}
                        <p className="text-white text-center text-sm">
                            🚚 Доставка наложеним платежем за тарифами Нової Пошти
                        </p>

                        {/* Divider */}
                        <hr className="w-full h-[4px] bg-orange-600 border-none rounded-full" />

                        {/* Price */}
                        <PriceTag current={520} old={699} currency="грн" size="md" />

                        {/* CTA */}
                        <CTAButton label="Order now" size="md" fullWidth />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FloorLampRGB;