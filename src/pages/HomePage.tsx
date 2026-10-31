import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Users,
  MapPin,
  Calendar,
  Mountain,
  CheckCircle,
  MessageSquare,
  Clock,
  Star,
  ExternalLink,
  Binoculars,
  Route,
  Camera,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { DestinationCard } from '../components/DestinationCard';
import { DestinationCategoryCarousel } from '../components/DestinationCategoryCarousel';
import { PackageCard } from '../components/PackageCard';
import { ImageLightbox } from '../components/ImageLightbox';
import { InquiryModal } from '../components/InquiryModal';
import { ReviewCarousel } from '../components/ReviewCarousel';
import { CertifiedGuideLogo } from '../components/CertifiedGuideLogo';
import { generateWhatsAppLink, createGeneralInquiryWhatsAppMessage } from '../utils/whatsapp';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const getActivePackages = () => {
    const all = StorageService.getPackages().filter(p => p.published);
    // Sort latest added packages on top (newest createdAt first)
    return [...all].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }).slice(0, 8);
  };

  const [destinations, setDestinations] = useState(() => StorageService.getDestinations().filter(d => d.published));
  const [packages, setPackages] = useState(getActivePackages);
  const [testimonials, setTestimonials] = useState(() => StorageService.getTestimonials());
  const [settings, setSettings] = useState(() => StorageService.getSiteSettings());
  const [galleryItems, setGalleryItems] = useState(() => StorageService.getGalleryItems());

  useEffect(() => {
    const handleDataUpdate = () => {
      setDestinations(StorageService.getDestinations().filter(d => d.published));
      setPackages(getActivePackages());
      setTestimonials(StorageService.getTestimonials());
      setSettings(StorageService.getSiteSettings());
      setGalleryItems(StorageService.getGalleryItems());
    };

    window.addEventListener('baunduilla_data_updated', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);
    return () => {
      window.removeEventListener('baunduilla_data_updated', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, []);

  // Search input state in the hero input pill
  const [destinationQuery, setDestinationQuery] = useState('');

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Inquiry modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [modalDestination, setModalDestination] = useState('North Bengal & Dooars');

  const galleryImages = galleryItems.map(item => item.src);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (destinationQuery.trim()) {
      query.set('region', destinationQuery.trim());
    }
    navigate(`/packages?${query.toString()}`);
  };

  const handleQuickDestinationSelect = (name: string) => {
    setDestinationQuery(name);
    navigate(`/packages?region=${encodeURIComponent(name)}`);
  };

  const generalWhatsAppUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createGeneralInquiryWhatsAppMessage()
  );

  // Dynamic view inside the hero outpost window (North Bengal, Meghalaya, Assam, Shimla)
  const [outpostView, setOutpostView] = useState(0);
  const outpostViews = [
    {
      name: 'North Bengal',
      label: 'Dooars Safari & Rhinos',
      gradient: 'from-emerald-700 via-green-600 to-amber-500',
      icon: '🌿'
    },
    {
      name: 'Meghalaya',
      label: 'Living Roots & Dawki',
      gradient: 'from-teal-700 via-emerald-500 to-cyan-400',
      icon: '🌉'
    },
    {
      name: 'Assam',
      label: 'Kaziranga & Brahmaputra',
      gradient: 'from-green-700 via-emerald-600 to-amber-600',
      icon: '🦏'
    },
    {
      name: 'Shimla',
      label: 'Himachal Pine Ridges',
      gradient: 'from-blue-700 via-sky-600 to-indigo-400',
      icon: '🏔️'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 sm:pb-28 lg:pb-36">
      {/* ============================================================== */}
      {/* HERO SECTION - 100% MOBILE-FRIENDLY & MULTI-TERRAIN JOURNEYS  */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EAE8E1] via-[#F4F3EE] to-[#E5E2D9] pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-stone-200/60">
        
        {/* Subtle Grid Floor (isometric pattern) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(23, 50, 77, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(23, 50, 77, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '72px 72px'
          }}
        />

        {/* Ambient Warm Sunbeam Lighting effect */}
        <div className="absolute -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 bg-white/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-72 sm:w-[30rem] h-72 sm:h-[30rem] bg-[#E99B54]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[520px]">
            
            {/* Left Column: Bold Responsive Headline, Subtext, and Capsule Input */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 lg:pr-4">
              
              {settings.heroBadge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 backdrop-blur-sm border border-stone-200/90 text-[#17324D] rounded-full text-xs font-semibold shadow-xs hover:border-[#173F35]/30 transition-all">
                  <CertifiedGuideLogo className="w-5 h-5" />
                  <span className="font-semibold text-stone-800">{settings.heroBadge}</span>
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold text-[#17324D] tracking-tight leading-[1.14] font-sans break-words whitespace-pre-line">
                {settings.heroHeadline || (
                  <>
                    Book your <br className="hidden sm:inline" />
                    adventure <br className="hidden sm:inline" />
                    journey now!
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-stone-600 max-w-md leading-relaxed font-normal">
                {settings.heroSubheadline || "With Baunduilla, explore wildlife safaris in Dooars, living root bridges in Meghalaya, tea garden retreats, and Himalayan road trips. Just start with where you want to go."}
              </p>

              {/* Exact Pill Input Container - 100% Mobile Friendly (no clipping or overflow) */}
              <div className="pt-1 sm:pt-2">
                <form
                  onSubmit={handleHeroSearch}
                  className="bg-white rounded-full p-1.5 sm:p-2 pl-3.5 sm:pl-5 shadow-xl shadow-stone-300/40 border border-stone-200/90 flex items-center justify-between gap-2 sm:gap-3 max-w-md transition-all hover:shadow-2xl"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-1 shrink-0 text-xs font-bold text-[#17324D]">
                      <Compass className="w-4 h-4 text-[#E99B54] stroke-[2.5]" />
                      <span className="hidden xs:inline">My trip</span>
                      <span className="text-stone-300 ml-0.5 font-normal hidden xs:inline">|</span>
                    </div>
                    <input
                      type="text"
                      value={destinationQuery}
                      onChange={(e) => setDestinationQuery(e.target.value)}
                      placeholder={settings.heroCtaText || "Where to? (e.g. Dooars, Sikkim, Spiti)"}
                      className="w-full text-xs sm:text-sm text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none font-medium truncate"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#E99B54] hover:bg-[#D88940] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#E99B54]/30 transition-transform active:scale-95"
                    aria-label="Search destinations"
                  >
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  </button>
                </form>

                {/* Popular Destination Tags below input - completely wrapped, no clipping */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3.5 text-xs text-stone-500">
                  <span className="font-semibold text-stone-400">Popular:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDestinationSelect('North Bengal & Dooars')}
                    className="hover:text-[#17324D] hover:underline font-medium bg-stone-200/50 sm:bg-transparent px-2 sm:px-0 py-0.5 sm:py-0 rounded-md transition-colors"
                  >
                    North Bengal
                  </button>
                  <span className="hidden sm:inline">·</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDestinationSelect('Meghalaya')}
                    className="hover:text-[#17324D] hover:underline font-medium bg-stone-200/50 sm:bg-transparent px-2 sm:px-0 py-0.5 sm:py-0 rounded-md transition-colors"
                  >
                    Meghalaya
                  </button>
                  <span className="hidden sm:inline">·</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDestinationSelect('Assam & Kaziranga')}
                    className="hover:text-[#17324D] hover:underline font-medium bg-stone-200/50 sm:bg-transparent px-2 sm:px-0 py-0.5 sm:py-0 rounded-md transition-colors"
                  >
                    Assam
                  </button>
                  <span className="hidden sm:inline">·</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDestinationSelect('Shimla & Himachal Hills')}
                    className="hover:text-[#17324D] hover:underline font-medium bg-stone-200/50 sm:bg-transparent px-2 sm:px-0 py-0.5 sm:py-0 rounded-md transition-colors"
                  >
                    Shimla
                  </button>
                </div>
              </div>

              {/* Trust Indicators - broad travel appeal: Safaris, Treks & Group tours */}
              <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-stone-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#173F35]" />
                  <span>Verified Tour Captains</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Binoculars className="w-4 h-4 text-[#E99B54]" />
                  <span>Safaris, Treks & Road Trips</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#173F35]" />
                  <span>Max 12 Guests/Group</span>
                </span>
              </div>
            </div>

            {/* Right Column: 3D Isometric Travel Outpost - 100% Mobile Friendly (Zero collisions) */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center pt-4 lg:pt-0">
              
              {/* Responsive Container */}
              <div className="relative w-full max-w-[340px] sm:max-w-[440px] flex flex-col items-center select-none">
                
                {/* Desktop/Tablet 3D Isometric Conveyor Rail (hidden on narrow screens to prevent text overlap) */}
                <div 
                  className="hidden sm:block absolute -top-5 -left-4 w-60 h-12 bg-gradient-to-r from-stone-200/90 to-stone-300/80 rounded-2xl shadow-lg border-b-4 border-stone-400/30 origin-top-left pointer-events-none z-0"
                  style={{ transform: 'rotate(-14deg) skewX(-12deg)' }}
                >
                  <div className="w-full h-1 bg-stone-400/25 rounded-full mt-5 mx-3" />
                </div>

                {/* Floating Destination Chips - Responsively Spaced */}
                {/* On mobile: clean interactive ribbon above the outpost */}
                {/* On desktop: isometric parcel packages along the track */}
                <div className="w-full flex sm:hidden items-center justify-center gap-2 mb-3 z-20">
                  <button
                    type="button"
                    onClick={() => handleQuickDestinationSelect('North Bengal & Dooars')}
                    className="bg-[#D4A373] text-[#202824] px-3 py-1.5 rounded-xl shadow-md text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <span>🌿 Dooars Safari</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDestinationSelect('Sikkim')}
                    className="bg-[#C89666] text-[#202824] px-3 py-1.5 rounded-xl shadow-md text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <span>🏔️ Sikkim Pass</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Desktop Floating Parcel 1: Dooars Safari */}
                <div 
                  onClick={() => handleQuickDestinationSelect('North Bengal & Dooars')}
                  className="hidden sm:block absolute -top-4 left-0 z-20 bg-[#D4A373] text-[#202824] px-3.5 py-2 rounded-xl shadow-xl border-t-2 border-l-2 border-white/40 cursor-pointer hover:-translate-y-1 transition-all group"
                  style={{ transform: 'rotate(-8deg)' }}
                  title="Click to view Dooars wildlife packages"
                >
                  <div className="text-[9px] uppercase font-bold tracking-wider text-amber-950/70">Wildlife</div>
                  <div className="text-xs font-bold text-amber-950 font-sans flex items-center gap-1">
                    <span>🌿 Dooars Safari</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Desktop Floating Parcel 2: Sikkim Odyssey */}
                <div 
                  onClick={() => handleQuickDestinationSelect('Sikkim')}
                  className="hidden sm:block absolute top-7 left-28 z-20 bg-[#C89666] text-[#202824] px-3.5 py-2 rounded-xl shadow-xl border-t-2 border-l-2 border-white/40 cursor-pointer hover:-translate-y-1 transition-all group"
                  style={{ transform: 'rotate(-4deg)' }}
                  title="Click to view Sikkim packages"
                >
                  <div className="text-[9px] uppercase font-bold tracking-wider text-amber-950/70">High Altitude</div>
                  <div className="text-xs font-bold text-amber-950 font-sans flex items-center gap-1">
                    <span>🏔️ Sikkim 17,800'</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* The Central Outpost Building - Beautiful 3D Style, Zero Collision */}
                <div className="relative z-10 w-full max-w-[320px] sm:max-w-[360px] bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 shadow-2xl shadow-stone-400/35 border border-stone-200/90 flex flex-col justify-between">
                  
                  {/* Outpost Top Skylight Indicator */}
                  <div className="w-24 sm:w-28 h-2 bg-stone-100 rounded-full mx-auto mb-4" />

                  {/* Storefront Main Area: Arched Interactive Window + Awning */}
                  <div className="w-full flex items-center justify-between gap-3 sm:gap-4">
                    
                    {/* Interactive Arched Window showing diverse landscapes */}
                    <div 
                      onClick={() => setOutpostView((prev) => (prev + 1) % outpostViews.length)}
                      className={`w-20 sm:w-24 h-28 sm:h-32 rounded-t-full rounded-b-2xl p-1 shadow-inner relative overflow-hidden group cursor-pointer transition-all shrink-0 bg-gradient-to-t ${outpostViews[outpostView].gradient}`}
                      title="Tap to switch landscape: Dooars, Sikkim, Meghalaya"
                    >
                      <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
                      <div className="relative z-10 w-full h-full border border-white/40 rounded-t-full rounded-b-xl flex flex-col justify-between p-1.5 text-center">
                        <span className="text-[8px] font-bold text-white/90 uppercase tracking-wider bg-black/30 rounded-full px-1 py-0.5">
                          Tap View
                        </span>
                        <div className="text-[10px] text-white font-bold leading-tight pb-0.5">
                          <span className="text-xs block mb-0.5">{outpostViews[outpostView].icon}</span>
                          <span>{outpostViews[outpostView].name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Striped Canopy / Awning with Baunduilla signage */}
                    <div className="flex-1 flex flex-col items-end min-w-0">
                      <div className="bg-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-md mb-1 border border-stone-200/80 flex items-center justify-center">
                        <img
                          src="/assets/aistudio/20261023_085549_c2e8a7b5.png"
                          alt="Baunduilla"
                          className="h-4 sm:h-5 w-auto object-contain"
                        />
                      </div>
                      
                      {/* Awning stripes */}
                      <div className="flex rounded-b-lg overflow-hidden shadow-xs">
                        <div className="w-2.5 sm:w-3 h-3.5 sm:h-4 bg-red-500" />
                        <div className="w-2.5 sm:w-3 h-3.5 sm:h-4 bg-white" />
                        <div className="w-2.5 sm:w-3 h-3.5 sm:h-4 bg-red-500" />
                        <div className="w-2.5 sm:w-3 h-3.5 sm:h-4 bg-white" />
                        <div className="w-2.5 sm:w-3 h-3.5 sm:h-4 bg-red-500" />
                        <div className="w-2.5 sm:w-3 h-3.5 sm:h-4 bg-white" />
                      </div>

                      {/* Travel Dispatch Ticket Counter */}
                      <div className="mt-3 sm:mt-4 px-2.5 py-1.5 bg-stone-50 rounded-xl border border-stone-200 text-right w-full max-w-[130px]">
                        <div className="text-[8px] font-bold text-stone-400 uppercase tracking-wider">Siliguri Desk</div>
                        <div className="text-[10px] font-bold text-[#173F35] flex items-center justify-end gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Trips Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Outpost Base Counter - Safe Wrap for narrow mobile */}
                  <div className="w-full mt-4 pt-3.5 border-t border-stone-100 flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        B
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#173F35] text-xs truncate">Siliguri Hub</div>
                        <div className="text-[10px] text-stone-400 truncate">Dooars, Hills & Pan-India</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setModalDestination('Custom Adventure Inquiry');
                        setInquiryModalOpen(true);
                      }}
                      className="w-full xs:w-auto bg-[#17324D] hover:bg-[#112437] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow transition-all active:scale-95 text-center shrink-0"
                    >
                      Instant Inquiry
                    </button>
                  </div>
                </div>

                {/* Rating Badge: Linked with Good Business Rating / Google Reviews */}
                <a
                  href={settings.googleBusinessUrl || 'https://www.google.com/search?q=Baunduilla+Siliguri+reviews'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 sm:mt-0 sm:absolute sm:-bottom-3 sm:-left-4 z-20 bg-white hover:bg-stone-50 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-stone-200/90 hover:border-amber-400 text-xs flex items-center gap-2.5 max-w-full transition-all hover:scale-105 active:scale-95 group cursor-pointer"
                  title="View Good Business Rating / Google Reviews"
                  aria-label="View Good Business Rating and Verified Traveler Reviews"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <Star className="w-4 h-4 fill-white text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#173F35] text-xs block leading-tight">4.9 / 5.0 Rating</span>
                      <span className="text-[9px] uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                        Good Business
                      </span>
                      <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-[#173F35] transition-colors" />
                    </div>
                    <span className="text-[10px] text-stone-500 leading-tight block mt-0.5">
                      Verified Business Rating • Read Reviews ↗
                    </span>
                  </div>
                </a>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* DESTINATION DISCOVERY                                          */}
      {/* ============================================================== */}
      {/* ICONIC DESTINATIONS BY 4 CATEGORIES (HILL, SEA, JUNGLE, DESERT)*/}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
              <Compass className="w-4 h-4" />
              <span>Explore By Terrain & Nature</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#173F35]">
              Iconic Destinations
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-2xl leading-relaxed">
              Handpicked travel departures across North Bengal, Assam, Sikkim, and Meghalaya.
            </p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#173F35] hover:text-[#E99B54] transition-colors shrink-0"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Carousel-Type Categories and Destination Slider */}
        {settings.showCategoryCarousel !== false && (
          <DestinationCategoryCarousel destinations={destinations} />
        )}
      </section>

      {/* ============================================================== */}
      {/* FEATURED TOUR PACKAGES                                         */}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#17324D] text-white rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
                <Route className="w-4 h-4" />
                <span>Handcrafted Journeys</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Featured Tour Packages
              </h2>
              <p className="text-white/80 text-sm mt-1 max-w-xl">
                Curated departures across North Bengal, Assam, Sikkim, and Meghalaya. Configured and managed by our experienced travel team.
              </p>
            </div>
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#E99B54] hover:text-white transition-colors"
            >
              <span>Browse All Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} tourPackage={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* TREKS & ADVENTURES SECTION (100% Mobile Friendly & Responsive) */}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#173F35] to-[#235A4D] text-white rounded-2xl sm:rounded-3xl p-5 xs:p-7 sm:p-10 lg:p-14 shadow-xl relative overflow-hidden">
          {/* Subtle background ambient glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-1.5 xs:gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 xs:px-3.5 xs:py-1.5 rounded-full text-[11px] xs:text-xs font-semibold text-[#E99B54] border border-white/20 max-w-full">
                <Binoculars className="w-3.5 h-3.5 xs:w-4 xs:h-4 shrink-0" />
                <span className="truncate">Safaris, Treks & Adventures</span>
              </div>

              <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight break-words">
                Explore Wild Trails. Journey with Baunduilla.
              </h2>

              <p className="text-white/85 text-xs xs:text-sm sm:text-base leading-relaxed break-words">
                Whether spotting one-horned rhinos in North Bengal and Assam, ascending high-altitude glacial passes in Sikkim, or descending into Meghalaya's living root bridge canyons—we combine local route knowledge with safety and camaraderie.
              </p>

              {/* Responsive 4-Feature Highlights (Single column on tiny screens, 2-col on xs+) */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 pt-1 sm:pt-2">
                <div className="flex items-start gap-2.5 xs:gap-3 min-w-0">
                  <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-[#E99B54]/20 flex items-center justify-center text-[#E99B54] shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs xs:text-sm text-white truncate xs:whitespace-normal">Certified Leaders</h3>
                    <p className="text-[11px] xs:text-xs text-white/70 leading-tight">Veteran local tour captains</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 xs:gap-3 min-w-0">
                  <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-[#E99B54]/20 flex items-center justify-center text-[#E99B54] shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs xs:text-sm text-white truncate xs:whitespace-normal">Small Groups</h3>
                    <p className="text-[11px] xs:text-xs text-white/70 leading-tight">8-14 travellers max</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 xs:gap-3 min-w-0">
                  <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-[#E99B54]/20 flex items-center justify-center text-[#E99B54] shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs xs:text-sm text-white truncate xs:whitespace-normal">Safe Altitude Pace</h3>
                    <p className="text-[11px] xs:text-xs text-white/70 leading-tight">Careful acclimatization</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 xs:gap-3 min-w-0">
                  <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-[#E99B54]/20 flex items-center justify-center text-[#E99B54] shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs xs:text-sm text-white truncate xs:whitespace-normal">Leave No Trace</h3>
                    <p className="text-[11px] xs:text-xs text-white/70 leading-tight">Eco-conscious trails</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Full-width touch friendly on phones */}
              <div className="pt-2 sm:pt-4 flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-4">
                <Link
                  to="/adventures"
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-[#E99B54] hover:bg-[#D88940] active:scale-95 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all text-center"
                >
                  <span>Explore Treks & Trails</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/plan-my-trip"
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all border border-white/20 text-center"
                >
                  <span>Custom Expedition</span>
                </Link>
              </div>
            </div>

            {/* Right Media Column */}
            <div className="relative mt-2 lg:mt-0">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/15 bg-black/20">
                <div className="aspect-[16/10] xs:aspect-[4/3] w-full">
                  <img
                    src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80"
                    alt="Trekking in the Himalayas"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Altitude Stamp Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] xs:text-[11px] font-bold px-2.5 py-1 xs:px-3 xs:py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
                  <Mountain className="w-3.5 h-3.5 text-[#E99B54]" />
                  <span>High-Altitude Guided</span>
                </div>
              </div>

              {/* Safety Notice Badge: Cleanly structured for mobile & desktop without boundary clipping */}
              <div className="mt-3.5 sm:mt-0 sm:absolute sm:-bottom-5 sm:-left-3 z-10 bg-white text-[#202824] p-3 xs:p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl max-w-full sm:max-w-[280px] md:max-w-xs border border-stone-100">
                <div className="flex items-center gap-2 text-xs font-bold text-[#173F35] mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#E99B54] shrink-0" />
                  <span>Important Safety Notice</span>
                </div>
                <p className="text-[10px] xs:text-[11px] text-stone-600 leading-normal">
                  All trek availability and route clearances are confirmed prior to departure based on weather and forest guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* WHY TRAVEL WITH BAUNDUILLA                                     */}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
            <Users className="w-4 h-4" />
            <span>The Baunduilla Difference</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#173F35]">
            Why Travel With Us?
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            We are real travelers and community builders based right at the doorstep of the Eastern Himalayas in Siliguri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center mb-5 font-bold">
              01
            </div>
            <h3 className="font-serif text-xl font-bold text-[#173F35] mb-2">
              Carefully Planned Itineraries
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              We never rush you through checklist sightseeing. Our routes allow natural acclimatization, time for photography, and deep appreciation of each place.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center mb-5 font-bold">
              02
            </div>
            <h3 className="font-serif text-xl font-bold text-[#173F35] mb-2">
              Friendly Group Travel
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Our small-group departures are welcoming to solo travelers, couples, and friends. You join as strangers and return as lifelong travel companions.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center mb-5 font-bold">
              03
            </div>
            <h3 className="font-serif text-xl font-bold text-[#173F35] mb-2">
              Transparent Package Information
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Clear inclusions, clear exclusions, and honest details about road conditions and hotel standards. No surprise hidden charges at the checkpost.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center mb-5 font-bold">
              04
            </div>
            <h3 className="font-serif text-xl font-bold text-[#173F35] mb-2">
              Authentic Local Experiences
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Eat home-cooked meals in traditional village homestays, meet local artisans, and support the mountain families whose homes we visit.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center mb-5 font-bold">
              05
            </div>
            <h3 className="font-serif text-xl font-bold text-[#173F35] mb-2">
              Personalised Trip Planning
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Have specific dates, a family group, or a specialized photography plan? We design custom day-by-day itineraries tailored to your pace.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center mb-5 font-bold">
              06
            </div>
            <h3 className="font-serif text-xl font-bold text-[#173F35] mb-2">
              Responsive Travel Assistance
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              From permit clearance to vehicle coordination during weather changes, our Siliguri-based travel desk stays connected with you throughout your journey.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* TRAVEL EXPERIENCE GALLERY (WITH LIGHTBOX)                      */}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
            <Camera className="w-4 h-4" />
            <span>Visual Stories</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#173F35]">
            {settings.galleryTitle || 'Travel Experience Gallery'}
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            {settings.gallerySubtitle || 'Sacred high-altitude temples, Himalayan peaks of Kinnaur and Garhwal, and living root bridges of Meghalaya.'}
          </p>
        </div>

        {galleryItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
            <Camera className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">Gallery is currently being refreshed</p>
            <p className="text-xs text-stone-500 mt-1">Check back soon for new Himalayan visual stories and travel photography.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryItems.map((item, i) => (
              <div
                key={item.id}
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Gradient scrim for high readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#E99B54] mb-1 drop-shadow-xs">
                    {item.tag} • {item.location}
                  </span>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-tight drop-shadow-xs">
                    {item.title}
                  </h3>
                </div>

                {/* Hover Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#173F35] text-[11px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#E99B54]" />
                  <span>Enlarge</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* TESTIMONIALS SECTION                                           */}
      {/* ============================================================== */}
      {settings.showTestimonials !== false && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-stone-50/90 via-white to-stone-50/90 rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E99B54]">
                Customer Experiences
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#173F35] mt-1 tracking-tight">
                Words From Fellow Explorers
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
                Genuine feedback and reflections from travelers who explored the Eastern Himalayas, Dooars, and the Northeast with Baunduilla.
              </p>
            </div>

            <ReviewCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* FINAL CALL TO ACTION                                           */}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#17324D] text-white rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto relative z-10 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E99B54]">
              Ready for Your Next Trip?
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Let's Plan Your Next Adventure.
            </h2>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Have questions about upcoming departure dates, Dooars safari slots, Meghalaya road trips, Sikkim weather, or customized family itineraries? Speak directly with our travel desk.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => {
                  setModalDestination('Custom Adventure Trip');
                  setInquiryModalOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E99B54] hover:bg-[#D88940] text-white px-5 sm:px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Talk to Our Travel Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 sm:px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Query</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
      <ImageLightbox
        images={galleryImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(i) => setLightboxIndex(i)}
        title={galleryItems[lightboxIndex] ? `${galleryItems[lightboxIndex].title} • ${galleryItems[lightboxIndex].location}` : "Baunduilla Experience Gallery"}
      />

      {/* Reusable Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        defaultDestination={modalDestination}
      />
    </div>
  );
};
