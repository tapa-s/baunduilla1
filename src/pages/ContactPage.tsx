import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { generateWhatsAppLink, createGeneralInquiryWhatsAppMessage } from '../utils/whatsapp';

export const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState(() => StorageService.getSiteSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(StorageService.getSiteSettings());
    };
    window.addEventListener('baunduilla_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('baunduilla_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Tour Package Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Please provide your name.';
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) errs.phone = 'Valid 10-digit mobile number required.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address required.';
    if (!message.trim() || message.trim().length < 10) errs.message = 'Please provide details (minimum 10 characters).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    StorageService.createInquiry({
      inquiryType: 'general',
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      destination: subject,
      requirements: message.trim(),
      source: 'Contact Us Page Form'
    });

    setSubmitted(true);
  };

  const whatsAppGeneralUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createGeneralInquiryWhatsAppMessage()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
          <Phone className="w-4 h-4" />
          <span>Get in Touch</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
          Contact Baunduilla Travel Desk
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
          Have queries about travel dates, road conditions in Sikkim, permits for North Bengal, or custom group bookings? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Contact Information & Channels */}
        <div className="space-y-6">
          <div className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#173F35]">
              Office & Support Hub
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold mb-0.5">Physical Address</strong>
                  <span className="leading-relaxed text-stone-600">{settings.address}</span>
                  <p className="text-[11px] text-[#E99B54] font-medium mt-1">
                    Gateway to Dooars, Sikkim, and Darjeeling Hills
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold mb-0.5">Phone Call Support</strong>
                  <a href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`} className="text-stone-800 hover:text-[#173F35] font-semibold">
                    {settings.contactPhone}
                  </a>
                  <p className="text-[11px] text-stone-400">Available 9:00 AM – 8:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold mb-0.5">Official Email</strong>
                  <a href={`mailto:${settings.contactEmail}`} className="text-stone-800 hover:text-[#173F35] font-semibold break-all">
                    {settings.contactEmail}
                  </a>
                  <p className="text-[11px] text-stone-400">Verified travel desk inbox</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold mb-0.5">WhatsApp Click-to-Chat</strong>
                  <span className="text-stone-600 block mb-1">+{settings.whatsappNumber}</span>
                  <a
                    href={whatsAppGeneralUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#25D366] font-bold hover:underline"
                  >
                    <span>Start Chat Now →</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Response Time Notice */}
            <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
              <Clock className="w-4 h-4 text-[#E99B54] shrink-0" />
              <span>Typical email & form response time: 2 to 4 hours</span>
            </div>
          </div>

          {/* Social Channels */}
          <div className="bg-[#17324D] text-white p-6 rounded-3xl space-y-4">
            <h3 className="font-serif font-bold text-base">Connect on Social</h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Follow our latest expedition dispatches, road photos, and weather updates across our social channels:
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-md">
            {submitted ? (
              <div className="py-12 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#173F35]">
                  Message Sent Successfully!
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your message has been received by our travel desk. We will review your query and reply to <strong>{email}</strong> or call you on <strong>{phone}</strong> promptly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="bg-[#173F35] text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#173F35]">
                    Send Us a Message
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    Fill out the form below and our team will get back to you with detailed travel guidance.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Debabrata Roy"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Subject / Query Type
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                    >
                      <option value="Tour Package Inquiry">Tour Package Inquiry</option>
                      <option value="Custom Itinerary Planning">Custom Itinerary Planning</option>
                      <option value="Sikkim / Dooars Permits">Sikkim / Dooars Permits</option>
                      <option value="Group / Corporate Outing">Group / Corporate Outing</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Your Message / Travel Requirements *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the dates you are considering, number of travelers, questions about road conditions, or any custom preferences..."
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#173F35] hover:bg-[#1F4F43] text-white px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>

                  <a
                    href={whatsAppGeneralUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Travel Desk</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
