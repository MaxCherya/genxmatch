import { useTranslation } from "react-i18next";
import { Trans } from 'react-i18next';
import { motion } from "framer-motion";
import { Element, scroller } from 'react-scroll';

// styles
import '../../components/styles/AnimatedBGGradient.css'

// components
import BubbleBackground from '../../components/bg/BubbleGradient/BubbleGradient';
import LiveVisitorsCounter from '../../components/item-page/LiveVisitorsCounter';
import HeroImagesCarousel from '../../components/imgs/HeroImagesCarousel/HeroImagesCarousel';
import PriceTag from '../../components/item-page/PriceTag';
import CTAButton from '../../components/btns/CTAButton';
import ReviewStars from '../../components/item-page/ReviewStars';
import SpecItem from "../../components/item-page/SpecItem";
import ReviewSlider from "../../components/item-page/ReviewSlider";
import OrderForm from "../../components/order-form/OrderForm";
import FeatureSection from "../../components/item-page/FeaturesSection";
import PicturesSlider from "../../components/item-page/PicturesSlider";
import DeliveryInfo from "../../components/infos/DeliveryInfo";
import ScrollProgressCircle from "../../components/general/ScrollProgressCircle";

interface Props {
    setIsFullscreen?: (value: boolean) => void;
    isFullscreen?: boolean;
}

