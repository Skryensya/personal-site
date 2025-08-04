import React, { useState, useEffect } from 'react';
import DropdownButton, { DropdownItem, DropdownSeparator } from './DropdownButton';

interface Theme {
    id: string;
    name: string;
    colorful: string;
    contrasty: string;
}

interface ThemeSelectorProps {
    themes: Theme[];
    className?: string;
}

export default function ThemeSelector({ themes, className }: ThemeSelectorProps) {
    const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
    const [currentMode, setCurrentMode] = useState<'light' | 'dark' | 'system'>('light');

    // Initialize theme and mode from localStorage or system
    useEffect(() => {
        const savedThemeId = localStorage.getItem('theme') || 'void';
        const savedMode = (localStorage.getItem('mode') as 'light' | 'dark' | 'system') || 'light';

        const theme = themes.find((t) => t.id === savedThemeId) || themes[0];
        setCurrentTheme(theme);
        setCurrentMode(savedMode);
    }, [themes]);

    const handleThemeSelect = (theme: Theme) => {
        setCurrentTheme(theme);
        localStorage.setItem('theme', theme.id);

        // Apply theme to document
        document.documentElement.setAttribute('data-theme-id', theme.id);
        if (theme.id !== 'custom') {
            document.documentElement.style.setProperty('--theme-colorful', theme.colorful);
            document.documentElement.style.setProperty('--theme-contrasty', theme.contrasty);
        }

        // Trigger theme change event
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
    };

    const handleModeSelect = (mode: 'light' | 'dark' | 'system') => {
        setCurrentMode(mode);
        localStorage.setItem('mode', mode);

        // Apply mode to document
        let resolvedMode = mode;
        if (mode === 'system') {
            resolvedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        document.documentElement.setAttribute('data-theme', resolvedMode);

        // Trigger mode change event
        window.dispatchEvent(new CustomEvent('mode-changed', { detail: { mode, resolvedMode } }));
    };

    const nextTheme = () => {
        if (!currentTheme) return;
        const currentIndex = themes.findIndex((t) => t.id === currentTheme.id);
        const nextIndex = (currentIndex + 1) % themes.length;
        handleThemeSelect(themes[nextIndex]);
    };

    const prevTheme = () => {
        if (!currentTheme) return;
        const currentIndex = themes.findIndex((t) => t.id === currentTheme.id);
        const prevIndex = currentIndex === 0 ? themes.length - 1 : currentIndex - 1;
        handleThemeSelect(themes[prevIndex]);
    };

    const randomTheme = () => {
        const randomIndex = Math.floor(Math.random() * themes.length);
        handleThemeSelect(themes[randomIndex]);
    };

    const getModeIcon = (mode: 'light' | 'dark' | 'system') => {
        switch (mode) {
            case 'light':
                return (
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                );
            case 'dark':
                return (
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                );
            case 'system':
                return (
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                );
        }
    };

    if (!currentTheme) return null;

    return (
        <div className={`flex flex-col md:flex-row items-center gap-1 ${className}`}>
            {/* Mode Selector */}
            <DropdownButton
                dropdownContent={
                    <div>
                        {(['light', 'dark', 'system'] as const).map((mode) => (
                            <DropdownItem
                                key={mode}
                                onClick={() => handleModeSelect(mode)}
                                className={`flex items-center gap-2 ${currentMode === mode ? 'bg-main text-secondary' : ''}`}
                            >
                                {getModeIcon(mode)}
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
            >
                <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 relative flex-shrink-0">{getModeIcon(currentMode)}</div>
                    <span className="hidden md:block font-mono text-xs font-semibold">{currentMode.toUpperCase()}</span>
                </div>
            </DropdownButton>

            {/* Theme Selector */}
            <DropdownButton
                dropdownContent={
                    <div>
                        {themes.map((theme) => (
                            <DropdownItem
                                key={theme.id}
                                onClick={() => handleThemeSelect(theme)}
                                className={`flex items-center gap-2 ${currentTheme.id === theme.id ? 'bg-main text-secondary' : ''}`}
                            >
                                <div
                                    className="w-3 h-3 border border-main flex-shrink-0"
                                    style={
                                        theme.id === 'custom'
                                            ? {}
                                            : {
                                                  background: `linear-gradient(135deg, ${theme.colorful} 50%, ${theme.contrasty} 50%)`
                                              }
                                    }
                                >
                                    {theme.id === 'custom' && <div className="w-full h-full flex items-center justify-center text-[8px] font-bold">⚙</div>}
                                </div>
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
                                className="hover:text-main hover:bg-secondary px-1 py-0.5 font-mono text-xs font-semibold text-secondary"
                            >
                                PREV [
                            </button>
                            <button
                                onClick={nextTheme}
                                className="hover:text-main hover:bg-secondary px-1 py-0.5 font-mono text-xs font-semibold text-secondary"
                            >
                                NEXT ]
                            </button>
                            <button
                                onClick={randomTheme}
                                className="hover:text-main hover:bg-secondary px-1 py-0.5 font-mono text-xs font-semibold text-secondary"
                            >
                                RANDOM _
                            </button>
                        </div>
                    </div>
                }
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-4 h-4 border border-main"
                        style={
                            currentTheme.id === 'custom'
                                ? {}
                                : {
                                      background: `linear-gradient(135deg, ${currentTheme.colorful} 50%, ${currentTheme.contrasty} 50%)`
                                  }
                        }
                    >
                        {currentTheme.id === 'custom' && <div className="w-full h-full flex items-center justify-center text-[8px] font-bold">⚙</div>}
                    </div>
                    <span className="hidden md:block font-mono text-xs font-semibold">{currentTheme.name}</span>
                </div>
            </DropdownButton>
        </div>
    );
}
