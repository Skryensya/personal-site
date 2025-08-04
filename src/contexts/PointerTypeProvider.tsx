import * as React from 'react';
import type { PointerTypeContext } from '../hooks/usePointerType';
import { usePointerType } from '../hooks/usePointerType';

// Default values for SSR and fallback
const defaultPointerContext: PointerTypeContext = {
    pointerType: 'fine',
    hasHover: true,
    hasPointer: true
};

const PointerTypeContext = React.createContext<PointerTypeContext>(defaultPointerContext);

export function PointerTypeProvider({ children }: { children: React.ReactNode }) {
    const pointerCapabilities = usePointerType();

    return <PointerTypeContext.Provider value={pointerCapabilities}>{children}</PointerTypeContext.Provider>;
}

export function usePointerCapabilities() {
    const context = React.useContext(PointerTypeContext);
    return context;
}
