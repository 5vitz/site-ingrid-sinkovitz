import React, { useState, useRef, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const AboutCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 15;
  
  // Touch swipe refs
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  // Generate paths to the 15 photos in the CARROSEL folder
  const photos = Array.from(
    { length: totalSlides }, 
    (_, i) => `/fotos/CARROSEL CURIOSIDADES SOBRE MIM/${i + 1}.png`
  );

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Mobile Swipe Handlers
  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    // Reset
    touchStart.current = null;
    touchEnd.current = null;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* CAROUSEL WRAPPER */}
      <div 
        className="relative w-full aspect-[4/5] overflow-hidden rounded-lg border border-black/10 bg-brand-charcoal/5 shadow-md group select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* SLIDES CONTAINER */}
        <div 
          className="flex w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {photos.map((url, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 bg-black/95">
              <img
                src={url}
                alt={`Curiosidade ${idx + 1}`}
                className="w-full h-full object-contain pointer-events-none"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* PREV BUTTON (Translúcido) */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/80 text-black backdrop-blur-md transition-all duration-300 opacity-80 hover:opacity-100 shadow-sm border border-white/20 active:scale-95"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={24} />
        </button>

        {/* NEXT BUTTON (Translúcido) */}
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/80 text-black backdrop-blur-md transition-all duration-300 opacity-80 hover:opacity-100 shadow-sm border border-white/20 active:scale-95"
          aria-label="Próximo slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* SLIDE COUNTER TOP RIGHT */}
        <div className="absolute top-4 right-4 bg-black/60 text-white text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md">
          {currentIndex + 1} / {totalSlides}
        </div>
      </div>

      {/* INSTAGRAM STYLE DOTS INDICATOR */}
      <div className="flex items-center justify-center space-x-1.5 mt-4 overflow-hidden py-2 px-4 max-w-full">
        {photos.map((_, idx) => {
          // Instagram has relative dot scaling for many items
          const diff = Math.abs(idx - currentIndex);
          let scaleClass = 'scale-100';
          
          if (diff === 0) {
            scaleClass = 'scale-115 bg-brand-blue'; // Active
          } else if (diff === 1) {
            scaleClass = 'scale-100 bg-brand-charcoal/60';
          } else if (diff === 2) {
            scaleClass = 'scale-75 bg-brand-charcoal/40';
          } else {
            scaleClass = 'scale-50 bg-brand-charcoal/20'; // Outer dots shrink
          }

          // To avoid showing 15 dots which can look cluttered,
          // we only render dots that are close to the current index (within a window of 5 dots)
          const isVisible = diff <= 3 || (currentIndex < 3 && idx < 6) || (currentIndex > totalSlides - 4 && idx > totalSlides - 7);

          if (!isVisible) return null;

          return (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer ${scaleClass}`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AboutCarousel;
