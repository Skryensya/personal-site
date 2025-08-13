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

// Simple theme management with localStorage optimization
export function applyTheme(themeId, isDark = false, mode = null) {
    const root = document.documentElement;

    // Set theme data attribute
    root.setAttribute('data-theme', themeId);

    // Get theme using backwards compatibility getters
    const theme = themes.find((t) => t.id === themeId) || themes[0];

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
