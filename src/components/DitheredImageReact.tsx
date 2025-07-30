import * as React from 'react';

const { useEffect, useRef, useState } = React;

// Global cache for dithered images
const ditheredCache = new Map<string, string>();

interface DitheredImageProps {
  src: string;
  alt: string;
  className?: string;
  crunch?: 'auto' | 'pixel' | number;
  cutoff?: number;
  mainColor?: string;
  secondaryColor?: string;
  respectOriginalSize?: boolean;
}

export default function DitheredImageReact({ 
  src, 
  alt, 
  className, 
  crunch = 'auto',
  cutoff = 0.3,
  mainColor,
  secondaryColor,
  respectOriginalSize = true
}: DitheredImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const webComponentRef = useRef<HTMLElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [cachedImage, setCachedImage] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginalOnClick, setShowOriginalOnClick] = useState(false);

  // Update dithered image colors based on theme - optimized for single color processing
  const updateDitheredImageColors = () => {
    const element = webComponentRef.current;
    if (!element) return;

    // Helper function to convert hex to rgba string
    function hexToRgba(hex: string, alpha: number = 255): string | null {
      if (!hex) return null;
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    let darkColor: string;

    if (mainColor) {
      // Use provided main color
      darkColor = mainColor;
    } else {
      // Use a unique blended dark color that works with all themes
      // This dark brown/charcoal mix complements all theme colors
      darkColor = '#2D1B1B'; // Rich dark brown-charcoal blend
    }

    const darkrgba = hexToRgba(darkColor, 255); // Full opacity for dark areas
    const lightrgba = 'rgba(0, 0, 0, 0)'; // Always transparent for light areas

    if (darkrgba) {
      element.setAttribute('darkrgba', darkrgba);
      element.setAttribute('lightrgba', lightrgba);
      // console.log('React: Color updated:', { themeColor, darkrgba });
    }
  };

  // Get cache key - simplified since we use a consistent dark color
  const getCacheKey = () => {
    if (mainColor) {
      return `${src}-${crunch}-${cutoff}-${mainColor}`;
    }
    
    // Use consistent key for the universal dark color
    return `${src}-${crunch}-${cutoff}-universal`;
  };

  // Check for cached dithered image and preload
  useEffect(() => {
    // Small delay to ensure theme is fully loaded after page navigation
    const checkCacheTimer = setTimeout(() => {
      const cacheKey = getCacheKey();
      
      // Check if we have a cached version for current theme
      if (ditheredCache.has(cacheKey)) {
        setCachedImage(ditheredCache.get(cacheKey)!);
        setIsReady(true);
        return;
      }

      // Clear cached image if theme changed
      setCachedImage(null);

      // Preload original image
      const img = new Image();
      img.onload = () => {
        setIsReady(true);
      };
      img.src = src;
    }, 100);

    return () => clearTimeout(checkCacheTimer);
  }, [src, crunch, cutoff]);


  // Cache dithered result and handle theme changes
  useEffect(() => {
    if (!isReady || !webComponentRef.current) return;

    // Initial color update
    updateDitheredImageColors();

    // Cache the dithered result after processing
    const cacheProcessedImage = () => {
      const element = webComponentRef.current;
      if (element) {
        const canvas = element.shadowRoot?.querySelector('canvas');
        if (canvas) {
          const cacheKey = getCacheKey();
          const dataUrl = canvas.toDataURL();
          ditheredCache.set(cacheKey, dataUrl);
          
          // Update the displayed image without flicker
          setPendingImage(dataUrl);
          setIsProcessing(false);
        }
      }
    };

    // Cache after a short delay to ensure processing is complete
    const cacheTimer = setTimeout(cacheProcessedImage, 500);

    // Listen for DOM attribute changes (data-theme, data-theme-id, class)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'data-theme' || 
             mutation.attributeName === 'data-theme-id' ||
             mutation.attributeName === 'class')) {
          // console.log('React: DOM change detected, updating colors');
          
          // Check if we have a cached version
          const newCacheKey = getCacheKey();
          
          if (ditheredCache.has(newCacheKey)) {
            setPendingImage(ditheredCache.get(newCacheKey)!);
            setIsProcessing(false);
          } else {
            setIsProcessing(true);
            setTimeout(updateDitheredImageColors, 50);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-theme-id', 'class']
    });

    // Listen for custom theme events
    const handleThemeChanged = () => {
      // console.log('React: Custom theme event detected, updating colors');
      
      // Check if we have a cached version
      const newCacheKey = getCacheKey();
      
      if (ditheredCache.has(newCacheKey)) {
        setPendingImage(ditheredCache.get(newCacheKey)!);
        setIsProcessing(false);
      } else {
        setIsProcessing(true);
        setTimeout(updateDitheredImageColors, 50);
      }
    };

    // Handle page navigation (especially back navigation)
    const handlePageLoad = () => {
      // Add delay to ensure theme is applied before checking cache
      setTimeout(() => {
        const newCacheKey = getCacheKey();
        
        if (ditheredCache.has(newCacheKey)) {
          setPendingImage(ditheredCache.get(newCacheKey)!);
          setIsProcessing(false);
        } else {
          setIsProcessing(true);
          updateDitheredImageColors();
        }
      }, 150);
    };

    window.addEventListener('theme-changed', handleThemeChanged);
    window.addEventListener('mode-changed', handleThemeChanged);
    document.addEventListener('astro:page-load', handlePageLoad);

    return () => {
      clearTimeout(cacheTimer);
      observer.disconnect();
      window.removeEventListener('theme-changed', handleThemeChanged);
      window.removeEventListener('mode-changed', handleThemeChanged);
      document.removeEventListener('astro:page-load', handlePageLoad);
    };
  }, [isReady, mainColor, secondaryColor, src, crunch, cutoff]);

  // Handle smooth transition from pending to cached
  useEffect(() => {
    if (pendingImage && !isProcessing) {
      setCachedImage(pendingImage);
      setPendingImage(null);
    }
  }, [pendingImage, isProcessing]);

  // Handle click to toggle original image
  const handleClick = () => {
    setShowOriginalOnClick(!showOriginalOnClick);
  };

  // Handle mouse out to hide image if click is active
  const handleMouseOut = () => {
    if (showOriginalOnClick) {
      setShowOriginalOnClick(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleClick}
      onMouseLeave={handleMouseOut}
      className={`dithered-container-${src.replace(/[^a-zA-Z0-9]/g, '')} ${showOriginalOnClick ? 'show-original' : ''} relative block overflow-hidden bg-(--theme-colorful) select-none cursor-pointer ${respectOriginalSize ? 'w-auto h-auto' : 'w-full h-full'} ${className}`}
    >
      {/* Show cached image when available */}
      {cachedImage && (
        <img 
          src={cachedImage}
          alt={alt}
          className={`block ${respectOriginalSize ? 'w-auto h-auto' : 'w-full h-full'}`}
        />
      )}
      
      {/* Show web component ONLY when no cached image exists - completely absent from DOM otherwise */}
      {!cachedImage && (
        /* @ts-ignore */
        <as-dithered-image 
          ref={webComponentRef}
          src={src} 
          alt={alt}
          className={`block ${respectOriginalSize ? 'w-auto h-auto' : 'w-full h-full'}`}
          crunch={crunch.toString()}
          cutoff={cutoff}
          data-main-color={mainColor}
          data-secondary-color={secondaryColor}
          draggable="false"
        />
      )}
      
      {/* Hover and click overlay using pseudo-element */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .dithered-container-${src.replace(/[^a-zA-Z0-9]/g, '')} canvas,
          .dithered-container-${src.replace(/[^a-zA-Z0-9]/g, '')} img {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
            draggable: false;
            pointer-events: none;
          }
          .dithered-container-${src.replace(/[^a-zA-Z0-9]/g, '')}::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${src}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0;
            z-index: 10;
            pointer-events: none;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            transition: opacity 0.2s ease;
            transition-delay: 0s;
          }
          .dithered-container-${src.replace(/[^a-zA-Z0-9]/g, '')}:hover:not(.show-original)::after {
            opacity: 0.7;
            transition-delay: 1s;
          }
          .dithered-container-${src.replace(/[^a-zA-Z0-9]/g, '')}.show-original::after {
            opacity: 0.7;
            transition-delay: 0s;
          }
        `
      }} />
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
        draggable?: string;
      };
    }
  }
}