import { Destination, TourPackage, BlogPost, Testimonial, FAQItem, SiteSettings, RegionCategory, AdminUser, TeamMember, GalleryItem } from '../types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  // Official Baunduilla contact defaults - editable from the Admin Settings tab
  whatsappNumber: '917872464356',
  contactPhone: '+91 78724 64356',
  contactEmail: 'contact.baunduilla@gmail.com',
  address: 'Ward No 15, Gobinda Pally Road, Near Dhupguri Model School, Gobinda Pally, Dhupguri, West Bengal, 735210',
  googleBusinessUrl: 'https://www.google.com/search?q=Baunduilla+Travel+Siliguri+reviews',
  facebookUrl: 'https://www.facebook.com/share/1FENbe1pEc/',
  instagramUrl: 'https://www.instagram.com/baunduilla?xtok=MWdodGt2c2V4Ym9kbw==',
  youtubeUrl: 'https://youtube.com/@baunduilla?si=irNP_o0h55GoPqR3',
  operationalNotice: 'All safari and mountain tour clearances are confirmed based on real-time weather and forest department guidelines. Contact our Siliguri desk for slot availability.',
  enableLiveBookingNotice: true,

  // Website Layout, Texts & Details (Customizable by Devoloper & Super Admin)
  heroBadge: 'Certified Mountain Guides & Forest Safaris',
  heroHeadline: 'Book your adventure journey now!',
  heroSubheadline: 'With Baunduilla, explore wildlife safaris in Dooars, living root bridges in Meghalaya, tea garden retreats, and Himalayan road trips. Just start with where you want to go.',
  heroCtaText: 'Start Planning',
  heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
  aboutStoryTitle: 'Rooted in the Himalayan Foothills',
  aboutStorySubtitle: 'Crafting genuine, small-group mountain expeditions with verified mountain drivers, organic village homestays, and forest clearances.',
  aboutStoryContent: 'Baunduilla was born in the tea and river country of North Bengal and the Eastern Himalayas. We believe the mountains are meant to be experienced at a mindful pace—sipping fresh first-flush tea by the riverbanks, walking misty cardamom groves, and sharing fireside stories with Sherpa and Lepcha families.',
  footerTagline: 'Unforgettable treks, road trips, and curated group departures across North Bengal, Dooars, Sikkim, and the Himalayas.',
  copyrightText: 'Baunduilla Travel & Adventure Agency. All rights reserved.',
  themeAccent: 'baunduilla-emerald',
  showCategoryCarousel: true,
  showVerifiedTariff: true,
  showTestimonials: true,
  showBlogSection: true,
  showFaqSection: true,

  // Main Menu Action Buttons (Get A Hotel & Hire A Cab)
  hotelButtonText: 'Get A Hotel',
  hotelButtonUrl: 'https://wa.me/917872464356?text=Hello%20Baunduilla%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%20hotel%20or%20homestay.',
  hotelButtonEnabled: true,
  cabButtonText: 'Hire A Cab',
  cabButtonUrl: 'https://wa.me/917872464356?text=Hello%20Baunduilla%2C%20I%20would%20like%20to%20hire%20a%20cab%20or%20mountain%20taxi%20for%20my%20trip.',
  cabButtonEnabled: true,

  // Travel Experience Gallery Defaults
  galleryTitle: 'Travel Experience Gallery',
  gallerySubtitle: 'Sacred high-altitude temples, Himalayan peaks of Kinnaur and Garhwal, and living root bridges of Meghalaya.',
};

