import { type CollectionEntry, getCollection } from 'astro:content';
import type { Language } from '@/i18n/ui';

export function getLanguageFromId(id: string): Language {
    const [lang] = id.split('/');
    if (lang === 'es' || lang === 'en' || lang === 'no' || lang === 'ja') {
        return lang;
    }
    return 'es';
}

export function getSlugFromId(id: string): string {
    const [, ...slugParts] = id.split('/');
    const fullSlug = slugParts.join('/');
    return fullSlug.replace(/\.(md|mdx)$/, '');
}

export async function getProjectsByLanguage(language: Language): Promise<CollectionEntry<'projects'>[]> {
    const allEntries = await getCollection('projects');
    const localized = allEntries.filter((entry) => getLanguageFromId(entry.id) === language);

    if (language === 'ja' && localized.length === 0) {
        return allEntries.filter((entry) => getLanguageFromId(entry.id) === 'en');
    }

    return localized;
}

export async function getFeaturedProjectsByLanguage(language: Language): Promise<CollectionEntry<'projects'>[]> {
    const entries = await getProjectsByLanguage(language);
    return entries.filter((entry) => entry.data.isFeatured);
}
