// Company Theme Query Parameter Detection Module
// Handles automatic theme unlocking and application via URL parameters

import { debugLogger } from '@/utils/debug-logger';
import {
    unlockCompanyTheme,
    unlockSpecialTheme,
    getCompanyThemes,
    getSpecialThemes,
    applyTheme
} from '@/data/themes.js';
import { showToast } from '@/utils/toast';

/**
 * Check URL for company/special theme query parameters
 * Supports both modern (?theme=theme-name) and legacy (?theme-name) formats
 */
export function checkCompanyQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);

    // Get all company and special themes that can be unlocked via query params
    const companyThemes = getCompanyThemes();
    const specialThemes = getSpecialThemes();
    const unlockableThemes = [...companyThemes, ...specialThemes];

    // Check for modern ?theme=theme-name format first
    const themeParam = urlParams.get('theme');
    let matchedTheme = null;

    if (themeParam) {
        matchedTheme = unlockableThemes.find(t => t.id === themeParam);
    }

    // Fallback to legacy format (?theme-name) for backwards compatibility
    if (!matchedTheme) {
        for (const theme of unlockableThemes) {
            if (urlParams.has(theme.id)) {
                matchedTheme = theme;
                break;
            }
        }
    }

    if (matchedTheme) {
        // Try to unlock the theme
        const isCompany = companyThemes.find(t => t.id === matchedTheme.id);
        const unlocked = isCompany
            ? unlockCompanyTheme(matchedTheme.id)
            : unlockSpecialTheme(matchedTheme.id);

        // Always apply the theme and show toast when parameter is detected
        // regardless of whether it was just unlocked or already unlocked
        if (unlocked !== undefined) {
            // Auto-apply company theme first
            setTimeout(() => {
                const savedMode = localStorage.getItem('theme-mode') || 'system';
                let isDark = false;
                if (savedMode === 'system') {
                    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                } else {
                    isDark = savedMode === 'dark';
                }

                applyTheme(matchedTheme.id, isDark);
                (window as any).__THEME_ID__ = matchedTheme.id;
                (window as any).__THEME_READY__ = true;
                if ((window as any).__APPLY_THEME_INSTANTLY__) {
                    (window as any).__APPLY_THEME_INSTANTLY__();
                }

                // Trigger theme control update by dispatching a custom event
                const themeChangeEvent = new CustomEvent('company-theme-activated', {
                    detail: { themeId: matchedTheme.id, isDark, theme: matchedTheme }
                });
                window.dispatchEvent(themeChangeEvent);

                // Show notification 1 second after theme is applied
                setTimeout(() => {
                    showCompanyThemeNotification(matchedTheme);
                }, 1000);

            }, 500);

            // Remove query param from URL to keep it clean
            const newUrl = new URL(window.location.href);
            if (themeParam) {
                newUrl.searchParams.delete('theme');
            } else {
                newUrl.searchParams.delete(matchedTheme.id);
            }
            window.history.replaceState({}, '', newUrl.toString());
        }
    }
}

/**
 * Show notification when a company theme is activated via URL parameter
 */
function showCompanyThemeNotification(matchedTheme: any) {
    const themeMessages = (window as any).__THEME_MESSAGES__;
    const companyName = matchedTheme.id.charAt(0).toUpperCase() + matchedTheme.id.slice(1);

    const message = themeMessages.company.replace('{company}', companyName);

    showToast({
        id: 'company-theme-toast',
        message,
        duration: 5000,
        kind: 'success'
    });
}