export const INITIAL_DESTINATIONS: Destination[] = [
  // 1. NORTH BENGAL & DOOARS
  {
    id: 'north-bengal',
    name: 'North Bengal & Dooars',
    slug: 'north-bengal',
    region: 'North Bengal',
    category: 'Forest',
    shortDescription: 'The lush gateway to Bhutan with dense Sal forests, one-horned rhinos, tea estates, and meandering river valleys.',
    fullOverview: 'The Dooars and North Bengal are the alluvial floodplains of Northeastern India that lie south of the outer foothills of the Himalayas. Teeming with dense national parks like Jaldapara, Gorumara, and Buxa Tiger Reserve, this region is ideal for wilderness enthusiasts, jungle safaris, birdwatching, and peaceful homestays amidst tea estates.',
    heroImage: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
    attractions: [
      {
        name: 'Jaldapara National Park',
        image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=600&q=80',
        description: 'Home to the largest population of the great Indian one-horned rhinoceros in West Bengal.'
      },
      {
        name: 'Buxa Fort & Tiger Reserve',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
        description: 'Historical trekking trail through dense moist deciduous forests and limestone cliffs.'
      },
      {
        name: 'Murti & Jhalong Riverbanks',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        description: 'Serene river valleys on the Indo-Bhutan border with migratory birds and quiet nature walks.'
      },
      {
        name: 'Gorumara Rhino Corridor',
        image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=600&q=80',
        description: 'Watchtowers overlooking salt licks where rhinos, gaur, and wild elephants assemble at dawn.'
      }
    ],
    bestTimeToVisit: 'October to May. (Forest sanctuaries remain closed during the annual monsoon breeding period from June 16 to September 15).',
    suggestedDuration: '4 to 6 Days',
    activities: ['Jeep and Elephant jungle safaris', 'Bird watching', 'Buxa hill trek & Jayanti riverbed walks', 'Tea factory tours', 'Village homestays'],
    approximateBudget: '₹11,500 - ₹18,000 per person',
    permitNotice: 'Forest safari permits are booked through the West Bengal Forest Development Corporation counters or government online portals.',
    published: true,
    featured: true,
    faqs: [
      {
        question: 'When is safari booking open in North Bengal?',
        answer: 'Safaris operate from mid-September to mid-June. Advance booking is recommended, especially for weekends and holiday seasons like Durga Puja and New Year.'
      }
    ]
  },

  // 2. MEGHALAYA
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    slug: 'meghalaya',
    region: 'Meghalaya',
    category: 'Hill',
    shortDescription: 'The Abode of the Clouds, featuring living root bridges, crystal-clear rivers, subterranean limestone caves, and roaring waterfalls.',
    fullOverview: 'Meghalaya offers an otherworldly landscape of mist-draped plateaus, dense subtropical rainforests, and unique Khasi and Jaintia tribal culture. Highlights include hiking down to the Double Decker Living Root Bridge in Nongriat, boating on the crystal transparent waters of Dawki Umngot river, and discovering hidden natural pools.',
    heroImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
    attractions: [
      {
        name: 'Double Decker Living Root Bridge',
        image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=600&q=80',
        description: 'Ancient bio-engineering marvel crafted from living rubber tree roots in Nongriat.'
      },
      {
        name: 'Dawki (Umngot River)',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        description: 'Famed transparent emerald waters where boats appear to float on glass.'
      },
      {
        name: 'Krang Suri & Nohkalikai Falls',
        image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
        description: 'Turquoise natural swimming pools and the tallest plunge waterfall in India.'
      },
      {
        name: 'Mawlynnong Clean Village',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        description: 'Renowned as Asia\'s cleanest village with bamboo skywalks and lush floral paths.'
      }
    ],
    bestTimeToVisit: 'October to April for trekking, caving, and clear rivers; July to September for dramatic full-flow monsoon waterfalls.',
    suggestedDuration: '5 to 7 Days',
    activities: ['Root bridge trekking', 'River cliff jumping and kayaking', 'Caving adventures', 'Village homestays in Mawlynnong', 'Waterfall photography'],
    approximateBudget: '₹17,000 - ₹26,000 per person ex-Guwahati',
    permitNotice: 'No special permits required for Indian travellers. Standard government ID required at checkpoints.',
    published: true,
    featured: true,
    faqs: [
      {
        question: 'How long is the hike to Nongriat double-decker bridge?',
        answer: 'The hike consists of approximately 3,500 stone stairs each way. It takes around 2 to 2.5 hours to descend and 3 to 3.5 hours to climb back.'
      }
    ]
  },

  // 3. ASSAM & KAZIRANGA
  {
    id: 'assam',
    name: 'Assam & Kaziranga',
    slug: 'assam',
    region: 'Assam',
    category: 'Forest',
    shortDescription: 'UNESCO World Heritage wildlands of Kaziranga, home to two-thirds of the world’s one-horned rhinos, heritage tea estates, and Brahmaputra cruises.',
    fullOverview: 'Assam is the green heart of Northeast India, defined by the mighty Brahmaputra river, sprawling emerald tea gardens, and world-renowned wildlife sanctuaries. Kaziranga National Park is celebrated worldwide for its successful conservation of the great Indian one-horned rhinoceros, alongside wild water buffalo, Asian elephants, and rich birdlife.',
    heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
    attractions: [
      {
        name: 'Kaziranga Safari Ranges (Kohora & Bagori)',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
        description: 'Prime safari zones offering close-up encounters with grazing one-horned rhinos and elephants.'
      },
      {
        name: 'Heritage Tea Estates & Tasting',
        image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=600&q=80',
        description: 'Historic colonial tea gardens producing world-renowned Assam black tea.'
      },
      {
        name: 'Brahmaputra River Sunset Cruise',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        description: 'Scenic cruise on India\'s mightiest river with chances to spot rare Gangetic freshwater dolphins.'
      },
      {
        name: 'Assam Orchid & Biodiversity Park',
        image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=600&q=80',
        description: 'Conservation haven housing over 500 species of wild native orchids and regional folk artifacts.'
      }
    ],
    bestTimeToVisit: 'November to April when the national park is dry and open for jeep and elephant safaris.',
    suggestedDuration: '4 to 6 Days',
    activities: ['Open jeep wildlife safaris', 'Assam tea tasting & factory tours', 'Brahmaputra sunset cruise', 'Orchid walks', 'Authentic Assamese cuisine'],
    approximateBudget: '₹14,000 - ₹22,000 per person ex-Guwahati',
    permitNotice: 'Safari permits are arranged in advance through the Assam Forest Department.',
    published: true,
    featured: true,
    faqs: [
      {
        question: 'When is Kaziranga National Park open?',
        answer: 'Kaziranga typically opens around late October / early November and closes for the monsoon season by May.'
      }
    ]
  },

  // 4. SIKKIM
  {
    id: 'sikkim',
    name: 'Sikkim',
    slug: 'sikkim',
    region: 'Sikkim',
    category: 'Hill',
    shortDescription: 'The mystical Himalayan wonderland of Kanchenjunga peaks, sacred high-altitude lakes, ancient Buddhist monasteries, and rhododendron valleys.',
    fullOverview: 'Bordered by Bhutan, Tibet, and Nepal, Sikkim is a Himalayan paradise crowned by Mt. Kanchenjunga (8,586 m). From the vibrant hill capital of Gangtok and sacred glacial waters of Tsomgo Lake and Gurudongmar (17,800 ft), to the floral carpet of Yumthang Valley and historic Silk Route passes, Sikkim offers majestic alpine serenity.',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
    attractions: [
      {
        name: 'Tsomgo Lake & Baba Mandir',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        description: 'Sacred glacial lake at 12,310 ft framed by rugged snowy peaks and prayer flags.'
      },
      {
        name: 'Gurudongmar Lake (17,800 ft)',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        description: 'One of the highest freshwater lakes in the world, sacred to Buddhists and Sikhs.'
      },
      {
        name: 'Yumthang Valley of Flowers',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
        description: 'Spectacular alpine grazing pasture surrounded by Himalayan peaks and hot springs.'
      },
      {
        name: 'Rumtek Monastery & Gangtok',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
        description: 'Historic seat of the Karma Kagyu lineage showcasing Tibetan Buddhist murals and artifacts.'
      }
    ],
    bestTimeToVisit: 'March to May for blooming rhododendrons; October to mid-December for crystal-clear Himalayan views.',
    suggestedDuration: '5 to 7 Days',
    activities: ['High-altitude glacial lake tours', 'Monastery cultural visits', 'Cable car rides in Gangtok', 'Hot spring baths in Yumthang', 'Himalayan sunrise viewing'],
    approximateBudget: '₹16,500 - ₹24,000 per person ex-Siliguri',
    permitNotice: 'Inner Line Permit (ILP) required for all travelers. Special protected area permits needed for Tsomgo Lake, Nathula Pass, and North Sikkim.',
    published: true,
    featured: true,
    faqs: [
      {
        question: 'Do I need special permits for North Sikkim and Nathula Pass?',
        answer: 'Yes, Indian tourists require Protected Area Permits (PAP) with valid photo ID and passport photos, which Baunduilla arranges on your behalf.'
      }
    ]
  },

  // 5. SHIMLA & HIMACHAL
  {
    id: 'shimla',
    name: 'Shimla & Himachal Hills',
    slug: 'shimla',
    region: 'Himachal Pradesh',
    category: 'Hill',
    shortDescription: 'The Queen of Hills with grand colonial architecture, pine-scented mountain ridges, snow-peaked viewpoints, and apple orchards.',
    fullOverview: 'Perched along the southwestern ranges of the Himalayas, Shimla is a classic mountain retreat with evergreen pine forests, historic British colonial architecture, and panoramic views of snow-dusted peaks. Beyond the bustling Mall Road and Christ Church, venture to Kufri, Fagu, and the tranquil apple country of Narkanda and Hatu Peak.',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    ],
    attractions: [
      {
        name: 'The Ridge & Mall Road',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        description: 'The cultural center of Shimla featuring the neo-Gothic Christ Church and sweeping valley vistas.'
      },
      {
        name: 'Jakhoo Peak & Ropeway',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
        description: 'Highest point in Shimla crowned with a 108 ft Hanuman statue amidst deodar woods.'
      },
      {
        name: 'Kufri Snow Viewpoint & Fagu',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        description: 'Scenic highland meadows offering horse rides, snow activities in winter, and clear mountain horizons.'
      },
      {
        name: 'Narkanda & Hatu Peak (11,152 ft)',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        description: 'Serene apple country with a panoramic 360-degree viewpoint of the Greater Himalayas.'
      }
    ],
    bestTimeToVisit: 'March to June for pleasant weather; December to February for winter snow.',
    suggestedDuration: '4 to 6 Days',
    activities: ['Heritage walking tours', 'Kufri & Fagu day trips', 'Hatu Peak nature hiking', 'Apple orchard walks', 'Himachal culinary exploration'],
    approximateBudget: '₹13,500 - ₹21,000 per person',
    permitNotice: 'No special permits required for Indian travellers. Standard government ID accepted at hotels.',
    published: true,
    featured: true,
    faqs: [
      {
        question: 'When is the best time for snow in Shimla?',
        answer: 'Snowfall is most likely between late December and early February in Shimla and nearby Kufri / Narkanda.'
      }
    ]
  }
];

