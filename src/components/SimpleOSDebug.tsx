import * as React from 'react';

const SimpleOSDebug: React.FC = () => {
  const [selectedOS, setSelectedOS] = React.useState<'macos' | 'windows' | null>(null);

  React.useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('debug-os');
    if (saved && (saved === 'macos' || saved === 'windows')) {
      setSelectedOS(saved);
    }
  }, []);

  const handleOSChange = (os: 'macos' | 'windows' | null) => {
    setSelectedOS(os);
    if (os) {
      localStorage.setItem('debug-os', os);
    } else {
      localStorage.removeItem('debug-os');
    }
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="bg-secondary border border-main p-4 font-mono text-sm">
      <div className="mb-2">
        <strong>OS Debug:</strong> {selectedOS || 'Auto'}
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => handleOSChange(null)}
          className={`px-2 py-1 border border-main ${!selectedOS ? 'bg-main text-secondary' : 'bg-secondary text-main'}`}
        >
          Auto
        </button>
        <button 
          onClick={() => handleOSChange('macos')}
          className={`px-2 py-1 border border-main ${selectedOS === 'macos' ? 'bg-main text-secondary' : 'bg-secondary text-main'}`}
        >
          macOS
        </button>
        <button 
          onClick={() => handleOSChange('windows')}
          className={`px-2 py-1 border border-main ${selectedOS === 'windows' ? 'bg-main text-secondary' : 'bg-secondary text-main'}`}
        >
          Windows
        </button>
      </div>
    </div>
  );
};

export default SimpleOSDebug;