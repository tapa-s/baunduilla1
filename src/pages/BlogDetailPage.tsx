import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, Share2, Tag, ArrowRight, Check, Copy, Eye, ExternalLink, Globe } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { useSEO } from '../hooks/useSEO';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = StorageService.getBlogPostBySlug(slug || '');
  const allPosts = StorageService.getBlogPosts().filter(p => p.published);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSocialPreview, setShowSocialPreview] = useState(false);

  // Configure OpenGraph, Twitter card and Schema.org metadata so the blog image is the preview image on social media
  useSEO({
    title: post ? `${post.title} | Baunduilla Travel Blog` : 'Article | Baunduilla',
    description: post ? post.excerpt : 'Explore travel guides and adventure stories with Baunduilla.',
    image: post?.coverImage,
    type: 'article',
    author: post?.author.name,
    publishedTime: post?.publishedAt,
    keywords: post?.tags,
    schema: post ? {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: [post.coverImage],
      datePublished: post.publishedAt,
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Baunduilla',
      },
    } : undefined,
  });

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#173F35]">
          Article Not Found
        </h1>
        <p className="text-stone-600 text-sm">
          The requested article could not be located.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 bg-[#173F35] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow"
        >
          <span>Return to Blog</span>
        </Link>
      </div>
    );
  }

  const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 2);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://baunduilla.com/blog/${post.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${post.title} | Baunduilla Blog`,
        text: post.excerpt,
        url: currentUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  // Social sharing endpoints
  const shareUrls = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title}\n\n${currentUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-[#173F35] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#173F35] text-white text-xs font-bold px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#E99B54]" />
            <span>{post.readTime}</span>
          </span>
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#E99B54]" />
            <span>{post.publishedAt}</span>
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173F35] leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-light">
          {post.excerpt}
        </p>

        {/* Author & Social Sharing Toolbar */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-sm tracking-wider shrink-0 shadow-sm">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#173F35]">{post.author.name}</h3>
              <p className="text-xs text-stone-500">{post.author.role}</p>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* WhatsApp Share */}
            <a
              href={shareUrls.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
              title="Share on WhatsApp with preview image"
            >
              <span>WhatsApp</span>
            </a>

            {/* Facebook Share */}
            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
              title="Share on Facebook with preview image"
            >
              <span>Facebook</span>
            </a>

            {/* X / Twitter Share */}
            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-black hover:bg-stone-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
              title="Share on X (Twitter)"
            >
              <span>X (Twitter)</span>
            </a>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="Copy link to clipboard"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>

            {/* Toggle Social Preview Card */}
            <button
              type="button"
              onClick={() => setShowSocialPreview(!showSocialPreview)}
              className="inline-flex items-center gap-1.5 bg-[#173F35]/10 hover:bg-[#173F35]/20 text-[#173F35] px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="View social media preview card"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showSocialPreview ? 'Hide Card' : 'Social Preview'}</span>
            </button>
          </div>
        </div>

        {/* Live Social Media Preview Card (Demonstrating OpenGraph & Twitter Card Preview) */}
        {showSocialPreview && (
          <div className="mt-4 p-5 sm:p-6 bg-stone-50 rounded-2xl border border-stone-200 shadow-inner animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17324D]">
                <Globe className="w-4 h-4 text-[#E99B54]" />
                <span>Social Media Link Preview (OpenGraph / Twitter / WhatsApp)</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                og:image active
              </span>
            </div>

            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              When this article is shared on WhatsApp, Facebook, LinkedIn, Twitter/X, or iMessage, the social platform fetches the blog image below as the rich preview banner:
            </p>

            {/* Mock Social Card */}
            <div className="max-w-md mx-auto bg-white rounded-2xl overflow-hidden border border-stone-300/80 shadow-md">
              <div className="aspect-[1.91/1] w-full relative overflow-hidden bg-stone-200">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Social Preview Image
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  baunduilla.com • Adventure Travel Blog
                </span>
                <h4 className="font-serif font-bold text-sm text-[#173F35] line-clamp-1 leading-snug">
                  {post.title}
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cover Image */}
      <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-6 pt-4">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-serif text-2xl font-bold text-[#173F35] pt-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('1. ') || paragraph.startsWith('* ')) {
            return (
              <div key={idx} className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-sm whitespace-pre-line leading-relaxed">
                {paragraph}
              </div>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Tags */}
      <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-stone-500 mr-1">Tags:</span>
        {post.tags.map((tag, i) => (
          <span key={i} className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full flex items-center gap-1 font-medium">
            <Tag className="w-3 h-3 text-[#E99B54]" />
            <span>{tag}</span>
          </span>
        ))}
      </div>

      {/* Related Trips Call to Action */}
      <div className="bg-[#17324D] text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#E99B54] font-bold">
            Travel With Baunduilla
          </span>
          <h2 className="font-serif text-2xl font-bold text-white mt-1">
            Inspired to Visit This Destination?
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-md">
            Explore our curated small group itineraries or plan a personalized mountain road trip.
          </p>
        </div>
        <Link
          to="/packages"
          className="inline-flex items-center gap-2 bg-[#E99B54] hover:bg-[#D88940] text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
        >
          <span>Explore Related Trips</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="pt-10 border-t border-stone-200 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#173F35]">
            More Stories & Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((rel) => (
              <div key={rel.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#E99B54] uppercase">{rel.category}</span>
                  <h3 className="font-serif font-bold text-base text-[#173F35] mt-1 line-clamp-2">
                    <Link to={`/blog/${rel.slug}`} className="hover:underline">{rel.title}</Link>
                  </h3>
                  <p className="text-stone-500 text-xs line-clamp-2 mt-2 leading-relaxed">{rel.excerpt}</p>
                </div>
                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400">{rel.readTime}</span>
                  <Link to={`/blog/${rel.slug}`} className="text-[#173F35] font-bold hover:text-[#E99B54]">Read Guide →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
