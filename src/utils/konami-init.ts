// Konami Code Initialization Module
// This file handles the initialization of the Konami code detector
// and integrates it with the theme system

import { debugLogger } from '@/utils/debug-logger';
import konami from '@/utils/konami.js';
import { toggleAllHiddenThemes } from '@/data/themes.js';

let konamiInitialized = false;

/**
 * Initialize the Konami code listener
 * This should only be called once per page load
 */
export async function initKonami() {
    // Check if already initialized globally
    if (konamiInitialized || (window as any).__KONAMI_INITIALIZED__) {
        debugLogger.warn('🎮 Konami already initialized globally, skipping');
        return;
    }

    konamiInitialized = true;
    (window as any).__KONAMI_INITIALIZED__ = true;

    try {
        debugLogger.group('🎮 Konami Code Initialization');
        debugLogger.log('Starting konami initialization...');

        // Start listening for key events
        konami.start();
        debugLogger.log('🎧 Konami event listener started');

        // Add activation callback
        konami.onActivate(async () => {
            try {
                debugLogger.group('🎮 Konami Code Activation');
                debugLogger.log('Starting Konami code activation sequence');

                // Toggle themes first to know if we should show confetti
                debugLogger.log('🎨 About to toggle hidden themes');
                const result = toggleAllHiddenThemes() || { action: 'locked', themes: [], companyCleared: false };
                debugLogger.log('🎨 Toggle result:', result);

                const themeMessages = (window as any).__THEME_MESSAGES__;
                const unlocked = result.action === 'unlocked';
                const companyCleared = Boolean(result.companyCleared);
                debugLogger.log('🏢 Company cleared during toggle:', companyCleared, '| Prev company:', result.previouslyActiveCompany, '| Fallback theme:', result.fallbackThemeId);
                debugLogger.log('🎨 Unlocked status:', unlocked);
                debugLogger.log('🎨 Theme messages:', themeMessages);

                // Only show confetti when UNLOCKING themes
                if (unlocked) {
                    createSimpleConfetti();
                    debugLogger.log('🎊 Confetti rain started for unlock');
                } else {
                    debugLogger.log('🚫 No confetti for lock action');
                }

                // Dispatch event to update theme controls UI
                if (unlocked) {
                    const themeEvent = new CustomEvent('themes-unlocked', {
                        detail: { themes: result.themes, action: result.action }
                    });
                    window.dispatchEvent(themeEvent);
                    debugLogger.log('📡 Dispatched themes-unlocked event', themeEvent.detail);
                } else {
                    const themeEvent = new CustomEvent('themes-locked', {
                        detail: { themes: result.themes, action: result.action }
                    });
                    window.dispatchEvent(themeEvent);
                    debugLogger.log('📡 Dispatched themes-locked event', themeEvent.detail);
                }

                // Show notification
                showKonamiNotification(unlocked, themeMessages, result, companyCleared);

                debugLogger.log('🎭 Notification shown and scheduled for removal');
                debugLogger.groupEnd();

            } catch (error) {
                debugLogger.error('❌ Konami callback error:', error);
                debugLogger.groupEnd();
            }
        });

        // Clean up on page unload
        window.addEventListener('beforeunload', () => konami.stop());

        debugLogger.log('🎮 Konami initialization completed successfully');
        debugLogger.groupEnd();

    } catch (error) {
        debugLogger.error('❌ Konami initialization error:', error);
        debugLogger.groupEnd();
    }
}

/**
 * Reset the Konami initialization state
 * Called before page transitions to allow re-initialization
 */
export function resetKonami() {
    konami.stop();
    konamiInitialized = false;
    (window as any).__KONAMI_INITIALIZED__ = false;
}

/**
 * Create simple confetti effect without React
 */
function createSimpleConfetti() {
    debugLogger.log('🎊 Creating simple confetti effect');
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        pointer-events: none; z-index: 9999; overflow: hidden;
    `;
    document.body.appendChild(confettiContainer);

    const computedStyle = getComputedStyle(document.documentElement);
    const mainColor = computedStyle.getPropertyValue('--color-main').trim() || '#000000';

    // Create simple falling squares as confetti
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 8px; height: 8px;
            background: ${mainColor};
            left: ${Math.random() * 100}vw;
            top: -10px;
            animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        confettiContainer.appendChild(particle);
    }

    // Add animation keyframes if not exist
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confetti-fall {
                to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        if (confettiContainer.parentNode) confettiContainer.remove();
    }, 6000);
}

/**
 * Show notification when Konami code is activated
 */
function showKonamiNotification(
    unlocked: boolean,
    themeMessages: any,
    result: any,
    companyCleared: boolean
) {
    const notification = document.createElement('div');
    if (unlocked) {
        const themeCount = result.themes ? result.themes.length : 0;
        notification.textContent = themeMessages.unlocked.replace('{count}', themeCount);
    } else {
        const messages = [themeMessages.locked];
        if (companyCleared && themeMessages.companyHidden) {
            messages.push(themeMessages.companyHidden);
        }
        notification.textContent = messages.join(' ');
    }

    notification.style.cssText = `
        position: fixed; top: 120px; right: -400px;
        background: var(--color-main); color: var(--color-secondary);
        border: 2px solid var(--color-secondary); padding: 12px 16px;
        font-family: monospace; font-weight: bold; font-size: 14px;
        z-index: 10000; max-width: 280px; border-radius: 4px;
        transition: right 0.4s ease-out; box-shadow: 4px 4px 0px var(--color-secondary);
    `;

    document.body.appendChild(notification);
    setTimeout(() => { notification.style.right = '20px'; }, 50);
    setTimeout(() => {
        notification.style.right = '-400px';
        setTimeout(() => notification.remove(), 400);
    }, unlocked ? 4000 : 3000);
}
