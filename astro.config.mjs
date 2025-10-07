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
        inlineStylesheets: 'always',  // Inline crítico CSS para evitar render blocking
        assets: '_astro'  // Directorio para assets con hash (para caché inmutable)
    },
    integrations: [
        react({
            include: ['**/react/*', '**/tsx'],
            experimentalReactChildren: true
        }),
        mdx(),
        sitemap()
    ],
    vite: {
        plugins: [tailwindcss()],
        server: {
            hmr: true
        },
        resolve: {
            alias: {
                '@': '/src'
            }
        },
        build: {
            modulePreload: {
                polyfill: false  // Navegadores modernos soportan modulepreload nativamente
            },
            assetsInlineLimit: 4096,  // Inline assets < 4KB para reducir requests
            minify: 'esbuild',
            rollupOptions: {
                output: {
                    // Optimizar chunks para reducir dependencias en cadena
                    manualChunks: (id) => {
                        // Core React - carga temprano
                        if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                            return 'react-vendor';
                        }
                        // Animations - lazy load
                        if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lenis')) {
                            return 'animation-vendor';
                        }
                        // 3D - lazy load
                        if (id.includes('three') || id.includes('@react-three')) {
                            return '3d-vendor';
                        }
                        // UI libraries - carga bajo demanda
                        if (id.includes('@radix-ui') || id.includes('@floating-ui')) {
                            return 'ui-vendor';
                        }
                        // Theme system - crítico, separar para cache
                        if (id.includes('/data/themes') || id.includes('/utils/debug-logger')) {
                            return 'theme-core';
                        }
                        // Astro runtime - debe ser pequeño y rápido
                        if (id.includes('astro/dist/runtime')) {
                            return 'astro-runtime';
                        }
                    },
                    // Configurar tamaño óptimo de chunks
                    chunkFileNames: '_astro/[name].[hash].js',
                    assetFileNames: '_astro/[name].[hash][extname]'
                }
            },
            // Optimizar tamaño de chunks
            chunkSizeWarningLimit: 600
        }
    }
});
