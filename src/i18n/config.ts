import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  de: {
    translation: de,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en', // Default language
  ns: ['translation'],
  defaultNS: 'translation',
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;