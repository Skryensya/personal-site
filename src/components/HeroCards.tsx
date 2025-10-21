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
                <div className="w-full space-y-3">
                    {/* Terminal/code showcase */}
                    <div className="bg-main/10 border border-main/30">
                        <div className="bg-main/20 px-2 py-1 border-b border-main/30">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-main/60 border border-main/40"></div>
                                <div className="w-2 h-2 bg-main/60 border border-main/40"></div>
                                <div className="w-2 h-2 bg-main/60 border border-main/40"></div>
                            </div>
                        </div>
                        <div className="p-2 text-xs font-mono space-y-1">
                            <div className="text-main/50">$ npm run lighthouse</div>
                            <div className="text-main">✓ Accessibility: 100/100</div>
                            <div className="text-main">✓ Performance: 98/100</div>
                            <div className="text-main">✓ Best Practices: 100/100</div>
                        </div>
                    </div>
                    
                    {/* Real project impact */}
                    <div className="bg-main/5 border border-main/20 p-2">
                        <div className="text-xs font-mono text-main/60 mb-1">KIT DIGITAL UC</div>
                        <div className="font-bold text-xs text-main">100+ sitios activos</div>
                        <div className="text-xs text-main/70">Sistema de diseño en producción</div>
                    </div>
                    
                    {/* Accessibility badge */}
                    <div className="flex items-center gap-2 bg-main/5 border border-main/20 p-2">
                        <div className="w-3 h-3 bg-main border border-main flex items-center justify-center">
                            <div className="w-1 h-1 bg-secondary"></div>
                        </div>
                        <div className="text-xs font-mono text-main">WCAG AAA compliant</div>
                    </div>
                </div>
            )
        },
        {
            title: backendTitle,
            description: backendDescription,
            pageContent: (
                <div className="w-full space-y-3">
                    {/* Server monitoring dashboard */}
                    <div className="bg-main/10 border border-main/30 p-2">
                        <div className="text-xs font-mono text-main/60 mb-2">PRODUCTION STATUS</div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="font-mono text-main/70">api.universidad.cl</span>
                                <span className="font-mono text-main font-bold">ONLINE</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="font-mono text-main/70">Response time</span>
                                <span className="font-mono text-main">23ms</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="font-mono text-main/70">Requests/min</span>
                                <span className="font-mono text-main">2,847</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Database optimization */}
                    <div className="bg-main/5 border border-main/20 p-2">
                        <div className="text-xs font-mono text-main/60 mb-1">OPTIMIZACIÓN BD</div>
                        <div className="text-xs text-main/70">Consultas 85% más rápidas</div>
                        <div className="mt-1 space-y-1">
                            <div className="h-1 bg-main w-full"></div>
                            <div className="h-1 bg-main/60 w-3/4"></div>
                            <div className="h-1 bg-main/30 w-1/2"></div>
                        </div>
                    </div>
                    
                    {/* Error monitoring */}
                    <div className="flex items-center justify-between bg-main/5 border border-main/20 p-2">
                        <div className="text-xs font-mono text-main">Error rate: 0.02%</div>
                        <div className="w-2 h-2 bg-main border border-main"></div>
                    </div>
                </div>
            )
        },
        {
            title: designTitle,
            description: designDescription,
            pageContent: (
                <div className="w-full space-y-3">
                    {/* Design system showcase */}
                    <div className="bg-main/10 border border-main/30 p-2">
                        <div className="text-xs font-mono text-main/60 mb-2">DESIGN TOKENS</div>
                        <div className="grid grid-cols-4 gap-1 mb-2">
                            <div className="h-4 bg-main border border-main"></div>
                            <div className="h-4 bg-secondary border border-main"></div>
                            <div className="h-4 bg-main/50 border border-main"></div>
                            <div className="h-4 bg-main/20 border border-main"></div>
                        </div>
                        <div className="text-xs font-mono text-main/70">Paleta completa: 4 valores</div>
                    </div>
                    
                    {/* This site as example */}
                    <div className="bg-main/5 border border-main/20 p-2">
                        <div className="text-xs font-mono text-main/60 mb-1">ESTE SITIO</div>
                        <div className="text-xs text-main font-bold">100% brutal design</div>
                        <div className="text-xs text-main/70">Zero bibliotecas UI externas</div>
                    </div>
                    
                    {/* Constraints as strength */}
                    <div className="space-y-1">
                        <div className="text-xs font-mono text-main/60">RESTRICCIONES ACTIVAS:</div>
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-main"></div>
                                <span className="font-mono text-main/70">Solo 2 colores por tema</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-main"></div>
                                <span className="font-mono text-main/70">Cero border-radius</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-main"></div>
                                <span className="font-mono text-main/70">Cambios instantáneos</span>
                            </div>
                        </div>
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
                    <div className="p-3 h-[calc(100%-2rem)] flex flex-col border-t-2 border-main">
                        <div className="mb-3">
                            <h3 className="text-sm font-bold mb-1 font-mono uppercase tracking-wide">{card.title}</h3>
                            <p className="text-xs text-main/70 leading-tight">{card.description}</p>
                        </div>
                        <div className="flex-1">{card.pageContent}</div>
                    </div>
                </Card>
            ))}
        </CardSwap>
    );
};

export default HeroCards;
