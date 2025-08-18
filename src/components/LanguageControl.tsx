import React, { useState, useEffect, useCallback } from 'react';
import DropdownButton, { DropdownContent } from './DropdownButton';
import { supportedLanguages, languages, type Language } from '@/i18n/ui';
import { getLangFromUrl } from '@/i18n/utils';
import { getEquivalentPage } from '@/utils/localized-routes';

interface LanguageControlProps {
    currentPath?: string;
    initialLocale?: Language;
}

export default function LanguageControl({ currentPath, initialLocale }: LanguageControlProps = {}) {
    // Initialize language immediately from URL - this is the fastest
    const [currentLang, setCurrentLang] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            return getLangFromUrl(new URL(window.location.href));
        }
        return initialLocale || 'es';
    });
    
    const [isMounted, setIsMounted] = useState(false);

    // Language utility functions
    const getNativeLanguageName = useCallback((lang: Language): string => {
        return languages[lang];
    }, []);

    const getLanguageNameInCurrent = useCallback((lang: Language): string => {
        const langNames = {
            es: { es: 'Español', en: 'Inglés', no: 'Noruego' },
            en: { es: 'Spanish', en: 'English', no: 'Norwegian' },
            no: { es: 'Spansk', en: 'Engelsk', no: 'Norsk' }
        };
        return langNames[currentLang][lang];
    }, [currentLang]);

    // Generate alternate URLs for all languages
    const alternateUrls = React.useMemo(() => {
        let pathname = '';
        if (typeof window !== 'undefined') {
            pathname = window.location.pathname;
        } else if (currentPath) {
            pathname = currentPath;
        }

        return supportedLanguages.map((lang) => ({
            lang,
            url: getEquivalentPage(pathname, lang)
        }));
    }, [currentPath]);

    // Mount immediately since language is read from URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const lang = getLangFromUrl(new URL(window.location.href));
            setCurrentLang(lang);
            setIsMounted(true);
            
            // Check if we should restore focus after navigation
            const shouldFocus = localStorage.getItem('focusAfterNavigation');
            if (shouldFocus === 'language-control') {
                localStorage.removeItem('focusAfterNavigation');
                // Focus the main language control button (not the dropdown button) after component is ready
                setTimeout(() => {
                    const mainLanguageButton = document.querySelector('[data-component="language-control"] .inline-flex button:first-child') as HTMLElement;
                    if (mainLanguageButton) {
                        mainLanguageButton.focus();
                    }
                }, 150);
            }
            
            // Signal that language control is ready
            setTimeout(() => {
                const event = new CustomEvent('language-control-ready', {
                    detail: { language: lang }
                });
                window.dispatchEvent(event);
            }, 100);
        }
    }, []);

    const handleLanguageSwitch = useCallback((lang: Language, url: string, viaKeyboard = false) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('langChoice', lang);
            // Only save focus state if changed via keyboard
            if (viaKeyboard) {
                localStorage.setItem('focusAfterNavigation', 'language-control');
            }
            window.location.href = url;
        }
    }, []);

    const nextLanguage = useCallback(() => {
        const currentIndex = supportedLanguages.findIndex(lang => lang === currentLang);
        const nextIndex = (currentIndex + 1) % supportedLanguages.length;
        const nextLang = supportedLanguages[nextIndex];
        const url = alternateUrls.find(alt => alt.lang === nextLang)?.url || '/';
        handleLanguageSwitch(nextLang, url, true); // Always via keyboard when using main button
    }, [currentLang, alternateUrls, handleLanguageSwitch]);

    // Separate handler for dropdown selections via keyboard
    const handleDropdownKeyboardSelection = useCallback((lang: Language, url: string) => {
        handleLanguageSwitch(lang, url, true); // Via keyboard
    }, [handleLanguageSwitch]);

    // Handler for dropdown selections via mouse
    const handleDropdownMouseSelection = useCallback((lang: Language, url: string) => {
        handleLanguageSwitch(lang, url, false); // Via mouse
    }, [handleLanguageSwitch]);

    // Don't render until mounted
    if (!isMounted) return null;
    
    // Find the index of the current language
    const currentLangIndex = supportedLanguages.findIndex(lang => lang === currentLang);
    const selectedIndex = currentLangIndex >= 0 ? currentLangIndex : 0;
    
    const dropdownContent = (
        <DropdownContent>
            {supportedLanguages.map((lang) => {
                const url = alternateUrls.find(alt => alt.lang === lang)?.url || '/';
                return (
                    <button
                        key={lang}
                        type="button"
                        onClick={(e) => {
                            // Detect if this was triggered by keyboard (Enter/Space via dropdown navigation)
                            // When DropdownButton calls activeItem.click(), the event has no pointer coordinates
                            const isKeyboard = (e.detail === 0 || e.detail === undefined) || (e.clientX === 0 && e.clientY === 0);
                            if (isKeyboard) {
                                handleDropdownKeyboardSelection(lang, url);
                            } else {
                                handleDropdownMouseSelection(lang, url);
                            }
                        }}
                        className="w-full px-1 py-0.5 text-left block cursor-pointer relative focus:z-[9999]"
                        data-selected={lang === currentLang ? 'true' : 'false'}
                        style={{
                            outlineWidth: '1px',
                            outlineOffset: '1px',
                            minHeight: '32px'
                        }}
                    >
                        <div className="flex items-center gap-0 pointer-events-none">
                            <div className="flex-1 px-1 py-1 pointer-events-none select-none">
                                <div className="font-grotesk text-sm font-semibold uppercase">
                                    {getNativeLanguageName(lang)}
                                </div>
                                <div className="font-grotesk text-sm opacity-70 mt-0.5 uppercase">
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
        </DropdownContent>
    );

    return (
        <div data-component="language-control">
            <DropdownButton
                onMainClick={nextLanguage}
                initialSelectedIndex={selectedIndex}
                dropdownContent={dropdownContent}
                className="w-7 h-7 @6xl:w-auto @6xl:h-8"
            >
            <div className="flex items-center gap-2">
                <span className="font-grotesk text-sm font-semibold text-main group-hover:text-secondary group-focus:text-secondary uppercase translate-y-[1.5px]">
                    {getNativeLanguageName(currentLang)}
                </span>
            </div>
            </DropdownButton>
        </div>
    );
}