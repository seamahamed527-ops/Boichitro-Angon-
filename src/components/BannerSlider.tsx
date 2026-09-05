import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { BANNERS } from '../data/products';

interface BannerSliderProps {
  onSelectCategory: (cat: string) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ onSelectCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const currentBanner = BANNERS[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-neutral-200/70 bg-neutral-900 group">
      {/* Banner Slide */}
      <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden">
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.titleBn}
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:scale-100"
          loading="eager"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-rose-600 text-white shadow-xs">
              {currentBanner.badgeBn}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400 text-neutral-950">
              {currentBanner.discountBn}
            </span>
          </div>

          <h2 className="font-bengali font-bold text-xl sm:text-2xl md:text-3xl text-white drop-shadow-sm leading-tight mb-1">
            {currentBanner.titleBn}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-200 line-clamp-1 max-w-md mb-3 font-bengali">
            {currentBanner.subtitleBn}
          </p>

          <button
            id={`banner-cta-${currentBanner.id}`}
            onClick={() => onSelectCategory(currentBanner.categoryTarget)}
            className="self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>কালেকশন দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5 text-rose-600" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2.5 right-4 flex items-center gap-1.5 z-10">
        {BANNERS.map((banner, index) => (
          <button
            key={banner.id}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 bg-rose-500' : 'w-1.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
