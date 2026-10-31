import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { DestinationCard } from '../components/DestinationCard';

export const DestinationsPage: React.FC = () => {
  const [allDestinations, setAllDestinations] = useState(() => StorageService.getDestinations().filter(d => d.published));
  const [availableRegions, setAvailableRegions] = useState(() => StorageService.getRegions());
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category') as any;
  const initialCategory = ['Hill', 'Sea', 'Forest', 'Jungle', 'Desert', 'All'].includes(urlCategory) ? urlCategory : 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Hill' | 'Sea' | 'Forest' | 'Jungle' | 'Desert'>(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedActivity, setSelectedActivity] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc'>('featured');

  useEffect(() => {
    const handleUpdate = () => {
      setAllDestinations(StorageService.getDestinations().filter(d => d.published));
      setAvailableRegions(StorageService.getRegions());
    };
    window.addEventListener('baunduilla_data_updated', handleUpdate);
    return () => window.removeEventListener('baunduilla_data_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category') as any;
    if (cat && ['Hill', 'Sea', 'Forest', 'Jungle', 'Desert', 'All'].includes(cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const categories = [
    { id: 'All', label: 'All Terrains', emoji: '✨' },
    { id: 'Hill', label: 'Hill & Mountains', emoji: '🏔️' },
    { id: 'Sea', label: 'Sea & Coastline', emoji: '🌊' },
    { id: 'Forest', label: 'Forest & Wildlife', emoji: '🌲' },
    { id: 'Desert', label: 'Desert & Dunes', emoji: '🏜️' },
  ];

  const regions = useMemo(() => {
    const list = availableRegions.map(r => r.name);
    allDestinations.forEach(d => {
      if (d.region && !list.includes(d.region)) {
        list.push(d.region);
      }
    });
    return ['All', ...list];
  }, [availableRegions, allDestinations]);

  const activities = [
    'All',
    'Trekking',
    'High-altitude road trips',
    'Jeep jungle safaris',
    'Monastery cultural walks',
    'Living root bridges',
    'Scuba diving & snorkeling',
    'Camel safari on dunes'
  ];

  const filteredDestinations = useMemo(() => {
    return allDestinations
      .filter((dest) => {
        const matchesQuery =
          dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.region.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === 'All' ||
          (selectedCategory === 'Forest' || selectedCategory === 'Jungle'
            ? dest.category === 'Forest' || dest.category === 'Jungle'
            : dest.category === selectedCategory);

        const matchesRegion =
          selectedRegion === 'All' || dest.region === selectedRegion;

        const matchesActivity =
          selectedActivity === 'All' ||
          dest.activities.some(act =>
            act.toLowerCase().includes(selectedActivity.toLowerCase())
          );

        return matchesQuery && matchesCategory && matchesRegion && matchesActivity;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [allDestinations, searchQuery, selectedCategory, selectedRegion, selectedActivity, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedRegion('All');
    setSelectedActivity('All');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
          <MapPin className="w-4 h-4" />
          <span>Regional Guide</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
          Explore Our Destinations
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
          From the mist-draped tea gardens and wildlife corridors of North Bengal & Dooars to the towering passes of Sikkim, Spiti, Uttarakhand, and Meghalaya.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination name (e.g. Sikkim, Dooars, Spiti...)"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
            />
          </div>

          {/* Region Filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
            >
              <option value="All">All Regions</option>
              {regions.filter(r => r !== 'All').map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
            >
              <option value="featured">Featured First</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
              <option value="name-desc">Alphabetical (Z - A)</option>
            </select>
          </div>
        </div>

        {/* Category Pills (Hill, Sea, Jungle, Desert) */}
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Terrain:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#173F35] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Region Pills and Reset */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 mr-1">
              <span>Region:</span>
            </span>
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                  selectedRegion === reg
                    ? 'bg-[#E99B54] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {(searchQuery || selectedCategory !== 'All' || selectedRegion !== 'All' || selectedActivity !== 'All' || sortBy !== 'featured') && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-stone-500 font-medium">
        Showing <strong>{filteredDestinations.length}</strong> of {allDestinations.length} destinations
      </div>

      {/* Destinations Grid or Empty State */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#173F35]">
            No Destinations Found
          </h3>
          <p className="text-stone-600 text-sm">
            We couldn't find any destinations matching your criteria. Try adjusting your search term or region filter.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 bg-[#173F35] hover:bg-[#1F4F43] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
