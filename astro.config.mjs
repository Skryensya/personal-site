import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    server: {
        port: 4321,
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
