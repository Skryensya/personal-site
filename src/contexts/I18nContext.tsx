import * as React from 'react';
import { translations, type TranslationKey } from '@/i18n/translations';
import { locales, type Locale, defaultLocale } from '@/utils/i18n';

const { createContext, useContext, useState, useEffect } = React;

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
    children: React.ReactNode;
    initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale = defaultLocale }: I18nProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
        document.documentElement.setAttribute('data-locale', newLocale);
    };

    const t = (key: TranslationKey): string => {
        const validLocale = locale in translations ? locale : defaultLocale;
        return translations[validLocale][key] || translations[defaultLocale][key] || key;
    };

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as Locale;
        if (savedLocale && locales.includes(savedLocale) && savedLocale !== locale) {
            setLocaleState(savedLocale);
        }
        document.documentElement.setAttribute('data-locale', locale);
    }, [locale]);

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}