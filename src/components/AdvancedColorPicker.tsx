import React, { useState, useEffect, useCallback, useRef } from 'react';
import FloatingWindow from './FloatingWindow';
import { ClipboardCopy, ClipboardCheck, ClipboardX, Palette, Pin } from 'lucide-react';

interface AdvancedColorPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (colorful: string, contrasty: string, themeName: string) => void;
    onSelectPreset?: (themeId: string) => void;
    currentTheme?: string;
    initialColors?: {
        colorful: string;
        contrasty: string;
        name?: string;
    };
    defaultPosition?: {
        x: number;
        y: number;
    };
}

interface HSVColor {
    h: number; // 0-360
    s: number; // 0-100
    v: number; // 0-100
}

interface ColorMode {
    primary: HSVColor;
    secondary: HSVColor;
}

const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({
    isOpen,
    onClose,
    onApply,
    onSelectPreset,
    currentTheme = 'custom',
    initialColors = { colorful: '#3b82f6', contrasty: '#1e293b', name: 'CUSTOM' },
    defaultPosition = { x: 20, y: 80 }
}) => {
    const [activeColor, setActiveColor] = useState<'primary' | 'secondary'>('primary');
    const [colors, setColors] = useState<ColorMode>({
        primary: { h: 220, s: 75, v: 96 },
        secondary: { h: 220, s: 85, v: 23 }
    });
    const [themeName, setThemeName] = useState(initialColors.name || 'CUSTOM');
    const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle');

    const saturationRef = useRef<HTMLDivElement>(null);
    const hueRef = useRef<HTMLDivElement>(null);

    // Convert HSV to RGB
    const hsvToRgb = useCallback((h: number, s: number, v: number): [number, number, number] => {
        s = s / 100;
        v = v / 100;
        const c = v * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = v - c;

        let r, g, b;
        if (h >= 0 && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (h >= 180 && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (h >= 240 && h < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }

        return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
    }, []);

    // Convert RGB to Hex
    const rgbToHex = useCallback((r: number, g: number, b: number): string => {
        return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
    }, []);

    // Convert HSV to Hex
    const hsvToHex = useCallback(
        (h: number, s: number, v: number): string => {
            const [r, g, b] = hsvToRgb(h, s, v);
            return rgbToHex(r, g, b);
        },
        [hsvToRgb, rgbToHex]
    );

    // Convert Hex to HSV
    const hexToHsv = useCallback((hex: string): HSVColor => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;

        let h = 0;
        if (diff !== 0) {
            if (max === r) {
                h = ((g - b) / diff) % 6;
            } else if (max === g) {
                h = (b - r) / diff + 2;
            } else {
                h = (r - g) / diff + 4;
            }
            h = h * 60;
            if (h < 0) h += 360;
        }

        const s = max === 0 ? 0 : (diff / max) * 100;
        const v = max * 100;

        return { h: Math.round(h), s: Math.round(s), v: Math.round(v) };
    }, []);

    // Initialize colors from props
    useEffect(() => {
        if (initialColors) {
            setColors({
                primary: hexToHsv(initialColors.colorful),
                secondary: hexToHsv(initialColors.contrasty)
            });
        }
    }, [initialColors, hexToHsv]);

    // Apply colors in real-time
    useEffect(() => {
        const primaryHex = hsvToHex(colors.primary.h, colors.primary.s, colors.primary.v);
        const secondaryHex = hsvToHex(colors.secondary.h, colors.secondary.s, colors.secondary.v);
        onApply(primaryHex, secondaryHex, themeName);
    }, [colors, hsvToHex, onApply, themeName]);

    // Handle saturation/value area click
    const handleSaturationClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!saturationRef.current) return;

            const rect = saturationRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const s = Math.max(0, Math.min(100, (x / rect.width) * 100));
            const v = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));

            setColors((prev) => ({
                ...prev,
                [activeColor]: { ...prev[activeColor], s, v }
            }));
        },
        [activeColor]
    );

    // Handle hue strip click
    const handleHueClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!hueRef.current) return;

            const rect = hueRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const h = Math.max(0, Math.min(360, (x / rect.width) * 360));

            setColors((prev) => ({
                ...prev,
                [activeColor]: { ...prev[activeColor], h }
            }));
        },
        [activeColor]
    );

    // Calculate relative luminance
    const getLuminance = useCallback((hex: string): number => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

        return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    }, []);

    // Calculate contrast ratio
    const getContrastRatio = useCallback(
        (color1: string, color2: string): number => {
            const lum1 = getLuminance(color1);
            const lum2 = getLuminance(color2);
            const brightest = Math.max(lum1, lum2);
            const darkest = Math.min(lum1, lum2);
            return (brightest + 0.05) / (darkest + 0.05);
        },
        [getLuminance]
    );

    // Get WCAG compliance level
    const getWCAGLevel = useCallback((ratio: number): { aa: boolean; aaa: boolean; level: string } => {
        const aa = ratio >= 4.5;
        const aaa = ratio >= 7;
        let level = 'FAIL';
        if (aaa) level = 'AAA';
        else if (aa) level = 'AA';
        return { aa, aaa, level };
    }, []);

    // Get current color values
    const currentColor = colors[activeColor];
    const primaryHex = hsvToHex(colors.primary.h, colors.primary.s, colors.primary.v);
    const secondaryHex = hsvToHex(colors.secondary.h, colors.secondary.s, colors.secondary.v);

    // Generate shareable URL
    const generateShareURL = useCallback(() => {
        const params = new URLSearchParams();
        params.set(
            'theme',
            btoa(
                JSON.stringify({
                    name: themeName,
                    colorful: primaryHex,
                    contrasty: secondaryHex
                })
            )
        );
        return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    }, [themeName, primaryHex, secondaryHex]);

    // Copy share URL to clipboard
    const handleShare = useCallback(async () => {
        try {
            const shareURL = generateShareURL();
            await navigator.clipboard.writeText(shareURL);
            setShareStatus('copied');
            setTimeout(() => setShareStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
            setShareStatus('error');
            setTimeout(() => setShareStatus('idle'), 2000);
            // Fallback: show URL in prompt
            const shareURL = generateShareURL();
            prompt('Copy this URL to share your theme:', shareURL);
        }
    }, [generateShareURL]);

    // Calculate contrast
    const contrastRatio = getContrastRatio(primaryHex, secondaryHex);
    const wcagLevel = getWCAGLevel(contrastRatio);

    return (
        <FloatingWindow
            isOpen={isOpen}
            onClose={onClose}
            title="CUSTOM THEME EDITOR"
            defaultPosition={defaultPosition}
            defaultSize={{ width: 280, height: 340 }}
            resizable={false}
        >
            <div className="h-full flex flex-col">
                {/* Enhanced Color Showcase */}
                <div className="flex-shrink-0 bg-secondary">
                    {/* Color Selection Controls */}
                    <div className="flex border-b">
                        <button className={`flex-1 p-2 text-center relative bg-main text-secondary`} onClick={() => setActiveColor('primary')}>
                            <div className="text-[10px] font-mono font-bold">MAIN</div>
                            <div className="text-[10px] font-mono">{primaryHex}</div>
                            {activeColor === 'primary' && (
                                <Pin size={10} className="absolute top-1 right-1 text-secondary" />
                            )}
                        </button>
                        <button className={`flex-1 p-2 text-center relative bg-secondary text-main`} onClick={() => setActiveColor('secondary')}>
                            <div className="text-[10px] font-mono font-bold">DARK</div>
                            <div className="text-[10px] font-mono">{secondaryHex}</div>
                            {activeColor === 'secondary' && (
                                <Pin size={10} className="absolute top-1 right-1 text-main" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Theme Name Input with Share Button */}
                <div className="flex border-b border-main bg-secondary h-8">
                    <div className="w-full h-full p-1 flex justify-center items-center">
                        <input
                            type="text"
                            value={themeName}
                            onChange={(e) => setThemeName(e.target.value.toUpperCase())}
                            placeholder="THEME NAME"
                            className=" w-full text-[10px] font-mono font-bold border border-main text-main bg-transparent px-2 py-1 text-start focus:outline-none focus:ring-1 focus:ring-main"
                            maxLength={9}
                        />
                    </div>
                    <button
                        onClick={handleShare}
                        className={`h-full aspect-square border-l p-2 text-[8px] font-mono font-bold border-0 focus:outline-none focus:ring-1 focus:ring-main ${
                            shareStatus === 'copied'
                                ? 'bg-main text-secondary'
                                : shareStatus === 'error'
                                  ? 'bg-secondary text-main'
                                  : 'text-main bg-secondary hover:bg-main hover:text-secondary'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-1">
                            {shareStatus === 'copied' ? (
                                <>
                                    <ClipboardCheck size={16} />
                                </>
                            ) : shareStatus === 'error' ? (
                                <>
                                    <ClipboardX size={16} />
                                </>
                            ) : (
                                <>
                                    <ClipboardCopy size={16} />
                                </>
                            )}
                        </div>
                    </button>
                </div>

                {/* Contrast Ratio Indicator */}
                <div className="flex justify-between items-center px-2 py-1 bg-secondary border-b border-main flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[7px] font-mono text-main opacity-70">CONTRAST:</span>
                        <span className="text-[8px] font-mono font-bold text-main">{contrastRatio.toFixed(2)}:1</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div
                            className={`text-[7px] font-mono font-bold px-1 border ${
                                wcagLevel.aa ? 'bg-main text-secondary border-main' : 'bg-secondary text-main border-main'
                            }`}
                        >
                            AA {wcagLevel.aa ? '✓' : '✗'}
                        </div>
                        <div
                            className={`text-[7px] font-mono font-bold px-1 border ${
                                wcagLevel.aaa ? 'bg-main text-secondary border-main' : 'bg-secondary text-main border-main'
                            }`}
                        >
                            AAA {wcagLevel.aaa ? '✓' : '✗'}
                        </div>
                    </div>
                </div>

                {/* Theme Selector */}

                {/* Color Picker Area */}
                <div className="flex-1 flex flex-col p-2 space-y-2">
                    {/* Saturation/Value Area */}
                    <div className="flex-1 flex flex-col">
                        <div
                            ref={saturationRef}
                            className="relative flex-1 cursor-crosshair border border-main"
                            style={{
                                background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${currentColor.h}, 100%, 50%))`
                            }}
                            onClick={handleSaturationClick}
                        >
                            {/* Enhanced Saturation/Value Indicator */}
                            <div
                                className="absolute w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{
                                    left: `${currentColor.s}%`,
                                    top: `${100 - currentColor.v}%`
                                }}
                            >
                                <div className="w-full h-full border-2 border-main rounded-full bg-secondary"></div>
                                <div className="absolute inset-[2px] border border-secondary rounded-full bg-main"></div>
                            </div>
                        </div>

                        {/* Hue Strip */}
                        <div
                            ref={hueRef}
                            className="h-3 mt-2 cursor-pointer border border-main relative"
                            style={{
                                background:
                                    'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))'
                            }}
                            onClick={handleHueClick}
                        >
                            {/* Enhanced Hue Indicator */}
                            <div
                                className="absolute w-1 h-full transform -translate-x-1/2 pointer-events-none"
                                style={{ left: `${(currentColor.h / 360) * 100}%` }}
                            >
                                <div className="w-full h-full bg-main border-x border-secondary"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FloatingWindow>
    );
};

export default AdvancedColorPicker;
