import { ui, defaultLang, supportedLanguages, type Language, type UIKeys } from './ui';

/**
 * Get language from URL pathname
 * @param url - Current URL object
 * @returns Language code or default language
 */
export function getLangFromUrl(url: URL): Language {
    const [, firstSegment] = url.pathname.split('/');
    
    // Check if first segment is a supported language code (es, no)
    // English (en) has no prefix, so paths like /, /projects, /resume are English
    if (firstSegment && supportedLanguages.includes(firstSegment as Language) && firstSegment !== 'en') {
        return firstSegment as Language;
    }
    
    // Default to English for all other paths (/, /projects, /resume, etc.)
    return defaultLang; // 'en'
}

/**
 * Remove language prefix from pathname
 * @param pathname - URL pathname
 * @returns Clean pathname without language prefix
 */
export function removeLocaleFromUrl(pathname: string): string {
    const [, possibleLang, ...rest] = pathname.split('/');
    
    // Check if first segment is a non-English language prefix (es, no)
    if (possibleLang && supportedLanguages.includes(possibleLang as Language) && possibleLang !== 'en') {
        return '/' + rest.join('/');
    }
    
    // For English or non-language paths, return as-is
    return pathname;
}

/**
 * Add language prefix to pathname
 * @param pathname - Clean pathname
 * @param lang - Target language
 * @returns Pathname with language prefix (unless default language English)
 */
export function addLocaleToUrl(pathname: string, lang: Language): string {
    // English (en) gets no prefix
    if (lang === 'en') {
        const cleanPath = removeLocaleFromUrl(pathname);
        return cleanPath;
    }
    
    // Other languages get their prefix
    const cleanPath = removeLocaleFromUrl(pathname);
    return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Get alternate language URLs for the current page
 * @param pathname - Current pathname
 * @returns Array of language/URL pairs
 */
export function getAlternateUrls(pathname: string) {
    const cleanPath = removeLocaleFromUrl(pathname);
    return supportedLanguages.map((lang) => ({
        lang,
        url: addLocaleToUrl(cleanPath, lang)
    }));
}

/**
 * Create translation function for server-side components (Astro)
 * @param lang - Target language
 * @returns Translation function
 */
export function useTranslations(lang: Language = defaultLang) {
    return function t(key: UIKeys): string {
        return ui[lang]?.[key] || ui[defaultLang][key] || key;
    };
}

/**
 * Create translated path function
 * @param lang - Target language
 * @returns Function to translate paths
 */
export function useTranslatedPath(lang: Language = defaultLang) {
    return function translatePath(path: string, targetLang: Language = lang): string {
        return addLocaleToUrl(path, targetLang);
    };
}

/**
 * Validate if a string is a supported language
 * @param lang - Language string to validate
 * @returns Boolean indicating if language is supported
 */
export function isValidLanguage(lang: string): lang is Language {
    return supportedLanguages.includes(lang as Language);
}

/**
 * Get language display name
 * @param lang - Language code
 * @returns Display name in native language
 */
export function getLanguageDisplayName(lang: Language): string {
    const names = {
        es: 'Español',
        en: 'English',
        no: 'Norsk'
    };
    return names[lang] || names[defaultLang];
}

/**
 * Client-side translation hook for React components
 * Usage: const t = useClientTranslations();
 */
export function useClientTranslations() {
    if (typeof window === 'undefined') {
        return useTranslations(defaultLang);
    }

    const lang = getLangFromUrl(new URL(window.location.href));
    return useTranslations(lang);
}
