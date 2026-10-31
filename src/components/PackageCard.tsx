import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TourPackage } from '../types';
import { StorageService } from '../services/storageService';
import { generateWhatsAppLink, createPackageWhatsAppMessage } from '../utils/whatsapp';

interface PackageCardProps {
  tourPackage: TourPackage;
  onQuickInquire?: (pkg: TourPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ tourPackage, onQuickInquire }) => {
  const settings = StorageService.getSiteSettings();

  const whatsAppUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createPackageWhatsAppMessage(tourPackage.title)
  );

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/60 flex flex-col h-full transform hover:-translate-y-1">
      {/* Package Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={tourPackage.images[0] || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'}
          alt={tourPackage.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Travel Style Badge */}
        <div className="absolute top-3 left-3 bg-[#173F35]/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
          {tourPackage.travelStyle}
        </div>

        {/* Badges on Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {tourPackage.featured && (
            <span className="bg-[#E99B54] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
              Featured
            </span>
          )}
          {tourPackage.difficulty && (
            <div className="bg-white/90 backdrop-blur-md text-[#17324D] text-xs font-semibold px-2 py-0.5 rounded-full shadow">
              {tourPackage.difficulty}
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
          <Clock className="w-3.5 h-3.5 text-[#E99B54]" />
          <span>{tourPackage.durationDays} Days / {tourPackage.durationNights} Nights</span>
        </div>
      </div>

      {/* Package Details */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs font-medium text-stone-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E99B54]" />
            <span>{tourPackage.destinationName}</span>
            <span className="mx-1">•</span>
            <span className="text-[#173F35] font-semibold">{tourPackage.tripType} Tour</span>
          </div>

          <h3 className="font-serif text-lg font-bold text-[#173F35] group-hover:text-[#E99B54] transition-colors line-clamp-1 mb-2">
            {tourPackage.title}
          </h3>

          <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed mb-3">
            {tourPackage.shortDescription}
          </p>

          {/* Highlights checklist preview */}
          {tourPackage.highlights && tourPackage.highlights.length > 0 && (
            <div className="space-y-1 mb-4">
              {tourPackage.highlights.slice(0, 2).map((hl, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-stone-600 truncate">
                  <CheckCircle2 className="w-3 h-3 text-[#E99B54] shrink-0" />
                  <span className="truncate">{hl}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price & CTA section */}
        <div className="pt-3 border-t border-stone-100">
          <div className="mb-3">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                Starting from
              </span>
              {tourPackage.isVerifiedPrice && (
                <span
                  className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50/90 border border-emerald-200/70 px-1.5 py-0.5 rounded-md leading-none whitespace-nowrap shrink-0"
                  title="Directly verified base tariff with local transport & stay providers"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                  <span>Verified Base Tariff</span>
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#17324D]">
                ₹{tourPackage.pricePerPerson.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-500 font-normal">/ person</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/packages/${tourPackage.slug}`}
              className="flex items-center justify-center gap-1.5 bg-[#173F35] hover:bg-[#1F4F43] text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-all shadow-sm text-center"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold py-2.5 px-2 rounded-xl transition-all shadow-sm text-center"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
