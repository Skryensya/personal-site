import { defineCollection, z } from 'astro:content';

const seoSchema = z.object({
    title: z.string().min(5).max(120).optional(),
    description: z.string().min(15).max(160).optional(),
    image: z
        .object({
            src: z.string(),
            alt: z.string().optional(),
            caption: z.string().optional()
        })
        .optional(),
    pageType: z.enum(['website', 'article']).default('website')
});

// Blog collection with localized structure (blog/[lang]/[slug])
const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        publishDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        isFeatured: z.boolean().default(false),
        tags: z.array(z.string()).default([]),
        seo: seoSchema.optional()
        // Language is now inferred from the folder structure
        // slug: z.string().optional(), // Base slug for cross-language linking
    })
});

// Pages collection with localized structure (pages/[lang]/[slug])
const pages = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        seo: seoSchema.optional()
        // Language is now inferred from the folder structure
        // slug: z.string().optional(), // Base slug for cross-language linking
    })
});

// Projects collection with localized structure (projects/[lang]/[slug])
const projects = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        hook: z.string().optional(),
        cvDescription: z.string().optional(),
        publishDate: z.coerce.date(),
        isFeatured: z.boolean().default(false),
        seo: seoSchema.optional(),
        color: z.string().optional(),
        clientLogo: z.string().optional(),
        tags: z.array(z.string()).default([]),
        audioUrl: z.string().optional()
        // Language is now inferred from the folder structure
        // slug: z.string().optional(), // Base slug for cross-language linking
    })
});

export const collections = { blog, pages, projects };
