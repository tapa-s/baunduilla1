import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Send,
  MapPin,
  Users,
  Compass,
  AlertCircle
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { generateWhatsAppLink, createCustomPlanWhatsAppMessage } from '../utils/whatsapp';

export const PlanMyTripPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const settings = StorageService.getSiteSettings();

  // Step 1: Traveller details
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Step 2: Trip preferences
  const [destination, setDestination] = useState('North Bengal & Dooars');
  const [startingCity, setStartingCity] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Step 3: Budget & Style
  const [budgetPerPerson, setBudgetPerPerson] = useState('₹18,000 - ₹25,000');
  const [tripType, setTripType] = useState<'Group' | 'Private'>('Group');
  const [travelStyle, setTravelStyle] = useState('High Altitude Road Trip');
  const [accommodationPreference, setAccommodationPreference] = useState('Comfortable Hotels & Verified Homestays');
  const [requirements, setRequirements] = useState('');

  // Form states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      errs.customerName = 'Please enter your full name.';
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile / WhatsApp number.';
    }
    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Please provide a valid email address.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: { [key: string]: string } = {};
    if (!destination) {
      errs.destination = 'Please choose a destination.';
    }
    if (!travelDate) {
      errs.travelDate = 'Please specify your travel dates or approximate month.';
    }
    if (adults < 1) {
      errs.adults = 'At least 1 adult traveller is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      setCurrentStep(1);
      return;
    }

    const created = StorageService.createInquiry({
      inquiryType: 'custom_plan',
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      destination,
      startingCity: startingCity.trim(),
      travelDate,
      travellers: { adults, children },
      budgetPerPerson,
      travelStyle,
      tripType,
      accommodationPreference,
      requirements: requirements.trim(),
      source: 'Plan My Trip 4-Step Wizard'
    });

    setSubmittedInquiryId(created.id);
  };

  const whatsAppExportUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createCustomPlanWhatsAppMessage({
      customerName,
      destination,
      startingCity,
      travelDate,
      adults,
      children,
      budgetPerPerson,
      travelStyle,
      requirements
    })
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#E99B54]/10 text-[#E99B54] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Tailor-Made Himalayan Journeys</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
          Plan My Trip
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Tell us about your dream destination, travel group, and budget. Our travel coordinators in Siliguri will design a custom day-by-day plan with transparent costs.
        </p>
      </div>

      {/* Wizard Progress Bar */}
      {!submittedInquiryId && (
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200/80 shadow-sm">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
            <div className={`flex flex-col items-center gap-1 ${currentStep >= 1 ? 'text-[#173F35]' : 'text-stone-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 1 ? 'bg-[#173F35] text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                1
              </div>
              <span className="hidden sm:inline">Traveller Info</span>
            </div>

            <div className={`flex flex-col items-center gap-1 ${currentStep >= 2 ? 'text-[#173F35]' : 'text-stone-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 2 ? 'bg-[#173F35] text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                2
              </div>
              <span className="hidden sm:inline">Destination & Dates</span>
            </div>

            <div className={`flex flex-col items-center gap-1 ${currentStep >= 3 ? 'text-[#173F35]' : 'text-stone-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 3 ? 'bg-[#173F35] text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                3
              </div>
              <span className="hidden sm:inline">Budget & Style</span>
            </div>

            <div className={`flex flex-col items-center gap-1 ${currentStep >= 4 ? 'text-[#173F35]' : 'text-stone-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 4 ? 'bg-[#173F35] text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                4
              </div>
              <span className="hidden sm:inline">Review & Submit</span>
            </div>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-md">
        {submittedInquiryId ? (
          /* Submission Success State */
          <div className="text-center py-8 space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173F35]">
                Custom Trip Request Received!
              </h2>
              <p className="text-xs font-mono text-stone-500 mt-1">
                Booking Reference ID: <strong className="text-[#17324D]">{submittedInquiryId}</strong>
              </p>
              <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                Thank you, <strong>{customerName}</strong>! Our Himalayan expedition coordinator will review your preferences for <strong>{destination}</strong> and get in touch with you at <strong>{phone}</strong> with a detailed itinerary and quote.
              </p>
            </div>

            {/* Direct WhatsApp continuation */}
            <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-5 space-y-3">
              <p className="text-xs text-stone-700 font-medium">
                Want immediate assistance or faster quotes? Forward your custom plan to our WhatsApp desk with one click:
              </p>
              <a
                href={whatsAppExportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Custom Plan via WhatsApp</span>
              </a>
            </div>

            <div className="pt-2">
              <Link
                to="/"
                className="text-xs font-bold text-stone-500 hover:text-stone-800"
              >
                ← Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            
            {/* ======================================================= */}
            {/* STEP 1: TRAVELLER DETAILS                               */}
            {/* ======================================================= */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="font-serif text-xl font-bold text-[#173F35]">
                    Step 1: Your Contact Information
                  </h3>
                  <p className="text-xs text-stone-500">
                    We will send your finalized day-by-day plan and quote here.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Priyanshu Paul"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                  />
                  {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STEP 2: TRIP PREFERENCES                                */}
            {/* ======================================================= */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="font-serif text-xl font-bold text-[#173F35]">
                    Step 2: Destination & Travel Dates
                  </h3>
                  <p className="text-xs text-stone-500">
                    Where would you like to travel, and when?
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Preferred Destination / Region *
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  >
                    <option value="North Bengal & Dooars">North Bengal & Dooars (Jaldapara, Buxa, Lataguri)</option>
                    <option value="Meghalaya Living Roots">Meghalaya (Shillong, Cherrapunji, Dawki, Root Bridges)</option>
                    <option value="Assam & Kaziranga">Assam & Kaziranga (Rhino Safari, Tea Gardens, Brahmaputra)</option>
                    <option value="Shimla & Himachal Hills">Shimla & Himachal (Shimla Ridge, Kufri, Narkanda)</option>
                    <option value="Multi-Region Combined Tour">Multi-Region Combined Custom Tour</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Starting City (Optional)
                    </label>
                    <input
                      type="text"
                      value={startingCity}
                      onChange={(e) => setStartingCity(e.target.value)}
                      placeholder="e.g. Kolkata, Siliguri, Delhi, Bangalore"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Travel Dates or Month *
                    </label>
                    <input
                      type="text"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      placeholder="e.g. Mid November 2026 or 15-22 Dec"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                    />
                    {errors.travelDate && <p className="text-xs text-red-500 mt-1">{errors.travelDate}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Adults (12+ yrs) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                    />
                    {errors.adults && <p className="text-xs text-red-500 mt-1">{errors.adults}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Children (below 12)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STEP 3: BUDGET AND STYLE                                */}
            {/* ======================================================= */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="font-serif text-xl font-bold text-[#173F35]">
                    Step 3: Budget & Travel Style
                  </h3>
                  <p className="text-xs text-stone-500">
                    Help us customize the vehicles, hotels, and trek pace.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Approximate Budget (Per Person in INR)
                    </label>
                    <select
                      value={budgetPerPerson}
                      onChange={(e) => setBudgetPerPerson(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                    >
                      <option value="₹12,000 - ₹18,000">₹12,000 - ₹18,000 (Budget / Homestay)</option>
                      <option value="₹18,000 - ₹25,000">₹18,000 - ₹25,000 (Standard Comfort)</option>
                      <option value="₹25,000 - ₹35,000">₹25,000 - ₹35,000 (Premium / Boutique)</option>
                      <option value="Flexible">Flexible / Advise Best Options</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Group or Private Tour?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTripType('Group')}
                        className={`py-3 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                          tripType === 'Group'
                            ? 'bg-[#173F35] text-white border-[#173F35]'
                            : 'bg-stone-50 text-stone-700 border-stone-300'
                        }`}
                      >
                        Join Small Group
                      </button>
                      <button
                        type="button"
                        onClick={() => setTripType('Private')}
                        className={`py-3 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                          tripType === 'Private'
                            ? 'bg-[#173F35] text-white border-[#173F35]'
                            : 'bg-stone-50 text-stone-700 border-stone-300'
                        }`}
                      >
                        Private Custom Trip
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Travel Experience Style
                  </label>
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                  >
                    <option value="High Altitude Road Trip">High Altitude Road Trip (SUVs / Himalayan Passes)</option>
                    <option value="Himalayan Trekking">Himalayan Trekking & Camping</option>
                    <option value="Wildlife Safari & Nature">Wildlife Safari & Rainforest Retreat (Dooars)</option>
                    <option value="Relaxed Sightseeing & Culture">Relaxed Sightseeing, Monasteries & Cafes</option>
                    <option value="Custom Blend">Custom Blend of Road Trip & Light Walks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Special Requirements or Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="e.g. Vegetarian food, senior citizens travelling, airport pickup from Bagdogra, photography emphasis..."
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STEP 4: REVIEW AND SUBMIT                               */}
            {/* ======================================================= */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="font-serif text-xl font-bold text-[#173F35]">
                    Step 4: Review Your Trip Summary
                  </h3>
                  <p className="text-xs text-stone-500">
                    Please verify your details before submitting to our travel team.
                  </p>
                </div>

                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-stone-400 block uppercase font-bold text-[10px]">Lead Traveller:</span>
                      <strong className="text-[#173F35] text-base">{customerName}</strong>
                      <p className="text-stone-600 text-xs">{phone} • {email}</p>
                    </div>

                    <div>
                      <span className="text-stone-400 block uppercase font-bold text-[10px]">Destination:</span>
                      <strong className="text-[#17324D] text-base">{destination}</strong>
                      {startingCity && <p className="text-stone-600 text-xs">From: {startingCity}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-200">
                    <div>
                      <span className="text-stone-400 block uppercase font-bold text-[10px]">Dates:</span>
                      <span className="font-semibold text-stone-800">{travelDate}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block uppercase font-bold text-[10px]">Travellers:</span>
                      <span className="font-semibold text-stone-800">{adults} Adults{children ? `, ${children} Children` : ''}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block uppercase font-bold text-[10px]">Trip Type:</span>
                      <span className="font-semibold text-stone-800">{tripType}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block uppercase font-bold text-[10px]">Budget / Person:</span>
                      <span className="font-semibold text-stone-800">{budgetPerPerson}</span>
                    </div>
                  </div>

                  {requirements && (
                    <div className="pt-3 border-t border-stone-200">
                      <span className="text-stone-400 block uppercase font-bold text-[10px]">Special Notes:</span>
                      <p className="text-stone-700 italic">{requirements}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  ✓ By clicking submit, your inquiry will be recorded in our travel desk system. You will also be given the option to message our team on WhatsApp immediately for instant replies.
                </div>
              </div>
            )}

            {/* Navigation & Submission Buttons */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : <div></div>}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 bg-[#173F35] hover:bg-[#1F4F43] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#E99B54] hover:bg-[#D88940] text-white px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Custom Trip Plan</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
