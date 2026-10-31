import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { generateWhatsAppLink, createGeneralInquiryWhatsAppMessage } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const settings = StorageService.getSiteSettings();

  const whatsappUrl = generateWhatsAppLink(
    settings.whatsappNumber,
    createGeneralInquiryWhatsAppMessage()
  );

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="mb-3 max-w-xs bg-white text-[#202824] rounded-2xl p-3 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-[#173F35]">Chat with Baunduilla Desk</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Have questions about trip dates, permits, or custom packages? We are online!
              </p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 p-0.5"
              aria-label="Close message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-center bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm"
          >
            Start WhatsApp Chat
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="relative group">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
          aria-label="Contact Baunduilla on WhatsApp"
        >
          <MessageSquare className="w-7 h-7 fill-current stroke-none" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#E99B54] border-2 border-white rounded-full"></span>
        </a>
      </div>
    </aside>
  );
};
