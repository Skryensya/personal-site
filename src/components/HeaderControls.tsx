import * as React from 'react';
import DropdownButton, { DropdownItem, DropdownSeparator } from './DropdownButton';
import { applyTheme } from '../data/themes.js';
import { locales, type Locale, defaultLocale } from '@/utils/i18n';
import { getLoadingText } from '@/i18n/text-functions';

const { useState, useEffect, useCallback } = React;

interface Theme {
    id: string;
    name: string;
    description: string;
    colorful: string;
    contrasty: string;
}

interface HeaderControlsProps {
    themes: Theme[];
}

type Mode = 'light' | 'dark' | 'system';

export default function HeaderControls({ themes }: HeaderControlsProps) {
    // Initialize with better defaults to reduce loading time
    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        // Try to get initial theme immediately if possible
        if (typeof window !== 'undefined') {
            const appliedTheme = (window as any).__APPLIED_THEME__;
            if (appliedTheme) {
                return themes.find(t => t.id === appliedTheme) || themes[0];
            }
            const savedThemeId = localStorage.getItem('theme-id');
            if (savedThemeId) {
                return themes.find(t => t.id === savedThemeId) || themes[0];
            }
        }
        return themes[0]; // Fallback to first theme
    });
    const [currentMode, setCurrentMode] = useState<Mode>(() => {
        // Try to get initial mode immediately if possible
        if (typeof window !== 'undefined') {
            const appliedMode = (window as any).__APPLIED_MODE__;
            if (appliedMode) return appliedMode as Mode;
            const savedMode = localStorage.getItem('theme-mode-preference');
            if (savedMode) return savedMode as Mode;
        }
        return 'system';
    });
    const [isMounted, setIsMounted] = useState(false);

    // Detect locale from URL for loading text
    const getLocaleFromURL = (): Locale => {
        if (typeof window === 'undefined') return defaultLocale;
        const urlPath = window.location.pathname;
        const [, possibleLocale] = urlPath.split('/');
        if (possibleLocale && locales.includes(possibleLocale)) {
            return possibleLocale as Locale;
        }
        return defaultLocale;
    };

    // Fast hydration - just set mounted flag
    useEffect(() => {
        setIsMounted(true);
        
        // Quick sync check - only update if values have actually changed
        if (typeof window !== 'undefined') {
            try {
                const appliedTheme = (window as any).__APPLIED_THEME__;
                const appliedMode = (window as any).__APPLIED_MODE__;
                
                if (appliedTheme && appliedTheme !== currentTheme.id) {
                    const theme = themes.find((t) => t.id === appliedTheme);
                    if (theme) setCurrentTheme(theme);
                }
                
                if (appliedMode && appliedMode !== currentMode) {
                    setCurrentMode(appliedMode as Mode);
                }
            } catch (error) {
                console.warn('Failed to sync theme on mount:', error);
            }
        }
    }, [themes, currentTheme.id, currentMode]);

    // Apply theme to document using the official theme system
    const applyThemeWithMode = useCallback(
        (theme: Theme) => {
            // Only apply if the theme is actually different
            const currentAppliedTheme = document.documentElement.getAttribute('data-theme');
            if (currentAppliedTheme === theme.id) {
                return; // Theme is already applied, skip
            }
            
            const isDark = document.documentElement.classList.contains('dark');
            applyTheme(theme.id, isDark, currentMode);
        },
        [currentMode]
    );

    // Apply mode to document
    const applyMode = useCallback(
        (mode: Mode) => {
            if (typeof window === 'undefined') return;
            
            let resolvedMode = mode;
            if (mode === 'system') {
                resolvedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            const isDark = resolvedMode === 'dark';

            // Use the official theme system
            if (currentTheme) {
                applyTheme(currentTheme.id, isDark, mode);
            }

            try {
                localStorage.setItem('theme-mode-preference', mode);
                localStorage.setItem('theme-mode', resolvedMode);
                (window as any).__APPLIED_MODE__ = mode;
            } catch (error) {
                console.warn('Failed to save mode:', error);
            }
        },
        [currentTheme]
    );

    // Sync with Astro page transitions
    useEffect(() => {
        const handlePageLoad = () => {
            // Sync React state with what Layout.astro has applied
            try {
                const appliedTheme = (window as any).__APPLIED_THEME__;
                const appliedMode = (window as any).__APPLIED_MODE__;
                
                if (appliedTheme) {
                    const theme = themes.find((t) => t.id === appliedTheme);
                    if (theme && (!currentTheme || theme.id !== currentTheme.id)) {
                        setCurrentTheme(theme);
                    }
                }
                
                if (appliedMode && appliedMode !== currentMode) {
                    setCurrentMode(appliedMode as Mode);
                }
            } catch (error) {
                console.warn('Failed to sync theme on page load:', error);
            }
        };

        // Handle Astro page transitions
        document.addEventListener('astro:page-load', handlePageLoad);
        
        return () => {
            document.removeEventListener('astro:page-load', handlePageLoad);
        };
    }, [themes, currentTheme?.id, currentMode]);

    // Theme navigation functions - defined early for keyboard shortcuts
    const prevTheme = useCallback(() => {
        if (!currentTheme) return;
        
        const currentIndex = themes.findIndex((t) => t.id === currentTheme.id);
        const prevIndex = currentIndex === 0 ? themes.length - 1 : currentIndex - 1;
        const newTheme = themes[prevIndex];

        setCurrentTheme(newTheme);
        applyThemeWithMode(newTheme);
        
        // Save to localStorage and update window variables
        try {
            localStorage.setItem('theme-id', newTheme.id);
            (window as any).__APPLIED_THEME__ = newTheme.id;
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    }, [currentTheme, themes, applyThemeWithMode]);

    const nextTheme = useCallback(() => {
        if (!currentTheme) return;
        
        const currentIndex = themes.findIndex((t) => t.id === currentTheme.id);
        const nextIndex = (currentIndex + 1) % themes.length;
        const newTheme = themes[nextIndex];

        setCurrentTheme(newTheme);
        applyThemeWithMode(newTheme);
        
        // Save to localStorage and update window variables
        try {
            localStorage.setItem('theme-id', newTheme.id);
            (window as any).__APPLIED_THEME__ = newTheme.id;
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    }, [currentTheme, themes, applyThemeWithMode]);

    // Listen for system preference changes when in system mode
    useEffect(() => {
        if (isMounted && currentMode === 'system' && typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                applyMode('system');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [currentMode, applyMode, isMounted]);

    // Keyboard shortcuts for theme navigation
    useEffect(() => {
        if (!isMounted || typeof window === 'undefined') return;
        
        const handleKeyDown = (event: KeyboardEvent) => {
            // Only trigger if no modifier keys are pressed and not in an input
            if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
                return;
            }

            // Don't trigger if user is typing in an input, textarea, or contenteditable
            const target = event.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
                return;
            }

            // Use event.code for more reliable bracket detection
            switch (event.code) {
                case 'BracketLeft': // [
                    event.preventDefault();
                    prevTheme();
                    break;
                case 'BracketRight': // ]
                    event.preventDefault();
                    nextTheme();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [prevTheme, nextTheme, isMounted]);

    // Get mode icon
    const getModeIcon = (mode: Mode, className = 'w-3.5 h-3.5') => {
        switch (mode) {
            case 'light':
                return (
                    <svg className={`${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                );
            case 'dark':
                return (
                    <svg className={`${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                );
            case 'system':
                return (
                    <svg className={`${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                );
        }
    };

    // Handle mode toggle (main button action) - only toggles between light and dark
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

        setCurrentMode(nextMode);
        applyMode(nextMode);
    };

    // Handle mode selection from dropdown
    const handleModeSelect = (mode: Mode) => {
        setCurrentMode(mode);
        applyMode(mode);
    };

    // Handle theme change (main button action) - uses the nextTheme function defined above

    // Handle theme selection from dropdown
    const handleThemeSelect = (theme: Theme) => {
        setCurrentTheme(theme);
        applyThemeWithMode(theme);
        
        // Save to localStorage
        try {
            localStorage.setItem('theme-id', theme.id);
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    };

    const randomTheme = () => {
        const randomIndex = Math.floor(Math.random() * themes.length);
        const newTheme = themes[randomIndex];

        setCurrentTheme(newTheme);
        applyThemeWithMode(newTheme);
        
        // Save to localStorage and update window variables
        try {
            localStorage.setItem('theme-id', newTheme.id);
            (window as any).__APPLIED_THEME__ = newTheme.id;
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    };

    // Show minimal loading state only if really needed
    if (!isMounted) {
        const loadingLocale = getLocaleFromURL();
        const loadingText = getLoadingText(loadingLocale);
        
        return (
            <div className="flex justify-end items-center gap-x-4 gap-y-1 pointer-events-auto min-w-0">
                {/* Placeholder mode button */}
                <div className="w-7 h-7 md:w-auto md:h-8 bg-secondary border border-main flex items-center justify-center px-3 py-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 relative flex-shrink-0">{getModeIcon(currentMode, "")}</div>
                        <span className="hidden md:block font-mono text-xs font-semibold text-main">{currentMode.toUpperCase()}</span>
                    </div>
                </div>
                
                {/* Placeholder theme button */}
                <div className="w-7 h-7 md:w-full md:h-8 bg-secondary border border-main flex items-center justify-center px-3 py-2">
                    <div className="flex items-center gap-2 w-full">
                        <div 
                            className="w-4 h-4 border border-main flex-shrink-0" 
                            style={{ background: `linear-gradient(135deg, ${currentTheme.colorful} 50%, ${currentTheme.contrasty} 50%)` }}
                        />
                        <span className="hidden md:block font-mono text-xs font-semibold text-main flex-1 text-left">{currentTheme.name}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-end items-center gap-x-4 gap-y-1 pointer-events-auto min-w-0">

            {/* Theme Switcher */}
            <DropdownButton
                onMainClick={nextTheme}
                dropdownContent={
                    <div>
                        {themes.map((theme) => (
                            <DropdownItem
                                key={theme.id}
                                onClick={() => handleThemeSelect(theme)}
                                selected={currentTheme?.id === theme.id}
                                className="flex items-center gap-2 border-b border-main last:border-b-0"
                            >
                                <div
                                    className="w-3 h-3 border border-main flex-shrink-0"
                                    style={{ background: `linear-gradient(135deg, ${theme.colorful} 50%, ${theme.contrasty} 50%)` }}
                                />
                                <span className="flex-1 px-1 font-mono text-xs font-semibold">{theme.name}</span>
                                <div className="w-4 h-4 flex items-center justify-center">
                                    {currentTheme?.id === theme.id && (
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                    )}
                                </div>
                            </DropdownItem>
                        ))}
                        <DropdownSeparator />
                    </div>
                }
                className="w-7 h-7 md:w-full md:h-8"
            >
                <div className="flex items-center gap-2 w-full">
                    <div
                        className="w-4 h-4 border border-main theme-preview-current flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${currentTheme.colorful} 50%, ${currentTheme.contrasty} 50%)` }}
                    />
                    <span className="hidden md:block font-mono text-xs font-semibold text-main group-hover:text-secondary flex-1 text-left">{currentTheme.name}</span>
                </div>
            </DropdownButton>

                        {/* Mode Toggle */}
                        <DropdownButton
                onMainClick={toggleMode}
                dropdownContent={
                    <div>
                        {(['light', 'dark', 'system'] as const).map((mode) => (
                            <DropdownItem
                                key={mode}
                                onClick={() => handleModeSelect(mode)}
                                selected={currentMode === mode}
                                className="flex items-center gap-2 border-b border-main last:border-b-0"
                            >
                                {getModeIcon(mode, 'w-3 h-3')}
                                <span className="flex-1 px-1 font-mono text-xs font-semibold">{mode.toUpperCase()}</span>
                                <div className="w-4 h-4 flex items-center justify-center">
                                    {currentMode === mode && (
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                    )}
                                </div>
                            </DropdownItem>
                        ))}
                    </div>
                }
                className="w-7 h-7 md:w-auto md:h-8"
            >
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 relative flex-shrink-0">{getModeIcon(currentMode, "")}</div>
                    <span className="hidden md:block font-mono text-xs font-semibold text-main group-hover:text-secondary">{currentMode.toUpperCase()}</span>
                </div>
            </DropdownButton>

        </div>
    );
}
