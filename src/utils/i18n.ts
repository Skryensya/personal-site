import siteConfig from '@/data/site-config';

export const defaultLocale = siteConfig.defaultLocale || 'es';
export const locales = siteConfig.supportedLocales || ['es', 'en', 'no'];

export type Locale = typeof locales[number];

export function getLocaleFromUrl(url: URL): Locale {
    const [, lang] = url.pathname.split('/');
    if (lang && locales.includes(lang)) {
        return lang as Locale;
    }
    return defaultLocale as Locale;
}

export function removeLocaleFromUrl(pathname: string): string {
    const [, possibleLocale, ...rest] = pathname.split('/');
    if (possibleLocale && locales.includes(possibleLocale)) {
        return '/' + rest.join('/');
    }
    return pathname;
}

export function addLocaleToUrl(pathname: string, locale: Locale): string {
    if (locale === defaultLocale) {
        return pathname;
    }
    const cleanPath = removeLocaleFromUrl(pathname);
    return `/${locale}${cleanPath}`;
}

export function getAlternateUrls(pathname: string) {
    const cleanPath = removeLocaleFromUrl(pathname);
    return locales.map(locale => ({
        locale,
        url: addLocaleToUrl(cleanPath, locale)
    }));
}

export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale);
}