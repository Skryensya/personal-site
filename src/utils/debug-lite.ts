type DebugMethod = (...args: unknown[]) => void;

// Cacheado en module load — evita hacer new URLSearchParams() en cada llamada (68 call sites).
// Se re-evalúa sólo cuando cambia localStorage o la URL, lo cual no sucede en runtime normal.
const _debugActive = (() => {
  const envDebug = import.meta.env.PUBLIC_DEBUG_LOGS === 'true';
  if (typeof window === 'undefined') return envDebug;
  try {
    const urlDebug = new URLSearchParams(window.location.search).get('debug') === 'true';
    const lsDebug  = localStorage.getItem('debug') === 'true';
    return urlDebug || lsDebug || envDebug;
  } catch {
    return envDebug;
  }
})();

const makeMethod = (method: keyof Console): DebugMethod => {
  return (...args: unknown[]) => {
    if (!_debugActive) return;
    const consoleMethod = console[method] as unknown as ((...args: unknown[]) => void) | undefined;
    if (typeof consoleMethod === 'function') {
      consoleMethod(...args);
    }
  };
};

export const debugLogger = {
  log: makeMethod('log'),
  warn: makeMethod('warn'),
  error: makeMethod('error'),
  info: makeMethod('info'),
  debug: makeMethod('debug'),
  group: makeMethod('group'),
  groupEnd: makeMethod('groupEnd')
};

if (typeof window !== 'undefined') {
  (window as Window & { debugLogger?: typeof debugLogger }).debugLogger = debugLogger;
}
