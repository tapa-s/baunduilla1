import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Share2,
  Backpack,
  Utensils,
  Car,
  Home,
  AlertTriangle
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { ImageLightbox } from '../components/ImageLightbox';
import { InquiryModal } from '../components/InquiryModal';
import { generateWhatsAppLink, createPackageWhatsAppMessage } from '../utils/whatsapp';
import { useSEO } from '../hooks/useSEO';

export const PackageDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const tourPackage = StorageService.getPackageBySlug(slug || '');
  const settings = StorageService.getSiteSettings();

  useSEO({
    title: tourPackage ? `${tourPackage.title} | Baunduilla Tours` : 'Tour Package | Baunduilla',
    description: tourPackage ? tourPackage.shortDescription : 'Verified Himalayan tours and Dooars safari packages.',
    image: tourPackage?.images[0],
    type: 'website',
  });

  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'details' | 'policy'>('itinerary');
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>({ 1: true, 2: true });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Embedded quick inquiry form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTravellers, setFormTravellers] = useState(2);
  const [formRequirements, setFormRequirements] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (!tourPackage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#173F35]">
          Package Not Found
        </h1>
        <p className="text-stone-600 text-sm">
          The requested tour package could not be found or has been updated by our travel coordinators.
        </p>
        <Link
          to="/packages"
          className="inline-flex items-center gap-2 bg-[#173F35] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow"
        >
          <span>Return to All Packages</span>
        </Link>
      </div>
    );
  }

  const toggleDay = (day: number) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const expandAllDays = () => {
    const all: { [key: number]: boolean } = {};
    tourPackage.itinerary.forEach(d => { all[d.day] = true; });
    setExpandedDays(all);
  };

  const collapseAllDays = () => {
    setExpandedDays({});
  };

  const whatsAppPackageUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createPackageWhatsAppMessage(tourPackage.title, formDate || undefined, formTravellers)
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tourPackage.title} | Baunduilla`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSideFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};
    if (!formName.trim()) errs.name = 'Please enter your name.';
    const cleanPhone = formPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) errs.phone = 'Please provide a valid 10-digit mobile number.';
    if (!formEmail.trim() || !formEmail.includes('@')) errs.email = 'Please provide a valid email.';
    if (!formDate) errs.date = 'Select approximate date.';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    StorageService.createInquiry({
      inquiryType: 'package',
      customerName: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim(),
      destination: tourPackage.destinationName,
      packageId: tourPackage.id,
      packageTitle: tourPackage.title,
      travelDate: formDate,
      travellers: { adults: formTravellers, children: 0 },
      tripType: tourPackage.tripType === 'Both' ? 'Group' : tourPackage.tripType,
      requirements: formRequirements.trim(),
      source: 'Package Details Sidebar Form'
    });

    setFormSubmitted(true);
    setFormErrors({});
  };

  return (
    <div className="space-y-10 sm:space-y-14 pb-20">
      {/* Top Breadcrumb & Share Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between text-xs text-stone-500 pb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-[#173F35]">Home</Link>
            <span>/</span>
            <Link to="/packages" className="hover:text-[#173F35]">Tour Packages</Link>
            <span>/</span>
            <span className="text-[#173F35] font-semibold truncate max-w-xs">{tourPackage.title}</span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1 text-stone-600 hover:text-[#173F35] font-semibold"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Trip</span>
          </button>
        </div>
        {copiedLink && (
          <p className="text-xs text-emerald-600 font-semibold text-right">Link copied to clipboard!</p>
        )}
      </div>

      {/* Package Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#173F35] text-white text-xs font-semibold px-3 py-1 rounded-full">
              {tourPackage.travelStyle}
            </span>
            <span className="bg-[#17324D] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E99B54]" />
              <span>{tourPackage.destinationName}</span>
            </span>
            {tourPackage.difficulty && (
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                Difficulty: {tourPackage.difficulty}
              </span>
            )}
            <span className="bg-stone-100 text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {tourPackage.tripType} Tour
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
            {tourPackage.title}
          </h1>

          <p className="text-stone-600 text-sm sm:text-base max-w-3xl leading-relaxed">
            {tourPackage.shortDescription}
          </p>
        </div>

        {/* Hero Gallery Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 rounded-3xl overflow-hidden shadow-lg border border-stone-200">
          <div
            onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
            className="md:col-span-2 relative aspect-[16/10] cursor-pointer group overflow-hidden bg-stone-100"
          >
            <img
              src={tourPackage.images[0]}
              alt={tourPackage.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
              Click to view all photos
            </div>
          </div>

          <div className="hidden md:grid grid-rows-2 gap-3">
            {tourPackage.images.slice(1, 3).map((img, i) => (
              <div
                key={i}
                onClick={() => { setLightboxIndex(i + 1); setLightboxOpen(true); }}
                className="relative h-full cursor-pointer group overflow-hidden bg-stone-100"
              >
                <img
                  src={img}
                  alt={`${tourPackage.title} gallery ${i + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Itinerary & Inclusions vs Booking Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main 2-column info */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Highlights Box */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#173F35] flex items-center gap-2">
                <span>Key Highlights of This Journey</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tourPackage.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-[#E99B54] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Departure Dates Banner */}
            {tourPackage.departureDates && tourPackage.departureDates.length > 0 && (
              <div className="bg-[#17324D]/5 border border-[#17324D]/15 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17324D]">
                  <Calendar className="w-4 h-4 text-[#E99B54]" />
                  <span>Upcoming Small Group Departure Batches</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {tourPackage.departureDates.map((date, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-[#17324D] border border-stone-200 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
                    >
                      {date}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 pt-1">
                  * Custom private departures available on any requested date. Contact us for private group rates.
                </p>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`py-2.5 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'itinerary'
                    ? 'border-[#173F35] text-[#173F35]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Day-by-Day Itinerary
              </button>
              <button
                onClick={() => setActiveTab('inclusions')}
                className={`py-2.5 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'inclusions'
                    ? 'border-[#173F35] text-[#173F35]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Inclusions & Exclusions
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`py-2.5 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'details'
                    ? 'border-[#173F35] text-[#173F35]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Stay, Transport & Meals
              </button>
              <button
                onClick={() => setActiveTab('policy')}
                className={`py-2.5 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'policy'
                    ? 'border-[#173F35] text-[#173F35]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Cancellation & Packing
              </button>
            </div>

            {/* Tab 1: Day-by-Day Itinerary */}
            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-bold text-[#173F35]">
                    Detailed Day-by-Day Schedule
                  </h2>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={expandAllDays}
                      className="text-[#E99B54] hover:underline font-semibold"
                    >
                      Expand All
                    </button>
                    <span>•</span>
                    <button
                      onClick={collapseAllDays}
                      className="text-stone-500 hover:underline font-semibold"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {tourPackage.itinerary.map((day) => {
                    const isExpanded = !!expandedDays[day.day];
                    return (
                      <div
                        key={day.day}
                        className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition-all"
                      >
                        <button
                          onClick={() => toggleDay(day.day)}
                          className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 hover:bg-stone-50 transition-colors"
                        >
                          <div className="flex items-start gap-3.5">
                            <span className="bg-[#173F35] text-white text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 mt-0.5">
                              Day {day.day}
                            </span>
                            <div>
                              <h3 className="font-serif font-bold text-base text-[#173F35]">
                                {day.title}
                              </h3>
                              {(day.stay || day.meals) && (
                                <p className="text-[11px] text-stone-500 mt-0.5">
                                  {day.stay && `Stay: ${day.stay}`} {day.stay && day.meals && '•'} {day.meals && `Meals: ${day.meals}`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-stone-400 p-1">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-5 pb-5 text-stone-700 text-xs sm:text-sm leading-relaxed border-t border-stone-100 pt-3">
                            <p>{day.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Inclusions & Exclusions */}
            {activeTab === 'inclusions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200/80 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>What's Included</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {tourPackage.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-emerald-950">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50/70 p-6 rounded-3xl border border-red-200/80 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-red-900 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>What's Not Included</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {tourPackage.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-red-950">
                        <span className="text-red-500 font-bold">✗</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Stay, Transport & Meals */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#173F35] flex items-center gap-2">
                    <Home className="w-5 h-5 text-[#E99B54]" />
                    <span>Accommodation Information</span>
                  </h3>
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                    {tourPackage.accommodationInfo}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#173F35] flex items-center gap-2">
                    <Car className="w-5 h-5 text-[#E99B54]" />
                    <span>Transportation Details</span>
                  </h3>
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                    {tourPackage.transportationInfo}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#173F35] flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-[#E99B54]" />
                    <span>Meals & Dining</span>
                  </h3>
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                    {tourPackage.mealsInfo}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 4: Cancellation Policy & Things to Carry */}
            {activeTab === 'policy' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#173F35] flex items-center gap-2">
                    <Backpack className="w-5 h-5 text-[#E99B54]" />
                    <span>Things To Carry Checklist</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {tourPackage.thingsToCarry.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E99B54]"></span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200/80 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span>Standard Cancellation Policy</span>
                  </h3>
                  <ul className="text-xs text-amber-950 space-y-1.5 leading-relaxed">
                    <li>• <strong>30+ Days before start:</strong> 90% refund (10% standard processing fee deducted).</li>
                    <li>• <strong>15 to 29 Days before start:</strong> 50% refund.</li>
                    <li>• <strong>Within 14 Days:</strong> Non-refundable due to mountain permits and advance vehicle blockages.</li>
                  </ul>
                  <Link to="/cancellation-policy" className="text-xs font-bold text-[#173F35] underline block mt-2">
                    Read complete Cancellation & Refund Policy
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Booking Inquiry Card */}
          <div>
            <div className="sticky top-24 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xl space-y-5">
              
              {/* Tariff Headline */}
              <div className="pb-4 border-b border-stone-100">
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">
                  Starting Tariff
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl font-bold text-[#17324D]">
                    ₹{tourPackage.pricePerPerson.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-500">/ person</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-2">
                  <Clock className="w-3.5 h-3.5 text-[#E99B54]" />
                  <span>{tourPackage.durationDays} Days / {tourPackage.durationNights} Nights</span>
                  {tourPackage.maxGroupSize && (
                    <>
                      <span>•</span>
                      <Users className="w-3.5 h-3.5 text-[#E99B54]" />
                      <span>Max {tourPackage.maxGroupSize} guests</span>
                    </>
                  )}
                </div>
              </div>

              {/* Direct Booking Form */}
              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif font-bold text-[#173F35] text-lg">Inquiry Sent!</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    We have logged your request for <strong>{tourPackage.title}</strong>. Our travel team will contact you on <strong>{formPhone}</strong> to verify hotel & permit clearance.
                  </p>
                  <a
                    href={whatsAppPackageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Follow Up on WhatsApp</span>
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSideFormSubmit} className="space-y-3">
                  <h4 className="font-serif font-bold text-base text-[#173F35]">
                    Inquire About This Trip
                  </h4>

                  <div>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Your Full Name *"
                      className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                    />
                    {formErrors.name && <span className="text-[10px] text-red-500">{formErrors.name}</span>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="Mobile / WhatsApp Number *"
                      className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                    />
                    {formErrors.phone && <span className="text-[10px] text-red-500">{formErrors.phone}</span>}
                  </div>

                  <div>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="Email Address *"
                      className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                    />
                    {formErrors.email && <span className="text-[10px] text-red-500">{formErrors.email}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                      />
                      {formErrors.date && <span className="text-[10px] text-red-500">{formErrors.date}</span>}
                    </div>
                    <div>
                      <select
                        value={formTravellers}
                        onChange={(e) => setFormTravellers(parseInt(e.target.value) || 2)}
                        className="w-full text-xs px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="4">3-4 Persons</option>
                        <option value="6">5+ Persons</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      value={formRequirements}
                      onChange={(e) => setFormRequirements(e.target.value)}
                      placeholder="Special notes or pickup requirements..."
                      className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#173F35] hover:bg-[#1F4F43] text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    Send Booking Inquiry
                  </button>
                </form>
              )}

              <div className="pt-2 border-t border-stone-100 space-y-2">
                <span className="text-[11px] text-stone-400 block text-center uppercase tracking-wider font-semibold">
                  Or Chat Immediately
                </span>
                <a
                  href={whatsAppPackageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>

              <div className="text-[10px] text-stone-400 text-center leading-normal">
                * No immediate payment is required. We check permit slots and confirm final tariffs first.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox for package images */}
      <ImageLightbox
        images={tourPackage.images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(i) => setLightboxIndex(i)}
        title={tourPackage.title}
      />

      {/* Modal fallback */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        defaultPackageId={tourPackage.id}
        defaultPackageTitle={tourPackage.title}
        defaultDestination={tourPackage.destinationName}
      />
    </div>
  );
};
