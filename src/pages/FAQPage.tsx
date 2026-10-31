import React, { useState, useMemo } from 'react';
import { HelpCircle, Search, ChevronDown, MessageSquare } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { generateWhatsAppLink, createGeneralInquiryWhatsAppMessage } from '../utils/whatsapp';

export const FAQPage: React.FC = () => {
  const faqs = StorageService.getFAQs();
  const settings = StorageService.getSiteSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    'All',
    'Booking Process',
    'Payment Methods',
    'Group and Private Tours',
    'Permits & Documents',
    'Cancellation & Refunds',
    'Safety & Insurance'
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [faqs, searchQuery, selectedCategory]);

  const whatsAppUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createGeneralInquiryWhatsAppMessage()
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E99B54]">
          <HelpCircle className="w-4 h-4" />
          <span>Knowledge & Guidance</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
          Frequently Asked Questions
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Everything you need to know about booking, permits, mountain packing, acclimatization, and our group policies.
        </p>
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. permits, payments, cancellation, group size...)"
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-300 rounded-2xl text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#173F35] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-[#173F35] hover:bg-stone-50 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 transform transition-transform shrink-0 ${
                    isOpen ? 'rotate-180 text-[#E99B54]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-stone-700 text-xs sm:text-sm leading-relaxed border-t border-stone-100 pt-3">
                  <p>{faq.answer}</p>
                  {faq.category && (
                    <span className="inline-block mt-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Category: {faq.category}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="bg-white p-10 rounded-2xl border border-stone-200 text-center space-y-2">
            <p className="text-stone-600 font-medium text-sm">No matching questions found.</p>
            <p className="text-stone-400 text-xs">Feel free to message our travel desk directly on WhatsApp!</p>
          </div>
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="bg-[#173F35] text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold">
          Still Have a Specific Question?
        </h2>
        <p className="text-white/80 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Our Siliguri travel desk coordinates daily with mountain drivers and forest stations. Message us directly for real-time answers.
        </p>
        <div className="pt-2 flex justify-center">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Our Travel Team on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
