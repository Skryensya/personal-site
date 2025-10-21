import { ui, defaultLang, supportedLanguages, type Language, type UIKeys } from './ui';

type UIValue = (typeof ui)[typeof defaultLang][UIKeys];

export function getTranslationValue(lang: Language, key: UIKeys): UIValue {
    const value = ui[lang]?.[key] ?? ui[defaultLang][key] ?? key;
    return value as UIValue;
}

/**
 * Get language from URL pathname
 * @param url - Current URL object
 * @returns Language code or default language
 */
export function getLangFromUrl(url: URL): Language {
    const [, firstSegment] = url.pathname.split('/');
    
    // Check if first segment is a supported language code (en, no)
    // Spanish (es) has no prefix, so paths like /, /proyectos are Spanish
    if (firstSegment && supportedLanguages.includes(firstSegment as Language) && firstSegment !== 'es') {
        return firstSegment as Language;
    }
    
    // Default to Spanish for all other paths (/, /proyectos, etc.)
    return defaultLang; // 'es'
}

/**
 * Remove language prefix from pathname
 * @param pathname - URL pathname
 * @returns Clean pathname without language prefix
 */
export function removeLocaleFromUrl(pathname: string): string {
    const [, possibleLang, ...rest] = pathname.split('/');
    
    // Check if first segment is a non-Spanish language prefix (en, no)
    if (possibleLang && supportedLanguages.includes(possibleLang as Language) && possibleLang !== 'es') {
        return '/' + rest.join('/');
    }
    
    // For Spanish or non-language paths, return as-is
    return pathname;
}

/**
 * Add language prefix to pathname
 * @param pathname - Clean pathname
 * @param lang - Target language
 * @returns Pathname with language prefix (unless default language Spanish)
 */
export function addLocaleToUrl(pathname: string, lang: Language): string {
    // Spanish (es) gets no prefix
    if (lang === 'es') {
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
export function getTranslations(lang: Language = defaultLang) {
    return function t(key: UIKeys): string {
        const value = getTranslationValue(lang, key);
        if (Array.isArray(value)) {
            return value.join(' ');
        }
        return value as string;
    };
}

/**
 * Create translated path function
 * @param lang - Target language
 * @returns Function to translate paths
 */
export function createTranslatedPath(lang: Language = defaultLang) {
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
 * Client-side translation function for React components
 * Usage: const t = getClientTranslations();
 */
export function getClientTranslations() {
    if (typeof window === 'undefined') {
        return getTranslations(defaultLang);
    }

    // Use window.location directly instead of creating new URL to avoid potential hook conflicts
    const lang = getLangFromUrl(new URL(window.location.href));
    return getTranslations(lang);
}

/**
 * Client-side translation function for React components (not a hook)
 * Usage: const t = getClientTranslations();
 */
export function getClientTranslationsForComponents() {
    // Get translations safely for client-side React components
    if (typeof window === 'undefined') {
        return getTranslations(defaultLang);
    }
    
    // Get language once and cache it
    const lang = getLangFromUrl(new URL(window.location.href));
    return getTranslations(lang);
}
