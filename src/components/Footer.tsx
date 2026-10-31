import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Phone, Mail, MessageSquare, ShieldCheck, Heart, Lock, Facebook, Instagram, Youtube } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { generateWhatsAppLink, createGeneralInquiryWhatsAppMessage } from '../utils/whatsapp';

export const Footer: React.FC = () => {
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
  const currentYear = new Date().getFullYear();

  const generalWhatsAppUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createGeneralInquiryWhatsAppMessage()
  );

  return (
    <footer className="bg-[#173F35] text-[#F7F5EF] pt-16 pb-8 border-t border-[#235A4D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#235A4D]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center group" aria-label="Baunduilla Home">
              <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-white/20 transition-transform group-hover:scale-[1.02]">
                <img
                  src="/assets/aistudio/20261023_085549_c2e8a7b5.png"
                  alt="Baunduilla"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-[11px] tracking-widest uppercase text-[#E99B54] font-bold">
              Travel Together • Discover More
            </p>

            <p className="text-sm text-[#F7F5EF]/80 leading-relaxed max-w-sm">
              {settings.footerTagline || "Baunduilla is an Indian adventure travel agency and community. We organize authentic small-group tours, high-altitude road trips, and Himalayan treks across North Bengal, Sikkim, Himachal, Uttarakhand, and Northeast India."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                to="/plan-my-trip"
                className="inline-flex items-center gap-2 bg-[#E99B54] hover:bg-[#D88940] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition-all"
              >
                <span>Custom Trip Request</span>
              </Link>
            </div>

            {/* Social Media Links */}
            {(settings.facebookUrl || settings.instagramUrl || settings.youtubeUrl) && (
              <div className="pt-2 flex items-center gap-2.5">
                <span className="text-xs text-[#F7F5EF]/70 font-medium">Follow Baunduilla:</span>
                <div className="flex items-center gap-2">
                  {settings.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-[#235A4D] hover:bg-[#1877F2] text-white flex items-center justify-center transition-colors shadow-xs"
                      title="Follow Baunduilla on Facebook"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {settings.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-[#235A4D] hover:bg-[#E4405F] text-white flex items-center justify-center transition-colors shadow-xs"
                      title="Follow Baunduilla on Instagram"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {settings.youtubeUrl && (
                    <a
                      href={settings.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-[#235A4D] hover:bg-[#FF0000] text-white flex items-center justify-center transition-colors shadow-xs"
                      title="Subscribe to Baunduilla on YouTube"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Geographical Focus */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase">
              Top Regions
            </h4>
            <ul className="space-y-2 text-sm text-[#F7F5EF]/80">
              <li>
                <Link to="/destinations/north-bengal" className="hover:text-[#E99B54] transition-colors">
                  North Bengal
                </Link>
              </li>
              <li>
                <Link to="/destinations/assam" className="hover:text-[#E99B54] transition-colors">
                  Assam
                </Link>
              </li>
              <li>
                <Link to="/destinations/sikkim" className="hover:text-[#E99B54] transition-colors">
                  Sikkim
                </Link>
              </li>
              <li>
                <Link to="/destinations/meghalaya" className="hover:text-[#E99B54] transition-colors">
                  Meghalaya
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase">
              Discover
            </h4>
            <ul className="space-y-2 text-sm text-[#F7F5EF]/80">
              <li>
                <Link to="/packages" className="hover:text-[#E99B54] transition-colors">
                  All Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/adventures" className="hover:text-[#E99B54] transition-colors">
                  Treks & Adventures
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E99B54] transition-colors">
                  Our Story & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#E99B54] transition-colors">
                  Travel Blog & Guides
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#E99B54] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#E99B54] transition-colors">
                  Contact Travel Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Desk Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase">
              Travel Desk
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F7F5EF]/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E99B54] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E99B54] shrink-0" />
                <a href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {settings.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E99B54] shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white truncate">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>WhatsApp: +{settings.whatsappNumber}</span>
              </li>
            </ul>

            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#235A4D] text-[#F7F5EF]/90 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E99B54]" />
                <span>Direct Local Coordinators</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Credit & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#F7F5EF]/70 text-center md:text-left">
          <p className="leading-relaxed">
            <span>{settings.copyrightText || (`© ${currentYear} Baunduilla Travel Agency. All rights reserved.`)}</span>{' '}
            <span className="inline-flex items-center gap-1 align-baseline whitespace-nowrap">
              Made with <Heart className="w-3.5 h-3.5 text-[#E99B54] fill-current inline-block shrink-0" /> for Indian travelers.
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 text-xs">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#235A4D] select-none hidden sm:inline">•</span>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-[#235A4D] select-none hidden sm:inline">•</span>
            <Link to="/cancellation-policy" className="hover:text-white transition-colors">
              Cancellation & Refunds
            </Link>
            <span className="text-[#235A4D] select-none hidden sm:inline">•</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-[#E99B54] hover:text-white transition-colors font-medium"
              title="Protected Admin Management Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
