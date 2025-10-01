import * as React from 'react';
import { useOSContext } from './OSContext';

const OSDebugToggle: React.FC = () => {
  const { windowStyle, setOverrideOS, overrideOS, actualOS } = useOSContext();
  
  const displayOS = windowStyle;

  return (
    <div className="bg-secondary border border-main p-4 font-mono text-sm">
      <div className="mb-2">
        <strong>OS Debug:</strong> {displayOS} {overrideOS && '(overridden)'}
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => setOverrideOS(null)}
          className={`px-2 py-1 border border-main ${!overrideOS ? 'bg-main text-secondary' : 'bg-secondary text-main'}`}
        >
          Auto
        </button>
        <button 
          onClick={() => setOverrideOS('macOS')}
          className={`px-2 py-1 border border-main ${overrideOS === 'macOS' ? 'bg-main text-secondary' : 'bg-secondary text-main'}`}
        >
          macOS
        </button>
        <button 
          onClick={() => setOverrideOS('Windows')}
          className={`px-2 py-1 border border-main ${overrideOS === 'Windows' ? 'bg-main text-secondary' : 'bg-secondary text-main'}`}
        >
          Windows
        </button>
      </div>
    </div>
  );
};

export default OSDebugToggle;