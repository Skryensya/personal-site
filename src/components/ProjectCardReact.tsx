import * as React from 'react';
import { usePointerCapabilities } from '../contexts/PointerTypeProvider';
import '../utils/pointer-debug';

interface ProjectCardProps {
    title: string;
    description?: string;
    href: string;
    slug?: string;
    dataIndex?: number;
    dataImage?: string;
    dataImageAlt?: string;
}

export default function ProjectCardReact({ title, description = '', href, slug, dataIndex, dataImage, dataImageAlt }: ProjectCardProps) {
    const { hasPointer, hasHover } = usePointerCapabilities();
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // Solo aplicar transforms si tiene pointer preciso y está montado
    const shouldTransform = isMounted && hasPointer && hasHover && (isHovered || isFocused);
    const showIcon = !isMounted || !hasHover || isHovered || isFocused; // Siempre visible en touch, solo en hover en desktop

    const transformStyle =
        isMounted && hasPointer && hasHover
            ? {
                  transformStyle: 'preserve-3d' as const,
                  transformOrigin: 'right center',
                  transform: shouldTransform ? 'rotateY(0deg) translateZ(5px) translateY(2px)' : 'rotateY(-8deg) translateZ(15px) translateY(-5px)',
                  transition: 'all 300ms ease-out'
              }
            : {
                  transform: 'none'
              };

    const containerStyle = isMounted && hasPointer && hasHover ? { perspective: '1000px' } : {};

    return (
        <div
            className="w-full aspect-[2/3] relative group"
            style={{
                viewTransitionName: `project-card-${slug}`,
                ...containerStyle
            }}
        >
            <div
                className="relative w-full h-full transition-all duration-300 ease-out"
                style={transformStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Arrow icon */}
                <div
                    className={`absolute top-2 right-2 transition-all duration-300 ease-out hover:scale-105 cursor-pointer z-40 ${
                        showIcon ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-main">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <a
                    href={href}
                    className="relative block w-full h-full cursor-pointer z-10"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    data-project-index={dataIndex}
                    data-project-image={dataImage}
                    data-project-image-alt={dataImageAlt}
                    data-project-title={title}
                    data-project-description={description}
                >
                    {/* Card face */}
                    <div
                        className="absolute w-full h-full bg-main border-2 border-main transition-all duration-200 ease-out"
                        style={{
                            transform: 'translateZ(25px)',
                            clipPath: 'polygon(0 0, calc(100% - var(--triangle-outer)) 0, 100% var(--triangle-outer), 100% 100%, 0 100%)'
                        }}
                    >
                        {/* Title in outer card */}
                        <div className="px-4 py-2">
                            <h3 className="font-sans text-2xl font-bold mb-3 text-secondary" style={{ viewTransitionName: `project-content-${slug}` }}>
                                {title}
                            </h3>
                        </div>

                        {/* Inner content container with opposite color */}
                        <div
                            className="absolute inset-0.5 top-12 bg-secondary border-2 border-main transition-all duration-200 ease-out"
                            style={{
                                clipPath: 'polygon(0 0, calc(100% - var(--triangle-inner)) 0, 100% var(--triangle-inner), 100% 100%, 0 100%)'
                            }}
                        >
                            {/* Content with CSS exclusions */}
                            <div className="px-3 py-2 h-full flex flex-col">
                                {description && (
                                    <p className="text-base text-main leading-relaxed line-clamp-10 triangle-text-wrap text-pretty flex-1">{description}</p>
                                )}

                                {/* Project number at bottom left */}
                                <div className="mt-auto pt-4">
                                    <span className="text-main font-mono text-4xl font-bold">#{String(dataIndex || 0).padStart(2, '0')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <style>{`
        :root {
          --triangle-base: 95px;
          --triangle-padding: 2px;
          --triangle-outer: var(--triangle-base);
          --triangle-inner: calc(var(--triangle-base) - var(--triangle-padding) * 22);
          --triangle-text: calc(var(--triangle-inner) - 30px);
        }
        
        .triangle-text-wrap {
          --triangle-size: var(--triangle-text);
          margin-right: 0;
        }
        
        .triangle-text-wrap::before {
          content: '';
          float: right;
          width: var(--triangle-size);
          height: var(--triangle-size);
          shape-outside: polygon(0% 0%, 100% 0%, 100% 100%);
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%);
        }
      `}</style>
        </div>
    );
}
