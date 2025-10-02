// Theme management system consuming centralized themes.json
// All theme data is now stored in src/data/themes.json
// This file provides JavaScript utilities for theme management

import themesData from './themes.json';

// Get unlocked themes from localStorage with 1-day expiration
function getUnlockedThemes() {
    if (typeof window === 'undefined') return [];
    try {
        const konamiData = localStorage.getItem('konami-unlock');
        if (!konamiData) return [];
        
        const { themes, timestamp } = JSON.parse(konamiData);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        // Check if more than 1 day has passed
        if (now - timestamp > oneDay) {
            // Expired, remove from localStorage
            localStorage.removeItem('konami-unlock');
            return [];
        }
        
        return themes || [];
    } catch {
        return [];
    }
}

// Get special themes that are permanently unlocked (like chipax)
function getSpecialUnlockedThemes() {
    if (typeof window === 'undefined') return [];
    try {
        const specialData = localStorage.getItem('special-themes-unlocked');
        if (!specialData) return [];
        
        const { themes } = JSON.parse(specialData);
        return themes || [];
    } catch {
        return [];
    }
}

// Save special themes to localStorage (permanent unlock)
function saveSpecialUnlockedThemes(themes) {
    if (typeof window === 'undefined') return;
    try {
        const specialData = {
            themes,
            timestamp: Date.now()
        };
        localStorage.setItem('special-themes-unlocked', JSON.stringify(specialData));
    } catch (e) {
        console.warn('Failed to save special unlock data:', e);
    }
}

// Save unlocked themes to localStorage with timestamp
function saveUnlockedThemes(themes) {
    if (typeof window === 'undefined') return;
    try {
        const konamiData = {
            themes,
            timestamp: Date.now()
        };
        localStorage.setItem('konami-unlock', JSON.stringify(konamiData));
    } catch (e) {
        console.warn('Failed to save konami unlock data:', e);
    }
}

// Check if a theme is unlocked
function isThemeUnlocked(themeId) {
    const theme = themesData.themes.find(t => t.id === themeId);
    if (!theme || !theme.hidden) return true; // Non-hidden themes are always unlocked
    
    // Check special themes (permanently unlocked)
    if (theme.special) {
        const specialUnlockedThemes = getSpecialUnlockedThemes();
        return specialUnlockedThemes.includes(themeId);
    }
    
    // Check regular unlocked themes (temporary)
    const unlockedThemes = getUnlockedThemes();
    return unlockedThemes.includes(themeId);
}

// Unlock a hidden theme
export function unlockTheme(themeId) {
    const theme = themesData.themes.find(t => t.id === themeId);
    if (!theme || !theme.hidden) return false; // Can't unlock non-hidden themes
    
    const unlockedThemes = getUnlockedThemes();
    if (!unlockedThemes.includes(themeId)) {
        unlockedThemes.push(themeId);
        saveUnlockedThemes(unlockedThemes);
        
        // Emit event for UI updates
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('theme-unlocked', {
                detail: { themeId, theme }
            });
            window.dispatchEvent(event);
        }
        
        return true;
    }
    return false;
}

// Unlock a special theme (permanent unlock)
export function unlockSpecialTheme(themeId) {
    const theme = themesData.themes.find(t => t.id === themeId);
    if (!theme || !theme.hidden || !theme.special) return false; // Can only unlock special hidden themes
    
    let specialUnlockedThemes = getSpecialUnlockedThemes();
    
    // Remove all other special themes when unlocking a new one (mutual exclusivity)
    const otherSpecialThemes = themesData.themes
        .filter(t => t.special && t.hidden && t.id !== themeId)
        .map(t => t.id);
    
    // Filter out other special themes from the unlocked list
    specialUnlockedThemes = specialUnlockedThemes.filter(id => !otherSpecialThemes.includes(id));
    
    if (!specialUnlockedThemes.includes(themeId)) {
        specialUnlockedThemes.push(themeId);
        saveSpecialUnlockedThemes(specialUnlockedThemes);
        
        // Emit event for UI updates
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('theme-unlocked', {
                detail: { themeId, theme, special: true }
            });
            window.dispatchEvent(event);
        }
        
        return true;
    } else {
        // Theme was already unlocked, but we still need to save to ensure other special themes are removed
        saveSpecialUnlockedThemes(specialUnlockedThemes);
        return false;
    }
}

// Toggle all hidden themes (unlock if none unlocked, lock if any unlocked)
export function toggleAllHiddenThemes() {
    const hiddenThemes = themesData.themes.filter(t => t.hidden).map(t => t.id);
    const unlockedThemes = getUnlockedThemes();
    
    // Check if any hidden themes are currently unlocked
    const anyUnlocked = hiddenThemes.some(themeId => unlockedThemes.includes(themeId));
    
    if (anyUnlocked) {
        // Lock all hidden themes (clear the unlocked list)
        saveUnlockedThemes([]);
        
        // Emit event for UI updates
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('themes-locked', {
                detail: { hiddenThemes }
            });
            window.dispatchEvent(event);
        }
        
        return { action: 'locked', themes: hiddenThemes };
    } else {
        // Unlock all hidden themes
        saveUnlockedThemes([...hiddenThemes]);
        
        // Emit event for UI updates
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('themes-unlocked', {
                detail: { hiddenThemes }
            });
            window.dispatchEvent(event);
        }
        return { action: 'unlocked', themes: hiddenThemes };
    }
}

// Check if current theme is hidden
export function isCurrentThemeHidden() {
    if (typeof window === 'undefined') return false;
    const currentThemeId = localStorage.getItem('theme-id');
    if (!currentThemeId) return false;
    
    const theme = themesData.themes.find(t => t.id === currentThemeId);
    return theme ? theme.hidden === true : false;
}

// Get default theme (first non-hidden theme)
export function getDefaultTheme() {
    return themesData.themes.find(t => !t.hidden) || themesData.themes[0];
}

// Get time remaining until konami unlock expires
export function getKonamiTimeRemaining() {
    if (typeof window === 'undefined') return null;
    try {
        const konamiData = localStorage.getItem('konami-unlock');
        if (!konamiData) return null;
        
        const { timestamp } = JSON.parse(konamiData);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const timeRemaining = (timestamp + oneDay) - now;
        
        if (timeRemaining <= 0) return null;
        
        return timeRemaining;
    } catch {
        return null;
    }
}

// Get available themes (non-hidden + unlocked hidden)
export function getAvailableThemes() {
    const availableThemes = themesData.themes.filter(theme => {
        if (!theme.hidden) return true;
        return isThemeUnlocked(theme.id);
    });

    // If chipax is available, put it first in the list
    const chipaxIndex = availableThemes.findIndex(theme => theme.id === 'chipax');
    if (chipaxIndex > 0) {
        const chipaxTheme = availableThemes.splice(chipaxIndex, 1)[0];
        availableThemes.unshift(chipaxTheme);
    }

    return availableThemes;
}

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
