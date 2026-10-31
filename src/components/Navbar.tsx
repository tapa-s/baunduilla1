import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X, ArrowRight, MessageSquare, Hotel, Car, Facebook, Instagram, Youtube } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { generateWhatsAppLink, createGeneralInquiryWhatsAppMessage } from '../utils/whatsapp';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [settings, setSettings] = useState(() => StorageService.getSiteSettings());

  // Listen to storage update events so settings and button links update live
  useEffect(() => {
    const handleUpdate = () => {
      setSettings(StorageService.getSiteSettings());
    };
    window.addEventListener('baunduilla_data_updated', handleUpdate);
    return () => window.removeEventListener('baunduilla_data_updated', handleUpdate);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Tour Packages', path: '/packages' },
    { name: 'Treks & Adventures', path: '/adventures' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Blog', path: '/blog' },
  ];

  const generalWhatsAppUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createGeneralInquiryWhatsAppMessage()
  );

  const hotelText = settings.hotelButtonText || 'Get A Hotel';
  const hotelUrl =
    settings.hotelButtonUrl ||
    generateWhatsAppLink(
      settings.whatsappNumber,
      'Hello Baunduilla, I would like to inquire about booking a hotel or homestay.'
    );
  const hotelButtonEnabled = settings.hotelButtonEnabled !== false;

  const cabText = settings.cabButtonText || 'Hire A Cab';
  const cabUrl =
    settings.cabButtonUrl ||
    generateWhatsAppLink(
      settings.whatsappNumber,
      'Hello Baunduilla, I would like to hire a cab or mountain taxi for my trip.'
    );
  const cabButtonEnabled = settings.cabButtonEnabled !== false;

  const renderMenuButton = (
    text: string,
    url: string,
    icon: React.ReactNode,
    variant: 'hotel' | 'cab',
    isMobile: boolean = false
  ) => {
    if (!url) return null;
    const isExternal =
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('tel:') ||
      url.startsWith('mailto:') ||
      url.startsWith('//');

    const baseClasses = isMobile
      ? variant === 'hotel'
        ? 'flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer'
        : 'flex items-center justify-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/90 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer'
      : variant === 'hotel'
      ? 'text-xs font-semibold text-stone-700 bg-amber-50/80 hover:bg-amber-100 hover:text-amber-950 border border-amber-200/80 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer'
      : 'text-xs font-semibold text-stone-700 bg-sky-50/80 hover:bg-sky-100 hover:text-sky-950 border border-sky-200/80 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer';

    if (isExternal) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          title={text}
          onClick={() => {
            if (isMobile) setMobileMenuOpen(false);
          }}
        >
          {icon}
          <span>{text}</span>
        </a>
      );
    }

    return (
      <Link
        to={url}
        className={baseClasses}
        title={text}
        onClick={() => {
          if (isMobile) setMobileMenuOpen(false);
        }}
      >
        {icon}
        <span>{text}</span>
      </Link>
    );
  };

  return (
    <header className="fixed top-0 sm:top-3 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Floating Capsule Container */}
        <nav className="bg-white/95 backdrop-blur-md rounded-b-[2rem] sm:rounded-full px-4 sm:px-6 py-3 sm:py-3.5 shadow-xl shadow-stone-300/30 border border-stone-200/70 flex items-center justify-between transition-all">
          
          {/* Official Brand Logo */}
          <Link to="/" className="flex items-center group shrink-0 py-0.5" aria-label="Baunduilla Home">
            <img
              src="/assets/aistudio/20261023_085549_c2e8a7b5.png"
              alt="Baunduilla"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Center Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-2.5 xl:space-x-4">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs xl:text-sm font-semibold transition-colors px-1 py-1 rounded-lg ${
                    isActive
                      ? 'text-[#17324D] font-extrabold border-b-2 border-[#E99B54]'
                      : 'text-stone-600 hover:text-[#17324D]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls: Get A Hotel, Hire A Cab, and WhatsApp */}
          <div className="hidden sm:flex items-center space-x-2">
            {hotelButtonEnabled &&
              renderMenuButton(
                hotelText,
                hotelUrl,
                <Hotel className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
                'hotel'
              )}

            {cabButtonEnabled &&
              renderMenuButton(
                cabText,
                cabUrl,
                <Car className="w-3.5 h-3.5 text-sky-600 shrink-0" />,
                'cab'
              )}

            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button with Animated Rotation */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-stone-700 hover:bg-stone-100 focus:outline-none transition-transform duration-300"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className={`transition-transform duration-300 ease-out ${mobileMenuOpen ? 'rotate-90 scale-105' : 'rotate-0'}`}>
                {mobileMenuOpen ? <X className="w-6 h-6 text-[#173F35]" /> : <Menu className="w-6 h-6 text-[#173F35]" />}
              </div>
            </button>
          </div>
        </nav>

        {/* ========================================================= */}
        {/* SHUTTER ANIMATION: Rolls down & unrolls smoothly from top */}
        {/* ========================================================= */}
        <div
          className={`lg:hidden grid transition-[grid-template-rows,opacity,transform] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
            mobileMenuOpen
              ? 'grid-rows-[1fr] opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
              : 'grid-rows-[0fr] opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden">
            {/* Shutter Card matching previous favorite design */}
            <div className="mt-2 bg-white/98 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-stone-200/80 space-y-4 relative">
              
              {/* Shutter Handle / Top Slat Accent */}
              <div className="w-12 h-1 bg-stone-300/80 rounded-full mx-auto -mt-1 mb-1 transition-all" />

              <div className="flex items-center justify-between pb-3 border-b border-stone-100 px-2">
                <img
                  src="/assets/aistudio/20261023_085549_c2e8a7b5.png"
                  alt="Baunduilla"
                  className="h-7 w-auto object-contain"
                />
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#E99B54] bg-[#E99B54]/10 px-2.5 py-0.5 rounded-full">
                  Travel Desk
                </span>
              </div>

              {/* Shutter Slats / Navigation Links with Staggered Cascading Animation */}
              <div className="space-y-1">
                {navLinks.map((link, idx) => {
                  const isActive =
                    link.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(link.path);
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`block px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                        mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                      } ${
                        isActive
                          ? 'bg-[#17324D] text-white font-bold shadow-xs'
                          : 'text-stone-700 hover:bg-stone-50 hover:translate-x-1'
                      }`}
                      style={{
                        transitionDelay: mobileMenuOpen ? `${idx * 30}ms` : '0ms'
                      }}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Shutter Bottom Action Controls */}
              <div
                className={`pt-3 border-t border-stone-100 space-y-2.5 transition-all duration-300 ${
                  mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                }`}
                style={{
                  transitionDelay: mobileMenuOpen ? '220ms' : '0ms'
                }}
              >
                {/* Main Menu Action Buttons (Hotel & Cab) */}
                {(hotelButtonEnabled || cabButtonEnabled) && (
                  <div className="grid grid-cols-2 gap-2">
                    {hotelButtonEnabled &&
                      renderMenuButton(
                        hotelText,
                        hotelUrl,
                        <Hotel className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
                        'hotel',
                        true
                      )}

                    {cabButtonEnabled &&
                      renderMenuButton(
                        cabText,
                        cabUrl,
                        <Car className="w-3.5 h-3.5 text-sky-600 shrink-0" />,
                        'cab',
                        true
                      )}
                  </div>
                )}

                <Link
                  to="/plan-my-trip"
                  className="w-full flex items-center justify-center gap-2 bg-[#E99B54] hover:bg-[#D88940] text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 text-center"
                >
                  <Compass className="w-4 h-4 stroke-[2]" />
                  <span>Plan Trip</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </Link>

                <a
                  href={generalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold py-2.5 rounded-xl shadow transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                {/* Social media links in mobile drawer */}
                {(settings.facebookUrl || settings.instagramUrl || settings.youtubeUrl) && (
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <span className="text-[11px] text-stone-400 font-medium">Follow us:</span>
                    <div className="flex items-center gap-2">
                      {settings.facebookUrl && (
                        <a
                          href={settings.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-[#1877F2] text-stone-600 hover:text-white flex items-center justify-center transition-colors"
                          title="Facebook"
                          aria-label="Facebook"
                        >
                          <Facebook className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {settings.instagramUrl && (
                        <a
                          href={settings.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-[#E4405F] text-stone-600 hover:text-white flex items-center justify-center transition-colors"
                          title="Instagram"
                          aria-label="Instagram"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {settings.youtubeUrl && (
                        <a
                          href={settings.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-[#FF0000] text-stone-600 hover:text-white flex items-center justify-center transition-colors"
                          title="YouTube"
                          aria-label="YouTube"
                        >
                          <Youtube className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
