// Theme management system consuming centralized themes.json
// All theme data is now stored in src/data/themes.json
// This file provides JavaScript utilities for theme management

import themesData from './themes.json';

// Export themes from JSON with backwards compatibility
export const themes = themesData.themes.map((theme) => ({
    ...theme,
    // Backwards compatibility getters
    get colorful() {
        return theme.colors.colorful;
    },
    get contrasty() {
        return theme.colors.contrasty;
    }
}));

export const themeKeys = themes.map((theme) => theme.id);

// Simple theme management with localStorage optimization and View Transitions API
export function applyTheme(themeId, isDark = false, mode = null) {
    const root = document.documentElement;
    
    // Get theme using backwards compatibility getters
    const theme = themes.find((t) => t.id === themeId) || themes[0];

    // Function to actually apply the theme changes
    const updateTheme = () => {
        // Set theme data attribute
        root.setAttribute('data-theme', themeId);

        // Apply dark class
        root.classList.toggle('dark', isDark);

        // Set CSS custom properties using backwards compatibility getters
        root.style.setProperty('--theme-colorful', theme.colorful);
        root.style.setProperty('--theme-contrasty', theme.contrasty);
        
        // Set the main color variables that the CSS actually uses
        root.style.setProperty('--color-main', isDark ? theme.colorful : theme.contrasty);
        root.style.setProperty('--color-secondary', isDark ? theme.contrasty : theme.colorful);

        // Persist to localStorage with error handling
        try {
            localStorage.setItem('theme-id', themeId);
            localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
        } catch (e) {
            console.warn('Failed to save theme to localStorage:', e);
        }
        
        // Debug log
        console.log('🎨 Theme applied via applyTheme():', themeId, 'isDark:', isDark, 'colors:', {
            colorful: theme.colorful,
            contrasty: theme.contrasty
        });
    };

    // Use View Transitions API if available and supported
    if (typeof document !== 'undefined' && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Start view transition for smooth theme change
        document.startViewTransition(() => {
            updateTheme();
        });
    } else {
        // Fallback: Add CSS transitions temporarily for older browsers
        const elementsToTransition = document.querySelectorAll('*');
        
        // Add temporary transitions to all elements
        elementsToTransition.forEach(el => {
            el.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
        });
        
        // Apply theme change
        updateTheme();
        
        // Remove temporary transitions after animation completes
        setTimeout(() => {
            elementsToTransition.forEach(el => {
                el.style.transition = '';
            });
        }, 300);
    }
}

// Get theme by id with fallback
export function getThemeById(id) {
    return themes.find((theme) => theme.id === id) || themes[0];
}

// Load theme from localStorage with validation
export function loadThemeFromStorage() {
    try {
        const savedThemeId = localStorage.getItem('theme-id');
        const savedMode = localStorage.getItem('theme-mode');

        // Validate saved theme exists in current theme list
        const theme = savedThemeId && themes.find((t) => t.id === savedThemeId) ? savedThemeId : themes[0].id;

        const isDark = savedMode === 'dark';
        const mode = isDark ? 'dark' : 'light';

        return { themeId: theme, isDark, mode };
    } catch (e) {
        console.warn('Failed to load theme from localStorage:', e);
        return { themeId: 'dos', isDark: false, mode: 'light' };
    }
}

// Initialize theme on page load
export function initializeTheme() {
    const { themeId, isDark } = loadThemeFromStorage();
    applyTheme(themeId, isDark);
    return { themeId, isDark };
}
