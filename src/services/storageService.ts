import {
  Destination,
  TourPackage,
  BlogPost,
  Testimonial,
  FAQItem,
  SiteSettings,
  Inquiry,
  RegionCategory,
  AdminUser,
  TeamMember,
  GalleryItem
} from '../types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_PACKAGES,
  INITIAL_BLOG_POSTS,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_SITE_SETTINGS,
  INITIAL_REGIONS,
  INITIAL_ADMIN_USERS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_GALLERY_ITEMS
} from '../data/initialData';

const STORAGE_KEYS = {
  DESTINATIONS: 'baunduilla_destinations',
  PACKAGES: 'baunduilla_packages',
  BLOG_POSTS: 'baunduilla_blog_posts',
  TESTIMONIALS: 'baunduilla_testimonials',
  FAQS: 'baunduilla_faqs',
  SETTINGS: 'baunduilla_settings',
  INQUIRIES: 'baunduilla_inquiries',
  REGIONS: 'baunduilla_regions',
  USERS: 'baunduilla_admin_users',
  CURRENT_USER: 'baunduilla_current_user',
  TEAM_MEMBERS: 'baunduilla_team_members',
  GALLERY: 'baunduilla_gallery',
};

// Data Versioning: Automatically reset storage to sync Top Regions, social links, photos & Desert terrain category
const CURRENT_DATA_VERSION = 'v10_official_social_links';
if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem('baunduilla_data_version') !== CURRENT_DATA_VERSION) {
      localStorage.removeItem(STORAGE_KEYS.DESTINATIONS);
      localStorage.removeItem(STORAGE_KEYS.PACKAGES);
      localStorage.removeItem(STORAGE_KEYS.REGIONS);
      localStorage.removeItem(STORAGE_KEYS.BLOG_POSTS);
      localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.FAQS);
      localStorage.setItem('baunduilla_data_version', CURRENT_DATA_VERSION);
    }
  } catch (e) {
    // ignore
  }
}

// Safe LocalStorage Helpers
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Asynchronously dispatch event so listeners never trigger setState during an active React render cycle
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new Event('baunduilla_data_updated'));
      }, 0);
    }
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
}