export const INITIAL_PACKAGES: TourPackage[] = [
  // 1. NORTH BENGAL TOUR
  {
    id: 'north-bengal-wildlife-escape',
    title: 'Untamed North Bengal & Dooars Wildlife Tour',
    slug: 'untamed-north-bengal-dooars-tour',
    destinationId: 'north-bengal',
    destinationName: 'North Bengal & Dooars',
    shortDescription: 'Rhino safaris in Jaldapara, Gorumara elephant corridors, peaceful riverbank homestays, and Buxa tiger reserve trails.',
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 13500,
    currency: 'INR',
    travelStyle: 'Wildlife Safari',
    difficulty: 'Easy',
    tripType: 'Both',
    maxGroupSize: 10,
    highlights: [
      'Jeep and Elephant jungle safaris in Jaldapara',
      'Scenic Murti riverbank stays near Bhutan border',
      'Historic Buxa Fort nature trek and limestone cliffs',
      'Heritage North Bengal tea estate garden walks',
      'Experienced local naturalist guide included'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Siliguri / Hasimara & Transfer to Lataguri',
        description: 'Pickup from Siliguri / NJP Railway Station or Bagdogra Airport. Drive through lush tea estates into the peaceful forests of Lataguri. Evening briefing beside the Murti river.',
        stay: 'Jungle Resort, Lataguri',
        meals: 'Dinner'
      },
      {
        day: 2,
        title: 'Gorumara Watchtower Safari & Jhalong Riverbank',
        description: 'Early morning watchtower safari into Gorumara National Park to spot rhinos and wild elephants. Post breakfast, excursion to Jhalong and Bindu on the Indo-Bhutan border.',
        stay: 'Jungle Resort, Lataguri',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 3,
        title: 'Lataguri to Jaldapara & Afternoon Forest Safari',
        description: 'Drive to Jaldapara National Park. Check into forest lodge. Afternoon jeep safari across the riverine grasslands to witness one-horned rhinos, hog deer, and peacock flocks.',
        stay: 'Eco Forest Lodge, Jaldapara',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 4,
        title: 'Buxa Tiger Reserve & Historical Fort Hike',
        description: 'Full-day excursion to Buxa Tiger Reserve. Scenic hike up to historic Buxa Fort with panoramic views over the Bhutanese hills, followed by a walk across Jayanti riverbed pebbles.',
        stay: 'Eco Forest Lodge, Jaldapara',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 5,
        title: 'Morning Forest Walk & Return to Siliguri',
        description: 'Gentle morning birdwatching walk. After breakfast, transfer back to Siliguri / NJP Station or Bagdogra Airport for your onward journey.',
        meals: 'Breakfast'
      }
    ],
    inclusions: [
      '4 Nights comfortable resort/lodge accommodation',
      'Daily breakfast and dinner (fresh Bengali and Indian meals)',
      'All transfers in private vehicle from Siliguri/NJP',
      'Jeep safari entry fees and forest road tolls',
      'Dedicated local naturalist guide'
    ],
    exclusions: [
      'Train or flight tickets to/from Siliguri',
      'Camera permits inside forest watchtowers',
      'Personal expenses and tips'
    ],
    accommodationInfo: 'Comfortable eco-resorts with clean private bathrooms, green lawns, and peaceful forest surroundings in Lataguri and Jaldapara.',
    transportationInfo: 'Private AC/non-AC tourist vehicles (Innova / Scorpio / Bolero) depending on group size, with authorized open forest 4x4 gypsies for safaris.',
    mealsInfo: 'Freshly prepared vegetarian and non-vegetarian meals highlighting local North Bengal and Bengali specialties.',
    thingsToCarry: [
      'Earth-toned clothing (greens, khakis, browns) for safaris',
      'Comfortable walking shoes',
      'Original photo ID for forest permits',
      'Binoculars and camera with zoom lens',
      'Light jacket for morning and evening chill'
    ],
    departureDates: ['10 Nov 2026', '24 Nov 2026', '08 Dec 2026', '22 Dec 2026', '12 Jan 2027'],
    images: [
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    published: true,
    featured: true,
    isVerifiedPrice: true,
    createdAt: '2026-01-04T00:00:00.000Z'
  },

  // 2. MEGHALAYA TOUR
  {
    id: 'meghalaya-canyons',
    title: 'Meghalaya Living Roots & Canyons Expedition',
    slug: 'meghalaya-living-roots-canyons-expedition',
    destinationId: 'meghalaya',
    destinationName: 'Meghalaya',
    shortDescription: 'Trek to the double-decker living root bridge in Nongriat, boat on the transparent Dawki river, and discover turquoise canyon waterfalls.',
    durationDays: 6,
    durationNights: 5,
    pricePerPerson: 19800,
    currency: 'INR',
    travelStyle: 'Sightseeing',
    difficulty: 'Moderate',
    tripType: 'Both',
    maxGroupSize: 12,
    highlights: [
      'Hike down 3,500 stone steps to Nongriat Double Decker Root Bridge',
      'Boat on the famous glass-transparent waters of Dawki',
      'Swim in the natural turquoise lagoons of Krang Suri',
      'Explore Mawlynnong, Asia\'s cleanest village',
      'Gaze at the roaring Nohkalikai, India’s tallest plunge fall'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Guwahati to Shillong: The Scotland of the East',
        description: 'Warm welcome at Guwahati Airport / Station. Scenic climb past Umiam Lake into Shillong. Evening leisure stroll around Police Bazar and Ward\'s Lake.',
        stay: 'Boutique Hotel, Shillong',
        meals: 'Dinner'
      },
      {
        day: 2,
        title: 'Shillong to Cherrapunji (Sohra) & Waterfall Trail',
        description: 'Drive along mist-draped gorges to Cherrapunji. Visit Mawkdok Dympep Valley Viewpoint, Nohkalikai Falls, and the ancient limestone formations of Mawsmai Cave.',
        stay: 'Cliff View Resort, Cherrapunji',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 3,
        title: 'Nongriat Trek: Double Decker Root Bridge & Rainbow Falls',
        description: 'Descend 3,500 steps through lush subtropical jungle canopy into Nongriat village. Marvel at the living root bridges and continue to the stunning turquoise plunge pool of Rainbow Falls.',
        stay: 'Community Homestay, Nongriat or Cherrapunji Resort',
        meals: 'Breakfast, Lunch & Dinner'
      },
      {
        day: 4,
        title: 'Climb to Tyrna & Drive to Mawlynnong & Dawki',
        description: 'Ascend back from the canyon. Drive through border ridges to Mawlynnong (Asia\'s Cleanest Village). Continue to Dawki on the Indo-Bangladesh border for riverside camping.',
        stay: 'Riverside Camp / Homestay, Dawki / Shnongpdeng',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 5,
        title: 'Dawki Boating & Turquoise Waters of Krang Suri',
        description: 'Morning country boat ride on the crystal-clear Umngot river. Visit the magical Krang Suri waterfall with its turquoise swimming lagoon in the Jaintia Hills before returning to Shillong.',
        stay: 'Boutique Hotel, Shillong',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 6,
        title: 'Shillong to Guwahati Departure',
        description: 'After breakfast, descend to Guwahati. Optional visit to Kamakhya Temple before drop-off at Guwahati Airport with lifelong memories of Meghalaya.',
        meals: 'Breakfast'
      }
    ],
    inclusions: [
      '5 Nights accommodation in handpicked hotels, resorts, and homestays',
      'Breakfast and dinner throughout the expedition',
      'Private vehicle for all inter-city transfers and sightseeing',
      'Umngot River boat safari in Dawki',
      'Experienced Khasi local trail guide for Nongriat trek'
    ],
    exclusions: [
      'Flight or train tickets to Guwahati',
      'Adventure water sports (scuba/cliff jumping) at Dawki',
      'Personal laundry, beverages, and tips'
    ],
    accommodationInfo: 'Carefully chosen boutique hotels in Shillong, scenic cliff-facing resorts in Cherrapunji, and authentic riverside homestays/camps in Dawki.',
    transportationInfo: 'Comfortable private Innova or tempo traveler for mountain journeys.',
    mealsInfo: 'Delicious multi-cuisine meals including authentic local Khasi specialties and Indian dishes.',
    thingsToCarry: [
      'Sturdy trekking shoes with good grip for wet stairs',
      'Quick-dry clothing and light rain poncho',
      'Waterproof backpack cover and phone pouch',
      'Reusable water bottle',
      'Swimwear for natural swimming pools'
    ],
    departureDates: ['12 Nov 2026', '26 Nov 2026', '10 Dec 2026', '24 Dec 2026', '14 Jan 2027'],
    images: [
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    published: true,
    featured: true,
    isVerifiedPrice: true,
    createdAt: '2026-01-03T00:00:00.000Z'
  },

  // 3. ASSAM TOUR
  {
    id: 'assam-kaziranga-safari',
    title: 'Assam Kaziranga Rhino Safari & Tea Heritage Tour',
    slug: 'assam-kaziranga-wildlife-safari-tour',
    destinationId: 'assam',
    destinationName: 'Assam & Kaziranga',
    shortDescription: 'Open-jeep safaris in Kaziranga National Park to spot one-horned rhinos, heritage tea estate homestays, and Brahmaputra cruises.',
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 16500,
    currency: 'INR',
    travelStyle: 'Wildlife Safari',
    difficulty: 'Easy',
    tripType: 'Both',
    maxGroupSize: 10,
    highlights: [
      'Central and Western Range open-jeep safaris in Kaziranga',
      'Spectacular sightings of the endangered great Indian one-horned rhino',
      'Visit heritage colonial tea bungalows and tasting freshly plucked Assam orthodox tea',
      'Brahmaputra river sunset cruise with Gangetic river dolphin spotting',
      'Explore indigenous cultural artifacts at Assam Orchid Biodiversity Park'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Guwahati & Scenic Drive to Kaziranga',
        description: 'Welcome pickup at Guwahati Airport or Railway Station. Scenic 4.5-hour highway drive past paddy fields and foothills to Kaziranga. Check into your wildlife resort and enjoy evening folk dance.',
        stay: 'Jungle Heritage Resort, Kaziranga',
        meals: 'Dinner'
      },
      {
        day: 2,
        title: 'Central Range Jeep Safari & Orchid Biodiversity Walk',
        description: 'Morning open-top 4x4 safari in the Kohora (Central) Range, prime habitat for rhinos, wild buffaloes, and swamp deer. Afternoon visit to the Assam Orchid Park featuring over 500 indigenous orchid species.',
        stay: 'Jungle Heritage Resort, Kaziranga',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 3,
        title: 'Western Range Safari & Heritage Tea Plantation Tour',
        description: 'Head into the Bagori (Western) Range, celebrated for dense rhino congregations and birdlife. Later, tour a functioning historic tea factory and learn the art of black tea grading and brewing.',
        stay: 'Jungle Heritage Resort, Kaziranga',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 4,
        title: 'Transfer to Guwahati & Brahmaputra Sunset Cruise',
        description: 'Drive back to Guwahati. Check into your hotel. In the evening, board a scenic river vessel for a sunset cruise on the Brahmaputra with folk music and fresh tea.',
        stay: 'City Hotel, Guwahati',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 5,
        title: 'Kamakhya Temple Visit & Airport Departure',
        description: 'Morning visit to the historic hilltop Kamakhya Temple overlooking the Brahmaputra valley. Transfer to Guwahati Airport / Railway Station for departure.',
        meals: 'Breakfast'
      }
    ],
    inclusions: [
      '4 Nights accommodation in verified wildlife resorts and hotels',
      'Daily breakfast and dinner throughout the tour',
      '2 Open 4x4 Jeep Safaris in Kaziranga National Park',
      'Forest entry permits, guide fees, and vehicle toll charges',
      'Brahmaputra sunset cruise ticket'
    ],
    exclusions: [
      'Airfare or train tickets to/from Guwahati',
      'Camera fee levied by forest department',
      'Personal expenses, laundry, and tips'
    ],
    accommodationInfo: 'Beautifully landscaped nature resorts near Kaziranga National Park boundary with spacious rooms and authentic local hospitality.',
    transportationInfo: 'AC private vehicle for transfers between Guwahati and Kaziranga, with authorized open 4x4 Maruti Gypsies inside the park.',
    mealsInfo: 'Fresh, healthy traditional Assamese meals (including pitika, khar, local fish curry) alongside standard North Indian options.',
    thingsToCarry: [
      'Neutral-toned safari clothing',
      'Binoculars and telephoto camera lens',
      'Valid photo ID (Aadhaar or Passport) for safari permits',
      'Sun hat and UV protection sunglasses',
      'Light fleece for early morning open-top drives'
    ],
    departureDates: ['14 Nov 2026', '28 Nov 2026', '12 Dec 2026', '26 Dec 2026', '16 Jan 2027'],
    images: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    published: true,
    featured: true,
    isVerifiedPrice: true,
    createdAt: '2026-01-02T00:00:00.000Z'
  },

  // 4. SHIMLA TOUR
  {
    id: 'shimla-heritage-tour',
    title: 'Shimla, Kufri & Narkanda Mountain Tour',
    slug: 'shimla-kufri-narkanda-mountain-tour',
    destinationId: 'shimla',
    destinationName: 'Shimla & Himachal Hills',
    shortDescription: 'Historic British colonial ridge walks, panoramic Himalayan snow vistas at Kufri, and peaceful apple orchard trails in Narkanda.',
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 14800,
    currency: 'INR',
    travelStyle: 'Sightseeing',
    difficulty: 'Easy',
    tripType: 'Both',
    maxGroupSize: 12,
    highlights: [
      'Stroll along the historic pedestrian Ridge & Mall Road of Shimla',
      'Ascend to Jakhoo Peak via scenic mountain ropeway',
      'Panoramic Himalayan vistas and alpine activities at Kufri & Fagu',
      'Day excursion to Narkanda & Hatu Peak (11,152 ft) through apple orchards',
      'Stay in cozy hill cottages with warm Himachali hospitality'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Chandigarh / Kalka & Scenic Ascent to Shimla',
        description: 'Pickup from Chandigarh Airport / Kalka Railway Station. Scenic mountain drive climbing through deodar and pine forests into Shimla (2,205 m). Evening walk on the pedestrian Mall Road.',
        stay: 'Pine View Hotel, Shimla',
        meals: 'Dinner'
      },
      {
        day: 2,
        title: 'Shimla Heritage Walk: The Ridge, Christ Church & Jakhoo Peak',
        description: 'Morning guided heritage walk visiting Christ Church, Gaiety Theatre, and the Viceregal Lodge. Take the ropeway to Jakhoo Temple for panoramic mountain views over the town.',
        stay: 'Pine View Hotel, Shimla',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 3,
        title: 'Excursion to Kufri, Fagu & Mahasu Ridge',
        description: 'Drive to Kufri (2,630 m). Take horse or walking trails through cedar woods to Mahasu Peak. Enjoy panoramic views of the Badrinath and Pir Panjal ranges. Evening leisure time in Shimla.',
        stay: 'Pine View Hotel, Shimla',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 4,
        title: 'Day Trip to Narkanda & Hatu Peak (Panoramic Himalayan Views)',
        description: 'Early drive further into the higher mountains to Narkanda, the apple capital of Himachal. Hike or drive up to Hatu Peak (11,152 ft) for 360-degree snow-capped vistas. Return to Shimla.',
        stay: 'Pine View Hotel, Shimla',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 5,
        title: 'Scenic Descent to Chandigarh / Kalka Departure',
        description: 'After breakfast, leisurely drive down the Shivalik foothills to Chandigarh / Kalka for your return flight or train.',
        meals: 'Breakfast'
      }
    ],
    inclusions: [
      '4 Nights accommodation in verified 3-star standard pine-view hotels',
      'Daily breakfast and dinner (Himachali and North Indian cuisine)',
      'All transfers and sightseeing by private dedicated mountain cab (Dzire/Etios/Innova)',
      'Toll taxes, parking charges, and driver allowances',
      'Full guidance and route briefing from Siliguri operations desk'
    ],
    exclusions: [
      'Flight or train tickets to Chandigarh / Kalka',
      'Jakhoo ropeway tickets and horse ride charges at Kufri',
      'Personal expenses, laundry, and room heater charges if applicable'
    ],
    accommodationInfo: 'Charming mountain hotels with wooden paneling, private balconies offering valley views, and clean attached bathrooms.',
    transportationInfo: 'Private commercial tourist vehicle throughout the journey with seasoned mountain chauffeurs.',
    mealsInfo: 'Freshly prepared vegetarian and non-vegetarian buffet meals featuring North Indian favorites and local Himachali dham dishes.',
    thingsToCarry: [
      'Warm woollens, thermals, and windproof jacket (especially in winter)',
      'Comfortable walking shoes for uphill Mall Road strolls',
      'Lip balm, moisturiser, and sunglasses',
      'Government ID card for hotel check-ins'
    ],
    departureDates: ['18 Nov 2026', '02 Dec 2026', '16 Dec 2026', '30 Dec 2026', '18 Jan 2027'],
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    ],
    published: true,
    featured: true,
    isVerifiedPrice: true,
    createdAt: '2026-01-01T00:00:00.000Z'
  },

  // 5. SIKKIM TOUR
  {
    id: 'sikkim-glaciers-odyssey',
    title: 'Enchanting Sikkim: Gangtok, Tsomgo Lake & Alpine Valleys',
    slug: 'enchanting-sikkim-gangtok-tsomgo-tour',
    destinationId: 'sikkim',
    destinationName: 'Sikkim',
    shortDescription: 'High-altitude Tsomgo Lake, Baba Mandir, Rumtek monastery heritage walks, and sweeping Kanchenjunga mountain viewpoints.',
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 17500,
    currency: 'INR',
    travelStyle: 'Sightseeing',
    difficulty: 'Moderate',
    tripType: 'Both',
    maxGroupSize: 10,
    highlights: [
      'Excursion to high-altitude glacial Tsomgo Lake (12,310 ft) and Baba Mandir',
      'Panoramic Kanchenjunga views from Tashi Viewpoint & Ganesh Tok',
      'Spiritual heritage tour of Rumtek and Enchey Monasteries',
      'Stroll along the historic pedestrian MG Marg in Gangtok',
      'Dedicated mountain vehicle and licensed local guide throughout'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Siliguri / NJP & Scenic Drive to Gangtok',
        description: 'Warm pickup at NJP Railway Station / Bagdogra Airport. Scenic 4.5-hour climb along the emerald Teesta river into Gangtok (5,500 ft). Check into hotel and evening walk on MG Marg.',
        stay: 'Mountain View Hotel, Gangtok',
        meals: 'Dinner'
      },
      {
        day: 2,
        title: 'Tsomgo Lake (12,310 ft) & Baba Harbhajan Singh Mandir',
        description: 'Drive along high mountain curves to the sacred, crystal-clear Tsomgo Lake. Continue to historic Baba Mandir near the international border. Return to Gangtok.',
        stay: 'Mountain View Hotel, Gangtok',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 3,
        title: 'Gangtok Sightseeing: Rumtek Monastery, Ban Jhakri & Viewpoints',
        description: 'Full day city cultural exploration visiting Rumtek Monastery, Do Drul Chorten, Namgyal Institute of Tibetology, Ropeway ride, and Ban Jhakri waterfalls.',
        stay: 'Mountain View Hotel, Gangtok',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 4,
        title: 'Excursion to Namchi (Char Dham) & Temi Tea Garden',
        description: 'Day tour to South Sikkim. Walk through the scenic slopes of Temi Tea Estate (Sikkim’s only tea garden) and visit the majestic Siddheshwar Dham (Char Dham) in Namchi.',
        stay: 'Mountain View Hotel, Gangtok',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 5,
        title: 'Descent to Siliguri / NJP / Bagdogra Departure',
        description: 'After breakfast, leisurely descent through Teesta river valleys back to Siliguri / NJP Station or Bagdogra Airport with unforgettable Himalayan memories.',
        meals: 'Breakfast'
      }
    ],
    inclusions: [
      '4 Nights accommodation in verified comfortable mountain hotels in Gangtok',
      'Daily breakfast and dinner (fresh home-style meals)',
      'All transfers and sightseeing by dedicated private vehicle',
      'Inner-Line Permits and Tsomgo Lake passes arrangement',
      'Experienced local mountain driver and 24x7 travel assistance'
    ],
    exclusions: [
      'Airfare or train tickets to Siliguri / NJP',
      'Optional Nathula Pass permit fee (subject to army clearance)',
      'Personal laundry, beverages, and tips'
    ],
    accommodationInfo: 'Handpicked mountain hotels offering heated blankets, hot water, and panoramic valley views close to MG Marg.',
    transportationInfo: 'Comfortable private mountain vehicles (Innova / Scorpio / Xylo) with experienced hill drivers.',
    mealsInfo: 'Fresh multi-cuisine meals including local Tibetan and Sikkimese dishes (momos, thukpa) and North Indian food.',
    thingsToCarry: [
      'Warm jackets, thermal innerwear, gloves, and woolen caps',
      'Original Voter ID or Passport + 4 passport photos for permits',
      'Comfortable walking shoes',
      'Lip balm, moisturizers, and sunglasses'
    ],
    departureDates: ['15 Nov 2026', '29 Nov 2026', '13 Dec 2026', '27 Dec 2026', '17 Jan 2027'],
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    published: true,
    featured: true,
    isVerifiedPrice: true,
    createdAt: '2026-01-05T00:00:00.000Z'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'north-bengal-ultimate-guide',
    title: 'The Untamed Dooars & North Bengal: Exploring the Gateway to the Himalayas',
    slug: 'north-bengal-dooars-ultimate-guide',
    excerpt: 'Everything you need to know about planning safaris in Jaldapara, exploring the Buxa Tiger Reserve, and relaxing by the Murti river.',
    content: `The Dooars region in North Bengal is one of India's most underrated wildlife corridors. Nestled at the foothills of Bhutan and the Eastern Himalayas, it offers dense tropical rainforests, roaring tea garden streams, and close encounters with the great Indian one-horned rhinoceros.

### 1. Jaldapara & Gorumara Safaris
The morning mist breaks as you ride an open Jeep through tall elephant grass, waiting for a glimpse of the great Indian one-horned rhino. Jaldapara National Park holds the second-largest rhino population in India after Kaziranga.

* **Best Time:** Safaris operate between mid-September and mid-June. They remain closed during the annual monsoon breeding season.
* **Permits:** Book safari slots at least 2 weeks in advance during peak festival holidays.

### 2. Buxa Tiger Reserve & Historical Fort
For those who enjoy combining history with nature, the gentle trek up to Buxa Fort from Santalabari is a rewarding half-day excursion. Surrounded by limestone hills, the fort holds colonial memories and panoramic views of the Bengal plains.`,
    coverImage: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-15',
    author: {
      name: 'Sourav',
      role: 'Siliguri Expedition Lead',
      avatar: ''
    },
    category: 'Travel Guides',
    readTime: '5 min read',
    tags: ['North Bengal', 'Dooars', 'Wildlife', 'Jaldapara'],
    published: true
  },
  {
    id: 'meghalaya-hidden-trails',
    title: 'Meghalaya Beyond Living Root Bridges: Hidden Waterfalls & Deep Canyons',
    slug: 'meghalaya-hidden-trails',
    excerpt: 'Step off the tourist trail in Meghalaya to find pristine turquoise swimming pools, limestone caves, and serene Khasi homestays.',
    content: `While everyone knows about Cherrapunji and the double-decker root bridge of Nongriat, Meghalaya hides hundreds of untouched canyons and crystal streams.

### 1. The Umngot River Experience
Dawki’s fame is well-deserved: when sunlight strikes the clear riverbed, wooden boats appear to float on pure glass. For a quieter experience, head to neighboring Shnongpdeng village for riverside camping and cliff jumping.

### 2. Caving in the Jaintia Hills
Meghalaya houses some of the longest and deepest cave systems in South Asia. Exploring Mawsmai and Krem Liat Prah with headlamps and local guides provides an unforgettable spelunking adventure.`,
    coverImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-18',
    author: {
      name: 'Wanbha',
      role: 'Khasi Canyon Specialist',
      avatar: ''
    },
    category: 'Trekking',
    readTime: '6 min read',
    tags: ['Meghalaya', 'Living Root Bridges', 'Dawki', 'Caving'],
    published: true
  },
  {
    id: 'assam-kaziranga-guide',
    title: 'The Wild Heart of Assam: First-Timer\'s Guide to Kaziranga National Park',
    slug: 'assam-kaziranga-safari-guide',
    excerpt: 'How to plan safari zones, book morning jeep drives, and savor authentic Assam tea heritage.',
    content: `Kaziranga National Park is a UNESCO World Heritage site known as the primary sanctuary for the great Indian one-horned rhinoceros. Covering sprawling marshes along the Brahmaputra, it offers world-class wildlife safaris.

### Safari Zones: Kohora vs Bagori
* **Central Range (Kohora):** Famous for dense wildlife concentration and wetland bird viewing.
* **Western Range (Bagori):** Known for open grassland terrain with frequent, close-up rhino sightings.`,
    coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-20',
    author: {
      name: 'Baunduilla Wildlife Team',
      role: 'Expedition Coordinators',
      avatar: ''
    },
    category: 'Northeast India',
    readTime: '5 min read',
    tags: ['Assam', 'Kaziranga', 'Rhino Safari', 'Brahmaputra'],
    published: true
  },
  {
    id: 'shimla-narkanda-guide',
    title: 'Shimla Beyond The Mall Road: High Ridges of Kufri & Narkanda',
    slug: 'shimla-kufri-narkanda-guide',
    excerpt: 'Escape the crowds of Shimla to discover apple orchards, Hatu Peak panoramas, and peaceful pine trails in Himachal.',
    content: `While Shimla’s colonial architecture on The Ridge is iconic, the real mountain peace begins as you travel higher along the Hindustan-Tibet road towards Narkanda.

### 1. Hatu Peak Summit
At 11,152 ft, Hatu Peak provides breathtaking 360-degree views of the snow-clad Greater Himalayas. Surrounded by dense deodar and spruce forests, it is one of Himachal\'s most scenic short day-hikes.

### 2. Kufri & Fagu Ridges
Kufri and Fagu offer panoramic viewpoints looking across deep terraced valleys. In winter, these ridges turn into snow playgrounds.`,
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-22',
    author: {
      name: 'Himachal Operations',
      role: 'Mountain Guide Lead',
      avatar: ''
    },
    category: 'Travel Guides',
    readTime: '5 min read',
    tags: ['Shimla', 'Himachal', 'Narkanda', 'Kufri'],
    published: true
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    customerName: 'Anirban & Priyanka Sen',
    location: 'Kolkata, West Bengal',
    rating: 5,
    tripName: 'Untamed North Bengal & Dooars Wildlife Tour',
    review: 'The Dooars trip planned by Baunduilla was exceptional! Spotting rhinos in Jaldapara and the peaceful stays by the Murti river made it unforgettable. Very caring local team based in Siliguri.',
    date: 'October 2026',
    isDemoSample: true
  },
  {
    id: 'test-2',
    customerName: 'Rohit Kulkarni',
    location: 'Pune, Maharashtra',
    rating: 5,
    tripName: 'Meghalaya Living Roots & Canyons Expedition',
    review: 'Hiking down to Nongriat’s double-decker root bridge was a dream come true. The boat ride on Dawki with Baunduilla was seamless and so well organized.',
    date: 'September 2026',
    isDemoSample: true
  },
  {
    id: 'test-3',
    customerName: 'Sneha & Amit Sharma',
    location: 'Delhi NCR',
    rating: 5,
    tripName: 'Assam Kaziranga Rhino Safari Tour',
    review: 'Kaziranga was breathtaking! We saw five rhinos and wild elephants on our first morning jeep safari. The tea estate stay was serene and authentic.',
    date: 'October 2026',
    isDemoSample: true
  },
  {
    id: 'test-4',
    customerName: 'Deepak Verma',
    location: 'Chandigarh',
    rating: 5,
    tripName: 'Shimla, Kufri & Narkanda Mountain Tour',
    review: 'Baunduilla’s recommendation to stay up in Narkanda instead of crowded town hotels was brilliant. Hatu Peak views were outstanding!',
    date: 'October 2026',
    isDemoSample: true
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    question: 'Where is Baunduilla located?',
    answer: 'We are based in North Bengal (Ward No 15, Gobinda Pally Road, Dhupguri), the gateway to Dooars and the Eastern Himalayas, with local mountain captains across Northeast India and Himachal Pradesh.',
    category: 'General'
  },
  {
    question: 'How do I book a tour package?',
    answer: 'You can request any tour package by clicking "Inquire / Book Slot", chatting directly with our Siliguri desk on WhatsApp, or submitting our Plan My Trip questionnaire. We confirm availability and route clearances before you make any payment.',
    category: 'Booking'
  },
  {
    question: 'What are the group sizes for your tours?',
    answer: 'We specialize in small group departures of 8 to 12 travelers to ensure comfort, environmental safety, and personal attention. We also arrange private, customized family expeditions.',
    category: 'Travel Style'
  },
  {
    question: 'Are safari and forest permits included in the package?',
    answer: 'Yes! All government forest entry permits, guide fees, and safari vehicle allocations for North Bengal (Jaldapara/Gorumara) and Assam (Kaziranga) are managed by our team.',
    category: 'Permits'
  }
];

