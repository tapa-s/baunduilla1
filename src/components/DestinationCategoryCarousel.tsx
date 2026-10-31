import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { Destination } from '../types';
import { DestinationCard } from './DestinationCard';

interface DestinationCategoryCarouselProps {
  destinations: Destination[];
}

export type CategoryType = 'Hill' | 'Sea' | 'Forest' | 'Jungle' | 'Desert' | 'All';

interface CategoryMeta {
  id: CategoryType;
  label: string;
  tagline: string;
  logo: React.ReactNode;
  accentColor: string;
}

/* ============================================================== */
/* CIRCULAR LOGO VECTORS (High-Fidelity Terrain Emblems)          */
/* ============================================================== */

const HillLogo: React.FC = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full object-cover"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="hillSkyGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E473D" />
        <stop offset="60%" stopColor="#2D6A5A" />
        <stop offset="100%" stopColor="#14342C" />
      </linearGradient>
      <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
    </defs>
    {/* Base Circle */}
    <circle cx="50" cy="50" r="48" fill="url(#hillSkyGrad)" />
    {/* Sun over mountain peaks */}
    <circle cx="68" cy="28" r="9" fill="#FBBF24" opacity="0.9" />
    <circle cx="68" cy="28" r="14" fill="#FDE68A" opacity="0.2" />
    {/* Back Mountain Peak */}
    <polygon points="50,20 76,64 24,64" fill="#13362E" />
    <polygon points="50,20 60,38 53,39 50,33 46,39 40,38" fill="url(#snowGrad)" />
    {/* Front Left Peak */}
    <polygon points="32,34 56,76 8,76" fill="#1E5446" />
    <polygon points="32,34 40,49 35,50 32,45 28,50 24,49" fill="url(#snowGrad)" />
    {/* Front Right Peak */}
    <polygon points="66,36 92,80 40,80" fill="#0D2620" />
    <polygon points="66,36 74,51 69,52 66,47 62,52 58,51" fill="url(#snowGrad)" />
    {/* Alpine Pine Tree Silhouettes */}
    <path d="M40 82 L44 73 L48 82 Z" fill="#34D399" opacity="0.85" />
    <path d="M47 84 L52 71 L57 84 Z" fill="#6EE7B7" opacity="0.95" />
    <path d="M56 82 L60 74 L64 82 Z" fill="#34D399" opacity="0.85" />
    {/* Subtle inner ring border */}
    <circle cx="50" cy="50" r="47.5" stroke="#34D399" strokeWidth="1.5" strokeOpacity="0.4" />
  </svg>
);

const SeaLogo: React.FC = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full object-cover"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="seaSkyGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="65%" stopColor="#0369A1" />
        <stop offset="100%" stopColor="#073B5B" />
      </linearGradient>
      <linearGradient id="sunSeaGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#seaSkyGrad)" />
    {/* Coastal Sunset / Sun */}
    <circle cx="50" cy="40" r="14" fill="url(#sunSeaGrad)" />
    <circle cx="50" cy="40" r="19" fill="#FDE68A" opacity="0.25" />
    {/* Distant seagulls */}
    <path d="M28 28 Q31 24 34 28 Q37 24 40 28" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />
    <path d="M64 24 Q66 21 68 24 Q70 21 72 24" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.75" />
    {/* Sailboat silhouette */}
    <path d="M62 46 L62 34 L71 46 Z" fill="#FFFFFF" opacity="0.95" />
    <path d="M59 38 L59 46 L53 46 Z" fill="#E2E8F0" opacity="0.8" />
    <path d="M51 48 Q61 50 73 48 L71 52 Q61 53 53 52 Z" fill="#0F172A" />
    {/* Ocean Rolling Waves */}
    <path d="M2 58 Q26 50 50 58 T98 58 L98 98 L2 98 Z" fill="#0284C7" opacity="0.75" />
    <path d="M2 66 Q26 58 50 66 T98 66 L98 98 L2 98 Z" fill="#0369A1" opacity="0.9" />
    <path d="M2 75 Q26 68 50 75 T98 75 L98 98 L2 98 Z" fill="#0C4A6E" />
    {/* Whitecaps foam */}
    <path d="M6 66 Q26 58 46 65" stroke="#BAE6FD" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
    <path d="M52 75 Q72 68 94 74" stroke="#E0F2FE" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />
    {/* Subtle inner ring border */}
    <circle cx="50" cy="50" r="47.5" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.45" />
  </svg>
);

