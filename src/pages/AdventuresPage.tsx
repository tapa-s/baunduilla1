import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Compass, ShieldAlert, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { InquiryModal } from '../components/InquiryModal';
import { generateWhatsAppLink, createGeneralInquiryWhatsAppMessage } from '../utils/whatsapp';

export const AdventuresPage: React.FC = () => {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const settings = StorageService.getSiteSettings();

  const adventures = [
    {
      id: 'adv-1',
      title: 'Buxa Fort & Jayanti Riverbed Forest Trail',
      category: 'Jungle & Nature Hike',
      destination: 'North Bengal & Dooars',
      elevation: '2,870 ft',
      duration: '5 Days',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      description: 'Hike through orange orchards and limestone cliffs in Buxa Tiger Reserve to reach historic prison ruins overlooking the Bhutanese plains.',
      packageSlug: 'untamed-north-bengal-dooars-tour'
    },
    {
      id: 'adv-2',
      title: 'Nongriat Double Decker Root Bridge & Canyons',
      category: 'Jungle & River Hike',
      destination: 'Meghalaya',
      elevation: '2,200 ft',
      duration: '6 Days',
      difficulty: 'Moderate',
      image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
      description: 'Descend 3,500 stone stairs into subtropical rainforest canopy to witness ancient bio-engineered living rubber tree bridges and turquoise lagoons.',
      packageSlug: 'meghalaya-living-roots-canyons-expedition'
    },
    {
      id: 'adv-3',
      title: 'Kaziranga Grassland & Forest Safari Trail',
      category: 'Wildlife Safari',
      destination: 'Assam',
      elevation: '250 ft',
      duration: '5 Days',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80',
      description: 'Traverse elephant grass and wetlands in open 4x4 gypsies to observe the world\'s largest population of great Indian one-horned rhinoceros.',
      packageSlug: 'assam-kaziranga-wildlife-safari-tour'
    },
    {
      id: 'adv-4',
      title: 'Hatu Peak Summit & Narkanda Ridge Trail',
      category: 'Himalayan Ridge Hike',
      destination: 'Shimla & Himachal',
      elevation: '11,152 ft',
      duration: '5 Days',
      difficulty: 'Easy to Moderate',
      image: 'https://images.unsplash.com/photo-1626014303757-64663372c358?auto=format&fit=crop&w=800&q=80',
      description: 'Ascend through dense pine and spruce forests to Hatu Peak for panoramic 360-degree snow-capped vistas of the Greater Himalayan ranges.',
      packageSlug: 'shimla-kufri-narkanda-mountain-tour'
    }
  ];

  const categories = ['All', 'Jungle & Nature Hike', 'Jungle & River Hike', 'Wildlife Safari', 'Himalayan Ridge Hike'];

  const filtered = selectedCategory === 'All'
    ? adventures
    : adventures.filter(a => a.category === selectedCategory);

  const whatsAppUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createGeneralInquiryWhatsAppMessage()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
          <Mountain className="w-4 h-4" />
          <span>Mountain & Wilderness Programs</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
          Treks & Adventures
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
          From high-altitude ridge climbs and rugged Himalayan road trips to deep jungle river treks across North Bengal and Northeast India.
        </p>
      </div>

      {/* Safety Notice Box */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-3.5 sm:gap-4">
        <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-xl xs:rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5 xs:w-6 xs:h-6" />
        </div>
        <div className="space-y-1.5 text-stone-800 text-xs sm:text-sm">
          <h2 className="font-serif font-bold text-amber-900 text-sm xs:text-base sm:text-lg">
            Essential Mountain Safety & Permit Protocol
          </h2>
          <p className="leading-relaxed">
            All high-altitude trekking, border pass entries (Sikkim, Spiti, Arunachal), and forest safaris are subject to real-time weather, landslide clearances, and army/forest authority permissions. We prioritize traveler health, gradual acclimatization, and zero-trace mountain discipline above all else.
          </p>
          <p className="text-amber-800/80 font-medium pt-0.5">
            • Emergency oxygen cylinders are carried on all high-altitude overland trips •
          </p>
        </div>
      </div>

      {/* Category Filter Pills (Scrollable on small mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <span className="text-xs font-bold text-stone-500 mr-1 shrink-0">Filter:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#173F35] text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Adventures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {filtered.map((adv) => (
          <div
            key={adv.id}
            className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
              <img
                src={adv.image}
                alt={adv.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#173F35]/90 backdrop-blur-xs text-white text-[10px] xs:text-xs font-bold px-2.5 py-1 rounded-full max-w-[60%] truncate">
                {adv.category}
              </div>
              <div className="absolute top-2.5 right-2.5 bg-white/95 text-[#17324D] text-[10px] xs:text-xs font-bold px-2 py-0.5 rounded-full shadow-xs">
                {adv.difficulty}
              </div>
              <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] xs:text-xs px-2.5 py-0.5 rounded-lg">
                Alt: {adv.elevation}
              </div>
            </div>

            <div className="p-4 xs:p-6 flex flex-col flex-1 justify-between">
              <div>
                <div className="text-[11px] xs:text-xs text-stone-400 font-semibold mb-1">
                  {adv.destination} • {adv.duration}
                </div>
                <h2 className="font-serif text-lg xs:text-xl font-bold text-[#173F35] group-hover:text-[#E99B54] transition-colors mb-2 leading-snug">
                  {adv.title}
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {adv.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                <Link
                  to={`/packages/${adv.packageSlug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173F35] hover:text-[#E99B54] transition-colors"
                >
                  <span>Full Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="text-xs font-semibold text-[#E99B54] hover:underline cursor-pointer"
                >
                  Inquire Slots
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to action strip */}
      <div className="bg-[#17324D] text-white rounded-2xl sm:rounded-3xl p-5 xs:p-7 sm:p-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6 shadow-xl">
        <div>
          <h2 className="font-serif text-xl xs:text-2xl sm:text-3xl font-bold">
            Looking for a Customized Trek or Route?
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl">
            We organize tailored treks with private guides, porters, gear rental assistance, and flexible camping for friend circles and clubs.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 w-full xs:w-auto">
          <button
            onClick={() => setInquiryModalOpen(true)}
            className="flex-1 xs:flex-initial bg-[#E99B54] hover:bg-[#D88940] active:scale-95 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-sm transition-all text-center cursor-pointer"
          >
            Request Custom Trek
          </button>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1EBE5D] active:scale-95 text-white p-2.5 rounded-xl shadow-sm flex items-center justify-center cursor-pointer"
            title="Chat with trek coordinator"
            aria-label="Chat with trek coordinator on WhatsApp"
          >
            <MessageSquare className="w-5 h-5" />
          </a>
        </div>
      </div>

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        defaultDestination="Himalayan Adventure & Trek"
      />
    </div>
  );
};
