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

    // Create notification using same style as konami toast with timer
    const notification = document.createElement('div');

    // Add icon + text content with close button and timer bar
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 6px; padding-bottom: 4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;">
                <circle cx="13.5" cy="6.5" r=".5"/>
                <circle cx="17.5" cy="10.5" r=".5"/>
                <circle cx="8.5" cy="7.5" r=".5"/>
                <circle cx="6.5" cy="12.5" r=".5"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
            </svg>
            <span style="line-height: 1.3; flex: 1;">${themeMessages.company.replace('{company}', companyName)}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: var(--color-secondary); cursor: pointer; padding: 0; font-size: 14px; line-height: 1; flex-shrink: 0; opacity: 0.7; margin-left: 4px;">×</button>
        </div>
        <div style="position: absolute; bottom: 0; left: 0; height: 2px; background: var(--color-secondary); width: 100%;" class="toast-progress-bar"></div>
    `;

    // Lean toast styles with relative positioning for timer
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: -400px;
        background: var(--color-main);
        color: var(--color-secondary);
        border: 2px solid var(--color-secondary);
        padding: 10px 12px 12px 12px;
        font-family: monospace;
        font-weight: bold;
        font-size: 13px;
        z-index: 10000;
        max-width: 280px;
        border-radius: 4px;
        transition: right 0.4s ease-out;
        box-shadow: 4px 4px 0px var(--color-secondary);
        position: relative;
        overflow: hidden;
    `;

    // Add timer animation CSS with reduced motion support
    const style = document.createElement('style');
    style.textContent = `
        @keyframes companyToastProgress {
            from { width: 100%; }
            to { width: 0%; }
        }

        .toast-progress-bar {
            animation: companyToastProgress 5s linear forwards;
        }

        @media (prefers-reduced-motion: reduce) {
            .toast-progress-bar {
                animation: none;
                width: 0% !important;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // No animation - show immediately at final position
        notification.style.right = '20px';
        notification.style.position = 'fixed';
        notification.style.transition = 'none'; // Disable slide transition

        // Remove after 5 seconds without animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    } else {
        // Normal animation - slide in from right
        setTimeout(() => {
            notification.style.right = '20px';
            notification.style.position = 'fixed'; // Ensure fixed positioning after animation
        }, 50);

        // Slide out and remove after 5 seconds (synced with timer)
        setTimeout(() => {
            notification.style.right = '-400px';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }, 5000);
    }
}