const JungleLogo: React.FC = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full object-cover"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="jungleSkyGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#15803D" />
        <stop offset="60%" stopColor="#166534" />
        <stop offset="100%" stopColor="#052E16" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#jungleSkyGrad)" />
    {/* Sun glow penetrating dense canopy */}
    <circle cx="50" cy="30" r="16" fill="#A3E635" opacity="0.25" />
    {/* Central Crown / Canopy */}
    <path d="M50 16 Q57 26 68 28 Q56 33 50 44 Q44 33 32 28 Q43 26 50 16 Z" fill="#4ADE80" opacity="0.9" />
    {/* Left Tropical Palm Fronds */}
    <path d="M18 52 Q32 34 50 40 Q36 46 28 62 Z" fill="#22C55E" />
    <path d="M14 66 Q30 52 48 54 Q34 62 24 76 Z" fill="#16A34A" />
    {/* Right Tropical Monstera / Fronds */}
    <path d="M82 52 Q68 34 50 40 Q64 46 72 62 Z" fill="#22C55E" />
    <path d="M86 66 Q70 52 52 54 Q66 62 76 76 Z" fill="#16A34A" />
    {/* Dense Forest Trees / Trunks */}
    <path d="M38 72 L42 98 L46 98 L42 72 Z" fill="#14532D" />
    <path d="M58 70 L54 98 L50 98 L54 70 Z" fill="#14532D" />
    {/* Meandering Forest River */}
    <path d="M46 62 Q51 74 47 98 L53 98 Q57 74 50 62 Z" fill="#38BDF8" opacity="0.85" />
    {/* Fauna / Bird in Flight Silhouette */}
    <path d="M43 56 C46 53 54 53 57 56 C55 58 45 58 43 56 Z" fill="#FEF08A" opacity="0.95" />
    {/* Subtle inner ring border */}
    <circle cx="50" cy="50" r="47.5" stroke="#4ADE80" strokeWidth="1.5" strokeOpacity="0.45" />
  </svg>
);

const DesertLogo: React.FC = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full object-cover"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="desertSkyGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C2410C" />
        <stop offset="50%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#7C2D12" />
      </linearGradient>
      <linearGradient id="duneGradA" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="duneGradB" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#desertSkyGrad)" />
    {/* Radiant Desert Sun */}
    <circle cx="50" cy="28" r="13" fill="#FDE047" />
    <circle cx="50" cy="28" r="18" fill="#FEF08A" opacity="0.25" />
    {/* Back Sand Dunes */}
    <path d="M2 62 Q32 44 62 56 Q80 64 98 54 L98 98 L2 98 Z" fill="url(#duneGradA)" />
    {/* Camel Caravan Silhouette */}
    <g fill="#451A03" transform="translate(42, 43) scale(0.18)">
      <path d="M20 30 Q22 20 28 22 Q34 24 35 28 L40 28 Q42 22 48 24 L52 28 Q55 25 58 28 L60 40 L56 50 L52 50 L54 40 L44 40 L42 50 L38 50 L40 38 L30 38 L28 50 L24 50 L26 36 Z" />
    </g>
    {/* Front Sweeping Dunes */}
    <path d="M2 72 Q36 60 68 76 Q82 82 98 74 L98 98 L2 98 Z" fill="url(#duneGradB)" />
    {/* Wind ripple lines on dunes */}
    <path d="M12 79 Q28 71 44 79" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <path d="M54 85 Q70 77 86 83" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    {/* Subtle inner ring border */}
    <circle cx="50" cy="50" r="47.5" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.5" />
  </svg>
);

const AllTerrainsLogo: React.FC = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full object-cover"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="allSkyGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="60%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#allSkyGrad)" />
    {/* Dotted compass circle */}
    <circle cx="50" cy="50" r="32" stroke="#E99B54" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    {/* 4 Points of the Compass */}
    <polygon points="50,18 55,45 50,50 45,45" fill="#E99B54" />
    <polygon points="50,18 45,45 50,50" fill="#D97706" />
    <polygon points="50,82 55,55 50,50 45,55" fill="#94A3B8" />
    <polygon points="82,50 55,55 50,50 55,45" fill="#CBD5E1" />
    <polygon points="18,50 45,55 50,50 45,45" fill="#64748B" />
    {/* Center Pivot */}
    <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
    <circle cx="50" cy="50" r="2" fill="#E99B54" />
    {/* Subtle inner ring border */}
    <circle cx="50" cy="50" r="47.5" stroke="#E99B54" strokeWidth="1.5" strokeOpacity="0.5" />
  </svg>
);

/* ============================================================== */
/* DESTINATION CATEGORY CAROUSEL COMPONENT                        */
/* ============================================================== */

