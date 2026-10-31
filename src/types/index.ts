export type TravelStyle = 
  | 'Trekking' 
  | 'Road Trip' 
  | 'Sightseeing' 
  | 'Camping' 
  | 'Family Tour' 
  | 'Wildlife Safari' 
  | 'Cultural & Heritage'
  | 'Custom Itinerary';

export type TripDifficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Strenuous';
export type TripType = 'Group' | 'Private' | 'Both';

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  stay?: string;
  altitude?: string;
}

export interface Attraction {
  name: string;
  image: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface RegionCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  badge?: string;
  featured?: boolean;
  destinationCount?: number;
  order?: number;
  createdAt?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  region: string;
  category?: 'Hill' | 'Sea' | 'Forest' | 'Jungle' | 'Desert';
  shortDescription: string;
  fullOverview: string;
  heroImage: string;
  gallery: string[];
  attractions: Attraction[];
  bestTimeToVisit: string;
  suggestedDuration: string;
  activities: string[];
  approximateBudget: string;
  permitNotice?: string;
  published: boolean;
  featured: boolean;
  faqs?: FAQItem[];
}

export interface TourPackage {
  id: string;
  title: string;
  slug: string;
  destinationId: string;
  destinationName: string;
  shortDescription: string;
  durationDays: number;
  durationNights: number;
  pricePerPerson: number;
  currency: string;
  travelStyle: TravelStyle;
  difficulty?: TripDifficulty;
  tripType: TripType;
  maxGroupSize?: number;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  accommodationInfo: string;
  transportationInfo: string;
  mealsInfo: string;
  thingsToCarry: string[];
  departureDates: string[];
  images: string[];
  published: boolean;
  featured: boolean;
  isVerifiedPrice: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'Travel Guides' | 'Trekking' | 'Itineraries' | 'Budget Travel' | 'Travel Tips' | 'Northeast India';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  readTime: string;
  tags: string[];
  published: boolean;
  publishedAt: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  location: string;
  tripName: string;
  rating: number;
  review: string;
  date: string;
  avatar?: string;
  isDemoSample: boolean;
}

export interface Inquiry {
  id: string;
  inquiryType: 'general' | 'package' | 'custom_plan' | 'destination';
  customerName: string;
  phone: string;
  email: string;
  destination: string;
  packageId?: string;
  packageTitle?: string;
  travelDate?: string;
  travellers?: {
    adults: number;
    children: number;
  };
  budgetPerPerson?: string;
  travelStyle?: string;
  tripType?: 'Group' | 'Private';
  startingCity?: string;
  accommodationPreference?: string;
  requirements?: string;
  status: 'new' | 'contacted' | 'booked' | 'archived';
  createdAt: string;
  source: string;
}

export interface SiteSettings {
  whatsappNumber: string; // e.g. "919876543210" without symbols
  contactPhone: string;
  contactEmail: string;
  address: string;
  googleBusinessUrl: string; // Direct link to Google Business profile / reviews
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  operationalNotice: string;
  enableLiveBookingNotice: boolean;

  // Website Layout, Texts & Details Customization
  heroBadge?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroCtaText?: string;
  heroImage?: string;
  aboutStoryTitle?: string;
  aboutStorySubtitle?: string;
  aboutStoryContent?: string;
  footerTagline?: string;
  copyrightText?: string;
  themeAccent?: 'baunduilla-emerald' | 'himalayan-midnight' | 'forest-moss' | 'terracotta-warm';
  showCategoryCarousel?: boolean;
  showVerifiedTariff?: boolean;
  showTestimonials?: boolean;
  showBlogSection?: boolean;
  showFaqSection?: boolean;

  // Main Menu Action Buttons (Get A Hotel & Hire A Cab)
  hotelButtonText?: string;
  hotelButtonUrl?: string;
  hotelButtonEnabled?: boolean;
  cabButtonText?: string;
  cabButtonUrl?: string;
  cabButtonEnabled?: boolean;

  // Travel Experience Gallery Customization
  galleryTitle?: string;
  gallerySubtitle?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  tag: string;
  src: string;
  description?: string;
  order?: number;
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'editor' | 'custom';

export type DashboardModule =
  | 'overview'
  | 'inquiries'
  | 'packages'
  | 'destinations'
  | 'regions'
  | 'gallery'
  | 'blog'
  | 'settings'
  | 'users';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isPrimarySuperAdmin?: boolean;
  status: 'active' | 'suspended';
  allowedModules: DashboardModule[];
  canDeleteContent?: boolean;
  canPublishContent?: boolean;
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  photo?: string;
  bio?: string;
  phone?: string;
  instagram?: string;
  order?: number;
}
