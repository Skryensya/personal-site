// Theme management system consuming centralized themes.json
// All theme data is now stored in src/data/themes.json
// This file provides JavaScript utilities for theme management

import themesData from './themes.json';
import { debugLogger } from '../utils/debug-logger.ts';

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

// Helper functions to manage session company theme state using sessionStorage
export function setSessionCompany(themeId) {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('active-company-theme', themeId);
    }
}

export function getSessionCompany() {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem('active-company-theme');
    }
    return null;
}

export function clearSessionCompany() {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('active-company-theme');
    }
}

// Persistent storage for visibility toggles using localStorage
const getVisibilityState = () => {
    if (typeof window === 'undefined') {
        return {
            specialVisible: false,
            activeCompany: null
        };
    }

    try {
        // Get special themes visibility from localStorage (persistent)
        const storageValue = localStorage.getItem('special-themes-visible');
        const specialVisible = storageValue === 'true';

        // Keep company theme in sessionStorage for session exclusivity
        const activeCompany = getSessionCompany();

        const state = {
            specialVisible,
            activeCompany
        };

        // Debug logging (async import to avoid blocking)
        import('@/utils/debug-logger.ts').then(({ debugLogger }) => {
            debugLogger.log('📊 getVisibilityState result:', {
                storageValue,
                specialVisible,
                activeCompany,
                finalState: state
            });
        });

        return state;
    } catch (e) {
        import('@/utils/debug-logger.ts').then(({ debugLogger }) => {
            debugLogger.warn('❌ Error in getVisibilityState:', e);
        });
        return {
            specialVisible: false,
            activeCompany: null
        };
    }
};

// Deactivate current company theme (for internal use)
export function deactivateCompanyTheme() {
    const previousTheme = getVisibilityState().activeCompany;
    clearSessionCompany();
    
    // Emit event for UI updates
    if (typeof window !== 'undefined' && previousTheme) {
        const event = new CustomEvent('company-theme-deactivated', {
            detail: { themeId: previousTheme }
        });
        window.dispatchEvent(event);
    }
    
    return previousTheme;
}

// Check if a theme is currently the active company theme
export function isActiveCompanyTheme(themeId) {
    return getVisibilityState().activeCompany === themeId;
}

// Debug function to check current visibility state
export function getDebugVisibilityState() {
    if (typeof window !== 'undefined') {
        const state = getVisibilityState();
        debugLogger.group('🔍 Debug Theme Visibility State');
        debugLogger.log('Current state:', {
            activeCompany: state.activeCompany,
            specialVisible: state.specialVisible,
            sessionCompany: getSessionCompany(),
            localStorage_themeId: localStorage.getItem('theme-id'),
            window_themeId: window.__THEME_ID__
        });
        debugLogger.log('Available themes:', getAvailableThemes().map(t => t.id));
        debugLogger.log('Company themes:', themesData.company.map(t => t.id));
        debugLogger.log('Special themes:', themesData.special.map(t => t.id));
        debugLogger.log('Default themes:', themesData.default.map(t => t.id));
        debugLogger.groupEnd();
        return state;
    }
    return null;
}

// Activate a company theme (session only, mutually exclusive, auto-applies)
export function unlockCompanyTheme(themeId) {
    debugLogger.log('🏢 unlockCompanyTheme called with:', themeId);
    const theme = themesData.company.find(t => t.id === themeId);
    if (!theme) {
        debugLogger.log('❌ Company theme not found:', themeId);
        return false;
    }

    const wasActive = getVisibilityState().activeCompany === themeId;
    debugLogger.log('📊 Current state - wasActive:', wasActive, 'current activeCompany:', getVisibilityState().activeCompany);

    // Set as active company theme (replaces any previous)
    setSessionCompany(themeId);

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
        
        // Persist company theme in localStorage so it survives navigation
        // This ensures the company theme stays active across page views
        try {
            localStorage.setItem('theme-id', themeId);
        } catch (e) {
            debugLogger.warn('Failed to save company theme to localStorage:', e);
        }
    }

    // Emit event for UI updates
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('theme-unlocked', {
            detail: { themeId, theme, category: 'company' }
        });
        window.dispatchEvent(event);
        
        // Also emit specific company theme activation event for ThemeControl
        const companyEvent = new CustomEvent('company-theme-activated', {
            detail: { themeId, theme, category: 'company' }
        });
        window.dispatchEvent(companyEvent);
    }

    return !wasActive;
}

