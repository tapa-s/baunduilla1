import React from 'react';

interface CertifiedGuideLogoProps {
  className?: string;
  size?: number;
}

/**
 * Dedicated official emblem for Certified Mountain Guides & Forest Safaris
 * Integrates snow-capped Himalayan mountain ridges, an evergreen pine tree for forest safaris,
 * and a golden verified certification seal.
 */
export const CertifiedGuideLogo: React.FC<CertifiedGuideLogoProps> = ({
  className = 'w-5 h-5',
}) => {
  return (
    <svg
      className={`${className} shrink-0`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Certified Mountain Guides & Forest Safaris Emblem"
    >
      {/* Base Badge Circle */}
      <circle cx="12" cy="12" r="11" fill="#173F35" stroke="#235A4D" strokeWidth="1" />

      {/* Mountain Ridge (Silhouette) */}
      <path
        d="M3.5 17.5L9 8.5L13.5 15L16.5 10.5L20.5 17.5H3.5Z"
        fill="#1F5F4A"
        stroke="#2D7A64"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />

      {/* Snowcap on Main Peak */}
      <path
        d="M9 8.5L10.6 11.2L9.2 12.2L7.6 11L9 8.5Z"
        fill="#FFFFFF"
      />

      {/* Snowcap on Secondary Peak */}
      <path
        d="M16.5 10.5L17.8 12.5L16.6 13.2L15.3 12.3L16.5 10.5Z"
        fill="#FFFFFF"
      />

      {/* Forest Safari Pine Tree */}
      <path
        d="M17 12.5L19.2 16H14.8L17 12.5Z"
        fill="#34D399"
      />
      <rect x="16.5" y="16" width="1" height="1.8" fill="#E99B54" />

      {/* Official Certified Seal on Top Right */}
      <circle cx="18" cy="6" r="3.8" fill="#E99B54" stroke="#173F35" strokeWidth="0.8" />
      <path
        d="M16.4 5.9L17.5 7L19.8 4.7"
        stroke="#173F35"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
