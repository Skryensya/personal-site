import * as React from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
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
    forceOS?: 'macos' | 'windows' | null;
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
    designDescription = 'UI/UX, Figma, Prototyping',
    forceOS = null
}) => {
    // Custom OS detection function
    const detectOS = () => {
        if (typeof window === 'undefined') return 'windows';

        const userAgent = window.navigator.userAgent;

        if (/Mac|iPhone|iPad|iPod/.test(userAgent)) {
            return 'macos';
        }

        return 'windows';
    };

    const [windowStyle, setWindowStyle] = React.useState('windows');

    React.useEffect(() => {
        const updateWindowStyle = () => {
            // Check localStorage first for debug override
            const debugOS = localStorage.getItem('debug-os');
            if (debugOS && (debugOS === 'macos' || debugOS === 'windows')) {
                setWindowStyle(debugOS);
            } else if (forceOS) {
                setWindowStyle(forceOS);
            } else {
                setWindowStyle(detectOS());
            }
        };

        updateWindowStyle();

        // Listen for localStorage changes
        const handleStorageChange = () => {
            updateWindowStyle();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [forceOS]);
    const cardData = [
        {
            title: frontendTitle,
            description: frontendDescription,
            pageContent: (
                <div className="space-y-2 w-full">
                    <div className="h-4 bg-main/20 w-3/4"></div>
                    <div className="h-3 bg-main/10 w-full"></div>
                    <div className="h-3 bg-main/10 w-5/6"></div>
                    <div className="flex gap-2 mt-3">
                        <div className="h-6 w-16 bg-main/30 border border-main/40"></div>
                        <div className="h-6 w-12 bg-main/20 border border-main/40"></div>
                    </div>
                </div>
            )
        },
        {
            title: backendTitle,
            description: backendDescription,
            pageContent: (
                <div className="space-y-3 w-full">
                    <div className="h-3 bg-main/30 w-2/3"></div>
                    <div className="space-y-2">
                        <div className="h-2 bg-main/20 w-full"></div>
                        <div className="h-2 bg-main/20 w-4/5"></div>
                        <div className="h-2 bg-main/20 w-3/4"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="h-8 bg-main/10 border border-main/30 flex items-center justify-center">
                            <div className="w-4 h-1 bg-main/40"></div>
                        </div>
                        <div className="h-8 bg-main/10 border border-main/30 flex items-center justify-center">
                            <div className="w-4 h-1 bg-main/40"></div>
                        </div>
                    </div>
                    <div className="h-1 bg-main/50 w-1/2 mt-3"></div>
                </div>
            )
        },
        {
            title: designTitle,
            description: designDescription,
            pageContent: (
                <div className="space-y-2 w-full">
                    <div className="grid grid-cols-3 gap-1">
                        <div className="h-8 bg-main/20 border border-main/30"></div>
                        <div className="h-8 bg-main/30 border border-main/30"></div>
                        <div className="h-8 bg-main/20 border border-main/30"></div>
                    </div>
                    <div className="h-2 bg-main/10 w-full mt-2"></div>
                    <div className="h-2 bg-main/10 w-4/5"></div>
                    <div className="flex justify-between mt-3">
                        <div className="w-8 h-8 bg-main/20 border border-main/30"></div>
                        <div className="w-8 h-8 bg-main/30 border border-main/30"></div>
                    </div>
                </div>
            )
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
                    {/* Browser window header */}
                    <div className={`w-full h-8  bg-secondary text-main flex items-center `}>
                        {windowStyle === 'macos' ? (
                            // macOS style - traffic lights on left
                            <div className="flex gap-2 pl-2">
                                <div className="w-3 h-3 bg-main rounded-full flex items-center justify-center">
                                    <X size={8} className="text-secondary" strokeWidth={3.5} />
                                </div>
                                <div className="w-3 h-3 bg-main rounded-full flex items-center justify-center">
                                    <Minus size={8} className="text-secondary" strokeWidth={3.5} />
                                </div>
                                <div className="w-3 h-3 bg-main rounded-full flex items-center justify-center">
                                    <Maximize2 size={6} className="text-secondary" strokeWidth={3.5} />
                                </div>
                            </div>
                        ) : (
                            // Windows style - controls on right
                            <>
                                <div className="flex-1"></div>
                                <div className="flex">
                                    <div className="w-8 h-8 bg-secondary border-l border-main flex items-center justify-center">
                                        <Minus size={12} className="text-main" strokeWidth={3.5} />
                                    </div>
                                    <div className="w-8 h-8 bg-secondary border-l border-main flex items-center justify-center">
                                        <Square size={10} className="text-main" strokeWidth={3.5} />
                                    </div>
                                    <div className="w-8 h-8 bg-secondary border-l border-main flex items-center justify-center">
                                        <X size={12} className="text-main" strokeWidth={3.5} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Window content */}
                    <div className="p-4 h-[calc(100%-2rem)] flex flex-col border-t-2 border-main">
                        <div className="text-center mb-4">
                            <h3 className="text-sm font-bold mb-2 font-mono uppercase tracking-wide">{card.title}</h3>
                            <p className="text-xs text-main/70 font-mono leading-relaxed">{card.description}</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center">{card.pageContent}</div>
                    </div>
                </Card>
            ))}
        </CardSwap>
    );
};

export default HeroCards;
