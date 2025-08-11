import * as React from 'react';
import { supportedLanguages, languages, type Language } from '@/i18n/ui';
import { getLangFromUrl, getAlternateUrls, addLocaleToUrl, removeLocaleFromUrl } from '@/i18n/utils';
import DropdownButton, { DropdownItem } from './DropdownButton';

interface LanguageSwitcherProps {
    currentPath?: string;
    initialLocale?: Language;
}

export default function LanguageSwitcher({ currentPath, initialLocale }: LanguageSwitcherProps) {
    const [currentLang, setCurrentLang] = React.useState<Language>(initialLocale || 'es');

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const lang = getLangFromUrl(new URL(window.location.href));
            setCurrentLang(lang);
        }
    }, []);

    const alternateUrls = React.useMemo(() => {
        let pathname = '';
        if (typeof window !== 'undefined') {
            pathname = window.location.pathname;
        } else if (currentPath) {
            pathname = currentPath;
        }

        // Handle project-specific routing
        const isProjectPage = pathname.includes('/projects/');
        if (isProjectPage) {
            // For project pages, we need to ensure the project exists in all languages
            // Use the same slug but different language prefix
            const cleanPath = removeLocaleFromUrl(pathname);
            return supportedLanguages.map((lang) => ({
                lang,
                url: addLocaleToUrl(cleanPath, lang)
            }));
        }

        // Default behavior for other pages
        return getAlternateUrls(pathname);
    }, [currentPath]);

    const handleLanguageSwitch = (lang: Language, url: string) => {
        if (typeof window !== 'undefined') {
            window.location.href = url;
        }
    };

    const nextLanguage = () => {
        const currentIndex = supportedLanguages.findIndex(lang => lang === currentLang);
        const nextIndex = (currentIndex + 1) % supportedLanguages.length;
        const nextLang = supportedLanguages[nextIndex];
        const url = alternateUrls.find(alt => alt.lang === nextLang)?.url || '/';
        handleLanguageSwitch(nextLang, url);
    };

    const dropdownContent = (
        <>
            {supportedLanguages.map((lang) => {
                const url = alternateUrls.find(alt => alt.lang === lang)?.url || '/';
                return (
                    <DropdownItem
                        key={lang}
                        selected={lang === currentLang}
                        onClick={() => handleLanguageSwitch(lang, url)}
                        className="font-mono text-xs font-semibold uppercase tracking-wider"
                    >
                        {languages[lang]}
                    </DropdownItem>
                );
            })}
        </>
    );

    return (
        <DropdownButton
            onMainClick={nextLanguage}
            dropdownContent={dropdownContent}
            className="w-7 h-7 @6xl:w-auto @6xl:h-8 font-mono text-xs font-semibold uppercase tracking-wider"
        >
            <span className="text-main group-hover:text-secondary">
                {currentLang.toUpperCase()}
            </span>
        </DropdownButton>
    );
}
