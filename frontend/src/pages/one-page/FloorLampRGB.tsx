// styles
import '../../components/styles/AnimatedBGGradient.css'

// components
import BubbleBackground from '../../components/bg/BubbleGradient/BubbleGradient';
import LanguageSwitcher from '../../components/general/LanguageSwitcher';
import LiveVisitorsCounter from '../../components/item-page/LiveVisitorsCounter';

const FloorLampRGB: React.FC = () => {
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
            </div>
        </div>
    )
}

export default FloorLampRGB;