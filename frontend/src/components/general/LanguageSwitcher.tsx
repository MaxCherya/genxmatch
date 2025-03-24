import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'ukr', label: 'Українська' },
        { code: 'eng', label: 'English' },
        { code: 'rus', label: 'Русский' },
    ];

    const handleSelect = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800 text-white p-1 rounded text-sm w-28 max-w-full md:p-2 md:text-base md:w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
            >
                <span className="truncate">{currentLanguage.label}</span>
                <svg
                    className={`w-4 h-4 ml-2 transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-200`}
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-gray-800 rounded shadow-lg z-20 max-h-60 overflow-y-auto">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleSelect(lang.code)}
                            className="block w-full text-left px-4 py-2 text-white text-sm md:text-base hover:bg-gray-700 focus:outline-none focus:bg-gray-700 truncate"
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;