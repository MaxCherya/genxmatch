import { useTranslation } from "react-i18next";
import { Trans } from 'react-i18next';

// styles
import '../../components/styles/AnimatedBGGradient.css'

// components
import BubbleBackground from '../../components/bg/BubbleGradient/BubbleGradient';
import LanguageSwitcher from '../../components/general/LanguageSwitcher';
import LiveVisitorsCounter from '../../components/item-page/LiveVisitorsCounter';
import HeroImagesCarousel from '../../components/imgs/HeroImagesCarousel/HeroImagesCarousel';
import PriceTag from '../../components/item-page/PriceTag';
import CTAButton from '../../components/btns/CTAButton';
import ReviewStars from '../../components/item-page/ReviewStars';
import FeatureCard from "../../components/item-page/FeatureCard";
import SpecItem from "../../components/item-page/SpecItem";


const FloorLampRGB: React.FC = () => {

    const { t } = useTranslation();

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
        <div className="relative w-full min-h-screen h-auto overflow-x-hidden bg-black">
            {/* Live Viewers */}
            <div className="fixed bottom-4 right-8 overflow-x-hidden z-50">
                <LiveVisitorsCounter min={10} max={30} refreshInterval={5} size="sm" theme="dark" />
            </div>

            {/* Language Switcher */}
            <div className="absolute top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>

            <div className="relative w-full z-10 flex flex-col">
                {/* Background */}
                <BubbleBackground className="fixed inset-0 h-screen w-screen pointer-events-none" />
                {/* Hero Section */}
                <div className="w-full flex flex-col lg:flex-row items-center justify-center px-4 py-8 gap-10 min-h-screen">
                    <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-10">

                        {/* Left: Image Carousel */}
                        <div className="w-[90svw] xs:w-1/2 flex justify-center">
                            <HeroImagesCarousel visibleCount={5} images={productImagesHero} />
                        </div>

                        {/* Right: Product Info */}
                        <div className="w-[90svw] xs:w-1/2 rounded-2xl bg-[#111] max-w-xl p-6 flex flex-col gap-4 shadow-lg">
                            {/* Title */}
                            <h1 className="text-orange-500 text-xl sm:text-3xl font-semibold text-center leading-snug">
                                <Trans i18nKey="corner_floor_light_lamp_name" components={{ br: <br /> }} />
                            </h1>

                            {/* Divider */}
                            <hr className="w-full h-[4px] bg-orange-600 border-none rounded-full" />

                            {/* Rating */}
                            <div className="flex items-center justify-center gap-3">
                                <ReviewStars rating={4.5} />
                                <p className="text-white text-sm">4.57 | 1034 {t('ratings')}</p>
                            </div>

                            {/* Shipping Info */}
                            <p className="text-white text-center text-sm">
                                🚚 {t('delivery_by_new_post_with_their_prices')}
                            </p>

                            {/* Divider */}
                            <hr className="w-full h-[4px] bg-orange-600 border-none rounded-full" />

                            {/* Price */}
                            <PriceTag current={589} old={899} currency={t('uah')} size="md" />

                            {/* CTA */}
                            <CTAButton size="md" fullWidth />
                        </div>
                    </div>
                </div>
                <div className="w-full bg-white py-12 flex flex-col items-center px-4 text-black">

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
                        Характеристики та особливості
                    </h2>

                    {/* Feature Highlights */}
                    <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <FeatureCard icon="💡" title="Регулювання яскравості" />
                        <FeatureCard icon="🎵" title="Синхронізація з музикою" />
                        <FeatureCard icon="🎨" title="RGB-кольори з пульта" />
                    </div>

                    {/* Divider */}
                    <hr className="w-full max-w-3xl h-[3px] bg-black border-none rounded-full mb-12" />

                    {/* Technical Specs */}
                    <div className="w-full max-w-3xl bg-gray-100 rounded-xl p-6 sm:p-8 shadow-md space-y-4">
                        <SpecItem label="Матеріал" value="Метал" />
                        <SpecItem label="Стиль" value="Мінімалістичний" />
                        <SpecItem label="Колір" value="Чорний" />
                        <SpecItem label="Форма" value="Кутова" />
                        <SpecItem label="Висота" value="1.2 м" />
                        <SpecItem label="Потужність" value="30 Вт" />
                        <SpecItem label="Світлодіоди" value="90 шт" />
                        <SpecItem label="Управління" value="Пульт ДУ" />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default FloorLampRGB;