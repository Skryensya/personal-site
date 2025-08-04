import { type CollectionEntry, getCollection } from 'astro:content';
import type { Language } from '@/i18n/ui';

// Extract language from collection entry id (e.g., "es/project-slug" -> "es")
export function getLanguageFromId(id: string): Language {
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

// Get all entries for a specific language from blog collection
export async function getBlogByLanguage(language: Language): Promise<CollectionEntry<'blog'>[]> {
    const allEntries = await getCollection('blog');
    return allEntries.filter((entry) => getLanguageFromId(entry.id) === language);
}

// Get all entries for a specific language from projects collection
export async function getProjectsByLanguage(language: Language): Promise<CollectionEntry<'projects'>[]> {
    const allEntries = await getCollection('projects');
    return allEntries.filter((entry) => getLanguageFromId(entry.id) === language);
}

// Get a specific blog entry by slug and language
export async function getBlogEntryBySlugAndLanguage(slug: string, language: Language): Promise<CollectionEntry<'blog'> | undefined> {
    const entries = await getBlogByLanguage(language);
    return entries.find((entry) => getSlugFromId(entry.id) === slug);
}

// Get a specific project entry by slug and language
export async function getProjectEntryBySlugAndLanguage(slug: string, language: Language): Promise<CollectionEntry<'projects'> | undefined> {
    const entries = await getProjectsByLanguage(language);
    return entries.find((entry) => getSlugFromId(entry.id) === slug);
}

// Get featured blog entries for a specific language
export async function getFeaturedBlogByLanguage(language: Language): Promise<CollectionEntry<'blog'>[]> {
    const entries = await getBlogByLanguage(language);
    return entries.filter((entry) => entry.data.isFeatured);
}

// Get featured project entries for a specific language
export async function getFeaturedProjectsByLanguage(language: Language): Promise<CollectionEntry<'projects'>[]> {
    const entries = await getProjectsByLanguage(language);
    return entries.filter((entry) => entry.data.isFeatured);
}

// Get project entries in other languages for the same content (by slug)
export async function getAlternativeLanguages(
    collection: 'projects' | 'blog',
    slug: string,
    excludeLanguage?: Language
): Promise<{ language: Language; entry: CollectionEntry<'projects'> | CollectionEntry<'blog'> }[]> {
    const allEntries = await getCollection(collection);
    const alternatives: { language: Language; entry: CollectionEntry<'projects'> | CollectionEntry<'blog'> }[] = [];

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
