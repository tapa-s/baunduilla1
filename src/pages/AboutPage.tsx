import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Users, MapPin, ShieldCheck, ArrowRight, Mountain } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { TeamMember } from '../types';

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState(() => StorageService.getSiteSettings());
  const [team, setTeam] = useState<TeamMember[]>(() => StorageService.getTeamMembers());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(StorageService.getSiteSettings());
      setTeam(StorageService.getTeamMembers());
    };
    window.addEventListener("baunduilla_data_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("baunduilla_data_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Header */}
      <div className="bg-[#173F35] text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-[#E99B54] border border-white/20">
            <Compass className="w-4 h-4" />
            <span>Our Roots & Ethos</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            About Baunduilla
          </h1>
          <p className="text-white/85 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            "Travel Together. Discover More." — Building a welcoming community of Indian safari adventurers, road trippers, trekkers, and culture enthusiasts.
          </p>
        </div>
      </div>

      {/* The Baunduilla Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E99B54]">
              {settings.aboutStorySubtitle || "How We Began"}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#173F35]">
              {settings.aboutStoryTitle || "Born From a Passion for the Eastern Himalayas"}
            </h2>
            {settings.aboutStoryContent ? (
              settings.aboutStoryContent.split("\n\n").map((para, idx) => (
                <p key={idx} className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {para}
                </p>
              ))
            ) : (
              <>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  In Bengali folklore and colloquial speech, a <em>"Baunduilla"</em> is someone with an untethered, wandering heart—a free spirit drawn to riverbeds, mountain ridges, and undiscovered village trails.
                </p>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  Headquartered with roots in <strong>Siliguri</strong>—the bustling gateway where the tea gardens of Dooars meet the steep ridges of Sikkim and Darjeeling—Baunduilla was created to offer an alternative to rushed, commercial package tours.
                </p>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  We believe travel is not about collecting selfie checkpoints. It is about waking up to crisp pine air, drinking steaming butter tea with Monpa homestay hosts, respecting altitude, and sharing a campfire with fellow travelers from across the country.
                </p>
              </>
            )}
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
                alt="Baunduilla mountain expedition"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Travel Philosophy & Pillars */}
      <div className="bg-[#F7F5EF] py-14 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E99B54]">
              Core Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#173F35] mt-1">
              Our Travel Philosophy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center font-bold">
                <Users className="w-6 h-6 text-[#173F35]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#173F35]">
                Human-Scale Group Travel
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                We cap our small groups at 8 to 14 guests. This ensures personal attention, agile mountain vehicles, and an authentic group dynamic where solo travelers never feel lost.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center font-bold">
                <Heart className="w-6 h-6 text-[#173F35]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#173F35]">
                Support Mountain Economies
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Whenever possible, we stay in local family homestays in Lachen, Kaza, and Nongriat. Your travel spend puts funds directly into rural mountain kitchens and local schools.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#173F35]/10 text-[#173F35] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-[#173F35]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#173F35]">
                Patience & Mountain Respect
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                The Himalayas command patience. We build acclimatization stops into every itinerary and never rush high-altitude passes during unpredictable weather.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team / Hosts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E99B54]">
            People Behind The Journey
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#173F35] mt-1">
            Meet Our Travel Coordinators
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Configured and managed directly by the Baunduilla team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm flex flex-col items-center text-center space-y-4 transition-all hover:shadow-md hover:border-[#173F35]/30 group"
            >
              {member.photo ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-stone-100 shrink-0 bg-stone-100 group-hover:scale-105 transition-transform">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#173F35] text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-stone-100 shrink-0 group-hover:scale-105 transition-transform">
                  <span className="text-[#E99B54] font-serif">{member.name.charAt(0)}</span>
                </div>
              )}

              <div className="space-y-2 flex-1 w-full flex flex-col justify-start">
                <h3 className="font-serif font-bold text-lg text-[#173F35]">{member.name}</h3>
                {member.role && member.role.trim() !== '' && (
                  <p className="text-xs text-[#E99B54] font-semibold">{member.role}</p>
                )}
                {member.bio && member.bio.trim() !== '' && (
                  <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed pt-1">
                    {member.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#17324D] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">
            Ready to Travel With Us?
          </h2>
          <p className="text-white/80 text-xs sm:text-sm max-w-lg mx-auto">
            Join an upcoming small-group departure or let our Siliguri travel desk tailor a custom holiday for your family or friends.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/packages"
              className="bg-[#E99B54] hover:bg-[#D88940] text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all"
            >
              Explore Packages
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all border border-white/20"
            >
              Contact Travel Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
