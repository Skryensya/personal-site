// Theme management system consuming centralized themes.json
// All theme data is now stored in src/data/themes.json
// This file provides JavaScript utilities for theme management

import themesData from './themes.json';

// Flatten all themes into a single array for backwards compatibility
const allThemes = [
    ...themesData.default,
    ...themesData.company,
    ...themesData.special
];

// Helper functions to get themes by category
export const getDefaultThemes = () => themesData.default;
export const getCompanyThemes = () => themesData.company;
export const getSpecialThemes = () => themesData.special;

// Session-only storage for visibility toggles
const sessionVisibility = {
    specialVisible: false,  // Konami code toggles this
    activeCompany: null     // Only one company theme can be active
};

// Get active company theme (only one at a time)
function getActiveCompanyTheme() {
    if (typeof window === 'undefined') return null;
    return sessionVisibility.activeCompany;
}

// Get special themes visibility status
function areSpecialThemesVisible() {
    if (typeof window === 'undefined') return false;
    return sessionVisibility.specialVisible;
}

// Check if a theme is unlocked/visible
function isThemeUnlocked(themeId) {
    // Default themes are always unlocked
    if (themesData.default.find(t => t.id === themeId)) return true;

    // Check company themes (only the active one is visible)
    if (themesData.company.find(t => t.id === themeId)) {
        return sessionVisibility.activeCompany === themeId;
    }

    // Check special themes (visible when konami code is active)
    if (themesData.special.find(t => t.id === themeId)) {
        return sessionVisibility.specialVisible;
    }

    return false;
}

// Activate a company theme (session only, mutually exclusive, auto-applies)
export function unlockCompanyTheme(themeId) {
    const theme = themesData.company.find(t => t.id === themeId);
    if (!theme) return false;

    const wasActive = sessionVisibility.activeCompany === themeId;

    // Set as active company theme (replaces any previous)
    sessionVisibility.activeCompany = themeId;

    // Auto-apply the theme
    if (typeof window !== 'undefined') {
        const savedMode = localStorage.getItem('theme-mode') || 'system';
        let isDark = false;
        if (savedMode === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            isDark = savedMode === 'dark';
        }

        applyTheme(themeId, isDark);
    }

    // Emit event for UI updates
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('theme-unlocked', {
            detail: { themeId, theme, category: 'company' }
        });
        window.dispatchEvent(event);
    }

    return !wasActive;
}

// Make all special themes visible (session only - toggled by konami code)
export function unlockSpecialThemes() {
    sessionVisibility.specialVisible = true;

    const specialThemeIds = themesData.special.map(t => t.id);

    // Emit event for UI updates
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('themes-unlocked', {
            detail: { themeIds: specialThemeIds, category: 'special' }
        });
        window.dispatchEvent(event);
    }

    return true;
}

// Hide all special themes (session only - toggled by konami code)
export function lockSpecialThemes() {
    sessionVisibility.specialVisible = false;

    const specialThemeIds = themesData.special.map(t => t.id);

    // Emit event for UI updates
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('themes-locked', {
            detail: { themeIds: specialThemeIds, category: 'special' }
        });
        window.dispatchEvent(event);
    }

    return true;
}

// Activate a special theme by query param (makes special themes visible and applies the theme)
export function unlockSpecialTheme(themeId) {
    const theme = themesData.special.find(t => t.id === themeId);
    if (!theme) return false;

    const wasVisible = sessionVisibility.specialVisible;

    // Make special themes visible
    sessionVisibility.specialVisible = true;

    // Auto-apply the theme
    if (typeof window !== 'undefined') {
        const savedMode = localStorage.getItem('theme-mode') || 'system';
        let isDark = false;
        if (savedMode === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            isDark = savedMode === 'dark';
        }

        applyTheme(themeId, isDark);
    }

    // Emit event for UI updates
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('theme-unlocked', {
            detail: { themeId, theme, category: 'special' }
        });
        window.dispatchEvent(event);
    }

    return !wasVisible;
}

// Toggle special themes visibility - used by konami code
export function toggleAllHiddenThemes() {
    const specialThemeIds = themesData.special.map(t => t.id);

    // Toggle visibility
    if (sessionVisibility.specialVisible) {
        // Hide special themes
        lockSpecialThemes();
        return { action: 'locked', themes: specialThemeIds };
    } else {
        // Show special themes
        unlockSpecialThemes();
        return { action: 'unlocked', themes: specialThemeIds };
    }
}

// Check if current theme is from non-default category
export function isCurrentThemeHidden() {
    if (typeof window === 'undefined') return false;
    const currentThemeId = localStorage.getItem('theme-id');
    if (!currentThemeId) return false;

    // Check if it's a default theme (not hidden)
    return !themesData.default.find(t => t.id === currentThemeId);
}

// Get default theme (first default theme)
export function getDefaultTheme() {
    return themesData.default[0];
}

// Get time remaining until special themes unlock expires (not used anymore with session storage)
export function getKonamiTimeRemaining() {
    // Special themes are now session-based, no expiration tracking needed
    return null;
}

// Get available themes (company if active → default → special if visible)
export function getAvailableThemes() {
    const result = [];

    // 1. Include active company theme FIRST (only one at a time)
    if (sessionVisibility.activeCompany) {
        const companyTheme = themesData.company.find(t => t.id === sessionVisibility.activeCompany);
        if (companyTheme) {
            result.push(companyTheme);
        }
    }

    // 2. Always include default themes
    result.push(...themesData.default);

    // 3. Include all special themes LAST (if visible via konami code)
    if (sessionVisibility.specialVisible) {
        result.push(...themesData.special);
    }

    return result;
}

// Export all themes flattened with backwards compatibility
export const themes = allThemes.map((theme) => ({
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
export function applyTheme(themeId, isDark = false) {
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

        // Sync to cookie for server-side rendering
        try {
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);
            document.cookie = `theme-id=${themeId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
            document.cookie = `theme-mode=${isDark ? 'dark' : 'light'}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        } catch (e) {
            console.warn('Failed to save theme to cookie:', e);
        }
        
    };

    // Apply theme changes instantly without transitions to prevent color blending
    updateTheme();
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
