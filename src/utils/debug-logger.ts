/**
 * Debug logger utility that respects environment configuration
 * Only logs to console when DEBUG mode is enabled
 */

// Check if we're in debug mode
const isDebugMode = (): boolean => {
  if (typeof window !== 'undefined') {
    // Client-side: check for debug flag in localStorage or URL params
    const urlParams = new URLSearchParams(window.location.search);
    const urlDebug = urlParams.get('debug') === 'true';
    const localStorageDebug = localStorage.getItem('debug') === 'true';
    return urlDebug || localStorageDebug || import.meta.env.DEV;
  } else {
    // Server-side: check import.meta.env
    return import.meta.env.DEV || import.meta.env.DEBUG === 'true';
  }
};

export class ConsoleDebugLogger {
  private static instance: ConsoleDebugLogger;
  private debugEnabled: boolean;

  private constructor() {
    this.debugEnabled = isDebugMode();
  }

  public static getInstance(): ConsoleDebugLogger {
    if (!ConsoleDebugLogger.instance) {
      ConsoleDebugLogger.instance = new ConsoleDebugLogger();
    }
    return ConsoleDebugLogger.instance;
  }

  public log(...args: any[]): void {
    if (this.debugEnabled) {
      console.log(...args);
    }
  }

  public warn(...args: any[]): void {
    if (this.debugEnabled) {
      console.warn(...args);
    }
  }

  public error(...args: any[]): void {
    if (this.debugEnabled) {
      console.error(...args);
    }
  }

  public info(...args: any[]): void {
    if (this.debugEnabled) {
      console.info(...args);
    }
  }

  public debug(...args: any[]): void {
    if (this.debugEnabled) {
      console.debug(...args);
    }
  }

  public group(label?: string): void {
    if (this.debugEnabled) {
      console.group(label);
    }
  }

  public groupEnd(): void {
    if (this.debugEnabled) {
      console.groupEnd();
    }
  }

  public table(data?: any, columns?: string[]): void {
    if (this.debugEnabled) {
      console.table(data, columns);
    }
  }

  public time(label?: string): void {
    if (this.debugEnabled) {
      console.time(label);
    }
  }

  public timeEnd(label?: string): void {
    if (this.debugEnabled) {
      console.timeEnd(label);
    }
  }

  // Method to dynamically enable/disable debug mode
  public setDebugMode(enabled: boolean): void {
    this.debugEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('debug', enabled.toString());
    }
  }

  public isDebugEnabled(): boolean {
    return this.debugEnabled;
  }
}

// Export a singleton instance for convenience
export const debugLogger = ConsoleDebugLogger.getInstance();

// Export convenience functions
export const log = (...args: any[]) => debugLogger.log(...args);
export const warn = (...args: any[]) => debugLogger.warn(...args);
export const error = (...args: any[]) => debugLogger.error(...args);
export const info = (...args: any[]) => debugLogger.info(...args);
export const debug = (...args: any[]) => debugLogger.debug(...args);