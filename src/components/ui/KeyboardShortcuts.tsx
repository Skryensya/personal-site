import { useState, useEffect } from 'react';

export function KeyboardShortcuts() {
  const [modKey, setModKey] = useState<string>('Ctrl/Cmd');

  useEffect(() => {
    // Detect OS
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
                  navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;

    setModKey(isMac ? 'Cmd' : 'Ctrl');
  }, []);

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
      <kbd className="kbd">{modKey}</kbd>
      <span>+</span>
      <kbd className="kbd">←</kbd>
      <span>para tema anterior,</span>
      <kbd className="kbd">{modKey}</kbd>
      <span>+</span>
      <kbd className="kbd">→</kbd>
      <span>para tema siguiente</span>
    </div>
  );
}
