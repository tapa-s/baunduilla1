import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, Send, AlertCircle } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { generateWhatsAppLink, createPackageWhatsAppMessage } from '../utils/whatsapp';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
  defaultPackageTitle?: string;
  defaultPackageId?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  defaultDestination = '',
  defaultPackageTitle = '',
  defaultPackageId = '',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [tripType, setTripType] = useState<'Group' | 'Private'>('Group');
  const [requirements, setRequirements] = useState('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const settings = StorageService.getSiteSettings();

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Please enter your full name (minimum 2 characters).';
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number with country code.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!travelDate) {
      errs.travelDate = 'Please select an approximate preferred travel date.';
    }
    if (adults < 1) {
      errs.adults = 'At least 1 adult traveller is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const created = StorageService.createInquiry({
        inquiryType: defaultPackageId ? 'package' : 'destination',
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        destination: defaultDestination || 'North Bengal / Sikkim',
        packageId: defaultPackageId || undefined,
        packageTitle: defaultPackageTitle || undefined,
        travelDate,
        travellers: { adults, children },
        tripType,
        requirements: requirements.trim(),
        source: 'Website Inquiry Modal'
      });

      setSubmittedInquiryId(created.id);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setErrors({ form: 'An error occurred while saving your inquiry. You can also contact us directly via WhatsApp.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppDirectUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createPackageWhatsAppMessage(defaultPackageTitle || defaultDestination || 'Himalayan Tour', travelDate, adults + children)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#17324D] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#E99B54] font-bold">
              Baunduilla Booking Inquiry
            </span>
            <h3 className="text-lg font-serif font-bold text-white mt-0.5">
              {defaultPackageTitle ? defaultPackageTitle : `Plan Trip to ${defaultDestination || 'The Himalayas'}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submittedInquiryId ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-serif font-bold text-[#173F35]">
                  Inquiry Received!
                </h4>
                <p className="text-xs text-stone-500 font-mono mt-1">
                  Reference ID: <span className="text-[#17324D] font-bold">{submittedInquiryId}</span>
                </p>
                <p className="text-sm text-stone-600 mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Our travel team will review available permits, seasonal updates, and verified tariffs and contact you on <strong>{phone}</strong> shortly.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-3">
                <p className="text-xs text-stone-500 font-medium">
                  Want an immediate response? Forward your details directly to our WhatsApp coordinator:
                </p>
                <a
                  href={whatsAppDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp with Inquiry</span>
                </a>

                <button
                  onClick={onClose}
                  className="text-stone-500 hover:text-stone-800 text-xs font-semibold py-1"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sourav Mukherjee"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-stone-300 focus:border-[#173F35] focus:ring-[#173F35]/20'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Mobile / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-stone-300 focus:border-[#173F35] focus:ring-[#173F35]/20'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-stone-300 focus:border-[#173F35] focus:ring-[#173F35]/20'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Preferred Date & Group / Private Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Approx. Travel Date *
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.travelDate
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-stone-300 focus:border-[#173F35] focus:ring-[#173F35]/20'
                    }`}
                  />
                  {errors.travelDate && <p className="text-red-500 text-xs mt-1">{errors.travelDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Trip Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTripType('Group')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        tripType === 'Group'
                          ? 'bg-[#173F35] text-white border-[#173F35]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Join Group
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('Private')}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        tripType === 'Private'
                          ? 'bg-[#173F35] text-white border-[#173F35]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Private Tour
                    </button>
                  </div>
                </div>
              </div>

              {/* Travellers count */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Adults (12+ yrs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Children (below 12)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Special Requirements or Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="e.g. Vegetarian food preference, senior citizen travelling, pickup point needed from Bagdogra..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                />
              </div>

              {/* Notice */}
              <p className="text-[11px] text-stone-500 leading-tight">
                * Note: Submitting this inquiry does not constitute a confirmed booking. We verify permits and hotel availability before requesting payment.
              </p>

              {/* Action buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#173F35] hover:bg-[#1F4F43] text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Inquiry to Baunduilla'}</span>
                </button>

                <a
                  href={whatsAppDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white p-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center"
                  title="Chat directly on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
