import { useState, useEffect } from 'react';

export type PointerType = 'fine' | 'coarse' | 'none';

export interface PointerTypeContext {
  pointerType: PointerType;
  hasHover: boolean;
  hasPointer: boolean;
}

export function usePointerType(): PointerTypeContext {
  const [pointerType, setPointerType] = useState<PointerType>('fine');
  const [hasHover, setHasHover] = useState(true);
  const [hasPointer, setHasPointer] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marcar que estamos en el cliente
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const updatePointerCapabilities = () => {
      // Override para testing: forzar touch en viewports pequeños
      const isSmallViewport = window.innerWidth < 1024;
      const forceTouch = isSmallViewport && localStorage.getItem('force-touch-mode') === 'true';
      
      // Detectar tipo de pointer
      const hasFinePointer = forceTouch ? false : window.matchMedia('(pointer: fine)').matches;
      const hasCoarsePointer = forceTouch ? true : window.matchMedia('(pointer: coarse)').matches;
      const hasAnyPointer = forceTouch ? true : window.matchMedia('(any-pointer: fine)').matches || window.matchMedia('(any-pointer: coarse)').matches;
      const canHover = forceTouch ? false : window.matchMedia('(hover: hover)').matches;

      // Determinar tipo de pointer principal
      if (hasFinePointer) {
        setPointerType('fine'); // Mouse, trackpad
      } else if (hasCoarsePointer) {
        setPointerType('coarse'); // Touch
      } else {
        setPointerType('none'); // Sin pointer
      }

      setHasHover(canHover);
      setHasPointer(hasAnyPointer);
    };

    // Listeners para cambios en media queries y viewport
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const hoverQuery = window.matchMedia('(hover: hover)');

    const handleChange = () => updatePointerCapabilities();
    const handleResize = () => updatePointerCapabilities();

    finePointerQuery.addEventListener('change', handleChange);
    coarsePointerQuery.addEventListener('change', handleChange);
    hoverQuery.addEventListener('change', handleChange);
    window.addEventListener('resize', handleResize);

    // Inicializar
    updatePointerCapabilities();

    return () => {
      finePointerQuery.removeEventListener('change', handleChange);
      coarsePointerQuery.removeEventListener('change', handleChange);
      hoverQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { pointerType, hasHover, hasPointer };
}