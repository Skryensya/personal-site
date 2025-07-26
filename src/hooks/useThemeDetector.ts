// Ruta sugerida: src/hooks/useThemeDetector.ts

import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

/**
 * Hook personalizado para detectar el tema actual (dark/light)
 * y observar cambios en el atributo 'class' del elemento <html>.
 * @returns {Theme} El tema actual: 'dark' o 'light'.
 */
export function useThemeDetector(): Theme {
    const getInitialTheme = (): Theme => {
        if (typeof window === 'undefined') {
            return 'light'; // Valor por defecto para SSR
        }
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    };

    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                    setTheme(newTheme);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Función de limpieza para desconectar el observador al desmontar el componente
        return () => observer.disconnect();
    }, []); // El array de dependencias vacío asegura que se ejecute solo una vez

    return theme;
}
