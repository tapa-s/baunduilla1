import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Clock, ArrowRight, Tag } from 'lucide-react';
import { StorageService } from '../services/storageService';

export const BlogPage: React.FC = () => {
  const [allPosts, setAllPosts] = useState(() => StorageService.getBlogPosts().filter(p => p.published));

  useEffect(() => {
    const handleUpdate = () => {
      setAllPosts(StorageService.getBlogPosts().filter(p => p.published));
    };
    window.addEventListener('baunduilla_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('baunduilla_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const defaultCats = ['Travel Guides', 'Trekking', 'Itineraries', 'Northeast India'];
    const dynamicCats = allPosts.map(p => p.category);
    return ['All', ...Array.from(new Set([...defaultCats, ...dynamicCats]))];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === 'All' || post.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [allPosts, searchQuery, selectedCategory]);

  const featuredPost = allPosts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E99B54] mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Mountain Dispatch & Field Notes</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35]">
          Travel Blog & Guides
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
          Insider guides on Dooars safaris, Sikkim acclimatization, Spiti road trip logistics, and hidden Northeast waterfalls written by our expedition team.
        </p>
      </div>

      {/* Featured Article Banner (if no search filter applied) */}
      {!searchQuery && selectedCategory === 'All' && featuredPost && (
        <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md grid grid-cols-1 lg:grid-cols-2 group">
          <div className="aspect-[16/10] lg:aspect-auto overflow-hidden bg-stone-100">
            <img
              src={featuredPost.coverImage}
              alt={featuredPost.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="bg-[#173F35] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Featured Guide
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#E99B54]" />
                  <span>{featuredPost.readTime}</span>
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173F35] group-hover:text-[#E99B54] transition-colors">
                <Link to={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-stone-600 text-sm leading-relaxed">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-xs">
                  {featuredPost.author.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#173F35]">{featuredPost.author.name}</h3>
                  <p className="text-[11px] text-stone-400">{featuredPost.publishedAt}</p>
                </div>
              </div>

              <Link
                to={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173F35] group-hover:text-[#E99B54]"
              >
                <span>Read Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles or topics..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#173F35] text-white shadow-xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Post Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
          >
            <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-stone-100">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-[#173F35]/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                {post.category}
              </div>
            </Link>

            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                  <span>{post.publishedAt}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="font-serif text-lg font-bold text-[#173F35] group-hover:text-[#E99B54] transition-colors line-clamp-2 mb-2">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.slice(0, 3).map((t, i) => (
                    <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5 text-[#E99B54]" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700">{post.author.name}</span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#173F35] group-hover:text-[#E99B54]"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