// Make all special themes visible (persistently - toggled by konami code)
export function unlockSpecialThemes() {
    debugLogger.group('🔓 Unlocking special themes');
    
    // Store in localStorage for persistence across sessions
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('special-themes-visible', 'true');
            debugLogger.log('✅ Successfully saved special-themes-visible=true to localStorage');
            
            // Verify it was saved
            const saved = localStorage.getItem('special-themes-visible');
            debugLogger.log('✅ Verification - localStorage value:', saved);
        } catch (e) {
            debugLogger.warn('❌ Failed to save special themes visibility to localStorage:', e);
        }
    }

    const specialThemeIds = themesData.special.map(t => t.id);
    debugLogger.log('🎨 Special theme IDs to unlock:', specialThemeIds);

    // Check visibility state after setting localStorage
    const newState = getVisibilityState();
    debugLogger.log('📊 New visibility state after unlock:', newState);

    // Emit event for UI updates
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('themes-unlocked', {
            detail: { themeIds: specialThemeIds, category: 'special' }
        });
        window.dispatchEvent(event);
        debugLogger.log('📡 Dispatched themes-unlocked event with detail:', event.detail);
    }

    debugLogger.groupEnd();
    return true;
}

// Hide all special themes (persistently - toggled by konami code)
export function lockSpecialThemes() {
    // Remove from localStorage to hide persistently
    if (typeof window !== 'undefined') {
        try {
            localStorage.removeItem('special-themes-visible');
        } catch (e) {
            debugLogger.warn('Failed to remove special themes visibility from localStorage:', e);
        }
    }

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

    const wasVisible = getVisibilityState().specialVisible;

    // Make special themes visible (persistently)
    unlockSpecialThemes();

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

    // Get current state and log it
    const currentState = getVisibilityState();
    const activeCompany = currentState.activeCompany;
    debugLogger.group('🔄 toggleAllHiddenThemes');
    debugLogger.log('Current visibility state:', currentState);
    debugLogger.log('specialVisible:', currentState.specialVisible);

    let storageValue = null;
    try {
        storageValue = localStorage.getItem('special-themes-visible');
    } catch (error) {
        debugLogger.warn('Unable to read special-themes-visible from localStorage:', error);
    }
    debugLogger.log('localStorage value:', storageValue);

    // Toggle visibility based on current state from localStorage
    if (currentState.specialVisible) {
        // Hide special themes
        debugLogger.log('➡️ Currently visible, will LOCK (hide)');
        lockSpecialThemes();

        let companyCleared = false;
        let fallbackThemeId = null;

        if (activeCompany) {
            debugLogger.log('🏢 Active company theme detected, deactivating:', activeCompany);
            deactivateCompanyTheme();
            companyCleared = true;

            if (typeof window !== 'undefined') {
                const defaultTheme = getDefaultTheme();
                if (defaultTheme) {
                    let savedMode = 'system';
                    try {
                        savedMode = localStorage.getItem('theme-mode') || 'system';
                    } catch (error) {
                        debugLogger.warn('Unable to read theme-mode from localStorage:', error);
                    }

                    let isDark = false;
                    try {
                        if (savedMode === 'system') {
                            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                        } else {
                            isDark = savedMode === 'dark';
                        }
                    } catch (error) {
                        debugLogger.warn('Unable to determine preferred color scheme during company theme reset:', error);
                    }

                    applyTheme(defaultTheme.id, isDark);
                    fallbackThemeId = defaultTheme.id;

                    try {
                        localStorage.setItem('theme-id', defaultTheme.id);
                    } catch (error) {
                        debugLogger.warn('Failed to persist default theme after locking special themes:', error);
                    }

                    window.__THEME_ID__ = defaultTheme.id;
                    const resolvedMode = savedMode === 'system' ? (isDark ? 'dark' : 'light') : savedMode;
                    window.__THEME_MODE__ = resolvedMode;
                    window.__THEME_READY__ = true;

                    const themeChangedEvent = new CustomEvent('theme-changed', {
                        detail: { themeId: defaultTheme.id, category: 'default', reason: 'konami-lock' }
                    });
                    window.dispatchEvent(themeChangedEvent);
                }
            }
        }

        try {
            storageValue = localStorage.getItem('special-themes-visible');
        } catch (error) {
            debugLogger.warn('Unable to read updated special-themes-visible value:', error);
        }

        debugLogger.log('✅ Locked, new value:', storageValue);
        debugLogger.groupEnd();
        return { action: 'locked', themes: specialThemeIds, companyCleared, fallbackThemeId, previouslyActiveCompany: activeCompany };
    } else {
        // Show special themes
        debugLogger.log('➡️ Currently hidden, will UNLOCK (show)');
        unlockSpecialThemes();

        try {
            storageValue = localStorage.getItem('special-themes-visible');
        } catch (error) {
            debugLogger.warn('Unable to read updated special-themes-visible value:', error);
        }

        debugLogger.log('✅ Unlocked, new value:', storageValue);
        debugLogger.groupEnd();
        return { action: 'unlocked', themes: specialThemeIds, companyCleared: false, fallbackThemeId: null, previouslyActiveCompany: activeCompany };
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

// Get time remaining until special themes unlock expires (not used anymore with persistent storage)
export function getKonamiTimeRemaining() {
    // Special themes are now persistent via localStorage, no expiration tracking needed
    return null;
}

// Get available themes (company if active → default → special if visible)
export function getAvailableThemes() {
    const result = [];
    const visibility = getVisibilityState();

    debugLogger.log('🔍 getAvailableThemes called with visibility:', {
        activeCompany: visibility.activeCompany,
        specialVisible: visibility.specialVisible
    });

    // 1. Include active company theme FIRST (only one at a time)
    if (visibility.activeCompany) {
        const companyTheme = themesData.company.find(t => t.id === visibility.activeCompany);
        if (companyTheme) {
            debugLogger.log('✅ Adding company theme to dropdown:', companyTheme.id);
            result.push(companyTheme);
        } else {
            debugLogger.log('❌ Company theme not found in themesData:', visibility.activeCompany);
        }
    } else {
        debugLogger.log('⚠️ No active company theme found');
    }

    // 2. Always include default themes
    result.push(...themesData.default);
    debugLogger.log('📝 Added default themes, total count:', result.length);

    // 3. Include all special themes LAST (if visible via konami code - now persistent)
    if (visibility.specialVisible) {
        result.push(...themesData.special);
        debugLogger.log('✨ Added special themes, total count:', result.length);
    }

    debugLogger.log('📋 Final available themes:', result.map(t => t.id));
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
            debugLogger.warn('Failed to save theme to localStorage:', e);
        }

        // Sync to cookie for server-side rendering
        try {
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);
            document.cookie = `theme-id=${themeId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
            document.cookie = `theme-mode=${isDark ? 'dark' : 'light'}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        } catch (e) {
            debugLogger.warn('Failed to save theme to cookie:', e);
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
    debugLogger.log('📚 loadThemeFromStorage called');
    try {
        const savedThemeId = localStorage.getItem('theme-id');
        const savedMode = localStorage.getItem('theme-mode');
        debugLogger.log('💾 localStorage data:', { savedThemeId, savedMode });

        if (savedThemeId) {
            // Check if it's a company theme and activate it if needed
            const companyTheme = themesData.company.find(t => t.id === savedThemeId);
            if (companyTheme) {
                debugLogger.log('🏢 Found company theme in localStorage:', savedThemeId);
                // Reactivate company theme if it was previously active
                setSessionCompany(savedThemeId);
                
                // Emit event to notify ThemeControl that company theme is active
                if (typeof window !== 'undefined') {
                    // Use setTimeout to ensure the event is emitted after components are initialized
                    setTimeout(() => {
                        debugLogger.log('📢 Emitting company-theme-activated from loadThemeFromStorage');
                        const companyEvent = new CustomEvent('company-theme-activated', {
                            detail: { themeId: savedThemeId, theme: companyTheme, category: 'company' }
                        });
                        window.dispatchEvent(companyEvent);
                    }, 100);
                }
            } else {
                debugLogger.log('📝 Not a company theme:', savedThemeId);
            }
            
            // Validate saved theme exists in available theme list (respects exclusivity)
            const availableThemes = getAvailableThemes();
            const theme = availableThemes.find((t) => t.id === savedThemeId) ? savedThemeId : availableThemes[0]?.id || 'dos';
            
            const isDark = savedMode === 'dark';
            const mode = isDark ? 'dark' : 'light';

            return { themeId: theme, isDark, mode };
        } else {
            // No saved theme, use first available theme
            const availableThemes = getAvailableThemes();
            return { themeId: availableThemes[0]?.id || 'dos', isDark: false, mode: 'light' };
        }
    } catch (e) {
        return { themeId: 'dos', isDark: false, mode: 'light' };
    }
}

// Initialize theme on page load
export function initializeTheme() {
    const { themeId, isDark } = loadThemeFromStorage();
    applyTheme(themeId, isDark);
    
    
    return { themeId, isDark };
}
