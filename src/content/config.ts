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
    })
});

export const collections = { projects };
