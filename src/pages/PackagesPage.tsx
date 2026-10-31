import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Route, Search, Filter, RotateCcw } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { PackageCard } from '../components/PackageCard';

export const PackagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRegion = searchParams.get('region') || 'All';
  const initialStyle = searchParams.get('style') || 'All';

  const [allPackages, setAllPackages] = useState(() => StorageService.getPackages().filter(p => p.published));

  useEffect(() => {
    const handleUpdate = () => {
      setAllPackages(StorageService.getPackages().filter(p => p.published));
    };
    window.addEventListener('baunduilla_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('baunduilla_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(initialRegion);
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [selectedBudget, setSelectedBudget] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedTripType, setSelectedTripType] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc'>('featured');

  const destinationsList = useMemo(() => {
    const names = StorageService.getDestinations().map(d => d.name);
    return ['All', ...Array.from(new Set(names))];
  }, [allPackages]);
  const stylesList = ['All', 'Road Trip', 'Trekking', 'Wildlife Safari', 'Cultural & Heritage'];

  const filteredPackages = useMemo(() => {
    return allPackages
      .filter((pkg) => {
        // Search query
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          !query ||
          pkg.title.toLowerCase().includes(query) ||
          pkg.destinationName.toLowerCase().includes(query) ||
          pkg.shortDescription.toLowerCase().includes(query);

        // Destination match
        const matchesDest =
          selectedDestination === 'All' ||
          pkg.destinationName.toLowerCase().includes(selectedDestination.toLowerCase()) ||
          (selectedDestination === 'Sikkim' && pkg.destinationId === 'sikkim');

        // Travel style match
        const matchesStyle =
          selectedStyle === 'All' || pkg.travelStyle === selectedStyle;

        // Trip type
        const matchesTripType =
          selectedTripType === 'All' ||
          pkg.tripType === 'Both' ||
          pkg.tripType === selectedTripType;

        // Budget match
        let matchesBudget = true;
        if (selectedBudget === 'under-15000') {
          matchesBudget = pkg.pricePerPerson <= 15000;
        } else if (selectedBudget === '15000-22000') {
          matchesBudget = pkg.pricePerPerson > 15000 && pkg.pricePerPerson <= 22000;
        } else if (selectedBudget === 'above-22000') {
          matchesBudget = pkg.pricePerPerson > 22000;
        }

        // Duration match
        let matchesDuration = true;
        if (selectedDuration === 'short') {
          matchesDuration = pkg.durationDays <= 5;
        } else if (selectedDuration === 'medium') {
          matchesDuration = pkg.durationDays >= 6 && pkg.durationDays <= 7;
        } else if (selectedDuration === 'long') {
          matchesDuration = pkg.durationDays >= 8;
        }

        return matchesQuery && matchesDest && matchesStyle && matchesTripType && matchesBudget && matchesDuration;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerPerson - b.pricePerPerson;
        if (sortBy === 'price-desc') return b.pricePerPerson - a.pricePerPerson;
        if (sortBy === 'duration-asc') return a.durationDays - b.durationDays;
        if (sortBy === 'duration-desc') return b.durationDays - a.durationDays;
        // Default sort: latest added tour packages on top
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeA !== timeB) return timeB - timeA;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [allPackages, searchQuery, selectedDestination, selectedStyle, selectedTripType, selectedBudget, selectedDuration, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDestination('All');
    setSelectedStyle('All');
    setSelectedBudget('All');
    setSelectedDuration('All');
    setSelectedTripType('All');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
          <Route className="w-4 h-4" />
          <span>Curated Expeditions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
          Tour Packages & Journeys
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
          Carefully crafted Himalayan expeditions, scenic road trips, and cultural small group batches. All packages include transparent base pricing in INR.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search packages by title or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
            />
          </div>

          {/* Destination */}
          <div>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
            >
              <option value="All">All Destinations</option>
              {destinationsList.filter(d => d !== 'All').map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-[#202824] focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Short to Long</option>
              <option value="duration-desc">Duration: Long to Short</option>
            </select>
          </div>
        </div>

        {/* Multi-facet Row */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Style */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Travel Style
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full py-2 px-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
            >
              {stylesList.map((st) => (
                <option key={st} value={st}>{st === 'All' ? 'All Styles' : st}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Budget Range
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full py-2 px-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
            >
              <option value="All">Any Budget</option>
              <option value="under-15000">Under ₹15,000</option>
              <option value="15000-22000">₹15,000 - ₹22,000</option>
              <option value="above-22000">Above ₹22,000</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Trip Duration
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full py-2 px-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
            >
              <option value="All">Any Duration</option>
              <option value="short">1 - 5 Days</option>
              <option value="medium">6 - 7 Days</option>
              <option value="long">8+ Days</option>
            </select>
          </div>

          {/* Trip Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Group / Private
            </label>
            <select
              value={selectedTripType}
              onChange={(e) => setSelectedTripType(e.target.value)}
              className="w-full py-2 px-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
            >
              <option value="All">All Types</option>
              <option value="Group">Small Group Departure</option>
              <option value="Private">Private Custom Tour</option>
            </select>
          </div>
        </div>

        {/* Reset */}
        {(searchQuery || selectedDestination !== 'All' || selectedStyle !== 'All' || selectedBudget !== 'All' || selectedDuration !== 'All' || selectedTripType !== 'All' || sortBy !== 'featured') && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-[#E99B54] hover:text-[#BD7027] font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Package Count Notice */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>Showing <strong>{filteredPackages.length}</strong> available packages</span>
        <span>All baseline tariffs in INR (₹)</span>
      </div>

      {/* Package Grid or Empty State */}
      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.id} tourPackage={pkg} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#173F35]">
            No Packages Found
          </h3>
          <p className="text-stone-600 text-sm">
            We couldn't find any packages matching these specific filters. Try resetting the filters or request a custom itinerary!
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={resetFilters}
              className="bg-[#173F35] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
