import { useTranslation } from "react-i18next";
import './NotFound.css'

const NotFound: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-black w-screen h-screen flex flex-col items-center justify-center p-2">
            <h1 className="text-white text-9xl">404</h1>
            <p className="text-white">{t('404_not_found')}</p>
        </div>
    );
};

export default NotFound;