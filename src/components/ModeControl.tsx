import * as React from 'react';
import DropdownButton, { DropdownContent } from './DropdownButton';
import { applyTheme, themes } from '../data/themes.js';
import { getClientTranslations, getTranslations } from '../i18n/utils';

type Mode = 'light' | 'dark' | 'system';

export default function ModeControl() {
    // Get translations without hooks to avoid conflicts
    const t = typeof window === 'undefined' ? getTranslations('es') : getClientTranslations();
    
    const [currentMode, setCurrentMode] = React.useState<Mode>(() => {
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
    
    const [isMounted, setIsMounted] = React.useState(false);

    // Get mode name in current language
    const getModeName = React.useCallback((mode: Mode): string => {
        return t(`mode.${mode}` as any) || mode.charAt(0).toUpperCase() + mode.slice(1);
    }, [t]);
    
    // Get mode icon
    const getModeIcon = React.useCallback((mode: Mode, className = 'w-3.5 h-3.5') => {
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
    }, []);

    // Apply mode to document
    const applyModeToDocument = React.useCallback((mode: Mode) => {
        if (typeof window === 'undefined') return;
        
        // Get current theme from localStorage or global state
        const savedThemeId = localStorage.getItem('theme-id') || (window as any).__THEME_ID__;
        const currentTheme = themes.find(t => t.id === savedThemeId) || themes[0];
        
        let resolvedMode = mode;
        if (mode === 'system') {
            resolvedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        const isDark = resolvedMode === 'dark';
        applyTheme(currentTheme.id, isDark, null);
        
        // Save to localStorage
        localStorage.setItem('theme-mode', mode);
        
        // Update global state
        (window as any).__THEME_MODE__ = mode;
    }, []);

    // Mount immediately - don't wait for theme
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            applyModeToDocument(currentMode);
            setIsMounted(true);
            
            // Signal that mode control is ready
            setTimeout(() => {
                const event = new CustomEvent('mode-control-ready', {
                    detail: { mode: currentMode }
                });
                window.dispatchEvent(event);
            }, 0);
        }
    }, []);

    // Handle mode change
    const handleModeChange = React.useCallback((mode: Mode) => {
        setCurrentMode(mode);
        applyModeToDocument(mode);
    }, [applyModeToDocument]);

    // Listen for system preference changes when in system mode
    React.useEffect(() => {
        if (isMounted && currentMode === 'system' && typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                applyModeToDocument('system');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [currentMode, applyModeToDocument, isMounted]);

    // Handle mode toggle (main button action)
    const toggleMode = React.useCallback(() => {
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

        handleModeChange(nextMode);
    }, [currentMode, isMounted, handleModeChange]);

    // Find the index of the current mode
    const modes: Mode[] = ['light', 'dark', 'system'];
    const currentModeIndex = modes.findIndex(mode => mode === currentMode);
    const selectedIndex = currentModeIndex >= 0 ? currentModeIndex : 0;
    
    // Don't render until mounted
    if (!isMounted) return null;
    
    return (
        <DropdownButton
            onMainClick={toggleMode}
            disabled={false}
            initialSelectedIndex={selectedIndex}
            ariaLabel={`${t('mode.current' as any)} ${getModeName(currentMode)}. ${t('mode.toggle' as any)}`}
            dropdownContent={
                <DropdownContent>
                    {(['light', 'dark', 'system'] as Mode[]).map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => handleModeChange(mode)}
                            className="w-full px-1 py-0.5 text-left block cursor-pointer relative focus-visible:z-[9999]"
                            data-selected={currentMode === mode ? 'true' : 'false'}
                            style={{
                                outlineWidth: '1px',
                                outlineOffset: '1px',
                                minHeight: '32px'
                            }}
                        >
                            <div className="flex items-center gap-0 pointer-events-none">
                                <div className="w-3.5 h-3.5 relative flex-shrink-0 ml-1">{getModeIcon(mode, '')}</div>
                                <span className="flex-1 px-1 py-1 font-grotesk text-sm font-semibold pointer-events-none select-none uppercase">
                                    {getModeName(mode)}
                                </span>
                                <div className="w-4 h-4 flex items-center justify-center pointer-events-none">
                                    {currentMode === mode && (
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
                </DropdownContent>
            }
            className="w-7 h-7 @6xl:w-auto @6xl:h-8"
        >
            <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 relative flex-shrink-0 translate-y-[-1px]">{getModeIcon(currentMode, '')}</div>
                <span className="hidden @6xl:block font-grotesk text-sm font-semibold text-main group-hover:text-secondary group-focus-visible:text-secondary uppercase">{getModeName(currentMode)}</span>
            </div>
        </DropdownButton>
    );
}