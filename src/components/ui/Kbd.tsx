import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface KbdProps {
  children?: React.ReactNode;
  keyCode?: string;
  className?: string;
}

export function Kbd({ children, keyCode, className = '' }: KbdProps) {
  const getKeyContent = () => {
    if (children) return children;
    
    switch (keyCode) {
      case 'ArrowUp':
        return <ArrowUp className="w-3 h-3" />;
      case 'ArrowDown':
        return <ArrowDown className="w-3 h-3" />;
      case 'ArrowLeft':
        return <ArrowLeft className="w-3 h-3" />;
      case 'ArrowRight':
        return <ArrowRight className="w-3 h-3" />;
      case 'KeyB':
        return 'B';
      case 'KeyA':
        return 'A';
      default:
        return keyCode || children;
    }
  };

  return (
    <kbd 
      className={`
        bg-gradient-to-br from-main via-main to-secondary 
        text-secondary 
        border-none 
        p-0 
        font-mono 
        font-bold 
        text-xs 
        pointer-events-none 
        w-6 
        h-6 
        flex 
        items-center 
        justify-center 
        shadow-[2px_2px_0px_var(--color-secondary),3px_3px_0px_rgba(0,0,0,0.2)] 
        ${className}
      `}
    >
      {getKeyContent()}
    </kbd>
  );
}