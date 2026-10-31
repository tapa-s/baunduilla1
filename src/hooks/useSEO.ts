import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  keywords?: string[];
  schema?: Record<string, any>;
}

/**
 * Universal hook for updating document head metadata, OpenGraph, Twitter Cards,
 * and JSON-LD schema for social media sharing and SEO snippet previews.
 */
export const useSEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  keywords,
  schema,
}: SEOProps) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let tag = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const setLinkTag = (rel: string, href: string) => {
      let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        document.head.appendChild(tag);
      }
      tag.href = href;
    };

    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const defaultImage = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80';
    const resolvedImage = image || defaultImage;

    // Standard Meta
    setMetaTag('name', 'description', description);
    if (keywords && keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '));
    }
    setLinkTag('canonical', currentUrl);

    // OpenGraph Social Share Card Tags
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', resolvedImage);
    setMetaTag('property', 'og:image:secure_url', resolvedImage);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:image:alt', title);
    setMetaTag('property', 'og:site_name', 'Baunduilla - Adventure Travel & Tour Agency');

    if (publishedTime) {
      setMetaTag('property', 'article:published_time', publishedTime);
    }
    if (author) {
      setMetaTag('property', 'article:author', author);
    }

    // Twitter Card Social Share Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:url', currentUrl);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', resolvedImage);
    setMetaTag('name', 'twitter:image:alt', title);

    // Schema.org Structured Data
    let scriptTag = document.getElementById('schema-structured-data') as HTMLScriptElement | null;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'schema-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    }

    return () => {
      document.title = originalTitle;
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [title, description, image, url, type, author, publishedTime, keywords, schema]);
};