const FloorLampRGB: React.FC<Props> = ({ setIsFullscreen, isFullscreen = false }) => {

    const { t } = useTranslation();

    const productOldPrice: number = 899;
    const productNewPrice: number = 589;

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

    console.log(productImages)

    const productImagesWide = [
        { src: 'https://ae01.alicdn.com/kf/S93e21a9ca1774d1ca5569c9f9c4e2c4bH.jpg', alt: "Image 5" },
        { src: 'https://ae01.alicdn.com/kf/S9952a643f0bf41279f3482ce245ed31d2.png', alt: "Image 4" },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223073_napolnaya-uglovaya-rgb.jpg', alt: 'Image 1' },
        { src: 'https://ae01.alicdn.com/kf/Sc3267ad41343454aa4b8ecc626ad1427d.jpg', alt: 'Image 9' },
    ]

    const productImagesHero = [
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/ezgif.com-video-to-gif_1_480x480_60688bf3-472c-47e1-8e42-867b36901351_480x480.webp', alt: 'Hero 1' },
        { src: 'https://ae01.alicdn.com/kf/S368465b6141c497ca587779956652da7j.jpg', alt: 'Hero 2' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223073_napolnaya-uglovaya-rgb.jpg', alt: 'Hero 3' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223071_napolnaya-uglovaya-rgb.jpg', alt: 'Hero 4' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223075_napolnaya-uglovaya-rgb.jpg', alt: 'Hero 5' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223074_napolnaya-uglovaya-rgb.jpg', alt: 'Hero 6' },
        { src: 'https://ae01.alicdn.com/kf/Sc3267ad41343454aa4b8ecc626ad1427d.jpg', alt: 'Hero 7' },
    ]

    const reviews = [
        { name: "Олександр К.", rating: 5, text: "Дуже стильна лампа! Ідеально доповнила мій ігровий сетап. Яскравість і кольори — супер!", avatar: "https://i.pravatar.cc/150?img=3" },
        { name: "Марина Л.", rating: 4, text: "Гарна лампа, створює затишну атмосферу ввечері. Трохи не вистачає мобільного додатку.", avatar: "https://i.pravatar.cc/150?img=5" },
        { name: "Ігор С.", rating: 5, text: "Люблю, як вона синхронізується з музикою! Проста в керуванні та дуже ефектна в кімнаті.", avatar: "https://i.pravatar.cc/150?img=12" },
        { name: "Наталя Р.", rating: 4.5, text: "Мінімалістичний дизайн ідеально вписався в інтер’єр. Дуже задоволена!", avatar: "https://i.pravatar.cc/150?img=47" },
        { name: "Денис П.", rating: 5, text: "Виглядає круто, легко зібрати. Часто використовую як нічник." },
        { name: "Аліна Ж.", rating: 5, text: "Обожнюю зміну кольорів! Дуже приємне світло і зручно керувати.", avatar: "https://i.pravatar.cc/150?img=53" },
        { name: "Влад М.", rating: 4, text: "Монтаж швидкий, пульт працює чітко. Хотілось би ще мобільний застосунок." },
        { name: "Катерина Б.", rating: 5, text: "Подарувала хлопцю — не відпускає її з рук 😄 реально крута річ!", avatar: "https://i.pravatar.cc/150?img=9" },
        { name: "Роман І.", rating: 4.5, text: "Світить потужно, якісна збірка. Трохи зависокий кабель, але не критично." },
        { name: "Інна Ч.", rating: 5, text: "Ідеальна для вечірніх фільмів! Атмосфера просто вау 🌈", avatar: "https://i.pravatar.cc/150?img=21" },
        { name: "Тарас Н.", rating: 5, text: "Міксуємо кольори під настрій. Особливо круто виглядає з музикою!" },
        { name: "Юлія С.", rating: 4.5, text: "Купила як декор — вийшло краще, ніж очікувала. Легка, але стабільна.", avatar: "https://i.pravatar.cc/150?img=36" },
        { name: "Максим Г.", rating: 5, text: "Працює чудово. Більше не уявляю кімнату без неї." }
    ]

    const features = [
        { header: t('brightness_regulation'), description: t('brightness_regulation_description') },
        { header: t('sync_with_music'), description: t('sync_with_music_description') },
        { header: t('rgb_colors_from_remote'), description: t('rgb_colors_from_remote_description') },
        { header: t('stylish_design'), description: t('stylish_design_description') }
    ]

    const productVideo = 'https://gv-vod-cdn.aliexpress-media.com/ae_sg_gmc/video_target/gv91-2bfa8819-a1d168e5-91275174-506d/trans/2ee6bd40-6019-4f21-956d-2bcd8290e2e9-hd.mp4?auth_key=1742898115-0-0-aa5455236668eea2a605c9f4bad4f077'

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-black">
            {/* Live Viewers */}
            {!isFullscreen ?
                <div className="fixed bottom-4 right-4 overflow-x-hidden z-50">
                    <LiveVisitorsCounter min={10} max={30} refreshInterval={5} size="sm" theme="dark" />
                </div>
                : null}

            <ScrollProgressCircle isFullscreen={isFullscreen} />


            <div className="relative w-full z-10 flex flex-col">
                {/* Background */}
                <BubbleBackground className="fixed inset-0 h-screen w-screen pointer-events-none" />
                {/* Hero Section */}
                <div className="xl:flex-row mt-4 sm:mt-7 xl:mt-7 px-4 py-8 min-h-screen flex flex-col justify-center">
                    <div className="w-full flex flex-col xl:flex-row gap-4 xl:gap-12 items-center justify-center">

                        {/* Left: Image Carousel */}
                        <div className="xs:w-1/2 flex justify-center">
                            <HeroImagesCarousel images={productImagesHero} setIsFullscreen={setIsFullscreen} />
                        </div>

                        {/* Right: Product Info */}
                        <div className="w-full xs:w-1/2 mt-4 xl:mt-0 xl:min-h-[500px] max-w-2xl p-2 py-4 sm:p-4 rounded-3xl bg-gradient-to-b from-orange-950/30 to-orange-900/30 shadow-xl flex flex-col xl:justify-evenly gap-2 sm:gap-3">

                            {/* Title */}
                            <h1 className="text-orange-400 text-2xl sm:text-4xl font-bold text-center leading-snug tracking-tight mb-2">
                                <Trans i18nKey="corner_floor_light_lamp_name" components={{ br: <br /> }} />
                            </h1>

                            {/* Divider */}
                            <div className="w-20 h-1 rounded-full mx-auto bg-orange-500 mb-2" />

                            {/* Short Description */}
                            <p className="text-stone-400 text-center text-sm max-w-full xl:max-w-[90%] self-center mb-2">
                                <p>{t('description_floor_rgb_lamp_short')}</p>
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
                                <p className="text-stone-300/90 text-sm">4.93 | 1034 {t('ratings')}</p>
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
                            {t('description_floor_rgb_lamp_part_1')}
                        </motion.p >
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ margin: '-15%' }}
                            className="text-gray-500 mb-12"
                        >
                            {t('description_floor_rgb_lamp_part_2')}
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
                        <SpecItem label={t('material')} value={t('metal')} />
                        <SpecItem label={t('style')} value={t('minimalist')} />
                        <SpecItem label={t('color')} value={t('black')} />
                        <SpecItem label={t('shape')} value={t('corner_shape')} />
                        <SpecItem label={t('height')} value={`1.2 ${t('m')}`} />
                        <SpecItem label={t('power')} value={`30 ${t('W')}`} />
                        <SpecItem label={t('leds')} value={`90 ${t('pcs')}`} />
                        <SpecItem label={t('control')} value={t('remote_control')} />
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
                        className="w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl mb-12"
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
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-auto rounded-xl"
                        >
                            <source src={productVideo} type="video/mp4" />
                            {t('your_browser_does_not_support_video_tag')}
                        </video>
                    </motion.div>

                </div>

                <div className="w-full bg-white py-12 px-4 text-black flex flex-col items-center">
                    <div className="w-full max-w-3xl bg-white py-12 px-4 text-black">
                        <FeatureSection features={features} />
                    </div>
                </div>

                <div className="relative w-screen h-screen bg-black text-black overflow-hidden flex flex-col items-center justify-center">
                    <PicturesSlider asBG={true} images={productImagesWide} />
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
                                itemLength={120}
                                itemHeight={10}
                                itemWeight={3}
                                itemWidth={10}
                                itemAntopometryWarning
                                productId={1}
                                productName={<Trans i18nKey="corner_floor_light_lamp_name" components={{ br: <br /> }} />}
                                productImage={productImagesHero[0].src}
                                oldPrice={productOldPrice}
                                currentPrice={productNewPrice}
                                theme="dark"
                            />
                        </Element>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default FloorLampRGB;