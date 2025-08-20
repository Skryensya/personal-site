import * as React from 'react';

interface TableOfContentsProps {
    contentId?: string;
    readingGuideToggleId?: string;
    className?: string;
}

export default function TableOfContents({ 
    contentId = 'main-content', 
    readingGuideToggleId = 'reading-guide-toggle',
    className = ''
}: TableOfContentsProps) {
    const [isReadingGuideActive, setIsReadingGuideActive] = React.useState(false);

    React.useEffect(() => {
        const generateTableOfContents = () => {
            const tocList = document.getElementById('toc-list');
            const allHeadings = document.querySelectorAll(`#${contentId} h1, #${contentId} h2`);
            
            // Filter out the hook heading (first h1 in the header section)
            const headings = Array.from(allHeadings).filter(heading => {
                const isInHeader = heading.closest('header');
                return !isInHeader;
            });
            
            if (!tocList || !headings.length) return;
            
            // Clear existing TOC
            tocList.innerHTML = '';
            
            // Generate TOC entries for desktop only
            headings.forEach((heading, index) => {
                // Create slugified ID from heading text
                const headingText = heading.textContent || '';
                const slug = headingText
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Remove accents
                    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
                    .trim()
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/-+/g, '-'); // Remove multiple hyphens
                
                // Ensure unique ID (add index if needed)
                let id = slug;
                if (document.getElementById(id)) {
                    id = `${slug}-${index}`;
                }
                
                heading.id = id;
                
                // Create TOC entry for desktop only
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                
                link.href = `#${id}`;
                link.textContent = heading.textContent || '';
                
                // Add click handler to immediately mark as active
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetElement = document.getElementById(id);
                    if (targetElement) {
                        // Scroll to 200px above the element so it becomes active
                        const elementTop = targetElement.offsetTop;
                        const scrollPosition = Math.max(0, elementTop - 200);
                        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
                        
                        // Immediately update active state
                        setTimeout(() => updateActiveTocItem(id), 100);
                    }
                });
                
                // Desktop styling based on heading level
                const level = parseInt(heading.tagName.charAt(1));
                listItem.className = 'relative group';
                
                if (level === 1 || level === 2) {
                    link.className = 'block text-main border-2 border-transparent hover:border-main text-xs py-2 px-3 mx-1 font-mono font-medium transition-all duration-200 ease-out cursor-pointer';
                } else {
                    link.className = 'block text-main border-2 border-transparent hover:border-main text-xs py-1.5 px-3 pl-5 mx-1 font-mono opacity-70 hover:opacity-100 transition-all duration-200 ease-out cursor-pointer';
                }
                
                listItem.appendChild(link);
                tocList.appendChild(listItem);
            });
        };

        const updateActiveTocItem = (activeId: string) => {
            const tocLinks = document.querySelectorAll('#toc-list a');
            const progressIndicator = document.getElementById('progress-indicator');
            const tocList = document.getElementById('toc-list');
            
            // Reset all links to default style
            tocLinks.forEach(link => {
                link.classList.remove('font-bold', 'text-secondary');
                link.classList.add('text-main');
            });
            
            const activeLink = document.querySelector(`#toc-list a[href="#${activeId}"]`);
            if (activeLink && progressIndicator && tocList) {
                // Style the active link text for better contrast over shadow
                activeLink.classList.remove('text-main');
                activeLink.classList.add('font-bold', 'text-secondary', 'relative', 'z-10');
                
                // Calculate position for animated shadow indicator
                const linkRect = activeLink.getBoundingClientRect();
                const tocListRect = tocList.getBoundingClientRect();
                
                // Position relative to the TOC list container
                const relativeTop = linkRect.top - tocListRect.top;
                const linkHeight = linkRect.height;
                
                // Update animated shadow position and height
                progressIndicator.style.top = `${relativeTop}px`;
                progressIndicator.style.height = `${linkHeight}px`;
                progressIndicator.style.opacity = '1';
            }
        };

        const updateCurrentHeading = () => {
            const allHeadings = document.querySelectorAll(`#${contentId} h1, #${contentId} h2`);
            
            // Filter out the hook heading (first h1 in the header section)
            const headings = Array.from(allHeadings).filter(heading => {
                const isInHeader = heading.closest('header');
                return !isInHeader;
            });
            
            if (!headings.length) return;
            
            let currentHeading = null;
            const detectionY = 200; // Fixed 200px from top of viewport
            
            // Find heading that is closest to being 200px from top but has passed it
            for (let i = 0; i < headings.length; i++) {
                const heading = headings[i] as HTMLElement;
                const headingRect = heading.getBoundingClientRect();
                const headingScreenY = headingRect.top;
                
                // Check if heading has passed the 200px mark from top
                if (headingScreenY <= detectionY) {
                    currentHeading = heading;
                } else {
                    break;
                }
            }
            
            // Update active TOC item
            if (currentHeading && currentHeading.id) {
                updateActiveTocItem(currentHeading.id);
            }
        };

        const initTableOfContents = () => {
            generateTableOfContents();
            updateCurrentHeading();
            
            // Update active heading on scroll
            let scrollTimeout: number;
            
            const handleScroll = () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(updateCurrentHeading, 10) as any;
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        };

        // Initialize on mount and page transitions
        const cleanup1 = initTableOfContents();
        
        const handlePageLoad = () => {
            setTimeout(initTableOfContents, 100);
        };

        document.addEventListener('astro:page-load', handlePageLoad);
        
        return () => {
            if (cleanup1) cleanup1();
            document.removeEventListener('astro:page-load', handlePageLoad);
        };
    }, [contentId, readingGuideToggleId]);

    const handleReadingGuideToggle = () => {
        const toggle = document.getElementById(readingGuideToggleId);
        if (toggle) {
            const isCurrentlyActive = toggle.getAttribute('aria-pressed') === 'true';
            setIsReadingGuideActive(!isCurrentlyActive);
            // Let the actual reading guide component handle the toggle
            toggle.click();
        }
    };

    return (
        <aside className={`w-[250px] flex-shrink-0 hidden lg:block ${className}`} id="content-sidebar">
            <div className="sticky top-20 py-8 px-4">
                {/* Table of Contents */}
                <nav className="toc-nav">
                    <div className="mb-6">
                        <h2 className="text-xs font-mono font-medium text-main opacity-50 uppercase tracking-wide">Contenido</h2>
                    </div>
                    <div className="relative max-h-[50vh] overflow-y-auto scrollbar-custom">
                        {/* Progress indicator background */}
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-main opacity-10" id="progress-bg"></div>
                        {/* Active progress indicator - animated shadow */}
                        <div className="absolute left-3 right-0 bg-main opacity-15 transition-all duration-300 ease-out" id="progress-indicator" style={{height: '0px', top: '0px'}}></div>
                        {/* TOC list with modern styling */}
                        <ul id="toc-list" className="relative space-y-1 pl-3 pr-2">
                            {/* TOC will be generated by JavaScript */}
                        </ul>
                    </div>
                    
                    {/* Custom scrollbar styles */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                            .scrollbar-custom {
                                scrollbar-width: thin;
                                scrollbar-color: var(--color-main) transparent;
                            }
                            
                            .scrollbar-custom::-webkit-scrollbar {
                                width: 8px;
                            }
                            
                            .scrollbar-custom::-webkit-scrollbar-track {
                                background: transparent;
                                border-radius: 0;
                            }
                            
                            .scrollbar-custom::-webkit-scrollbar-thumb {
                                background: var(--color-main);
                                border-radius: 0;
                                border: 2px solid var(--color-secondary);
                                background-clip: content-box;
                            }
                            
                            .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                                background: var(--color-main);
                                opacity: 0.8;
                            }
                            
                            .scrollbar-custom::-webkit-scrollbar-corner {
                                background: transparent;
                            }
                        `
                    }} />
                </nav>
                
                {/* Reading Guide Toggle */}
                <div className="mt-8 pt-6 border-t border-main border-opacity-20">
                    <div className="mb-4">
                        <h3 className="text-xs font-mono font-medium text-main opacity-50 uppercase tracking-wide">Guía de lectura</h3>
                    </div>
                    <button
                        id={readingGuideToggleId}
                        className="w-full text-left text-xs font-mono px-3 py-2 border-2 border-main bg-secondary text-main hover:bg-main hover:text-secondary transition-colors"
                        aria-pressed="false"
                        onClick={handleReadingGuideToggle}
                    >
                        {isReadingGuideActive ? 'Desactivar guía' : 'Activar guía'}
                    </button>
                </div>
            </div>
        </aside>
    );
}