import * as React from 'react';
import { OSProvider } from './OSContext';
import HeroCards from './HeroCards';
import OSDebugToggle from './OSDebugToggle';

interface HeroWithOSDebugProps {
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  width?: number;
  height?: number;
  frontendTitle?: string;
  frontendDescription?: string;
  backendTitle?: string;
  backendDescription?: string;
  designTitle?: string;
  designDescription?: string;
}

const HeroWithOSDebug: React.FC<HeroWithOSDebugProps> = (props) => {
  return (
    <OSProvider>
      <div>
        <HeroCards {...props} />
        <div className="mt-8">
          <OSDebugToggle />
        </div>
      </div>
    </OSProvider>
  );
};

export default HeroWithOSDebug;