import * as React from 'react';
import DropdownButton, { DropdownItem, DropdownSeparator } from './DropdownButton';

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
    const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
    const [currentMode, setCurrentMode] = useState<Mode>('light');

    // Apply theme to document
    const applyTheme = useCallback((theme: Theme) => {
        document.documentElement.setAttribute('data-theme-id', theme.id);
        document.documentElement.style.setProperty('--theme-colorful', theme.colorful);
        document.documentElement.style.setProperty('--theme-contrasty', theme.contrasty);

        try {
            localStorage.setItem('theme-id', theme.id);
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    }, []);

    // Apply mode to document
    const applyMode = useCallback((mode: Mode) => {
        let resolvedMode = mode;
        if (mode === 'system') {
            resolvedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        // Apply the dark class for styling
        document.documentElement.classList.toggle('dark', resolvedMode === 'dark');
        // Also set the data-theme attribute for compatibility
        document.documentElement.setAttribute('data-theme', resolvedMode);

        try {
            localStorage.setItem('theme-mode-preference', mode);
            localStorage.setItem('theme-mode', resolvedMode);
        } catch (error) {
            console.warn('Failed to save mode:', error);
        }
    }, []);

    // Initialize from localStorage
    useEffect(() => {
        try {
            const savedThemeId = localStorage.getItem('theme-id') || themes[0].id;
            const savedMode = (localStorage.getItem('theme-mode-preference') as Mode) || 'light';

            const theme = themes.find((t) => t.id === savedThemeId) || themes[0];
            setCurrentTheme(theme);
            setCurrentMode(savedMode);

            // Apply initial theme and mode
            applyTheme(theme);
            applyMode(savedMode);
        } catch (error) {
            console.warn('Failed to load theme from storage:', error);
        }
    }, [themes, applyTheme, applyMode]);

    // Listen for system preference changes when in system mode
    useEffect(() => {
        if (currentMode === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                applyMode('system');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [currentMode, applyMode]);

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

    // Handle mode toggle (main button action)
    const toggleMode = () => {
        const modes: Mode[] = ['light', 'dark', 'system'];
        const currentIndex = modes.indexOf(currentMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];

        setCurrentMode(nextMode);
        applyMode(nextMode);
    };

    // Handle mode selection from dropdown
    const handleModeSelect = (mode: Mode) => {
        setCurrentMode(mode);
        applyMode(mode);
    };

    // Handle theme change (main button action)
    const nextTheme = () => {
        const currentIndex = themes.findIndex((t) => t.id === currentTheme.id);
        const nextIndex = (currentIndex + 1) % themes.length;
        const newTheme = themes[nextIndex];

        setCurrentTheme(newTheme);
        applyTheme(newTheme);
    };

    // Handle theme selection from dropdown
    const handleThemeSelect = (theme: Theme) => {
        setCurrentTheme(theme);
        applyTheme(theme);
    };

    // Theme navigation functions
    const prevTheme = () => {
        const currentIndex = themes.findIndex((t) => t.id === currentTheme.id);
        const prevIndex = currentIndex === 0 ? themes.length - 1 : currentIndex - 1;
        const newTheme = themes[prevIndex];

        setCurrentTheme(newTheme);
        applyTheme(newTheme);
    };

    const randomTheme = () => {
        const randomIndex = Math.floor(Math.random() * themes.length);
        const newTheme = themes[randomIndex];

        setCurrentTheme(newTheme);
        applyTheme(newTheme);
    };

    return (
        <div className="flex justify-end items-center gap-x-4 gap-y-1 pointer-events-auto">
            {/* Mode Toggle */}
            <DropdownButton
                onMainClick={toggleMode}
                dropdownContent={
                    <div>
                        {(['light', 'dark', 'system'] as const).map((mode) => (
                            <DropdownItem
                                key={mode}
                                onClick={() => handleModeSelect(mode)}
                                className={`flex items-center gap-2 border-b border-main last:border-b-0 ${
                                    currentMode === mode ? 'bg-main text-secondary' : ''
                                }`}
                            >
                                {getModeIcon(mode, 'w-3 h-3')}
                                <span className="flex-1 px-1 font-mono text-xs font-semibold">{mode.toUpperCase()}</span>
                                {currentMode === mode && (
                                    <svg
                                        className="w-2.5 h-2.5"
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
                            </DropdownItem>
                        ))}
                    </div>
                }
                className="w-7 h-7 md:w-auto md:h-8"
            >
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 relative flex-shrink-0">{getModeIcon(currentMode)}</div>
                    <span className="hidden md:block font-mono text-xs font-semibold text-main group-hover:text-secondary">{currentMode.toUpperCase()}</span>
                </div>
            </DropdownButton>

            {/* Theme Switcher */}
            <DropdownButton
                onMainClick={nextTheme}
                dropdownContent={
                    <div>
                        {themes.map((theme) => (
                            <DropdownItem
                                key={theme.id}
                                onClick={() => handleThemeSelect(theme)}
                                className={`flex items-center gap-2 border-b border-main last:border-b-0 ${
                                    currentTheme.id === theme.id ? 'bg-main text-secondary' : ''
                                }`}
                            >
                                <div
                                    className="w-3 h-3 border border-main flex-shrink-0"
                                    style={{
                                        background: `linear-gradient(135deg, ${theme.colorful} 50%, ${theme.contrasty} 50%)`
                                    }}
                                />
                                <span className="flex-1 px-1 font-mono text-xs font-semibold">{theme.name}</span>
                                {currentTheme.id === theme.id && (
                                    <svg
                                        className="w-2.5 h-2.5"
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
                            </DropdownItem>
                        ))}
                        <DropdownSeparator />
                        <div className="bg-main p-1 flex justify-between items-center gap-1">
                            <button
                                onClick={prevTheme}
                                className="hover:text-main hover:bg-secondary px-1 py-0.5 font-mono text-xs font-semibold text-secondary "
                            >
                                PREV [
                            </button>
                            <button
                                onClick={nextTheme}
                                className="hover:text-main hover:bg-secondary px-1 py-0.5 font-mono text-xs font-semibold text-secondary "
                            >
                                NEXT ]
                            </button>
                            <button
                                onClick={randomTheme}
                                className="hover:text-main hover:bg-secondary px-1 py-0.5 font-mono text-xs font-semibold text-secondary "
                            >
                                RANDOM _
                            </button>
                        </div>
                    </div>
                }
                className="w-7 h-7 md:w-auto md:h-8"
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 border border-main theme-preview-current flex-shrink-0"
                        style={{
                            background: `linear-gradient(135deg, ${currentTheme.colorful} 50%, ${currentTheme.contrasty} 50%)`
                        }}
                    />
                    <span className="hidden md:block font-mono text-xs font-semibold text-main group-hover:text-secondary">{currentTheme.name}</span>
                </div>
            </DropdownButton>
        </div>
    );
}
