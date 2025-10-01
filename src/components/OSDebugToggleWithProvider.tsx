import * as React from 'react';
import { OSProvider } from './OSContext';
import OSDebugToggle from './OSDebugToggle';

const OSDebugToggleWithProvider: React.FC = () => {
  return (
    <OSProvider>
      <OSDebugToggle />
    </OSProvider>
  );
};

export default OSDebugToggleWithProvider;