export const DestinationCategoryCarousel: React.FC<DestinationCategoryCarouselProps> = ({
  destinations,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');
  const [slideIndex, setSlideIndex] = useState(0);

  // Cards per view in destination cards carousel
  const [cardsPerView, setCardsPerView] = useState(3);

  // Mobile touch swipe handling for destination cards
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Category circle carousel horizontal scroll ref
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardsPerView(1);
      } else if (width < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const categories: CategoryMeta[] = [
    {
      id: 'All',
      label: 'All Terrains',
      tagline: 'The complete pan-Indian travel landscape collection',
      logo: <AllTerrainsLogo />,
      accentColor: '#17324D',
    },
    {
      id: 'Hill',
      label: 'Hills & Mountains',
      tagline: 'High Himalayan passes, mist-draped ridges & alpine lakes',
      logo: <HillLogo />,
      accentColor: '#173F35',
    },
    {
      id: 'Sea',
      label: 'Sea & Coastline',
      tagline: 'Turquoise island lagoons, coastal cliffs & golden beaches',
      logo: <SeaLogo />,
      accentColor: '#0E5275',
    },
    {
      id: 'Forest',
      label: 'Forest & Wildlife',
      tagline: 'Dense Sal forests, rhinos, tidal mangroves & rainforests',
      logo: <JungleLogo />,
      accentColor: '#1B4332',
    },
    {
      id: 'Desert',
      label: 'Desert & Dunes',
      tagline: 'Cold trans-Himalayan valleys, golden sand & salt flats',
      logo: <DesertLogo />,
      accentColor: '#B05B20',
    },
  ];

  // Filter destinations based on category
  const filteredDestinations = destinations.filter((d) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Forest' || activeCategory === 'Jungle') {
      return d.category === 'Forest' || d.category === 'Jungle';
    }
    return d.category === activeCategory;
  });

  // Calculate slide boundaries
  const totalItems = filteredDestinations.length;
  const maxSlideIndex = Math.max(0, totalItems - cardsPerView);

  // Reset slide index when category changes
  const handleCategoryChange = (cat: CategoryType) => {
    setActiveCategory(cat);
    setSlideIndex(0);
  };

  const nextSlide = useCallback(() => {
    setSlideIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
  }, [maxSlideIndex]);

  const prevSlide = useCallback(() => {
    setSlideIndex((prev) => (prev <= 0 ? maxSlideIndex : prev - 1));
  }, [maxSlideIndex]);

  // Touch Swipe Handlers for destination cards slider
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

    if (isLeftSwipe && slideIndex < maxSlideIndex) {
      nextSlide();
    } else if (isRightSwipe && slideIndex > 0) {
      prevSlide();
    }
  };

  // Scroll categories carousel left/right smoothly
  const scrollCategoryCarousel = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 220;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Percentage slide offset for destination cards
  const itemWidthPercent = 100 / cardsPerView;
  const translateX = -(slideIndex * itemWidthPercent);

  // Active category meta
  const currentMeta = categories.find((c) => c.id === activeCategory);

  return (
    <div className="space-y-8 select-none">
      {/* ============================================================== */}
      {/* SMALL CIRCLE CAROUSEL WITH LOGOS IN CIRCLE & TEXT ON BOTTOM    */}
      {/* ============================================================== */}
      <div className="relative py-2 px-1">
        {/* Subtle background container to frame the circle carousel */}
        <div className="bg-stone-50/70 border border-stone-200/80 rounded-3xl p-3 sm:p-5 relative shadow-xs">
          {/* Left Arrow Button for Circle Carousel */}
          <button
            type="button"
            onClick={() => scrollCategoryCarousel('left')}
            className="hidden sm:flex absolute -left-3.5 top-1/2 -translate-y-6 z-10 w-8 h-8 rounded-full bg-white border border-stone-200 shadow-md items-center justify-center text-stone-700 hover:bg-[#173F35] hover:text-white transition-all active:scale-95"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Circle Carousel Horizontal Track */}
          <div
            ref={categoryScrollRef}
            className="flex items-start justify-start sm:justify-center gap-5 sm:gap-8 md:gap-12 overflow-x-auto scrollbar-none py-2 px-3 scroll-smooth snap-x snap-mandatory"
          >
            {categories.map((cat) => {
              const isSelected =
                activeCategory === cat.id ||
                ((cat.id === 'Forest' || cat.id === 'Jungle') &&
                  (activeCategory === 'Forest' || activeCategory === 'Jungle'));
              const count =
                cat.id === 'All'
                  ? destinations.length
                  : cat.id === 'Forest' || cat.id === 'Jungle'
                  ? destinations.filter((d) => d.category === 'Forest' || d.category === 'Jungle').length
                  : destinations.filter((d) => d.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className="flex flex-col items-center group cursor-pointer shrink-0 snap-center focus:outline-none transition-transform"
                >
                  {/* Top Circle Container with Logo Inside */}
                  <div
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 transform ${
                      isSelected
                        ? 'ring-4 ring-[#173F35] ring-offset-2 ring-offset-stone-50 scale-105 shadow-lg'
                        : 'ring-2 ring-stone-200 hover:ring-[#E99B54] hover:scale-105 shadow-xs'
                    }`}
                  >
                    {/* Inner Circle Wrapping the Logo */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-inner flex items-center justify-center">
                      {cat.logo}
                    </div>

                    {/* Active Selected Corner Badge */}
                    {isSelected && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#E99B54] text-white flex items-center justify-center shadow-xs border-2 border-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </span>
                    )}
                  </div>

                  {/* Category Text at the Bottom */}
                  <div className="text-center mt-2.5 max-w-[90px] sm:max-w-[115px]">
                    <span
                      className={`text-xs sm:text-sm block tracking-tight leading-tight transition-colors ${
                        isSelected
                          ? 'font-extrabold text-[#173F35]'
                          : 'font-bold text-stone-700 group-hover:text-[#173F35]'
                      }`}
                    >
                      {cat.label}
                    </span>

                    {/* Destination Count */}
                    <span
                      className={`text-[10px] block mt-0.5 font-medium transition-colors ${
                        isSelected ? 'text-[#E99B54] font-bold' : 'text-stone-400 group-hover:text-stone-600'
                      }`}
                    >
                      {count} {count === 1 ? 'place' : 'places'}
                    </span>

                    {/* Active indicator dot under text */}
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#173F35] mx-auto mt-1 animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button for Circle Carousel */}
          <button
            type="button"
            onClick={() => scrollCategoryCarousel('right')}
            className="hidden sm:flex absolute -right-3.5 top-1/2 -translate-y-6 z-10 w-8 h-8 rounded-full bg-white border border-stone-200 shadow-md items-center justify-center text-stone-700 hover:bg-[#173F35] hover:text-white transition-all active:scale-95"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ACTIVE CATEGORY HEADER & SLIDER CONTROLS                       */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E99B54]" />
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#173F35]">
              {currentMeta?.label} Destinations
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {currentMeta?.tagline}
          </p>
        </div>

        {/* Carousel Navigation Buttons & Counter */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {totalItems > cardsPerView && (
            <div className="text-xs font-semibold text-stone-500 mr-1">
              <span>
                {slideIndex + 1} - {Math.min(slideIndex + cardsPerView, totalItems)} of {totalItems}
              </span>
            </div>
          )}

          {totalItems > cardsPerView && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="w-9 h-9 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-[#17324D] active:scale-95 flex items-center justify-center transition-all shadow-xs"
                aria-label="Previous destination"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-[#17324D] active:scale-95 flex items-center justify-center transition-all shadow-xs"
                aria-label="Next destination"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* DESTINATION CARDS TRACK                                        */}
      {/* ============================================================== */}
      {filteredDestinations.length > 0 ? (
        <div
          className="overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${translateX}%)` }}
          >
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="shrink-0 px-2 sm:px-3"
                style={{ width: `${itemWidthPercent}%` }}
              >
                <div className="h-full">
                  <DestinationCard destination={dest} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-stone-700">
            Currently featuring our core departures across North Bengal, Meghalaya, Assam, and Shimla.
          </p>
          <p className="text-xs text-stone-500">
            Custom expeditions for {currentMeta?.label} can be configured on request by our Siliguri desk.
          </p>
          <button
            type="button"
            onClick={() => handleCategoryChange('All')}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#173F35] text-white px-4 py-2 rounded-xl shadow-xs hover:bg-[#112437] transition-all cursor-pointer"
          >
            <span>View All Active Tours</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* PAGINATION INDICATORS & DIRECT LINK TO DESTINATIONS            */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Pagination Dots (shown when items exceed view capacity) */}
        {maxSlideIndex > 0 ? (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxSlideIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSlideIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  slideIndex === i
                    ? 'w-7 h-2 bg-[#E99B54]'
                    : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        ) : (
          <div />
        )}

        {/* Quick Explore Link for Active Category */}
        <Link
          to={activeCategory === 'All' ? '/destinations' : `/destinations?category=${activeCategory}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173F35] hover:text-[#E99B54] transition-colors"
        >
          <span>Explore all {currentMeta?.label} in Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
