import * as React from 'react';
import HeroCards from './HeroCards';
import SimpleOSDebug from './SimpleOSDebug';

interface HeroCardsWithDebugProps {
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

const HeroCardsWithDebug: React.FC<HeroCardsWithDebugProps> = (props) => {
  const [forceOS, setForceOS] = React.useState<'macos' | 'windows' | null>(null);

  return (
    <div>
      <HeroCards {...props} forceOS={forceOS} />
      <div className="mt-8">
        <SimpleOSDebug onOSChange={setForceOS} />
      </div>
    </div>
  );
};

export default HeroCardsWithDebug;