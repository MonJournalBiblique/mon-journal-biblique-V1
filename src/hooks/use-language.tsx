import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/i18n/config';

interface LanguageState {
  language: string;
  setLanguage: (language: string) => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },
    }),
    {
      name: 'language-storage',
    }
  )
);