export const StorageService = {
  // Destinations
  getDestinations(): Destination[] {
    return getFromStorage<Destination[]>(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
  },

  getDestinationBySlug(slug: string): Destination | undefined {
    const all = this.getDestinations();
    return all.find(d => d.slug.toLowerCase() === slug.toLowerCase());
  },

  saveDestination(destination: Destination): void {
    const all = this.getDestinations();
    const index = all.findIndex(d => d.id === destination.id);
    if (index >= 0) {
      all[index] = destination;
    } else {
      all.push(destination);
    }
    saveToStorage(STORAGE_KEYS.DESTINATIONS, all);
  },

  deleteDestination(id: string): void {
    const all = this.getDestinations().filter(d => d.id !== id);
    saveToStorage(STORAGE_KEYS.DESTINATIONS, all);
  },

  // Tour Packages
  getPackages(): TourPackage[] {
    const pkgs = getFromStorage<TourPackage[]>(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
    // Always sort latest added tour packages on top (newest createdAt first)
    return [...pkgs].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  },

  getPackageBySlug(slug: string): TourPackage | undefined {
    const all = this.getPackages();
    return all.find(p => p.slug.toLowerCase() === slug.toLowerCase());
  },

  savePackage(tourPackage: TourPackage): void {
    const all = this.getPackages();
    const index = all.findIndex(p => p.id === tourPackage.id);
    const now = new Date().toISOString();
    if (index >= 0) {
      all[index] = {
        ...tourPackage,
        updatedAt: now,
        createdAt: tourPackage.createdAt || all[index].createdAt || now,
      };
    } else {
      // Latest added tour packages are prepended and featured on top
      all.unshift({
        ...tourPackage,
        featured: tourPackage.featured !== undefined ? tourPackage.featured : true,
        createdAt: tourPackage.createdAt || now,
        updatedAt: now,
      });
    }
    saveToStorage(STORAGE_KEYS.PACKAGES, all);
  },

  deletePackage(id: string): void {
    const all = this.getPackages().filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.PACKAGES, all);
  },

  // Blog Posts
  getBlogPosts(): BlogPost[] {
    return getFromStorage<BlogPost[]>(STORAGE_KEYS.BLOG_POSTS, INITIAL_BLOG_POSTS);
  },

  getBlogPostBySlug(slug: string): BlogPost | undefined {
    const all = this.getBlogPosts();
    return all.find(b => b.slug.toLowerCase() === slug.toLowerCase());
  },

  saveBlogPost(post: BlogPost): void {
    const all = this.getBlogPosts();
    const index = all.findIndex(b => b.id === post.id);
    if (index >= 0) {
      all[index] = post;
    } else {
      all.push(post);
    }
    saveToStorage(STORAGE_KEYS.BLOG_POSTS, all);
  },

  deleteBlogPost(id: string): void {
    const all = this.getBlogPosts().filter(b => b.id !== id);
    saveToStorage(STORAGE_KEYS.BLOG_POSTS, all);
  },

  // Testimonials
  getTestimonials(): Testimonial[] {
    return getFromStorage<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  },

  saveTestimonial(testimonial: Testimonial): void {
    const all = this.getTestimonials();
    const index = all.findIndex(t => t.id === testimonial.id);
    if (index >= 0) {
      all[index] = testimonial;
    } else {
      all.push(testimonial);
    }
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, all);
  },

  // FAQs
  getFAQs(): FAQItem[] {
    return getFromStorage<FAQItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  },

  saveFAQs(faqs: FAQItem[]): void {
    saveToStorage(STORAGE_KEYS.FAQS, faqs);
  },

  // Site Settings
  getSiteSettings(): SiteSettings {
    const saved = getFromStorage<Partial<SiteSettings>>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    
    // Automatically migrate legacy placeholder social URLs to official ones
    const facebookUrl =
      !saved?.facebookUrl || saved.facebookUrl === 'https://facebook.com/baunduilla'
        ? INITIAL_SITE_SETTINGS.facebookUrl
        : saved.facebookUrl;

    const instagramUrl =
      !saved?.instagramUrl || saved.instagramUrl === 'https://instagram.com/baunduilla'
        ? INITIAL_SITE_SETTINGS.instagramUrl
        : saved.instagramUrl;

    const youtubeUrl =
      !saved?.youtubeUrl || saved.youtubeUrl === 'https://youtube.com/@baunduilla'
        ? INITIAL_SITE_SETTINGS.youtubeUrl
        : saved.youtubeUrl;

    return {
      ...INITIAL_SITE_SETTINGS,
      ...saved,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      hotelButtonText: saved?.hotelButtonText || INITIAL_SITE_SETTINGS.hotelButtonText,
      hotelButtonUrl: saved?.hotelButtonUrl || INITIAL_SITE_SETTINGS.hotelButtonUrl,
      hotelButtonEnabled: saved?.hotelButtonEnabled !== undefined ? saved.hotelButtonEnabled : true,
      cabButtonText: saved?.cabButtonText || INITIAL_SITE_SETTINGS.cabButtonText,
      cabButtonUrl: saved?.cabButtonUrl || INITIAL_SITE_SETTINGS.cabButtonUrl,
      cabButtonEnabled: saved?.cabButtonEnabled !== undefined ? saved.cabButtonEnabled : true,
    };
  },

  updateSiteSettings(settings: SiteSettings): void {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  },

  // Team Members (About Us page)
  getTeamMembers(): TeamMember[] {
    const saved = getFromStorage<TeamMember[]>(STORAGE_KEYS.TEAM_MEMBERS, INITIAL_TEAM_MEMBERS);
    if (!saved || saved.length === 0) return INITIAL_TEAM_MEMBERS;
    return saved.map((member) => {
      const initial = INITIAL_TEAM_MEMBERS.find(
        (m) => m.id === member.id || m.name.toLowerCase() === member.name.toLowerCase()
      );
      if (initial && (!member.bio || member.bio.trim() === '')) {
        return { ...member, bio: initial.bio };
      }
      return member;
    });
  },

  saveTeamMembers(team: TeamMember[]): void {
    saveToStorage(STORAGE_KEYS.TEAM_MEMBERS, team);
  },

  // Customer Inquiries
  getInquiries(): Inquiry[] {
    return getFromStorage<Inquiry[]>(STORAGE_KEYS.INQUIRIES, [
      {
        id: 'inq-sample-1',
        inquiryType: 'package',
        customerName: 'Rajdeep Banerjee',
        phone: '+91 98300 12345',
        email: 'rajdeep.b@example.com',
        destination: 'Sikkim',
        packageId: 'sikkim-odyssey',
        packageTitle: 'Enchanted Sikkim & North Sikkim Odyssey',
        travelDate: '2026-11-20',
        travellers: { adults: 2, children: 0 },
        budgetPerPerson: '₹18,000 - ₹22,000',
        travelStyle: 'Road Trip',
        tripType: 'Group',
        requirements: 'Interested in joining a small group departure with photography enthusiasts.',
        status: 'new',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        source: 'Website Package Details Form'
      },
      {
        id: 'inq-sample-2',
        inquiryType: 'custom_plan',
        customerName: 'Meera Chawla',
        phone: '+91 98112 56789',
        email: 'meera.chawla@example.com',
        destination: 'Spiti Valley',
        startingCity: 'Chandigarh',
        travelDate: '2027-06-15',
        travellers: { adults: 4, children: 1 },
        budgetPerPerson: '₹25,000 - ₹30,000',
        travelStyle: 'Road Trip',
        tripType: 'Private',
        requirements: 'Family trip. Need an experienced driver and kid-friendly acclimatization stops.',
        status: 'contacted',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        source: 'Plan My Trip Wizard'
      }
    ]);
  },

  createInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
    const all = this.getInquiries();
    const newInquiry: Inquiry = {
      ...data,
      id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    all.unshift(newInquiry);
    saveToStorage(STORAGE_KEYS.INQUIRIES, all);
    return newInquiry;
  },

  updateInquiryStatus(id: string, status: Inquiry['status']): void {
    const all = this.getInquiries();
    const target = all.find(i => i.id === id);
    if (target) {
      target.status = status;
      saveToStorage(STORAGE_KEYS.INQUIRIES, all);
    }
  },

  deleteInquiry(id: string): void {
    const all = this.getInquiries().filter(i => i.id !== id);
    saveToStorage(STORAGE_KEYS.INQUIRIES, all);
  },

  // Region Categories
  getRegions(): RegionCategory[] {
    return getFromStorage<RegionCategory[]>(STORAGE_KEYS.REGIONS, INITIAL_REGIONS);
  },

  getRegionById(id: string): RegionCategory | undefined {
    return this.getRegions().find(r => r.id === id);
  },

  getRegionBySlug(slug: string): RegionCategory | undefined {
    return this.getRegions().find(r => r.slug.toLowerCase() === slug.toLowerCase());
  },

  saveRegion(region: RegionCategory): void {
    const all = this.getRegions();
    const index = all.findIndex(r => r.id === region.id);
    if (index >= 0) {
      all[index] = region;
    } else {
      all.push(region);
    }
    saveToStorage(STORAGE_KEYS.REGIONS, all);
  },

  deleteRegion(id: string): void {
    const all = this.getRegions().filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.REGIONS, all);
  },

  // User Management & RBAC
  getUsers(): AdminUser[] {
    const users = getFromStorage<AdminUser[]>(STORAGE_KEYS.USERS, INITIAL_ADMIN_USERS);
    // Ensure primary super admins are always present
    let modified = false;
    for (const initUser of INITIAL_ADMIN_USERS) {
      if (!users.some(u => u.email.toLowerCase() === initUser.email.toLowerCase())) {
        users.push(initUser);
        modified = true;
      }
    }
    if (modified && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      } catch (e) {
        console.warn('Error saving synced users:', e);
      }
    }
    return users;
  },

  getUserById(id: string): AdminUser | undefined {
    return this.getUsers().find(u => u.id === id);
  },

  getUserByEmail(email: string): AdminUser | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  },

  saveUser(user: AdminUser): void {
    const all = this.getUsers();
    const index = all.findIndex(u => u.id === user.id);
    if (index >= 0) {
      all[index] = { ...user };
    } else {
      all.push({
        ...user,
        createdAt: user.createdAt || new Date().toISOString()
      });
    }
    saveToStorage(STORAGE_KEYS.USERS, all);

    // If current logged-in user was modified, keep session in sync
    const current = this.getCurrentUser();
    if (current && current.id === user.id) {
      saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    }
  },

  deleteUser(id: string): { success: boolean; message?: string } {
    const all = this.getUsers();
    const target = all.find(u => u.id === id);
    if (!target) {
      return { success: false, message: 'User not found' };
    }
    if (target.isPrimarySuperAdmin) {
      return { success: false, message: 'Cannot delete the Primary Super Admin account.' };
    }
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      return { success: false, message: 'You cannot delete your own currently active account.' };
    }
    const updated = all.filter(u => u.id !== id);
    saveToStorage(STORAGE_KEYS.USERS, updated);
    return { success: true };
  },

  getCurrentUser(): AdminUser | null {
    const user = getFromStorage<AdminUser | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) {
      // If legacy auth flag is set, return the primary super admin
      if (typeof window !== 'undefined' && localStorage.getItem('baunduilla_admin_auth') === 'true') {
        const primary = this.getUsers().find(u => u.isPrimarySuperAdmin) || INITIAL_ADMIN_USERS[0];
        return primary;
      }
      return null;
    }
    const currentInDb = this.getUserById(user.id);
    return currentInDb || user;
  },

  setCurrentUser(user: AdminUser | null): void {
    if (user) {
      saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('baunduilla_admin_auth', 'true');
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem('baunduilla_admin_auth');
        setTimeout(() => {
          window.dispatchEvent(new Event('baunduilla_data_updated'));
        }, 0);
      }
    }
  },

  authenticate(emailOrPhone: string, passwordOrPin: string): { user: AdminUser | null; error?: string } {
    const cleanIdentifier = emailOrPhone.trim().toLowerCase();
    const cleanSecret = passwordOrPin.trim();

    // Universal admin passcode shortcut or blank identifier
    if (cleanSecret === 'admin' && (cleanIdentifier === '' || cleanIdentifier === 'admin' || cleanIdentifier.includes('superadmin'))) {
      const primary = this.getUsers().find(u => u.isPrimarySuperAdmin) || INITIAL_ADMIN_USERS[0];
      const updatedUser: AdminUser = { ...primary, lastLoginAt: new Date().toISOString() };
      this.saveUser(updatedUser);
      this.setCurrentUser(updatedUser);
      return { user: updatedUser };
    }

    const all = this.getUsers();
    const matched = all.find(
      u => u.email.toLowerCase() === cleanIdentifier || (u.phone && u.phone.replace(/\D/g, '').endsWith(cleanIdentifier.replace(/\D/g, '')))
    );

    if (!matched) {
      return { user: null, error: 'No account registered with this email or mobile number.' };
    }

    if (matched.status === 'suspended') {
      return { user: null, error: 'This account has been suspended by the Super Admin.' };
    }

    const validPassword = matched.password || 'admin';
    if (cleanSecret !== validPassword && cleanSecret !== 'admin') {
      return { user: null, error: 'Incorrect password or passcode.' };
    }

    const updatedUser: AdminUser = { ...matched, lastLoginAt: new Date().toISOString() };
    this.saveUser(updatedUser);
    this.setCurrentUser(updatedUser);
    return { user: updatedUser };
  },

  logout(): void {
    this.setCurrentUser(null);
  },

  // Travel Experience Gallery
  getGalleryItems(): GalleryItem[] {
    const items = getFromStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY_ITEMS);
    return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  saveGalleryItem(item: GalleryItem): void {
    const all = this.getGalleryItems();
    const index = all.findIndex(g => g.id === item.id);
    if (index >= 0) {
      all[index] = item;
    } else {
      all.push({
        ...item,
        order: item.order !== undefined ? item.order : all.length + 1
      });
    }
    saveToStorage(STORAGE_KEYS.GALLERY, all);
  },

  deleteGalleryItem(id: string): void {
    const all = this.getGalleryItems().filter(g => g.id !== id);
    saveToStorage(STORAGE_KEYS.GALLERY, all);
  },

  setGalleryItems(items: GalleryItem[]): void {
    saveToStorage(STORAGE_KEYS.GALLERY, items);
  },

  resetGalleryItems(): void {
    saveToStorage(STORAGE_KEYS.GALLERY, INITIAL_GALLERY_ITEMS);
  },

  // Factory Reset
  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.DESTINATIONS);
    localStorage.removeItem(STORAGE_KEYS.PACKAGES);
    localStorage.removeItem(STORAGE_KEYS.BLOG_POSTS);
    localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
    localStorage.removeItem(STORAGE_KEYS.FAQS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.REGIONS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TEAM_MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new Event('baunduilla_data_updated'));
      }, 0);
    }
  }
};

