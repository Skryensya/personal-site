import * as React from 'react';
import CardSwap, { Card } from './CardSwap';

interface HeroCardsProps {
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

const HeroCards: React.FC<HeroCardsProps> = ({
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  width = 300,
  height = 200,
  frontendTitle = 'Frontend',
  frontendDescription = 'React, TypeScript, Astro',
  backendTitle = 'Backend',
  backendDescription = 'Node.js, Python, APIs',
  designTitle = 'Design',
  designDescription = 'UI/UX, Figma, Prototyping'
}) => {
  const cardData = [
    {
      title: frontendTitle,
      description: frontendDescription,
      icon: '⚛️'
    },
    {
      title: backendTitle,
      description: backendDescription,
      icon: '🔧'
    },
    {
      title: designTitle,
      description: designDescription,
      icon: '🎨'
    }
  ];

  return (
    <CardSwap
      width={width}
      height={height}
      cardDistance={cardDistance}
      verticalDistance={verticalDistance}
      delay={delay}
      pauseOnHover={pauseOnHover}
      easing="elastic"
      skewAmount={6}
    >
      {cardData.map((card, index) => (
        <Card key={index} customClass="bg-secondary border-2 border-main text-main shadow-none">
          {/* Window header bar */}
          <div className="w-full h-8 bg-main text-secondary border-b-2 border-main flex items-center justify-between px-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-secondary border border-secondary"></div>
              <div className="w-3 h-3 bg-secondary border border-secondary"></div>
              <div className="w-3 h-3 bg-secondary border border-secondary"></div>
            </div>
            <div className="text-xs font-mono uppercase tracking-wider">{card.title}</div>
          </div>

          {/* Window content */}
          <div className="p-6 h-[calc(100%-2rem)] flex flex-col justify-center items-center text-center">
            <div className="text-4xl mb-4 font-mono">{card.icon}</div>
            <h3 className="text-lg font-bold mb-3 font-mono uppercase tracking-wide">{card.title}</h3>
            <p className="text-xs text-main/90 font-mono leading-relaxed">{card.description}</p>
          </div>
        </Card>
      ))}
    </CardSwap>
  );
};

export default HeroCards;