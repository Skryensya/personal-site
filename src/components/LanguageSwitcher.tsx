import * as React from 'react';
import { locales, type Locale, defaultLocale, addLocaleToUrl, removeLocaleFromUrl } from '@/utils/i18n';
import { getLoadingText } from '@/i18n/text-functions';
import DropdownButton, { DropdownItem } from './DropdownButton';

const { useState, useEffect, useCallback } = React;

interface LanguageSwitcherProps {
    initialLocale?: Locale;
}

const localeNames = {
    es: 'ESPAÑOL',
    en: 'ENGLISH', 
    no: 'NORSK'
} as const;

const localeCodes = {
    es: 'ES',
    en: 'EN',
    no: 'NO'
} as const;

export default function LanguageSwitcher({ initialLocale = defaultLocale }: LanguageSwitcherProps) {
    // Initialize with detected locale immediately to reduce loading time
    const [currentLocale, setCurrentLocale] = useState<Locale>(() => {
        if (typeof window !== 'undefined') {
            const urlPath = window.location.pathname;
            const [, possibleLocale] = urlPath.split('/');
            if (possibleLocale && locales.includes(possibleLocale)) {
                return possibleLocale as Locale;
            }
        }
        return initialLocale;
    });
    const [isMounted, setIsMounted] = useState(false);

    // Detect locale from URL before mounting  
    const getLocaleFromURL = (): Locale => {
        if (typeof window === 'undefined') return initialLocale;
        const urlPath = window.location.pathname;
        const [, possibleLocale] = urlPath.split('/');
        if (possibleLocale && locales.includes(possibleLocale)) {
            return possibleLocale as Locale;
        }
        return defaultLocale;
    };

    useEffect(() => {
        setIsMounted(true);
        // Quick sync check - only update if locale has changed
        const detectedLocale = getLocaleFromURL();
        if (detectedLocale !== currentLocale) {
            setCurrentLocale(detectedLocale);
        }
    }, [currentLocale]);

    // Navigate to language
    const navigateToLanguage = useCallback((newLocale: Locale) => {
        if (newLocale === currentLocale) return;
        
        const currentPath = window.location.pathname;
        const cleanPath = removeLocaleFromUrl(currentPath);
        const newUrl = addLocaleToUrl(cleanPath, newLocale);
        
        window.location.href = newUrl;
    }, [currentLocale]);

    // Cycle through languages (main button action)
    const nextLanguage = useCallback(() => {
        const currentIndex = locales.findIndex((l) => l === currentLocale);
        const nextIndex = (currentIndex + 1) % locales.length;
        const newLocale = locales[nextIndex] as Locale;
        navigateToLanguage(newLocale);
    }, [currentLocale, navigateToLanguage]);

    // Handle language selection from dropdown
    const handleLanguageSelect = (newLocale: Locale) => {
        navigateToLanguage(newLocale);
    };

    // Show minimal loading state - use actual current locale
    if (!isMounted) {
        return (
            <div className="w-7 h-7 md:w-auto md:h-8 bg-secondary border border-main flex items-center justify-center px-3 py-2">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-main">{localeCodes[currentLocale]}</span>
                </div>
            </div>
        );
    }

    return (
        <DropdownButton
            onMainClick={nextLanguage}
            dropdownContent={
                <div>
                    {locales.map((localeOption) => (
                        <DropdownItem
                            key={localeOption}
                            onClick={() => handleLanguageSelect(localeOption as Locale)}
                            selected={localeOption === currentLocale}
                            className="flex items-center gap-2 border-b border-main last:border-b-0"
                        >
                            <span className="flex-1 px-1 font-mono text-xs font-semibold">{localeNames[localeOption as keyof typeof localeNames]}</span>
                            <div className="w-4 h-4 flex items-center justify-center">
                                {localeOption === currentLocale && (
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                )}
                            </div>
                        </DropdownItem>
                    ))}
                </div>
            }
            className="w-7 h-7 md:w-auto md:h-8"
        >
            <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-main group-hover:text-secondary">{localeCodes[currentLocale]}</span>
            </div>
        </DropdownButton>
    );
}