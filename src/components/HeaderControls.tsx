import * as React from 'react';
import { useThemeMode, type Theme } from './useThemeMode';
import { themes as defaultThemes } from '@/config/themes';
import ThemeButton from './ThemeButton';
import ModeButton from './ModeButton';

interface HeaderControlsProps {
    themes?: Theme[];
}

export default function HeaderControls({ themes = defaultThemes }: HeaderControlsProps) {
    const {
        currentTheme,
        currentMode,
        isMounted,
        handleThemeSelect,
        handleModeChange,
        nextTheme,
        toggleMode
    } = useThemeMode(themes);

    return (
        <>
            <ThemeButton
                currentTheme={currentTheme}
                themes={themes}
                isMounted={isMounted}
                onThemeSelect={handleThemeSelect}
                onNextTheme={nextTheme}
            />
            <ModeButton
                currentMode={currentMode}
                isMounted={isMounted}
                onModeSelect={handleModeChange}
                onToggleMode={toggleMode}
            />
        </>
    );
}