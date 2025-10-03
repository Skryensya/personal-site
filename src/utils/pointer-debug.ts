// Utilidad para testing de pointer capabilities en dev tools
import { debugLogger } from '@/utils/debug-logger';

declare global {
    interface Window {
        __pointerDebug: {
            enableTouchMode: () => void;
            disableTouchMode: () => void;
            getTouchMode: () => boolean;
            getCurrentCapabilities: () => any;
        };
    }
}

export function setupPointerDebug() {
    if (typeof window === 'undefined') return;

    window.__pointerDebug = {
        enableTouchMode: () => {
            localStorage.setItem('force-touch-mode', 'true');
            window.dispatchEvent(new Event('resize')); // Trigger re-check
            debugLogger.log('🚀 Touch mode enabled - cards should now show touch behavior');
        },

        disableTouchMode: () => {
            localStorage.removeItem('force-touch-mode');
            window.dispatchEvent(new Event('resize')); // Trigger re-check
            debugLogger.log('🖱️ Touch mode disabled - cards should now show pointer behavior');
        },

        getTouchMode: () => {
            return localStorage.getItem('force-touch-mode') === 'true';
        },

        getCurrentCapabilities: () => {
            const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
            const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
            const canHover = window.matchMedia('(hover: hover)').matches;
            const isSmallViewport = window.innerWidth < 1024;
            const forceTouch = localStorage.getItem('force-touch-mode') === 'true';

            return {
                mediaQueries: {
                    'pointer: fine': hasFinePointer,
                    'pointer: coarse': hasCoarsePointer,
                    'hover: hover': canHover
                },
                viewport: {
                    width: window.innerWidth,
                    isSmall: isSmallViewport
                },
                override: {
                    forceTouchMode: forceTouch
                },
                finalResult: {
                    hasPointer: forceTouch && isSmallViewport ? false : hasFinePointer,
                    hasHover: forceTouch && isSmallViewport ? false : canHover
                }
            };
        }
    };

    debugLogger.log(`
🔧 Pointer Debug Tools Available:

Para simular touch en dev tools:
__pointerDebug.enableTouchMode()  // Activa modo touch
__pointerDebug.disableTouchMode() // Desactiva modo touch
__pointerDebug.getCurrentCapabilities() // Ver estado actual

Las cards deberían cambiar comportamiento al activar touch mode en viewports < 1024px
  `);
}

// Auto-setup en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    setupPointerDebug();
}
