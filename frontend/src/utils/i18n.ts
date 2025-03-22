import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationENG from '../locales/eng/translation.json';
import translationUKR from '../locales/ukr/translation.json';
import translationRUS from '../locales/rus/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            eng: { translation: translationENG },
            ukr: { translation: translationUKR },
            rus: { translation: translationRUS },
        },
        fallbackLng: 'ukr',
        supportedLngs: ['eng', 'ukr', 'rus'],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;