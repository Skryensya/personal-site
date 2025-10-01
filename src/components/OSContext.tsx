import * as React from 'react';

interface OSContextType {
  windowStyle: string;
  setOverrideOS: (os: string | null) => void;
  overrideOS: string | null;
  actualOS: string;
}

const OSContext = React.createContext<OSContextType | undefined>(undefined);

export const useOSContext = () => {
  const context = React.useContext(OSContext);
  if (!context) {
    throw new Error('useOSContext must be used within an OSProvider');
  }
  return context;
};

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Custom OS detection function
  const detectOS = () => {
    if (typeof window === 'undefined') return 'windows';
    
    const userAgent = window.navigator.userAgent;
    
    if (/Mac|iPhone|iPad|iPod/.test(userAgent)) {
      return 'macos';
    }
    
    return 'windows';
  };

  const [actualOS, setActualOS] = React.useState('windows');
  const [overrideOS, setOverrideOS] = React.useState<string | null>(null);

  React.useEffect(() => {
    setActualOS(detectOS());
  }, []);

  const windowStyle = overrideOS || actualOS;

  return (
    <OSContext.Provider value={{ windowStyle, setOverrideOS, overrideOS, actualOS }}>
      {children}
    </OSContext.Provider>
  );
};