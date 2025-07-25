import React, { useEffect, useRef, useState } from 'react';

interface DitheredImageProps {
  src: string;
  alt: string;
  className?: string;
  crunch?: 'auto' | 'pixel' | number;
  cutoff?: number;
  mainColor?: string;
  secondaryColor?: string;
}

export default function DitheredImageReact({ 
  src, 
  alt, 
  className, 
  crunch = 'auto',
  cutoff = 0.7,
  mainColor,
  secondaryColor
}: DitheredImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const webComponentRef = useRef<HTMLElement>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isReady, setIsReady] = useState(false);


  // Update dithered image colors based on theme
  const updateDitheredImageColors = () => {
    const element = webComponentRef.current;
    if (!element) return;

    // Helper function to get grayscale value
    function getGrayscaleValue(hex: string): number {
      if (!hex || hex.length < 6) return 0;
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return (0.299 * r + 0.587 * g + 0.114 * b);
    }

    // Helper function to convert hex to rgba string
    function hexToRgba(hex: string, alpha: number = 0): string | null {
      if (!hex) return null;
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    let darkColor: string, lightColor: string;

    if (mainColor && secondaryColor) {
      // Use custom colors if provided
      if (getGrayscaleValue(mainColor) < getGrayscaleValue(secondaryColor)) {
        darkColor = mainColor;
        lightColor = secondaryColor;
      } else {
        darkColor = secondaryColor;
        lightColor = mainColor;
      }
    } else {
      // Get theme colors from CSS custom properties
      const computedStyle = getComputedStyle(document.documentElement);
      const themeColorful = computedStyle.getPropertyValue('--theme-colorful').trim();
      const themeContrasty = computedStyle.getPropertyValue('--theme-contrasty').trim();

      const colorful = themeColorful || '#ffffff';
      const contrasty = themeContrasty || '#000000';

      const colorfulGray = getGrayscaleValue(colorful);
      const contrastyGray = getGrayscaleValue(contrasty);

      if (colorfulGray < contrastyGray) {
        darkColor = colorful;
        lightColor = contrasty;
      } else {
        darkColor = contrasty;
        lightColor = colorful;
      }
    }

    const darkrgba = hexToRgba(darkColor, 232); // 78% opacity
    const lightrgba = hexToRgba(lightColor, 255); // 100% opacity

    if (darkrgba && lightrgba) {
      element.setAttribute('darkrgba', darkrgba);
      element.setAttribute('lightrgba', lightrgba);
      console.log('React: Colors updated:', { darkColor, lightColor, darkrgba, lightrgba });
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

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          console.log('React: Theme change detected, updating colors');
          setTimeout(updateDitheredImageColors, 50);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, [isReady, mainColor, secondaryColor]);


  return (
    <div 
      ref={containerRef}
      className={`relative block w-full h-full ${className}`}
    >
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
        className={`absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none z-10 transition-opacity duration-300 ${
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