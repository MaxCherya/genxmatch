import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface LanguageSwitcherProps {
    isMobile?: boolean; // New prop to adjust behavior in mobile menu
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isMobile = false }) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'ukr', label: 'Українська', flag: '🇺🇦' },
        { code: 'eng', label: 'English', flag: '🇬🇧' },
        { code: 'rus', label: 'Русский', flag: '🇷🇺' },
    ];

    const handleSelect = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

    return (
        <div className="relative z-50 w-full">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full lg:w-36 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg text-white text-sm md:text-base font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className="flex items-center gap-2 truncate">
                    <span>{currentLanguage.flag}</span>
                    <span>{currentLanguage.label}</span>
                </span>
                <motion.svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0.8, y: isMobile ? 0 : -10 }}
                        animate={{ opacity: 1, scaleY: 1, y: 0 }}
                        exit={{ opacity: 0, scaleY: 0.8, y: isMobile ? 0 : -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={`w-full lg:w-36 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-xl overflow-hidden ${isMobile ? 'relative mt-2' : 'absolute top-full left-0 mt-2'
                            }`}
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-white/90 hover:text-white text-sm md:text-base bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-150 truncate"
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;