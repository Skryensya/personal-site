// Server-side translation utility for Astro components
import { translations, type TranslationKey } from './translations';
import { type Locale, defaultLocale } from '@/utils/i18n';

export function getServerTranslation(locale: Locale = defaultLocale) {
    return function t(key: TranslationKey): string {
        const validLocale = locale in translations ? locale : defaultLocale;
        return translations[validLocale][key] || translations[defaultLocale][key] || key;
    };
}

// Export for convenience
export const t = getServerTranslation();