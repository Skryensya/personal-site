import * as React from 'react';

const { useState, useEffect } = React;

/**
 * ScrollProgress - Componente React que muestra una barra de progreso de scroll
 * Se posiciona fijo en la parte superior de la pantalla
 * Usa el elemento nativo <progress> para mejor accesibilidad
 */
export default function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        function updateScrollProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            
            setScrollProgress(Math.min(1, Math.max(0, scrollPercent)));
        }

        // Initial calculation
        updateScrollProgress();

        // Listen to scroll events
        window.addEventListener('scroll', updateScrollProgress, { passive: true });

        // Cleanup
        return () => {
            window.removeEventListener('scroll', updateScrollProgress);
        };
    }, []);

    return (
        <progress 
            value={scrollProgress} 
            max={1}
            className="print:hidden fixed top-0 left-0 w-full h-0.5 z-50 appearance-none [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-main [&::-webkit-progress-value]:opacity-60 [&::-moz-progress-bar]:bg-main [&::-moz-progress-bar]:opacity-60"
            aria-label="Progreso de lectura de la página"
        />
    );
}