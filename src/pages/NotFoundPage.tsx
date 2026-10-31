import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Home, MapPin, Package } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xl space-y-6">
        <div className="w-16 h-16 bg-[#173F35]/10 text-[#173F35] rounded-3xl flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-[#E99B54]" />
        </div>

        <div className="space-y-2">
          <span className="text-5xl sm:text-6xl font-serif font-bold text-[#173F35]">
            404
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#173F35]">
            Looks Like You've Wandered Off Trail
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            The page you are looking for doesn't exist, was renamed, or has moved to another mountain pass. Let's guide you back.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-stone-50 hover:bg-[#173F35] hover:text-white text-stone-700 text-xs font-semibold transition-all border border-stone-200"
          >
            <Home className="w-3.5 h-3.5 text-[#E99B54]" />
            <span>Home</span>
          </Link>
          <Link
            to="/destinations"
            className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-stone-50 hover:bg-[#173F35] hover:text-white text-stone-700 text-xs font-semibold transition-all border border-stone-200"
          >
            <MapPin className="w-3.5 h-3.5 text-[#E99B54]" />
            <span>Destinations</span>
          </Link>
          <Link
            to="/packages"
            className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-stone-50 hover:bg-[#173F35] hover:text-white text-stone-700 text-xs font-semibold transition-all border border-stone-200"
          >
            <Package className="w-3.5 h-3.5 text-[#E99B54]" />
            <span>Packages</span>
          </Link>
        </div>

        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E99B54] hover:underline"
          >
            <span>Need assistance from our travel coordinators? Contact us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
