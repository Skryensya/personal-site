import * as React from 'react';
const { useState, useEffect } = React;

interface ProjectCarouselProps {
  children: React.ReactNode;
  projectCount: number;
}

export default function ProjectCarousel({ children, projectCount }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Update items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerPage(1); // Mobile: 1 item
      } else if (width < 1024) {
        setItemsPerPage(2); // Tablet: 2 items
      } else {
        setItemsPerPage(3); // Desktop: 3 items
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(projectCount / itemsPerPage);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Only show carousel if more than 3 projects
  if (projectCount <= 3) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 lg:grid-cols-3 gap-x-2">{children}</div>;
  }

  return (
    <div className="relative">
      {/* Carousel container */}
      <div className="overflow-hidden">
        <div 
          className="flex"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="w-full flex-shrink-0"
            >
              <div className={`grid gap-y-4 gap-x-2 ${
                itemsPerPage === 1 
                  ? 'grid-cols-1' 
                  : itemsPerPage === 2 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {React.Children.toArray(children).slice(
                  pageIndex * itemsPerPage,
                  (pageIndex + 1) * itemsPerPage
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="bg-secondary border border-main px-4 py-2 font-mono disabled:opacity-50 disabled:cursor-not-allowed hover:bg-main hover:text-secondary"
          aria-label="Previous projects"
        >
          ← PREV
        </button>

        {/* Dots indicator */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 border border-main ${
                index === currentIndex ? 'bg-main' : 'bg-secondary'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentIndex === totalPages - 1}
          className="bg-secondary border border-main px-4 py-2 font-mono disabled:opacity-50 disabled:cursor-not-allowed hover:bg-main hover:text-secondary"
          aria-label="Next projects"
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}