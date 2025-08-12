import * as React from 'react';
import { applyTheme } from '../data/themes.js';

const { useState, useEffect, useCallback } = React;

export interface Theme {
    id: string;
    name: string;
    description: string;
    colorful: string;
    contrasty: string;
}

export type Mode = 'light' | 'dark' | 'system';

export function useThemeMode(themes: Theme[]) {
    // Initialize theme from global state or localStorage
    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            // Check global state first (set by navbar script)
            const globalThemeId = (window as any).__THEME_ID__;
            if (globalThemeId) {
                const globalTheme = themes.find((t) => t.id === globalThemeId);
                if (globalTheme) return globalTheme;
            }
            
            // Fallback to localStorage
            const savedThemeId = localStorage.getItem('theme-id');
            if (savedThemeId) {
                const savedTheme = themes.find((t) => t.id === savedThemeId);
                if (savedTheme) return savedTheme;
            }
            
            // Only set random theme if no theme was previously saved AND not already marked as ready
            if (!(window as any).__THEME_READY__) {
                const randomIndex = Math.floor(Math.random() * themes.length);
                const randomTheme = themes[randomIndex] || themes[0];
                
                // Save the random theme immediately so placeholder can use it
                localStorage.setItem('theme-id', randomTheme.id);
                (window as any).__THEME_ID__ = randomTheme.id;
                (window as any).__THEME_READY__ = true;
                
                return randomTheme;
            }
        }
        
        // Fallback for SSR or if no theme found
        return themes[0];
    });
    
    const [currentMode, setCurrentMode] = useState<Mode>(() => {
        if (typeof window !== 'undefined') {
            // Check global state first
            const globalMode = (window as any).__THEME_MODE__;
            if (globalMode && (globalMode === 'light' || globalMode === 'dark' || globalMode === 'system')) {
                return globalMode;
            }
            
            // Fallback to localStorage
            const savedMode = localStorage.getItem('theme-mode');
            if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
                return savedMode;
            }
        }
        return 'system';
    });
    
    // Start unmounted to prevent flash of first theme
    const [isMounted, setIsMounted] = useState(false);
    
    // Apply theme and mode to document
    const applyThemeToDocument = useCallback((theme: Theme, mode: Mode) => {
        if (typeof window === 'undefined') return;
        
        let resolvedMode = mode;
        if (mode === 'system') {
            resolvedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        const isDark = resolvedMode === 'dark';
        applyTheme(theme.id, isDark, null);
        
        // Save to localStorage
        localStorage.setItem('theme-id', theme.id);
        localStorage.setItem('theme-mode', mode);
        
        // Update global state for subsequent page loads
        (window as any).__THEME_ID__ = theme.id;
        (window as any).__THEME_MODE__ = mode;
        (window as any).__THEME_READY__ = true;
    }, []);

    // Initialize and apply theme/mode, then mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Apply the current theme immediately
            applyThemeToDocument(currentTheme, currentMode);
            
            // Save initial theme to localStorage if not already saved
            const savedThemeId = localStorage.getItem('theme-id');
            if (!savedThemeId) {
                localStorage.setItem('theme-id', currentTheme.id);
            }
            const savedMode = localStorage.getItem('theme-mode');
            if (!savedMode) {
                localStorage.setItem('theme-mode', currentMode);
            }
            
            // Wait a tiny bit to ensure theme is applied before mounting
            requestAnimationFrame(() => {
                setIsMounted(true);
            });
        }
    }, []);
    
    // Signal when components are ready - only after theme is correctly applied and rendered
    useEffect(() => {
        if (isMounted && currentTheme && currentMode && typeof window !== 'undefined') {
            // Apply theme first
            applyThemeToDocument(currentTheme, currentMode);
            
            // Wait for next frame to ensure React has rendered with correct theme
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Signal that React components are ready to be shown
                    const event = new CustomEvent('react-header-ready', {
                        detail: { themeId: currentTheme.id, mode: currentMode }
                    });
                    window.dispatchEvent(event);
                });
            });
        }
    }, [isMounted, currentTheme, currentMode, applyThemeToDocument]);

    // Handle theme selection
    const handleThemeSelect = useCallback((theme: Theme) => {
        setCurrentTheme(theme);
        applyThemeToDocument(theme, currentMode);
    }, [currentMode, applyThemeToDocument]);
    
    // Handle mode change
    const handleModeChange = useCallback((mode: Mode) => {
        setCurrentMode(mode);
        applyThemeToDocument(currentTheme, mode);
    }, [currentTheme, applyThemeToDocument]);
    
    // Previous theme handler
    const prevTheme = useCallback(() => {
        if (!currentTheme) return;
        const currentIndex = themes.findIndex((t) => t.id === currentTheme.id);
        const prevIndex = currentIndex === 0 ? themes.length - 1 : currentIndex - 1;
        const newTheme = themes[prevIndex];
        handleThemeSelect(newTheme);
    }, [currentTheme, themes, handleThemeSelect]);

    // Next theme handler
    const nextTheme = useCallback(() => {
        if (!currentTheme || !themes || themes.length === 0) return;
        const currentIndex = themes.findIndex((t) => t.id === currentTheme.id);
        const nextIndex = (currentIndex + 1) % themes.length;
        const newTheme = themes[nextIndex];
        if (newTheme) {
            handleThemeSelect(newTheme);
        }
    }, [currentTheme, themes, handleThemeSelect]);

    // Listen for system preference changes when in system mode
    useEffect(() => {
        if (isMounted && currentMode === 'system' && typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                applyThemeToDocument(currentTheme, 'system');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [currentMode, currentTheme, applyThemeToDocument, isMounted]);

    // Keyboard shortcuts for theme navigation
    useEffect(() => {
        if (!isMounted || typeof window === 'undefined') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Only respond to keyboard shortcuts if no input is focused
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }

            // Left/Right arrow keys for theme navigation
            if (e.key === 'ArrowLeft' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                prevTheme();
            } else if (e.key === 'ArrowRight' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                nextTheme();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [prevTheme, nextTheme, isMounted]);

    // Handle mode toggle (main button action)
    const toggleMode = () => {
        if (!isMounted || typeof window === 'undefined') return;

        let nextMode: Mode;

        if (currentMode === 'system') {
            // If in system mode, detect current preference and switch to the opposite
            const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            nextMode = isSystemDark ? 'light' : 'dark';
        } else {
            // Toggle between light and dark
            nextMode = currentMode === 'light' ? 'dark' : 'light';
        }

        // Toggle mode
        handleModeChange(nextMode);
    };

    return {
        currentTheme,
        currentMode,
        isMounted,
        themes,
        handleThemeSelect,
        handleModeChange,
        prevTheme,
        nextTheme,
        toggleMode
    };
}