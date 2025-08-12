import * as React from 'react';
import { useThemeMode, type Theme } from './useThemeMode';
import ThemeButton from './ThemeButton';
import ModeButton from './ModeButton';

interface MobileHeaderControlsProps {
    themes: Theme[];
}

export default function MobileHeaderControls({ themes }: MobileHeaderControlsProps) {
    const {
        currentTheme,
        currentMode,
        isMounted,
        handleThemeSelect,
        handleModeChange,
        nextTheme,
        toggleMode
    } = useThemeMode(themes);

    if (!isMounted) return null;

    return (
        <div className="flex flex-col gap-2 w-full md:hidden">
            <ThemeButton
                currentTheme={currentTheme}
                themes={themes}
                isMounted={isMounted}
                onThemeSelect={handleThemeSelect}
                onNextTheme={nextTheme}
                isMobile={true}
                className="bg-secondary border border-main"
            />
            <ModeButton
                currentMode={currentMode}
                isMounted={isMounted}
                onModeSelect={handleModeChange}
                onToggleMode={toggleMode}
                isMobile={true}
                className="bg-secondary border border-main"
            />
        </div>
    );
}