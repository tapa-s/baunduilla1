import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Wallet,
  ShieldAlert,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  CalendarCheck,
  Share2
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { PackageCard } from '../components/PackageCard';
import { InquiryModal } from '../components/InquiryModal';
import { generateWhatsAppLink, createDestinationWhatsAppMessage } from '../utils/whatsapp';
import { useSEO } from '../hooks/useSEO';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const destination = StorageService.getDestinationBySlug(slug || '');
  const allPackages = StorageService.getPackages().filter(p => p.published);
  const settings = StorageService.getSiteSettings();

  useSEO({
    title: destination ? `${destination.name} Travel Guide | Baunduilla` : 'Destination | Baunduilla',
    description: destination ? destination.shortDescription : 'Explore Eastern Himalayan and Dooars destinations.',
    image: destination?.heroImage,
    type: 'website',
  });

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!destination) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#173F35]">
          Destination Not Found
        </h1>
        <p className="text-stone-600 text-sm">
          The requested destination could not be located. It may have been relocated or updated by our travel desk.
        </p>
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 bg-[#173F35] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow"
        >
          <span>Return to All Destinations</span>
        </Link>
      </div>
    );
  }

  // Related tour packages for this destination
  const relatedPackages = allPackages.filter(
    pkg => pkg.destinationId === destination.id || pkg.destinationName.toLowerCase().includes(destination.name.toLowerCase())
  );

  const destinationWhatsAppUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createDestinationWhatsAppMessage(destination.name)
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${destination.name} Travel Guide | Baunduilla`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative min-h-[55vh] sm:min-h-[65vh] flex items-end text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17324D] via-[#17324D]/50 to-black/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#E99B54] mb-3">
            <Link to="/destinations" className="hover:underline">Destinations</Link>
            <span>/</span>
            <span>{destination.region}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white mb-3">
                {destination.name}
              </h1>
              <p className="text-white/90 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
                {destination.shortDescription}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="bg-[#E99B54] hover:bg-[#D88940] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Plan a Trip Here
              </button>
              <button
                onClick={handleShare}
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl text-white backdrop-blur-md transition-colors cursor-pointer"
                title="Share this destination"
                aria-label="Share this destination"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          {copiedLink && (
            <span className="text-xs text-emerald-300 font-semibold mt-2 inline-block">
              Link copied to clipboard!
            </span>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Details, Highlights, FAQs */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Quick Fact Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#E99B54] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                    Best Time
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-800">
                    {destination.bestTimeToVisit}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#E99B54] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                    Ideal Duration
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-800">
                    {destination.suggestedDuration}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 col-span-2 sm:col-span-1">
                <Wallet className="w-5 h-5 text-[#E99B54] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                    Estimated Budget
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-800">
                    {destination.approximateBudget}
                  </span>
                </div>
              </div>
            </div>

            {/* Time-sensitive Notice / Permit advisory */}
            {destination.permitNotice && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 flex items-start gap-3.5 text-stone-800">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong className="text-amber-900 block font-bold mb-0.5">
                    Important Travel & Permit Notice
                  </strong>
                  <span>{destination.permitNotice}</span>
                  <p className="mt-1.5 text-amber-900/80 italic">
                    Note: Rules, road clearances, and weather conditions can change seasonally. Always verify current status with our coordinators prior to booking tickets.
                  </p>
                </div>
              </div>
            )}

            {/* Overview */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173F35]">
                Overview & Traveler Insight
              </h2>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {destination.fullOverview}
              </p>
            </div>

            {/* Popular Attractions */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173F35]">
                  Key Attractions & Landmarks
                </h2>
                <span className="text-xs text-stone-500 font-medium">
                  {destination.attractions.length} Featured Spots
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {destination.attractions.map((att, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm flex flex-col"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                      <img
                        src={att.image}
                        alt={att.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-serif font-bold text-base text-[#173F35] mb-1">
                        {att.name}
                      </h3>
                      <p className="text-stone-600 text-xs leading-relaxed">
                        {att.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities & Experiences */}
            <div className="bg-[#173F35]/5 p-6 rounded-2xl border border-[#173F35]/15 space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#173F35]">
                Top Activities & Experiences
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {destination.activities.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-800">
                    <CheckCircle2 className="w-4 h-4 text-[#E99B54] shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequently Asked Questions */}
            {destination.faqs && destination.faqs.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#173F35]">
                  Destination FAQs
                </h2>
                <div className="space-y-3">
                  {destination.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl border border-stone-200 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        className="w-full p-4 text-left font-semibold text-sm text-[#173F35] flex items-center justify-between hover:bg-stone-50"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-stone-500 transform transition-transform ${
                            openFaqIndex === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openFaqIndex === index && (
                        <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Quick Action Card & Related Packages */}
          <div className="space-y-8">
            <div className="sticky top-24 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-md space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E99B54] block mb-1">
                  Custom Travel Planning
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#173F35]">
                  Plan Your {destination.name} Trip
                </h3>
                <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                  Connect directly with our local coordinator in Siliguri to customize permits, homestays, and SUV transport.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full bg-[#173F35] hover:bg-[#1F4F43] text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4 text-[#E99B54]" />
                  <span>Request Custom Itinerary</span>
                </button>

                <a
                  href={destinationWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask on WhatsApp</span>
                </a>

                <Link
                  to="/plan-my-trip"
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 py-2.5 px-4 rounded-xl text-xs font-semibold text-center block transition-all"
                >
                  Open Multi-Step Trip Planner
                </Link>
              </div>

              <div className="text-[11px] text-stone-500 pt-3 border-t border-stone-100 space-y-1">
                <p>✓ Transparent quotes in INR</p>
                <p>✓ Experienced Himalayan mountain drivers</p>
                <p>✓ Inner Line & border permit assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tour Packages */}
        {relatedPackages.length > 0 && (
          <div className="pt-12 border-t border-stone-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E99B54]">
                  Tour Packages
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173F35] mt-1">
                  Featured Packages in {destination.name}
                </h2>
              </div>
              <Link
                to="/packages"
                className="text-xs sm:text-sm font-bold text-[#173F35] hover:text-[#E99B54] flex items-center gap-1"
              >
                <span>All Packages</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPackages.map((pkg) => (
                <PackageCard key={pkg.id} tourPackage={pkg} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        defaultDestination={destination.name}
      />
    </div>
  );
};
