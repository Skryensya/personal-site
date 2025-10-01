import * as React from 'react';

interface CompanyToastProps {
  companyName: string;
  message: string;
  duration?: number;
}

export default function CompanyToast({ 
  companyName, 
  message, 
  duration = 10000 // 10 seconds default
}: CompanyToastProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(100);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = React.useRef<number>(0);
  const pausedTimeRef = React.useRef<number>(0);

  const cleanupTimers = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = React.useCallback((remainingTime: number = duration) => {
    startTimeRef.current = Date.now();
    
    // Update progress bar
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTimeRef.current + pausedTimeRef.current;
        const remaining = Math.max(0, remainingTime - elapsed);
        const newProgress = (remaining / duration) * 100;
        setProgress(newProgress);
        
        if (remaining <= 0) {
          handleClose();
        }
      }
    }, 50);

    // Auto-close timer
    timeoutRef.current = setTimeout(() => {
      if (!isPaused) {
        handleClose();
      }
    }, remainingTime);
  }, [duration, isPaused]);

  const handleClose = React.useCallback(() => {
    setIsVisible(false);
    cleanupTimers();
    // Component will unmount naturally
  }, [cleanupTimers]);

  const handleMouseEnter = React.useCallback(() => {
    if (!isPaused && timeoutRef.current) {
      setIsPaused(true);
      cleanupTimers();
      
      // Save paused time
      const elapsed = Date.now() - startTimeRef.current + pausedTimeRef.current;
      pausedTimeRef.current = elapsed;
    }
  }, [isPaused, cleanupTimers]);

  const handleMouseLeave = React.useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      const remainingTime = duration - pausedTimeRef.current;
      if (remainingTime > 0) {
        startTimer(remainingTime);
      } else {
        handleClose();
      }
    }
  }, [isPaused, duration, startTimer, handleClose]);

  // Initialize toast
  React.useEffect(() => {
    // Show toast immediately
    setIsVisible(true);
    
    // Start timer after animation
    setTimeout(() => {
      startTimer();
    }, 100);

    return cleanupTimers;
  }, [startTimer, cleanupTimers]);

  // Cleanup on unmount
  React.useEffect(() => {
    return cleanupTimers;
  }, [cleanupTimers]);

  if (!isVisible && progress <= 0) return null;

  return (
    <div
      className={`fixed top-20 transition-all duration-400 ease-out z-[99999] max-w-80 ${
        isVisible ? 'right-5' : '-right-96'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'var(--color-main)',
        color: 'var(--color-secondary)',
        border: '2px solid var(--color-secondary)',
        borderRadius: '4px',
        boxShadow: '4px 4px 0px var(--color-secondary)',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: '14px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div className="flex items-center gap-2 p-3 pb-4">
        {/* Lucide Palette Icon */}
        <div className="flex items-center flex-shrink-0" style={{ color: 'var(--color-secondary)' }}>
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="13.5" cy="6.5" r=".5"/>
            <circle cx="17.5" cy="10.5" r=".5"/>
            <circle cx="8.5" cy="7.5" r=".5"/>
            <circle cx="6.5" cy="12.5" r=".5"/>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
          </svg>
        </div>
        
        {/* Message Text */}
        <span className="flex-1">
          {message.replace('{company}', companyName)}
        </span>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex items-center justify-center w-5 h-5 flex-shrink-0 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--color-secondary)' }}
          aria-label="Close"
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      {/* Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-1 transition-all duration-50 ease-linear"
        style={{
          background: 'var(--color-secondary)',
          width: `${progress}%`,
          opacity: isPaused ? 0.5 : 1
        }}
      />
      
      {/* Pause Indicator */}
      {isPaused && (
        <div 
          className="absolute top-1 right-1 text-xs opacity-60"
          style={{ color: 'var(--color-secondary)' }}
        >
          ⏸
        </div>
      )}
    </div>
  );
}