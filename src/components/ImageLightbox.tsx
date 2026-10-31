import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (newIndex: number) => void;
  title?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  title,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndexChange((currentIndex + 1) % images.length);
      if (e.key === 'ArrowLeft') onIndexChange((currentIndex - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between text-white z-10">
        <div>
          {title && <h4 className="text-sm font-semibold">{title}</h4>}
          <p className="text-xs text-white/60">
            {currentIndex + 1} of {images.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close image lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Display */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
        {images.length > 1 && (
          <button
            onClick={() => onIndexChange((currentIndex - 1 + images.length) % images.length)}
            className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={images[currentIndex]}
          alt={title || `Gallery image ${currentIndex + 1}`}
          className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
        />

        {images.length > 1 && (
          <button
            onClick={() => onIndexChange((currentIndex + 1) % images.length)}
            className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onIndexChange(idx)}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-[#E99B54] scale-105' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
