import { type CollectionEntry, getCollection } from 'astro:content';
import type { Locale } from '@/utils/i18n';

// Extract language from collection entry id (e.g., "es/project-slug" -> "es")
export function getLanguageFromId(id: string): Locale {
    const [lang] = id.split('/');
    if (lang === 'es' || lang === 'en' || lang === 'no') {
        return lang;
    }
    return 'es'; // Default fallback
}

// Extract slug from collection entry id (e.g., "es/project-slug" -> "project-slug")
export function getSlugFromId(id: string): string {
    const [, ...slugParts] = id.split('/');
    return slugParts.join('/');
}

// Get all entries for a specific language from any collection
export async function getCollectionByLanguage<T extends keyof typeof import('astro:content')['collections']>(
    collection: T,
    language: Locale
): Promise<CollectionEntry<T>[]> {
    const allEntries = await getCollection(collection);
    return allEntries.filter(entry => getLanguageFromId(entry.id) === language);
}

// Get a specific entry by slug and language
export async function getEntryBySlugAndLanguage<T extends keyof typeof import('astro:content')['collections']>(
    collection: T,
    slug: string,
    language: Locale
): Promise<CollectionEntry<T> | undefined> {
    const entries = await getCollectionByLanguage(collection, language);
    return entries.find(entry => getSlugFromId(entry.id) === slug);
}

// Get entries in other languages for the same content (by slug)
export async function getAlternativeLanguages<T extends keyof typeof import('astro:content')['collections']>(
    collection: T,
    slug: string,
    excludeLanguage?: Locale
): Promise<{ language: Locale; entry: CollectionEntry<T> }[]> {
    const allEntries = await getCollection(collection);
    const alternatives: { language: Locale; entry: CollectionEntry<T> }[] = [];
    
    for (const entry of allEntries) {
        const entrySlug = getSlugFromId(entry.id);
        const entryLang = getLanguageFromId(entry.id);
        
        if (entrySlug === slug && entryLang !== excludeLanguage) {
            alternatives.push({
                language: entryLang,
                entry
            });
        }
    }
    
    return alternatives;
}

// Get featured entries for a specific language
export async function getFeaturedByLanguage<T extends keyof typeof import('astro:content')['collections']>(
    collection: T,
    language: Locale
): Promise<CollectionEntry<T>[]> {
    const entries = await getCollectionByLanguage(collection, language);
    return entries.filter(entry => 'isFeatured' in entry.data && entry.data.isFeatured);
}