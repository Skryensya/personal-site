import * as React from 'react';

const { useState, useEffect, useRef } = React;

interface ScrollyTellingProps {
    className?: string;
}

const ScrollyTelling: React.FC<ScrollyTellingProps> = ({ className = '' }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const containerHeight = rect.height;
            const viewportHeight = window.innerHeight;

            // Calculate progress based on how much of the container has been scrolled
            const startOffset = viewportHeight;
            const endOffset = containerHeight - viewportHeight;
            const scrolled = startOffset - rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / endOffset));

            setScrollProgress(progress);

            const step = Math.min(Math.floor(progress * steps.length), steps.length - 1);
            setCurrentStep(step);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        {
            year: '2019',
            title: 'LOS INICIOS',
            desc: 'Primeros pasos con HTML, CSS y JavaScript vanilla. Descubriendo el poder del código.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Git'],
            icon: '🌱',
            color: 'from-green-400 to-blue-500'
        },
        {
            year: '2020',
            title: 'FRONTEND FOCUS',
            desc: 'Inmersión total en React. Aprendiendo componentes, estado, y el ecosistema moderno.',
            tech: ['React', 'ES6+', 'Webpack', 'Sass'],
            icon: '⚛️',
            color: 'from-blue-400 to-purple-500'
        },
        {
            year: '2021',
            title: 'FULL-STACK JOURNEY',
            desc: 'Expandiendo horizontes con Node.js y bases de datos. Construyendo aplicaciones completas.',
            tech: ['Node.js', 'Express', 'PostgreSQL', 'REST APIs'],
            icon: '🔗',
            color: 'from-purple-400 to-pink-500'
        },
        {
            year: '2022',
            title: 'TYPESCRIPT ADOPTION',
            desc: 'Adoptando TypeScript para código más robusto. Mejorando developer experience y calidad.',
            tech: ['TypeScript', 'GraphQL', 'Prisma', 'Testing'],
            icon: '🛡️',
            color: 'from-pink-400 to-red-500'
        },
        {
            year: '2023',
            title: 'DEVOPS & CLOUD',
            desc: 'Aprendiendo infraestructura como código. AWS, Docker, y deployments automatizados.',
            tech: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
            icon: '☁️',
            color: 'from-red-400 to-yellow-500'
        },
        {
            year: '2024',
            title: 'MODERN STACK',
            desc: 'Especializándome en herramientas modernas. Astro, Tailwind, y arquitecturas performantes.',
            tech: ['Astro', 'Tailwind', 'Vercel', 'Edge Computing'],
            icon: '🚀',
            color: 'from-yellow-400 to-green-500'
        }
    ];

    return (
        <div ref={containerRef} className={`relative ${className}`} style={{ height: `${steps.length * 100}vh` }}>
            {/* Cards sticky que se mueven */}
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <div className="relative w-full max-w-2xl mx-auto px-6">
                    {/* Stack de cards */}
                    {steps.map((step, index) => {
                        const isActive = index === currentStep;
                        const isPast = index < currentStep;
                        const isFuture = index > currentStep;

                        // Calcular transformaciones para cada card
                        let transform = '';
                        let opacity = 1;
                        let scale = 1;

                        if (isPast) {
                            // Cards pasadas se mueven hacia arriba y se desvanecen
                            transform = `translateY(-${(currentStep - index) * 100}px) scale(0.8)`;
                            opacity = Math.max(0, 1 - (currentStep - index) * 0.3);
                        } else if (isFuture) {
                            // Cards futuras se mueven hacia abajo y están parcialmente visibles
                            transform = `translateY(${(index - currentStep) * 50}px) scale(${1 - (index - currentStep) * 0.1})`;
                            opacity = Math.max(0.3, 1 - (index - currentStep) * 0.2);
                        } else {
                            // Card activa está centrada
                            transform = 'translateY(0) scale(1)';
                            opacity = 1;
                            scale = 1;
                        }

                        return (
                            <div
                                key={index}
                                className="absolute inset-0 flex items-center justify-center"
                                style={{
                                    transform,
                                    opacity,
                                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    zIndex: steps.length - Math.abs(index - currentStep)
                                }}
                            >
                                <div className={`w-full max-w-lg border-4 border-main p-8 ${isActive ? 'bg-main text-secondary' : 'bg-secondary text-main'}`}>
                                    {/* Header con icono y año */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl">{step.icon}</span>
                                            <div className="font-mono text-lg font-bold uppercase tracking-wider">{step.year}</div>
                                        </div>
                                        <div className="font-mono text-sm opacity-60">
                                            {index + 1} / {steps.length}
                                        </div>
                                    </div>

                                    {/* Título */}
                                    <h3 className="font-mono text-2xl font-bold mb-4 uppercase tracking-wide">{step.title}</h3>

                                    {/* Descripción */}
                                    <p className="font-mono text-sm mb-6 leading-relaxed">{step.desc}</p>

                                    {/* Tech stack */}
                                    <div className="flex flex-wrap gap-2">
                                        {step.tech.map((tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className={`px-3 py-1 font-mono text-xs font-semibold border-2 ${
                                                    isActive ? 'bg-secondary text-main border-secondary' : 'bg-main text-secondary border-main'
                                                }`}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Progress indicator fijo */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-secondary border-2 border-main px-6 py-3">
                    <div className="font-mono text-xs text-main uppercase tracking-wider mb-2 text-center">Mi Evolución Técnica</div>
                    <div className="flex gap-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 border border-main transition-all duration-300 ${index <= currentStep ? 'bg-main' : 'bg-transparent'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollyTelling;
