import React from 'react';
import { supportedLanguages, languages, type Language } from '@/i18n/ui';
import { getLangFromUrl } from '@/i18n/utils';
import { getEquivalentPage } from '@/utils/localized-routes';
import DropdownButton from './DropdownButton';

interface LanguageSwitcherProps {
    currentPath?: string;
    initialLocale?: Language;
}

export default function LanguageSwitcher({ currentPath, initialLocale }: LanguageSwitcherProps) {
    const [currentLang, setCurrentLang] = React.useState<Language>(initialLocale || 'en');

    // Get language name in its native language
    const getNativeLanguageName = (lang: Language): string => {
        return languages[lang];
    };

    // Get language name in current language
    const getLanguageNameInCurrent = (lang: Language): string => {
        const langNames = {
            es: { es: 'Español', en: 'Inglés', no: 'Noruego' },
            en: { es: 'Spanish', en: 'English', no: 'Norwegian' },
            no: { es: 'Spansk', en: 'Engelsk', no: 'Norsk' }
        };
        return langNames[currentLang][lang];
    };

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

        // Use the pages dictionary to get the correct equivalent page for each language
        return supportedLanguages.map((lang) => ({
            lang,
            url: getEquivalentPage(pathname, lang)
        }));
    }, [currentPath]);

    const handleLanguageSwitch = (lang: Language, url: string) => {
        if (typeof window !== 'undefined') {
            // Save language choice to localStorage
            localStorage.setItem('langChoice', lang);
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
        <div>
            {supportedLanguages.map((lang) => {
                const url = alternateUrls.find(alt => alt.lang === lang)?.url || '/';
                return (
                    <button
                        key={lang}
                        type="button"
                        onClick={() => handleLanguageSwitch(lang, url)}
                        className={`w-full px-1 py-0.5 text-left focus:outline-none block cursor-pointer relative z-10 ${
                            lang === currentLang ? 'bg-main text-secondary' : 'bg-secondary text-main hover:bg-main hover:text-secondary'
                        }`}
                        style={{ minHeight: '32px' }}
                    >
                        <div className="flex items-center gap-0 pointer-events-none">
                            <div className="flex-1 px-1 py-1 pointer-events-none select-none">
                                <div className="font-mono text-xs font-semibold">
                                    {getNativeLanguageName(lang)}
                                </div>
                                <div className="font-mono text-xs opacity-70 mt-0.5" style={{ fontSize: '10px' }}>
                                    {getLanguageNameInCurrent(lang)}
                                </div>
                            </div>
                            <div className="w-4 h-4 flex items-center justify-center pointer-events-none">
                                {lang === currentLang && (
                                    <svg
                                        className="w-4 h-4 pointer-events-none"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <polyline points="20,6 9,17 4,12" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );

    return (
        <DropdownButton
            onMainClick={nextLanguage}
            dropdownContent={dropdownContent}
            className="w-7 h-7 @6xl:w-auto @6xl:h-8"
        >
            <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-main group-hover:text-secondary capitalize">
                    {getNativeLanguageName(currentLang)}
                </span>
            </div>
        </DropdownButton>
    );
}
