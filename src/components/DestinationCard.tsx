import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Destination } from '../types';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/60 flex flex-col h-full transform hover:-translate-y-1">
      {/* Destination Image with Badge */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Region Tag */}
        <div className="absolute top-3 left-3 bg-[#173F35]/90 backdrop-blur-md text-[#F7F5EF] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
          <MapPin className="w-3 h-3 text-[#E99B54]" />
          <span>{destination.region}</span>
        </div>

        {/* Category Tag */}
        {destination.category && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#17324D] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <span>
              {destination.category === 'Hill' && '🏔️'}
              {destination.category === 'Sea' && '🌊'}
              {(destination.category === 'Forest' || destination.category === 'Jungle') && '🌲'}
              {destination.category === 'Desert' && '🏜️'}
            </span>
            <span>{destination.category === 'Jungle' ? 'Forest' : destination.category}</span>
          </div>
        )}

        {/* Duration Tag */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[#E99B54]" />
          <span>{destination.suggestedDuration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#173F35] group-hover:text-[#E99B54] transition-colors mb-2">
            {destination.name}
          </h3>
          <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed">
            {destination.shortDescription}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">
            {destination.attractions.length} Key Highlights
          </span>
          <Link
            to={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#173F35] group-hover:text-[#E99B54] transition-colors"
          >
            <span>Explore Destination</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