export const INITIAL_REGIONS: RegionCategory[] = [
  {
    id: 'region-north-bengal',
    name: 'North Bengal',
    slug: 'north-bengal',
    description: 'Lush tea estates, dense rhino sanctuaries like Jaldapara & Gorumara, and sub-Himalayan floodplains.',
    heroImage: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
    badge: 'Wildlife & Tea Estates',
    featured: true,
    order: 1
  },
  {
    id: 'region-assam',
    name: 'Assam',
    slug: 'assam',
    description: 'UNESCO World Heritage wildlands of Kaziranga, prime tea estates, and Brahmaputra river cruises.',
    heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    badge: 'Rhino Safaris & Tea',
    featured: true,
    order: 2
  },
  {
    id: 'region-sikkim',
    name: 'Sikkim',
    slug: 'sikkim',
    description: 'Pristine alpine lakes, ancient Buddhist monasteries, Kanchenjunga panoramas, and high-altitude passes.',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    badge: 'Himalayan Vistas',
    featured: true,
    order: 3
  },
  {
    id: 'region-meghalaya',
    name: 'Meghalaya',
    slug: 'meghalaya',
    description: 'Living root bridges of Nongriat, crystal-clear Dawki waters, and roaring canyon waterfalls.',
    heroImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    badge: 'Abode of Clouds',
    featured: true,
    order: 4
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-super-admin-primary',
    name: 'Tapabrata Dey Sarkar',
    email: 'tapabratadeysarkar961@gmail.com',
    password: 'admin',
    role: 'super_admin',
    isPrimarySuperAdmin: true,
    status: 'active',
    allowedModules: ['overview', 'inquiries', 'packages', 'destinations', 'regions', 'blog', 'settings', 'users'],
    canDeleteContent: true,
    canPublishContent: true,
    avatar: '',
    phone: '+91 78724 64356',
    department: 'Executive Operations & Ownership',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLoginAt: '2026-10-27T03:00:00.000Z'
  },
  {
    id: 'user-devoloper',
    name: 'Devoloper',
    email: 'devoloper@baunduilla.com',
    password: 'admin',
    role: 'super_admin',
    isPrimarySuperAdmin: false,
    status: 'active',
    allowedModules: ['overview', 'inquiries', 'packages', 'destinations', 'regions', 'blog', 'settings', 'users'],
    canDeleteContent: true,
    canPublishContent: true,
    avatar: '',
    phone: '+91 78724 64356',
    department: 'Lead Developer & Website Layout Architecture',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLoginAt: '2026-10-27T03:20:00.000Z'
  },
  {
    id: 'user-baunduilla-owner',
    name: 'Baunduilla Admin Desk',
    email: 'contact.baunduilla@gmail.com',
    password: 'admin',
    role: 'super_admin',
    isPrimarySuperAdmin: true,
    status: 'active',
    allowedModules: ['overview', 'inquiries', 'packages', 'destinations', 'regions', 'gallery', 'blog', 'settings', 'users'],
    canDeleteContent: true,
    canPublishContent: true,
    avatar: '',
    phone: '+91 78724 64356',
    department: 'Siliguri Central Office',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLoginAt: '2026-10-27T02:45:00.000Z'
  },
  {
    id: 'user-operations-lead',
    name: 'Rohan Sharma',
    email: 'coordinator@baunduilla.com',
    password: 'coordinator123',
    role: 'manager',
    isPrimarySuperAdmin: false,
    status: 'active',
    allowedModules: ['overview', 'inquiries'],
    canDeleteContent: false,
    canPublishContent: true,
    avatar: '',
    phone: '+91 98300 11223',
    department: 'Customer Inquiries & WhatsApp Operations',
    createdAt: '2026-02-15T00:00:00.000Z',
    lastLoginAt: '2026-10-26T14:30:00.000Z'
  },
  {
    id: 'user-tours-lead',
    name: 'Ananya Sen',
    email: 'tours@baunduilla.com',
    password: 'tours123',
    role: 'manager',
    isPrimarySuperAdmin: false,
    status: 'active',
    allowedModules: ['overview', 'packages', 'destinations', 'regions', 'gallery'],
    canDeleteContent: true,
    canPublishContent: true,
    avatar: '',
    phone: '+91 98300 44556',
    department: 'Tours & Destination Catalog',
    createdAt: '2026-03-01T00:00:00.000Z',
    lastLoginAt: '2026-10-25T17:10:00.000Z'
  },
  {
    id: 'user-content-editor',
    name: 'Priyanka Roy',
    email: 'editor@baunduilla.com',
    password: 'editor123',
    role: 'editor',
    isPrimarySuperAdmin: false,
    status: 'active',
    allowedModules: ['overview', 'gallery', 'blog'],
    canDeleteContent: false,
    canPublishContent: true,
    avatar: '',
    phone: '+91 98300 77889',
    department: 'Travel Stories & Field Blog',
    createdAt: '2026-04-10T00:00:00.000Z',
    lastLoginAt: '2026-10-24T11:00:00.000Z'
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-suvankar-paul',
    name: 'Suvankar Paul',
    role: '',
    photo: '',
    bio: 'Passionate explorer and wilderness planner deeply connected to the trails of North Bengal and Sikkim. Dedicated to crafting mindful, safe, and culturally immersive journeys for travelers seeking authentic mountain experiences.',
    order: 1
  },
  {
    id: 'team-pritam-bose',
    name: 'Pritam Bose',
    role: '',
    photo: '',
    bio: 'Adventurer and logistics specialist with extensive experience across high-altitude roads, forest safaris, and offbeat Himalayan circuits. Committed to seamless route coordination and personalized guest hospitality.',
    order: 2
  },
  {
    id: 'team-tapabrata-dey-sarkar',
    name: 'Tapabrata Dey Sarkar',
    role: '',
    photo: '',
    bio: 'Avid nature enthusiast and community coordinator rooted in the Himalayan foothills. Focused on sustainable travel, local homestay partnerships, and ensuring every expedition leaves a lasting, positive memory.',
    order: 3
  }
];

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'yulla-kanda-temple',
    title: 'Yulla Kanda Temple',
    location: 'Kinnaur, Himachal Pradesh',
    tag: 'Sacred Glacial Lake (3,895m)',
    src: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    description: 'High-altitude holy lake in Ropa Valley, Kinnaur, revered for having the world\'s highest Krishna shrine.',
    order: 1
  },
  {
    id: 'tungnath-temple',
    title: 'Tungnath Temple',
    location: 'Chopta, Uttarakhand',
    tag: 'Highest Shiva Temple (3,680m)',
    src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    description: 'The highest Shiva shrine in the world, surrounded by alpine bugyals and majestic snow-clad peaks.',
    order: 2
  },
  {
    id: 'chandrashila-summit',
    title: 'Chandrashila Summit',
    location: 'Garhwal Himalayas, Uttarakhand',
    tag: 'Moon Rock Peak (4,000m)',
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    description: 'Panoramic 360-degree vista of Nanda Devi, Trishul, and Chaukhamba summits at sunrise.',
    order: 3
  },
  {
    id: 'madhyamaheswar-temple',
    title: 'Madhyamaheswar Temple',
    location: 'Mansuna, Uttarakhand',
    tag: 'Panch Kedar Shrine',
    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    description: 'Ancient fourth Panch Kedar temple nestled in a lush alpine meadow overlooked by snow peaks.',
    order: 4
  },
  {
    id: 'kedarnath-temple',
    title: 'Kedarnath Temple',
    location: 'Garhwal Himalayas, Uttarakhand',
    tag: 'Himalayan Dham (3,583m)',
    src: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    description: 'Revered ancient stone shrine standing beneath the towering Kedarnath range and glacial valleys.',
    order: 5
  },
  {
    id: 'double-decker-root-bridge',
    title: 'Double Decker Living Root Bridge',
    location: 'Nongriat, Meghalaya',
    tag: 'Cherrapunji Rainforest',
    src: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    description: 'Centuries-old bio-engineering marvel grown by Khasi tribes across roaring mountain streams.',
    order: 6
  }
];


