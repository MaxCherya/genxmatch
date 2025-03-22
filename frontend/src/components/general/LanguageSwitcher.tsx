import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'ukr', label: 'Українська' },
        { code: 'eng', label: 'English' },
        { code: 'rus', label: 'Русский' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <select
            onChange={handleChange}
            value={i18n.language}
            className="bg-gray-800 text-white p-2 rounded"
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.label}
                </option>
            ))}
        </select>
    );
};

export default LanguageSwitcher;