import * as React from 'react';
import { supportedLanguages, languages, type Language } from '@/i18n/ui';
import { getLangFromUrl, getAlternateUrls } from '@/i18n/utils';

interface LanguageSwitcherProps {
    currentPath?: string;
    initialLocale?: Language;
}

export default function LanguageSwitcher({ currentPath, initialLocale }: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentLang, setCurrentLang] = React.useState<Language>(initialLocale || 'es');

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const lang = getLangFromUrl(new URL(window.location.href));
            setCurrentLang(lang);
        }
    }, []);

    const alternateUrls = React.useMemo(() => {
        if (typeof window !== 'undefined') {
            return getAlternateUrls(window.location.pathname);
        }
        if (currentPath) {
            return getAlternateUrls(currentPath);
        }
        return [];
    }, [currentPath]);

    const handleLanguageSwitch = (lang: Language, url: string) => {
        if (typeof window !== 'undefined') {
            window.location.href = url;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-secondary border border-main px-3 py-1 font-mono text-xs font-semibold text-main hover:bg-main hover:text-secondary focus:bg-main focus:text-secondary focus:outline-none uppercase tracking-wider flex items-center gap-2"
                aria-label="Change language"
            >
                {languages[currentLang]}
                <span className="text-xs">▼</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-secondary border border-main shadow-none z-50 min-w-full">
                    {alternateUrls.map(({ lang, url }) => (
                        <button
                            key={lang}
                            onClick={() => handleLanguageSwitch(lang, url)}
                            className={`block w-full text-left px-3 py-2 font-mono text-xs font-semibold hover:bg-main hover:text-secondary focus:bg-main focus:text-secondary focus:outline-none uppercase tracking-wider ${
                                lang === currentLang ? 'bg-main text-secondary' : 'text-main'
                            }`}
                        >
                            {languages[lang]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
