import * as React from 'react';
import { translations, type TranslationKey } from '@/i18n/translations';
import { type Locale, defaultLocale } from '@/utils/i18n';

const { useState, useEffect } = React;

export function useTranslation(initialLocale: Locale = defaultLocale) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
        document.documentElement.setAttribute('data-locale', newLocale);
        
        // Dispatch custom event for other components to listen
        window.dispatchEvent(new CustomEvent('localeChanged', { detail: newLocale }));
    };

    const t = (key: TranslationKey): string => {
        const validLocale = locale in translations ? locale : defaultLocale;
        return translations[validLocale][key] || translations[defaultLocale][key] || key;
    };

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as Locale;
        if (savedLocale && savedLocale !== locale) {
            setLocaleState(savedLocale);
        }

        const handleLocaleChange = (event: CustomEvent<Locale>) => {
            setLocaleState(event.detail);
        };

        window.addEventListener('localeChanged', handleLocaleChange as EventListener);
        
        return () => {
            window.removeEventListener('localeChanged', handleLocaleChange as EventListener);
        };
    }, []);

    return { locale, setLocale, t };
}