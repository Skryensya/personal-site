import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://skryensya.dev',
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
    image: {
        service: {
            entrypoint: 'astro/assets/services/sharp'
        }
    },
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'hover'
    },
    build: {
        inlineStylesheets: 'auto'
    },
    integrations: [react(), mdx(), sitemap()],
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
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        'react-vendor': ['react', 'react-dom'],
                        'animation-vendor': ['framer-motion', 'gsap', 'lenis'],
                        '3d-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
                        'ui-vendor': ['@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-tooltip', '@floating-ui/dom', '@floating-ui/react']
                    }
                }
            }
        }
    }
});
