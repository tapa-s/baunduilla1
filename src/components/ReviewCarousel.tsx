import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, ShieldCheck, Pause, Play, UserCheck } from 'lucide-react';
import { Testimonial } from '../types';

interface ReviewCarouselProps {
  testimonials: Testimonial[];
}

export const ReviewCarousel: React.FC<ReviewCarouselProps> = ({
  testimonials,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Screen size check for number of visible cards
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = testimonials.length;
  // On desktop we show 2 cards at a time if total >= 2, on mobile 1 card
  const maxIndex = isMobile ? total - 1 : Math.max(0, total - 2);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused || isHovered || total <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => clearInterval(timer);
  }, [nextSlide, isPaused, isHovered, total]);

  // Touch Swipe Handlers for mobile
  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Calculate slide offset percentage
  // Mobile: 100% per slide. Desktop: 50% per slide.
  const slideWidthPercent = isMobile ? 100 : 50;
  const translateX = -(currentIndex * slideWidthPercent);

  // Helper to extract clean initials from customer names
  const getInitials = (name: string) => {
    const parts = name.split('&')[0].trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (parts[0] ? parts[0].slice(0, 2) : 'EX').toUpperCase();
  };

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Controls Bar: Counter, Auto-play pause, Prev/Next buttons */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-stone-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Verified Review {currentIndex + 1}
            {!isMobile && total > 1 ? ` & ${Math.min(currentIndex + 2, total)}` : ''} of {total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pause / Play auto-advance button */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
            aria-label={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current text-stone-700" /> : <Pause className="w-3.5 h-3.5 text-stone-700" />}
          </button>

          {/* Previous Slide Button */}
          <button
            type="button"
            onClick={prevSlide}
            className="w-9 h-9 rounded-full border border-stone-200 bg-white hover:bg-stone-100 active:scale-95 text-[#17324D] flex items-center justify-center transition-all shadow-sm cursor-pointer"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Next Slide Button */}
          <button
            type="button"
            onClick={nextSlide}
            className="w-9 h-9 rounded-full border border-stone-200 bg-white hover:bg-stone-100 active:scale-95 text-[#17324D] flex items-center justify-center transition-all shadow-sm cursor-pointer"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Carousel Viewport Container */}
      <div
        className="overflow-hidden rounded-3xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out items-stretch"
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`shrink-0 px-2 sm:px-3 flex ${isMobile ? 'w-full' : 'w-1/2'}`}
            >
              <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group">
                
                {/* Header: Star Rating & Verified Explorer Badge */}
                <div className="relative z-10 mb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    {/* Star Rating with Score */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-stone-700 ml-1">5.0</span>
                    </div>

                    {/* Verified Review Badge */}
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Review</span>
                    </div>
                  </div>

                  {/* Fully Readable Feedback */}
                  <div className="relative pt-1 pb-1">
                    <Quote className="w-7 h-7 text-[#E99B54] mb-3 fill-[#E99B54]/15" />
                    <p className="text-stone-800 text-sm sm:text-[15px] leading-relaxed font-normal not-italic">
                      "{t.review}"
                    </p>
                  </div>
                </div>

                {/* Author Information - Just Customer Name */}
                <div className="relative z-10 pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Clean Initials Emblem */}
                    <div
                      className="w-10 h-10 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-xs border border-[#173F35]"
                      title={t.customerName}
                    >
                      {getInitials(t.customerName)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm sm:text-base text-[#173F35] truncate flex items-center gap-1.5">
                        <span>{t.customerName}</span>
                        <span title="Verified booking" className="inline-flex">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </span>
                      </h4>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToSlide(i)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === i
                ? 'w-7 h-2 bg-[#E99B54]'
                : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
