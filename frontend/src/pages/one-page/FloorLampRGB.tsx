// styles
import '../../components/styles/AnimatedBGGradient.css'

// components
import BubbleBackground from '../../components/bg/BubbleGradient/BubbleGradient';
import LanguageSwitcher from '../../components/general/LanguageSwitcher';
import LiveVisitorsCounter from '../../components/item-page/LiveVisitorsCounter';
import ProductHeroImages from '../../components/imgs/ProductHeroImages/ProductHeroImages';
import HeroImagesCarousel from '../../components/imgs/HeroImagesCarousel/HeroImagesCarousel';

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
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223075_napolnaya-uglovaya-rgb.jpg', alt: 'Image 5' },
        { src: 'https://zima.com.ua/wp-content/uploads/2024/12/6423223074_napolnaya-uglovaya-rgb.jpg', alt: 'Image 6' },
    ]

    return (
        <div className='overflow-hidden'>

            <div className="absolute bottom-4 right-4 transform z-10">
                <LiveVisitorsCounter min={10} max={30} refreshInterval={5} size="sm" theme="dark" />
            </div>

            <div className="absolute top-4 right-4 z-10">
                <LanguageSwitcher />
            </div>

            <div className="w-screen h-screen relative flex flex-row items-center justify-center">
                <BubbleBackground />
                <HeroImagesCarousel images={productImagesHero} />
            </div>
        </div>
    )
}

export default FloorLampRGB;