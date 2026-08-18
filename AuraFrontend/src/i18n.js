import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import az from './locales/az.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      az: { translation: az },
      ru: { translation: ru },
      en: { translation: en },
    },
    fallbackLng: 'az',
    lng: localStorage.getItem('i18nextLng') || 'az',
    debug: false,
    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  });

export default i18n;
