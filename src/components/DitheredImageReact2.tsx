import * as React from 'react';

const { useEffect, useRef, useState } = React;

interface DitheredImageProps {
    src: string;
    alt: string;
    className?: string;
    crunch?: 'auto' | 'pixel' | number;
    cutoff?: number;
    mainColor?: string;
    secondaryColor?: string;
    swapOnTheme?: boolean; // Intercambia qué color tiene opacidad según el tema
}

export default function DitheredImageReact2({
    src,
    alt,
    className,
    crunch = 'auto',
    cutoff = 0.7,
    mainColor,
    secondaryColor,
    swapOnTheme = false
}: DitheredImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const webComponentRef = useRef<HTMLElement>(null);
    const [showOriginal, setShowOriginal] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Helper functions
    const getGrayscaleValue = (hex: string): number => {
        if (!hex || hex.length < 6) return 0;
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return 0.299 * r + 0.587 * g + 0.114 * b;
    };

    const hexToRgba = (hex: string, alpha: number = 0): string | null => {
        if (!hex) return null;
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const updateDitheredImageColors = () => {
        const element = webComponentRef.current;
        if (!element) return;

        // Detectar si estamos en modo oscuro usando la clase 'dark' del html
        const isDarkMode = document.documentElement.classList.contains('dark');

        // Obtener los colores principales
        let colorfulHex: string, contrastyHex: string;

        if (mainColor && secondaryColor) {
            colorfulHex = mainColor;
            contrastyHex = secondaryColor;
        } else {
            // Usar colores del tema
            const computedStyle = getComputedStyle(document.documentElement);
            colorfulHex = computedStyle.getPropertyValue('--theme-colorful').trim() || '#ffffff';
            contrastyHex = computedStyle.getPropertyValue('--theme-contrasty').trim() || '#000000';
        }

        // Determinar cuál es el color más claro y cuál el más oscuro
        const colorfulGray = getGrayscaleValue(colorfulHex);
        const contrastyGray = getGrayscaleValue(contrastyHex);

        const lighterColor = colorfulGray > contrastyGray ? colorfulHex : contrastyHex;
        const darkerColor = colorfulGray > contrastyGray ? contrastyHex : colorfulHex;

        let darkrgba: string | null, lightrgba: string | null;

        if (swapOnTheme) {
            if (isDarkMode) {
                // En modo oscuro: usar el color más claro para la imagen
                darkrgba = hexToRgba(lighterColor, 1);
                lightrgba = hexToRgba(darkerColor, 0);
            } else {
                // En modo claro: usar el color más oscuro para la imagen
                darkrgba = hexToRgba(darkerColor, 1);
                lightrgba = hexToRgba(lighterColor, 0);
            }
        } else {
            // Comportamiento original: siempre el color primario con opacidad parcial
            darkrgba = hexToRgba(darkerColor, 0.91);
            lightrgba = hexToRgba(lighterColor, 1);
        }

        if (darkrgba && lightrgba) {
            element.setAttribute('darkrgba', darkrgba);
            element.setAttribute('lightrgba', lightrgba);
            // console.log('React2: Colors updated:', {
            //     isDarkMode,
            //     swapOnTheme,
            //     colorfulHex,
            //     contrastyHex,
            //     lighterColor,
            //     darkerColor,
            //     darkrgba,
            //     lightrgba
            // });
        }
    };

    // Wait for component to be ready
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    // Setup hover functionality
    useEffect(() => {
        if (!isReady || !containerRef.current) return;

        const container = containerRef.current;
        let hoverTimeout: NodeJS.Timeout | null = null;

        const handleMouseEnter = () => {
            hoverTimeout = setTimeout(() => {
                setShowOriginal(true);
            }, 500);
        };

        const handleMouseLeave = () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }
            setShowOriginal(false);
        };

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
        };
    }, [isReady]);

    // Update colors when component is ready and listen for theme changes
    useEffect(() => {
        if (!isReady) return;

        // Initial color update
        updateDitheredImageColors();

        // Listen for theme changes if swapOnTheme is enabled
        if (swapOnTheme) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
                        // console.log('React2: Theme change detected, updating colors');
                        setTimeout(updateDitheredImageColors, 50);
                    }
                });
            });

            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class', 'data-theme']
            });

            // Also listen for CSS color changes
            const colorChangeObserver = new MutationObserver(() => {
                updateDitheredImageColors();
            });

            // Watch for CSS variable changes by observing style attribute
            const styleElement = document.createElement('style');
            document.head.appendChild(styleElement);
            colorChangeObserver.observe(document.head, {
                childList: true,
                subtree: true
            });

            return () => {
                observer.disconnect();
                colorChangeObserver.disconnect();
                if (styleElement.parentNode) {
                    styleElement.parentNode.removeChild(styleElement);
                }
            };
        }
    }, [isReady, mainColor, secondaryColor, swapOnTheme]);

    return (
        <div ref={containerRef} className={`relative block w-full h-full ${className}`}>
            {/* @ts-ignore */}
            <as-dithered-image
                ref={webComponentRef}
                src={src}
                alt={alt}
                className="block w-full h-full"
                crunch={crunch.toString()}
                cutoff={cutoff}
                data-main-color={mainColor}
                data-secondary-color={secondaryColor}
            />
            <div
                className={`absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none z-10  ${
                    showOriginal ? 'opacity-75' : 'opacity-0'
                }`}
                style={{
                    backgroundImage: `url('${src}')`,
                    filter: showOriginal ? 'contrast(1.1)' : 'none'
                }}
            />
        </div>
    );
}

// Declare the custom element for TypeScript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'as-dithered-image': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                alt?: string;
                crunch?: string;
                cutoff?: number;
                'data-main-color'?: string;
                'data-secondary-color'?: string;
                darkrgba?: string;
                lightrgba?: string;
            };
        }
    }
}
