import * as React from 'react';
import DropdownButton, { DropdownItem } from './DropdownButton';
import { applyTheme } from '../data/themes.js';

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
    
    // Get theme name in Spanish (forced for all languages)
    const getThemeNameInSpanish = (themeId: string): string => {
        // Use same mapping as navbar placeholder to ensure consistency
        const themeNames: { [key: string]: string } = {
            'gameboy': 'GAMEBOY',
            'dos': 'TERMINAL', 
            'commodore64': 'COMMODORE',
            'caution': 'PRECAUCION',
            'sunset': 'ATARDECER',
            'neon': 'NEON',
            'ocean': 'OCEANO',
            'forest': 'BOSQUE',
            'ember': 'BRASA',
            'violet': 'VIOLETA'
        };
        return themeNames[themeId] || themeId.toUpperCase();
    };
    
    // Get mode name in Spanish (forced for all languages)
    const getModeNameInSpanish = (mode: Mode): string => {
        // Use same mapping as navbar placeholder to ensure consistency
        const modeNames: { [key: string]: string } = {
            'light': 'CLARO',
            'dark': 'OSCURO',
            'system': 'SISTEMA'
        };
        return modeNames[mode] || mode.toUpperCase();
    };
    
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
        if (!currentTheme) return;
        const currentIndex = themes.findIndex((t) => t.id === currentTheme.id);
        const nextIndex = (currentIndex + 1) % themes.length;
        const newTheme = themes[nextIndex];
        handleThemeSelect(newTheme);
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

    // Handle mode select from dropdown
    const handleModeSelect = (mode: Mode) => {
        handleModeChange(mode);
    };


    const renderThemeControls = () => {
        // Don't render anything until fully mounted and ready
        if (!isMounted) return null;
        
        return (
            <DropdownButton
                onMainClick={nextTheme}
                disabled={false}
                dropdownContent={
                        <div>
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => {
                                        console.log('Theme clicked:', theme.id);
                                        handleThemeSelect(theme);
                                    }}
                                    className={`w-full px-2 py-1 text-left focus:outline-none block cursor-pointer relative z-10 ${
                                        currentTheme?.id === theme.id ? 'bg-main text-secondary' : 'bg-secondary text-main hover:bg-main hover:text-secondary'
                                    }`}
                                    style={{ minHeight: '40px' }}
                                >
                                    <div className="flex items-center gap-0 pointer-events-none">
                                        <div
                                            className="w-6 h-6 aspect-square flex-shrink-0 border border-main pointer-events-none"
                                            style={{ 
                                                background: `linear-gradient(135deg, ${theme.colorful} 50%, ${theme.contrasty} 50%)`,
                                                boxShadow: `inset 0 0 0 1px ${theme.contrasty}`
                                            }}
                                        />
                                        <span className="flex-1 px-2 py-2 font-mono text-xs font-semibold pointer-events-none select-none">{getThemeNameInSpanish(theme.id)}</span>
                                        <div className="w-4 h-4 flex items-center justify-center pointer-events-none">
                                            {currentTheme?.id === theme.id && (
                                                <svg
                                                    className="w-4 h-4 pointer-events-none"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <polyline points="20,6 9,17 4,12" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    }
                    className="w-7 h-7 @6xl:w-full @6xl:h-8"
                >
                    <div className="flex items-center gap-2 w-full">
                        <div
                            className="w-4 h-4 border border-main theme-preview-current flex-shrink-0"
                            style={{ 
                                background: `linear-gradient(135deg, var(--color-main) 50%, var(--color-secondary) 50%)`
                            }}
                        />
                        <span className="hidden @6xl:block font-mono text-xs font-semibold text-main group-hover:text-secondary truncate">
                            {getThemeNameInSpanish(currentTheme.id)}
                        </span>
                    </div>
                </DropdownButton>
        );
    };

    const renderModeControls = () => {
        // Don't render anything until fully mounted and ready
        if (!isMounted) return null;
        
        return (
            <DropdownButton
                onMainClick={toggleMode}
                disabled={false}
                dropdownContent={
                        <div>
                            {(['light', 'dark', 'system'] as Mode[]).map((mode) => (
                                <DropdownItem
                                    key={mode}
                                    selected={currentMode === mode}
                                    onClick={() => handleModeSelect(mode)}
                                    className="font-mono text-xs font-semibold uppercase tracking-wider"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-3.5 h-3.5 relative flex-shrink-0">{getModeIcon(mode, '')}</div>
                                        <span>
                                            {getModeNameInSpanish(mode)}
                                        </span>
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            {currentMode === mode && (
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <polyline points="20,6 9,17 4,12" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </DropdownItem>
                            ))}
                        </div>
                    }
                    className="w-7 h-7 @6xl:w-auto @6xl:h-8"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 relative flex-shrink-0">{getModeIcon(currentMode, '')}</div>
                        <span className="hidden @6xl:block font-mono text-xs font-semibold text-main group-hover:text-secondary">{getModeNameInSpanish(currentMode)}</span>
                    </div>
                </DropdownButton>
        );
    };

    return (
        <>
            {renderThemeControls()}
            {renderModeControls()}
        </>
    );
}