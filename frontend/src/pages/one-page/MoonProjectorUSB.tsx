import { useTranslation } from "react-i18next";
import { useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { scroller, Element } from 'react-scroll';

import BubbleBackground from "../../components/bg/BubbleGradient/BubbleGradient";
import CTAButton from "../../components/btns/CTAButton";
import HeroImagesCarousel from "../../components/imgs/HeroImagesCarousel/HeroImagesCarousel";
import LiveVisitorsCounter from "../../components/item-page/LiveVisitorsCounter";
import PriceTag from "../../components/item-page/PriceTag";
import ReviewStars from "../../components/item-page/ReviewStars";
import SpecItem from "../../components/item-page/SpecItem";
import FeatureSection from "../../components/item-page/FeaturesSection";
import PicturesSlider from "../../components/item-page/PicturesSlider";
import DeliveryInfo from "../../components/infos/DeliveryInfo";
import ReviewSlider from "../../components/item-page/ReviewSlider";
import ScrollProgressCircle from "../../components/general/ScrollProgressCircle";
import OrderForm from "../../components/order-form/OrderForm";
import VideoPlayer from "../../components/item-page/VideoPlayer";

interface Props {
    setIsFullscreen?: (value: boolean) => void;
    isFullscreen?: boolean;
}

const MoonProjectorUSB: React.FC<Props> = ({ setIsFullscreen, isFullscreen = false }) => {

    const { t } = useTranslation();

    const productOldPrice: number = 459;
    const productNewPrice: number = 399;

    const videoRef = useRef<HTMLVideoElement>(null);

    const features = [
        { header: t('moon_projector_usb.feature_1'), description: t('moon_projector_usb.feature_1_d') },
        { header: t('moon_projector_usb.feature_2'), description: t('moon_projector_usb.feature_2_d') },
        { header: t('moon_projector_usb.feature_3'), description: t('moon_projector_usb.feature_3_d') },
        { header: t('moon_projector_usb.feature_4'), description: t('moon_projector_usb.feature_4_d') }
    ]

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return; // Exit early if video is null
        const handleTimeUpdate = () => {
            if (video.currentTime >= 21) {
                video.currentTime = 0;
            }
        };
        video.addEventListener('timeupdate', handleTimeUpdate);
        // Cleanup: remove the event listener when the component unmounts
        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    const productVideo = 'https://video.aliexpress-media.com/play/u/ae_sg_item/2214326458297/p/1/e/6/t/10301/1100071872771.mp4?from=chrome&definition=h265'

    const productImagesHero = [
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6403242846_luna-lunnyj-proektor.jpg', alt: 'Hero 1' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6403242837_luna-lunnyj-proektor.jpg', alt: 'Hero 2' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6403242838_luna-lunnyj-proektor.jpg', alt: 'Hero 3' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6403242849_luna-lunnyj-proektor.jpg', alt: 'Hero 4' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6403242882_luna-lunnyj-proektor.jpg', alt: 'Hero 5' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6403242877_luna-lunnyj-proektor.jpg', alt: 'Hero 6' },
    ]

    const productImageswide = [
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6403242846_luna-lunnyj-proektor.jpg', alt: 'Wide 1' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6403242849_luna-lunnyj-proektor.jpg', alt: 'Wide 2' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6403242882_luna-lunnyj-proektor.jpg', alt: 'Wide 3' },
    ]

    const reviews = [
        {
            name: "Олександр Т.",
            rating: 5,
            text: "Чудовий місячний проєктор! Створює неймовірно затишну атмосферу в спальні. Яскравість регулюється ідеально.",
            avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
            name: "Марія К.",
            rating: 4,
            text: "Гарний нічник, проекція Місяця виглядає дуже реалістично. Хотілося б трішки довший кабель USB.",
            avatar: "https://i.pravatar.cc/150?img=5"
        },
        {
            name: "Дмитро Л.",
            rating: 5,
            text: "Обожнюю цей проєктор! Увечері вмикаю, і кімната перетворюється на космос. Дуже простий у використанні.",
            avatar: "https://i.pravatar.cc/150?img=12"
        },
        {
            name: "Софія М.",
            rating: 4.5,
            text: "Стильний і компактний, ідеально вписався в мою кімнату. Проєкція Місяця заспокоює перед сном.",
            avatar: "https://i.pravatar.cc/150?img=47"
        },
        {
            name: "Артем В.",
            rating: 5,
            text: "Класна річ! Використовую як нічник, світло м’яке і приємне. Дуже задоволений покупкою."
        },
        {
            name: "Олена П.",
            rating: 5,
            text: "Місячне світло виглядає магічно! Дітям подобається, засинають швидше. Зручно, що на USB.",
            avatar: "https://i.pravatar.cc/150?img=53"
        },
        {
            name: "Іван Д.",
            rating: 4,
            text: "Проєктор супер, атмосфера в кімнаті казкова. Трохи незручно, що немає таймера вимкнення."
        },
        {
            name: "Анастасія Р.",
            rating: 5,
            text: "Подарувала подрузі, вона в захваті! Місяць на стелі виглядає неймовірно, рекомендую!",
            avatar: "https://i.pravatar.cc/150?img=9"
        },
        {
            name: "Микола С.",
            rating: 4.5,
            text: "Якість відмінна, світло приємне. Компактний, не займає багато місця. Хотів би пульт для зручності."
        },
        {
            name: "Вікторія З.",
            rating: 5,
            text: "Це просто вау! Вечірня релаксація з проекцією Місяця — найкраще завершення дня.",
            avatar: "https://i.pravatar.cc/150?img=21"
        },
        {
            name: "Павло Б.",
            rating: 5,
            text: "Крутий нічник, додає затишку. Легко підключити, проекція чітка і красива."
        },
        {
            name: "Юлія Н.",
            rating: 4.5,
            text: "Купила для дитячої кімнати, виглядає чарівно. Дуже легкий і зручний у використанні.",
            avatar: "https://i.pravatar.cc/150?img=36"
        },
        {
            name: "Ростислав Г.",
            rating: 5,
            text: "Місяць на стелі — це щось! Працює без нарікань, ідеально для вечірнього відпочинку."
        }
    ];

    return (
        <div className="relative w-full min-h-screen overflow-hidden">

            <ScrollProgressCircle isFullscreen={isFullscreen} />

            {!isFullscreen ?
                <div className="fixed bottom-4 right-4 overflow-x-hidden z-50">
                    <LiveVisitorsCounter min={10} max={30} refreshInterval={5} size="sm" theme="dark" />
                </div>
                : null}

            <div className="relative w-full min-h-screen z-10 flex flex-col">
                <BubbleBackground className="fixed inset-0 min-h-[200svh] w-screen pointer-events-none" />
                {/* Hero */}
                <div className="xl:flex-row mt-4 sm:mt-7 xl:mt-10 px-4 py-8 min-h-screen flex flex-col justify-center">

                    <div className="w-full flex flex-col xl:flex-row gap-4 xl:gap-12 items-center justify-center">

                        {/* Left */}
                        <div className="xs:w-1/2 flex justify-center">
                            <HeroImagesCarousel images={productImagesHero} setIsFullscreen={setIsFullscreen} />
                        </div>

                        {/* Right: Product Info */}
                        <div className="w-full xs:w-1/2 mt-4 xl:mt-0 xl:min-h-[500px] max-w-2xl p-2 py-4 sm:p-4 rounded-3xl bg-gradient-to-b from-orange-950/30 to-orange-900/30 shadow-xl flex flex-col xl:justify-evenly gap-2 sm:gap-3">

                            {/* Title */}
                            <h1 className="text-orange-400 text-2xl sm:text-4xl font-bold text-center leading-snug tracking-tight mb-2">
                                {t('moon_projector_usb.name')}
                            </h1>

                            {/* Divider */}
                            <div className="w-20 h-1 rounded-full mx-auto bg-orange-500 mb-2" />

                            {/* Short Description */}
                            <p className="text-stone-400 text-center text-sm max-w-full xl:max-w-[90%] self-center mb-2">
                                <p>{t('moon_projector_usb.short_description')}</p>
                            </p>

                            {/* Divider */}
                            <div className="w-20 h-1 rounded-full mx-auto bg-orange-500 mb-2" />

                            {/* Price */}
                            <PriceTag
                                current={productNewPrice}
                                old={productOldPrice}
                                currency={t('uah')}
                                size="md"
                            />

                            {/* Rating */}
                            <div className="flex items-center justify-center gap-3">
                                <ReviewStars rating={4.5} size="sm" />
                                <p className="text-stone-300/90 text-sm">4.87 | 341 {t('ratings')}</p>
                            </div>

                            {/* CTA */}
                            <div className="mt-4">
                                <CTAButton onClick={() =>
                                    scroller.scrollTo('orderFormSection', {
                                        duration: 800,
                                        delay: 0,
                                        smooth: 'easeInOutQuart',
                                        offset: -20 // Optional: adjust for spacing
                                    })
                                } size="md" fullWidth />
                            </div>
                        </div>

                    </div>
                </div>


                <div className="w-full bg-white py-12 flex flex-col items-center px-4 text-black">

                    {/* Title */}
                    <motion.h2
                        initial={{
                            opacity: 0,
                        }}
                        whileInView={{
                            opacity: 1,
                        }}
                        viewport={{
                            margin: '-10%'
                        }}
                        className="text-3xl sm:text-4xl font-bold text-center mb-12">
                        {t('specifications_and_features')}
                    </motion.h2>

                    <div
                        className="h-auto max-w-3xl">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ margin: '-15%' }}
                            className="text-gray-500 mb-4"
                        >
                            {t('moon_projector_usb.description_part_1')}
                        </motion.p >
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ margin: '-15%' }}
                            className="text-gray-500 mb-12"
                        >
                            {t('moon_projector_usb.description_part_2')}
                        </motion.p >
                    </div>

                    {/* Divider */}
                    <hr className="w-full max-w-3xl h-[3px] bg-black border-none rounded-full mb-12" />

                    {/* Technical Specs */}
                    <motion.div
                        className="w-full max-w-3xl bg-gray-100 rounded-xl p-6 sm:p-8 shadow-md space-y-4"
                        initial={{
                            opacity: 0,
                            y: 30,
                            filter: 'blur(6px)',
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                        }}
                        transition={{
                            duration: 0.8,
                            ease: 'easeOut',
                        }}
                        viewport={{ margin: '-20%' }}
                    >
                        <SpecItem label={t('moon_projector_usb.effect_of_projection')} value={t('moon_projector_usb.moon')} />
                        <SpecItem label={t('moon_projector_usb.power')} value={t('moon_projector_usb.answer_power')} />
                        <SpecItem label={t('moon_projector_usb.light_source_power')} value={t('moon_projector_usb.light_source_power_answer')} />
                        <SpecItem label={t('moon_projector_usb.light_source_type')} value={t('moon_projector_usb.light_source_type_answer')} />
                        <SpecItem label={t('moon_projector_usb.protection_lvl')} value={t('moon_projector_usb.protection_lvl_answer')} />
                        <SpecItem label={t('moon_projector_usb.material')} value={t('moon_projector_usb.material_answer')} />
                        <SpecItem label={t('moon_projector_usb.range')} value={t('moon_projector_usb.range_answer')} />
                        <SpecItem label={t('moon_projector_usb.type_of_charge')} value={t('moon_projector_usb.type_of_charge_answer')} />
                    </motion.div>

                </div>

                <div className="w-full bg-black py-12 flex flex-col items-center px-4 text-black">
                    {/* Title */}
                    <motion.h2
                        initial={{
                            opacity: 0,
                        }}
                        whileInView={{
                            opacity: 1,
                        }}
                        viewport={{
                            margin: '-10%'
                        }}
                        className="text-3xl text-white sm:text-4xl font-bold text-center mb-12">
                        {t('video_demo')}
                    </motion.h2>

                    {/* Video */}
                    <motion.div
                        className="w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl mb-12 flex flex-col items-center"
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            filter: 'blur(8px)',
                        }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                            filter: 'blur(0px)',
                        }}
                        transition={{
                            duration: 1,
                            ease: 'easeOut',
                            delay: 0.1
                        }}
                        viewport={{ margin: '-20%' }}
                    >
                        <VideoPlayer muted poster='https://i.imgur.com/OAlh7X2.gif' loopUntil={21} src={productVideo} />
                    </motion.div>

                </div>

                <div className="w-full bg-white py-12 px-4 text-black flex flex-col items-center">
                    <div className="w-full max-w-3xl bg-white py-12 px-4 text-black">
                        <FeatureSection features={features} />
                    </div>
                </div>

                <div className="relative w-screen h-screen bg-black text-black overflow-hidden flex flex-col items-center justify-center">
                    <PicturesSlider asBG={true} images={productImageswide} />
                    <div className="w-3xl max-w-[95%] z-50">
                        <DeliveryInfo />
                    </div>
                </div>

                <div className="w-full bg-white py-12 px-4 text-black flex flex-col items-center">
                    <ReviewSlider reviews={reviews} />
                </div>

                <div className="w-full bg-black py-12 flex flex-col items-center px-4 text-white">
                    <div className="w-full max-w-xl space-y-4">
                        <Element name="orderFormSection">
                            <OrderForm
                                items={[
                                    {
                                        item_id: 34,
                                        name: t('moon_projector_usb.name'),
                                        alt: 'Moon Projector USB', // Add alt text for accessibility
                                        image: productImagesHero[0].src,
                                        currentPrice: productNewPrice,
                                        oldPrice: productOldPrice,
                                        itemLength: 0, // in cm
                                        itemWidth: 0, // in cm
                                        itemHeight: 0, // in cm
                                        itemWeight: 0, // in kg
                                    },
                                ]}
                                theme="dark"
                                itemAnthropometryWarning={false} // Explicitly set since not provided
                            />
                        </Element>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default MoonProjectorUSB;