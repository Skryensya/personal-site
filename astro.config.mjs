import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    i18n: {
        defaultLocale: 'es',
        locales: ['es', 'en', 'no'],
        routing: {
            prefixDefaultLocale: false
        }
    },
    server: {
        port: 2008,
        host: true
    },
    integrations: [
        react(),
        mdx(),
        sitemap()
    ],
    vite: {
        plugins: [tailwindcss()],
        server: {
            hmr: {
                port: 4324
            }
        },
        resolve: {
            alias: {
                '@': '/src'
            }
        }
    }
});
