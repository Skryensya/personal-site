import * as React from 'react';
import { OSProvider } from './OSContext';
import HeroCards from './HeroCards';

interface HeroCardsWithOSProps {
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

const HeroCardsWithOS: React.FC<HeroCardsWithOSProps> = (props) => {
  return (
    <OSProvider>
      <HeroCards {...props} />
    </OSProvider>
  );
};

export default HeroCardsWithOS;