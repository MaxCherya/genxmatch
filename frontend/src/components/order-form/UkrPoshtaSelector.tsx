import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

type Props = {
    theme?: 'light' | 'dark';
    index: string;
    setIndex: (value: string) => void;
    city: string;
    setCity: (value: string) => void;
    patronymic: string;
    setPatronymic: (value: string) => void;
};

const UkrPoshtaSelector: React.FC<Props> = ({
    theme = 'light',
    index,
    setIndex,
    city,
    setCity,
    patronymic,
    setPatronymic
}) => {
    const { t } = useTranslation();

    const themeStyles = {
        light: {
            input: 'bg-gray-100 border-gray-300 text-black placeholder-gray-500',
        },
        dark: {
            input: 'bg-gray-800 border-gray-700 text-white placeholder-gray-400',
        },
    };

    const currentTheme = themeStyles[theme];

    return (
        <div className="space-y-6 bg-neutral-900 p-4">
            {/* Patronymic */}
            <div>
                <label className="block font-medium mb-1">
                    {t('patronymic')} <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    className={clsx(
                        'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                        currentTheme.input
                    )}
                    placeholder={t('enter_patronymic')}
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
                />
            </div>

            <div className="w-full p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md shadow-sm mb-4 text-sm">
                <p>
                    {t('your_patronymic_required_by_delivery_company')}
                </p>
            </div>

            {/* Zip Code */}
            <div>
                <label className="block font-medium mb-1">
                    {t('zip_code')} <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    className={clsx(
                        'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                        currentTheme.input
                    )}
                    placeholder={t('enter_zip_code')}
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                />
            </div>

            {/* City */}
            <div>
                <label className="block font-medium mb-1">
                    {t('city')} <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    className={clsx(
                        'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500',
                        currentTheme.input
                    )}
                    placeholder={t('enter_city_name')}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
        </div>
    );
};

export default UkrPoshtaSelector;