import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Unlock,
  Package,
  MapPin,
  MessageSquare,
  BookOpen,
  Settings as SettingsIcon,
  Shield,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  RotateCcw,
  Eye,
  FileCode,
  Calendar,
  Users,
  Image as ImageIcon,
  ListChecks,
  Sparkles,
  Hotel,
  Car,
  Home as HomeIcon,
  Utensils,
  Backpack,
  Layers,
  Clock,
  X,
  ChevronRight,
  ChevronLeft,
  Tag,
  UploadCloud,
  Globe,
  Crown,
  UserPlus,
  Layout,
  Type,
  Sliders,
  Check,
  UserCheck,
  UserX,
  Key,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  EyeOff,
  Camera,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { Destination, TourPackage, Inquiry, BlogPost, SiteSettings, RegionCategory, AdminUser, UserRole, DashboardModule, TeamMember, GalleryItem } from '../types';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { PhotoUploadManager } from '../components/PhotoUploadManager';
import { SingleImageUploader } from '../components/SingleImageUploader';
import { CertifiedGuideLogo } from '../components/CertifiedGuideLogo';

export const AdminPage: React.FC = () => {
  // Current Authenticated User & User Accounts
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => StorageService.getCurrentUser());
  const [users, setUsers] = useState<AdminUser[]>(() => StorageService.getUsers());

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSwitchUserModal, setShowSwitchUserModal] = useState(false);
  const [loginTab, setLoginTab] = useState<'credentials' | 'personas'>('credentials');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'packages' | 'destinations' | 'regions' | 'gallery' | 'blog' | 'settings' | 'users' | 'cloud'>('overview');

  // User Management state
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // Local state mirrored from StorageService
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [regions, setRegions] = useState<RegionCategory[]>(() => StorageService.getRegions());
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => StorageService.getSiteSettings());
  const [settingsSubTab, setSettingsSubTab] = useState<'layout' | 'menu' | 'texts' | 'team' | 'story' | 'details'>('layout');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => StorageService.getTeamMembers());
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [isNewTeamMember, setIsNewTeamMember] = useState(false);

  // Experience Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => StorageService.getGalleryItems());
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isNewGalleryItem, setIsNewGalleryItem] = useState(false);

  // Package Edit Modal State
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [isNewPackage, setIsNewPackage] = useState(false);
  const [pkgModalTab, setPkgModalTab] = useState<'basic' | 'pricing' | 'highlights' | 'itinerary' | 'inclusions' | 'logistics' | 'media'>('basic');

  // Destination Edit Modal State
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [isNewDestination, setIsNewDestination] = useState(false);

  // Region Category Edit Modal State
  const [editingRegion, setEditingRegion] = useState<RegionCategory | null>(null);
  const [isNewRegion, setIsNewRegion] = useState(false);

  // Blog Post Edit Modal State
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [isNewBlogPost, setIsNewBlogPost] = useState(false);

  // Inquiry View Modal
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  // Success notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete / Action Confirmation Modal State (replaces window.confirm for iframe reliability)
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadData = () => {
    setDestinations(StorageService.getDestinations());
    setPackages(StorageService.getPackages());
    setRegions(StorageService.getRegions());
    setInquiries(StorageService.getInquiries());
    setBlogPosts(StorageService.getBlogPosts());
    setSiteSettings(StorageService.getSiteSettings());
    setTeamMembers(StorageService.getTeamMembers());
    setGalleryItems(StorageService.getGalleryItems());
    const freshUsers = StorageService.getUsers();
    setUsers(freshUsers);
    const freshCurrentUser = StorageService.getCurrentUser();
    setCurrentUser(freshCurrentUser);
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener('baunduilla_data_updated', handleUpdate);
    return () => window.removeEventListener('baunduilla_data_updated', handleUpdate);
  }, []);

  // Super Admin & Granular RBAC Permissions
  const isSuperAdmin = Boolean(
    currentUser && (currentUser.role === 'super_admin' || currentUser.isPrimarySuperAdmin === true)
  );

  const canAccess = (module: DashboardModule): boolean => {
    if (!currentUser) return false;
    if (isSuperAdmin) return true;
    if (module === 'users') return false; // Strictly Super Admin only
    return currentUser.allowedModules?.includes(module) ?? false;
  };

  // Auto-redirect if non-super-admin tries to land on an unauthorized module
  useEffect(() => {
    if (currentUser) {
      if (!canAccess(activeTab as DashboardModule)) {
        const fallback = currentUser.allowedModules?.[0] || 'overview';
        setActiveTab(fallback as any);
      }
    }
  }, [currentUser, activeTab]);

  // Authentication Handlers
  const handleCredentialLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    const res = StorageService.authenticate(loginEmail, loginPassword);
    if (res.user) {
      setCurrentUser(res.user);
      setAuthError('');
      showToast(`Welcome back, ${res.user.name}!`);
    } else {
      setAuthError(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleQuickPersonaLogin = (user: AdminUser) => {
    if (user.status === 'suspended') {
      setAuthError(`The account "${user.name}" has been suspended by the Super Admin.`);
      return;
    }
    const updated = { ...user, lastLoginAt: new Date().toISOString() };
    StorageService.saveUser(updated);
    StorageService.setCurrentUser(updated);
    setCurrentUser(updated);
    setAuthError('');
    showToast(`Logged in as ${user.name} (${user.role.replace('_', ' ').toUpperCase()})`);
  };

  const handleLegacyPasscodeLogin = (e?: React.FormEvent, forceUnlock?: boolean) => {
    if (e) e.preventDefault();
    if (forceUnlock) {
      const primary = StorageService.getUsers().find(u => u.isPrimarySuperAdmin) || StorageService.getUsers()[0];
      handleQuickPersonaLogin(primary);
      return;
    }
    const clean = adminPasscode.trim().toLowerCase();
    if (clean === 'admin' || clean === 'baunduilla2026' || clean === 'baunduilla') {
      const primary = StorageService.getUsers().find(u => u.isPrimarySuperAdmin) || StorageService.getUsers()[0];
      handleQuickPersonaLogin(primary);
    } else {
      setAuthError('Invalid passcode. Use "admin" or select a team account.');
    }
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    showToast('Logged out of Admin Portal');
  };

  // User Management Handlers (Super Admin Exclusive)
  const handleCreateNewUser = () => {
    if (!isSuperAdmin) {
      showToast('Unauthorized: Only Super Admin can create new users');
      return;
    }
    setIsNewUser(true);
    setEditingUser({
      id: `user-${Date.now()}`,
      name: '',
      email: '',
      password: '',
      role: 'manager',
      status: 'active',
      isPrimarySuperAdmin: false,
      allowedModules: ['overview', 'inquiries'],
      canPublishContent: true,
      canDeleteContent: false,
      department: 'Operations Desk',
      phone: '',
      avatar: '',
      createdAt: new Date().toISOString()
    });
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!isSuperAdmin) {
      showToast('Unauthorized: Only Super Admin can modify users');
      return;
    }

    if (!editingUser.name.trim()) {
      showToast('Please enter the user full name');
      return;
    }

    const cleanEmail = editingUser.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }

    const duplicate = users.find(u => u.email.toLowerCase() === cleanEmail && u.id !== editingUser.id);
    if (duplicate) {
      showToast(`An account with email "${cleanEmail}" already exists`);
      return;
    }

    // Assign appropriate modules based on role
    const assignedModules: DashboardModule[] = editingUser.role === 'super_admin'
      ? ['overview', 'inquiries', 'packages', 'destinations', 'regions', 'blog', 'settings', 'users']
      : (editingUser.allowedModules.length > 0 ? editingUser.allowedModules.filter(m => m !== 'users') : ['overview']);

    const cleanedUser: AdminUser = {
      ...editingUser,
      name: editingUser.name.trim(),
      email: cleanEmail,
      password: editingUser.password?.trim() || 'admin123',
      department: editingUser.department?.trim() || 'Operations Desk',
      phone: editingUser.phone?.trim() || '',
      allowedModules: assignedModules,
      avatar: '',
      createdAt: editingUser.createdAt || new Date().toISOString()
    };

    StorageService.saveUser(cleanedUser);
    reloadData();
    setEditingUser(null);
    showToast(`User "${cleanedUser.name}" saved with ${cleanedUser.allowedModules.length} module permissions`);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (!isSuperAdmin) {
      showToast('Unauthorized: Only Super Admin can delete users');
      return;
    }
    setConfirmModal({
      title: 'Delete User Account',
      message: `Are you sure you want to delete user account "${name}"? This action cannot be undone.`,
      confirmLabel: 'Delete Account',
      onConfirm: () => {
        const res = StorageService.deleteUser(id);
        if (!res.success) {
          showToast(res.message || 'Cannot delete user');
          return;
        }
        reloadData();
        showToast(`User account "${name}" deleted`);
        setEditingUser(null);
      }
    });
  };

  const handleToggleUserStatus = (user: AdminUser) => {
    if (!isSuperAdmin) {
      showToast('Unauthorized');
      return;
    }
    if (user.isPrimarySuperAdmin) {
      showToast('Primary Super Admin cannot be suspended');
      return;
    }
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const updated: AdminUser = { ...user, status: newStatus };
    StorageService.saveUser(updated);
    reloadData();
    showToast(`User "${user.name}" is now ${newStatus}`);
  };

  const handleSwitchToUser = (targetUser: AdminUser) => {
    if (targetUser.status === 'suspended') {
      showToast('Cannot switch to a suspended account');
      return;
    }
    StorageService.setCurrentUser(targetUser);
    setCurrentUser(targetUser);
    setShowSwitchUserModal(false);
    showToast(`Switched active view to ${targetUser.name} (${targetUser.role.toUpperCase()})`);
  };

  // Inquiry management
  const handleUpdateInquiryStatus = (id: string, status: Inquiry['status']) => {
    StorageService.updateInquiryStatus(id, status);
    reloadData();
    showToast(`Inquiry status updated to ${status}`);
    if (viewingInquiry && viewingInquiry.id === id) {
      setViewingInquiry({ ...viewingInquiry, status });
    }
  };

  const handleDeleteInquiry = (id: string) => {
    setConfirmModal({
      title: 'Delete Inquiry',
      message: 'Are you sure you want to delete this customer inquiry from the records?',
      confirmLabel: 'Delete Inquiry',
      onConfirm: () => {
        StorageService.deleteInquiry(id);
        reloadData();
        showToast('Inquiry deleted');
        setViewingInquiry(null);
      }
    });
  };

  // Package Management
  const openPackageModal = (pkg: TourPackage, isNew: boolean = false) => {
    setIsNewPackage(isNew);
    setEditingPackage({
      ...pkg,
      highlights: pkg.highlights && pkg.highlights.length > 0 ? [...pkg.highlights] : [''],
      itinerary: pkg.itinerary && pkg.itinerary.length > 0 ? pkg.itinerary.map((d, i) => ({ ...d, day: i + 1 })) : [
        { day: 1, title: 'Arrival & Welcome', description: '', meals: 'Dinner Included', stay: '', altitude: '' }
      ],
      inclusions: pkg.inclusions && pkg.inclusions.length > 0 ? [...pkg.inclusions] : [''],
      exclusions: pkg.exclusions && pkg.exclusions.length > 0 ? [...pkg.exclusions] : [''],
      thingsToCarry: pkg.thingsToCarry && pkg.thingsToCarry.length > 0 ? [...pkg.thingsToCarry] : [''],
      departureDates: pkg.departureDates && pkg.departureDates.length > 0 ? [...pkg.departureDates] : [''],
      images: pkg.images && pkg.images.length > 0 ? [...pkg.images] : ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'],
      accommodationInfo: pkg.accommodationInfo || '',
      transportationInfo: pkg.transportationInfo || '',
      mealsInfo: pkg.mealsInfo || '',
      travelStyle: pkg.travelStyle || 'Road Trip',
      difficulty: pkg.difficulty || 'Moderate',
      tripType: pkg.tripType || 'Both',
      maxGroupSize: pkg.maxGroupSize || 12,
      pricePerPerson: pkg.pricePerPerson || 0,
      currency: pkg.currency || 'INR',
      durationDays: pkg.durationDays || 1,
      durationNights: pkg.durationNights || 1,
      shortDescription: pkg.shortDescription || '',
      published: pkg.published !== undefined ? pkg.published : true,
      featured: pkg.featured !== undefined ? pkg.featured : false,
      isVerifiedPrice: pkg.isVerifiedPrice !== undefined ? pkg.isVerifiedPrice : true,
    });
    setPkgModalTab('basic');
  };

  const handleCreateNewPackage = () => {
    const defaultDest = destinations[0] || { id: 'north-bengal', name: 'North Bengal & Dooars' };
    openPackageModal({
      id: `pkg-${Date.now()}`,
      title: 'New Himalayan Tour Expedition',
      slug: `new-tour-expedition-${Date.now().toString().slice(-4)}`,
      destinationId: defaultDest.id,
      destinationName: defaultDest.name,
      shortDescription: 'Unforgettable small-group mountain expedition with verified local guides and authentic homestays.',
      durationDays: 5,
      durationNights: 4,
      pricePerPerson: 14500,
      currency: 'INR',
      travelStyle: 'Road Trip',
      difficulty: 'Moderate',
      tripType: 'Both',
      maxGroupSize: 12,
      highlights: [
        'Scenic Himalayan mountain drive with verified local chauffeurs',
        'Traditional homestay experiences with organic home-cooked meals',
        'Guided wildlife sanctuary safaris and scenic river valley walks'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Scenic Mountain Transfer',
          description: 'Meet and greet at airport or railway station. Drive through lush tea estates into the peaceful Himalayan foothills. Evening welcome tea and briefing.',
          meals: 'Dinner Included',
          stay: 'Riverside Eco Resort / Homestay',
          altitude: '1,200 ft'
        },
        {
          day: 2,
          title: 'Forest Exploration & Viewpoint Excursion',
          description: 'Early morning safari or nature walk. Visit historic viewpoints, riverbeds, and local craft centers. Sunset tea amidst tea gardens.',
          meals: 'Breakfast & Dinner',
          stay: 'Riverside Eco Resort / Homestay',
          altitude: '1,500 ft'
        },
        {
          day: 3,
          title: 'Morning Forest Trail & Departure',
          description: 'Gentle sunrise birdwatching stroll. After breakfast, pack memories and transfer back to departure station/airport.',
          meals: 'Breakfast Included',
          stay: 'Departure',
          altitude: 'N/A'
        }
      ],
      inclusions: [
        'Dedicated commercial SUV (Innova/Xylo/Bolero) with experienced mountain driver',
        'Accommodations on twin/triple sharing in clean verified homestays & hotels',
        'Daily breakfast and hot regional dinner as specified',
        'Government inner-line permits, forest clearances, and entry passes',
        '24/7 dedicated trip coordinator support from Baunduilla operations desk'
      ],
      exclusions: [
        'Flight tickets or train fares to starting hub',
        'Daily lunches, mineral water, personal snacks, and beverages',
        'Camera fees, elephant safari surcharge, or personal adventure rides',
        'Personal travel insurance and guide tips'
      ],
      accommodationInfo: 'Handpicked clean eco-homestays and verified 3-star standard mountain properties with warm hospitality, clean linen, and attached running hot-water bathrooms.',
      transportationInfo: 'Commercial passenger SUV (Innova, Bolero, or Xylo) driven by experienced mountain drivers verified for steep terrain and hill passes.',
      mealsInfo: 'Fresh regional home-cooked breakfast and hot dinners prepared daily with organic local ingredients. Vegetarian and non-vegetarian choices provided.',
      thingsToCarry: [
        'Original Govt Photo ID (Voter ID or Passport) + 4 passport photos for permits',
        'Comfortable walking or trekking shoes with reliable rubber grip',
        'Light fleece, thermal innerwear, and windproof jacket',
        'Personal water bottle, power bank, and universal charger',
        'Basic first aid, motion sickness pills, and personal medicines'
      ],
      departureDates: ['15 Nov 2026', '01 Dec 2026', '18 Dec 2026', '05 Jan 2027'],
      images: [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80'
      ],
      published: true,
      featured: true,
      isVerifiedPrice: true
    }, true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    if (!editingPackage.title.trim()) {
      showToast('Please enter a tour package title');
      return;
    }

    const cleanSlug = editingPackage.slug?.trim() ||
      editingPackage.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const cleanedPackage: TourPackage = {
      ...editingPackage,
      createdAt: isNewPackage ? new Date().toISOString() : (editingPackage.createdAt || new Date().toISOString()),
      featured: isNewPackage ? true : editingPackage.featured,
      title: editingPackage.title.trim(),
      slug: cleanSlug,
      destinationName: editingPackage.destinationName?.trim() || 'North Bengal & Dooars',
      shortDescription: editingPackage.shortDescription?.trim() || '',
      highlights: (editingPackage.highlights || []).map(h => h.trim()).filter(Boolean),
      inclusions: (editingPackage.inclusions || []).map(i => i.trim()).filter(Boolean),
      exclusions: (editingPackage.exclusions || []).map(e => e.trim()).filter(Boolean),
      thingsToCarry: (editingPackage.thingsToCarry || []).map(t => t.trim()).filter(Boolean),
      departureDates: (editingPackage.departureDates || []).map(d => d.trim()).filter(Boolean),
      images: (editingPackage.images || []).map(img => img.trim()).filter(Boolean),
      itinerary: (editingPackage.itinerary || [])
        .map((item, index) => ({
          day: index + 1,
          title: item.title?.trim() || `Day ${index + 1}`,
          description: item.description?.trim() || '',
          meals: item.meals?.trim() || '',
          stay: item.stay?.trim() || '',
          altitude: item.altitude?.trim() || '',
        }))
        .filter(item => item.title || item.description),
    };

    if (cleanedPackage.images.length === 0) {
      cleanedPackage.images = ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'];
    }

    StorageService.savePackage(cleanedPackage);
    reloadData();
    setEditingPackage(null);
    showToast(`Package "${cleanedPackage.title}" saved successfully with all details`);
  };

  const handleDeletePackage = (id: string) => {
    const pkg = packages.find(p => p.id === id) || (editingPackage?.id === id ? editingPackage : null);
    const title = pkg?.title ? ` "${pkg.title}"` : '';
    setConfirmModal({
      title: 'Delete Tour Package',
      message: `Are you sure you want to delete tour package${title}? This will immediately remove it from public view.`,
      confirmLabel: 'Delete Package',
      onConfirm: () => {
        StorageService.deletePackage(id);
        reloadData();
        setEditingPackage(null);
        showToast('Tour package removed');
      }
    });
  };

  // Destination Management
  const handleCreateNewDestination = () => {
    setIsNewDestination(true);
    setEditingDestination({
      id: `dest-${Date.now()}`,
      name: 'New Destination',
      slug: `new-destination-${Date.now().toString().slice(-4)}`,
      region: 'North Bengal & Dooars',
      category: 'Hill',
      shortDescription: 'Spectacular mountain passes, lush river valleys, and authentic Himalayan hospitality.',
      fullOverview: 'Discover the scenic wonders, local traditions, viewpoints, and unspoiled wilderness of this pristine destination.',
      heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      ],
      attractions: [],
      bestTimeToVisit: 'October to May',
      suggestedDuration: '4 - 6 Days',
      activities: ['Sightseeing', 'Homestays', 'Photography', 'Nature Trails'],
      approximateBudget: '₹12,000 - ₹20,000 per person',
      permitNotice: 'Indian citizens require Voter ID / Aadhaar card. Foreign nationals require Protected Area Permits.',
      published: true,
      featured: false,
    });
  };

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDestination) return;
    if (!editingDestination.name.trim()) {
      showToast('Please enter a destination name');
      return;
    }
    const cleanSlug = editingDestination.slug?.trim() ||
      editingDestination.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const cleaned: Destination = {
      ...editingDestination,
      slug: cleanSlug,
      name: editingDestination.name.trim(),
      heroImage: editingDestination.heroImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      gallery: editingDestination.gallery && editingDestination.gallery.length > 0
        ? editingDestination.gallery
        : [editingDestination.heroImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'],
      attractions: (editingDestination.attractions || []).filter(a => a.name && a.name.trim()),
    };
    StorageService.saveDestination(cleaned);
    reloadData();
    setEditingDestination(null);
    showToast(`Destination "${cleaned.name}" saved with photo media`);
  };

  const handleDeleteDestination = (id: string) => {
    const dest = destinations.find(d => d.id === id) || (editingDestination?.id === id ? editingDestination : null);
    const name = dest?.name ? ` "${dest.name}"` : '';
    setConfirmModal({
      title: 'Delete Destination',
      message: `Are you sure you want to delete destination${name}? This will remove it from the destination catalog.`,
      confirmLabel: 'Delete Destination',
      onConfirm: () => {
        StorageService.deleteDestination(id);
        reloadData();
        setEditingDestination(null);
        showToast('Destination deleted');
      }
    });
  };

  // Blog Management Handlers
  const handleCreateNewBlogPost = () => {
    setIsNewBlogPost(true);
    setEditingBlogPost({
      id: `post-${Date.now()}`,
      title: 'New Himalayan Field Story',
      slug: `new-himalayan-story-${Date.now().toString().slice(-4)}`,
      excerpt: 'Essential tips, scenic viewpoints, and local route highlights from our expedition coordinators in Siliguri.',
      content: `### Discovering Untouched Mountain Trails

Traveling across the Eastern Himalayas and Northeast India offers an unmatched blend of rich cultural heritage, misty evergreen forests, and breathtaking river canyons.

#### 1. Best Time & Logistics
Plan your travel between October and May for crisp, crystal-clear skies and great mountain panoramas. Ensure you carry original government IDs for inner-line permits.

#### 2. Local Homestays & Community
Staying with local families not only provides warm, authentic hospitality and organic home-cooked food, but also directly supports conservation and sustainable tourism.`,
      coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      publishedAt: new Date().toISOString().split('T')[0],
      author: {
        name: 'Baunduilla Expedition Team',
        role: 'Travel Coordinator',
        avatar: ''
      },
      category: 'Travel Guides',
      readTime: '5 min read',
      tags: ['Himalayas', 'North Bengal', 'Travel Guide'],
      published: true
    });
  };

  const handleSaveBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlogPost) return;

    if (!editingBlogPost.title.trim()) {
      showToast('Please enter an article title');
      return;
    }

    const cleanSlug = editingBlogPost.slug?.trim() ||
      editingBlogPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const cleaned: BlogPost = {
      ...editingBlogPost,
      title: editingBlogPost.title.trim(),
      slug: cleanSlug,
      excerpt: editingBlogPost.excerpt.trim(),
      content: editingBlogPost.content.trim(),
      coverImage: editingBlogPost.coverImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      readTime: editingBlogPost.readTime?.trim() || '5 min read',
      publishedAt: editingBlogPost.publishedAt || new Date().toISOString().split('T')[0],
      tags: Array.isArray(editingBlogPost.tags)
        ? editingBlogPost.tags.map(t => t.trim()).filter(Boolean)
        : (typeof editingBlogPost.tags === 'string'
          ? (editingBlogPost.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
          : ['Travel Guide']),
      author: {
        name: editingBlogPost.author?.name?.trim() || 'Baunduilla Team',
        role: editingBlogPost.author?.role?.trim() || 'Expedition Coordinator',
        avatar: ''
      }
    };

    StorageService.saveBlogPost(cleaned);
    reloadData();
    setEditingBlogPost(null);
    showToast(`Blog article "${cleaned.title}" saved successfully`);
  };

  const handleDeleteBlogPost = (id: string) => {
    const post = blogPosts.find(b => b.id === id) || (editingBlogPost?.id === id ? editingBlogPost : null);
    const title = post?.title ? ` "${post.title}"` : '';
    setConfirmModal({
      title: 'Delete Blog Article',
      message: `Are you sure you want to delete article${title}? This action cannot be undone.`,
      confirmLabel: 'Delete Article',
      onConfirm: () => {
        StorageService.deleteBlogPost(id);
        reloadData();
        setEditingBlogPost(null);
        showToast('Article deleted');
      }
    });
  };

  // Region Categories Management
  const handleCreateNewRegion = () => {
    setIsNewRegion(true);
    setEditingRegion({
      id: `region-${Date.now()}`,
      name: '',
      slug: '',
      description: '',
      heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      badge: 'Scenic Destination',
      featured: true,
      order: regions.length + 1
    });
  };

  const handleSaveRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRegion) return;

    if (!editingRegion.name.trim()) {
      showToast('Please enter a region name');
      return;
    }

    const cleanSlug = editingRegion.slug?.trim() ||
      editingRegion.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const cleaned: RegionCategory = {
      ...editingRegion,
      name: editingRegion.name.trim(),
      slug: cleanSlug,
      description: editingRegion.description?.trim() || '',
      heroImage: editingRegion.heroImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      badge: editingRegion.badge?.trim() || 'Scenic Trail',
      featured: editingRegion.featured ?? true,
      order: Number(editingRegion.order) || 1,
      createdAt: editingRegion.createdAt || new Date().toISOString()
    };

    StorageService.saveRegion(cleaned);
    reloadData();
    setEditingRegion(null);
    showToast(`Region category "${cleaned.name}" saved successfully`);
  };

  const handleDeleteRegion = (id: string, name: string) => {
    setConfirmModal({
      title: 'Delete Region Category',
      message: `Are you sure you want to delete the region category "${name}"? Existing destinations linked to this region will be preserved.`,
      confirmLabel: 'Delete Region',
      onConfirm: () => {
        StorageService.deleteRegion(id);
        reloadData();
        setEditingRegion(null);
        showToast(`Region category "${name}" deleted`);
      }
    });
  };

  // Team Members Management (About Us Page)
  const handleCreateNewTeamMember = () => {
    setIsNewTeamMember(true);
    setEditingTeamMember({
      id: `team-${Date.now()}`,
      name: '',
      role: '',
      photo: '',
      bio: '',
      order: teamMembers.length + 1,
    });
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember) return;
    if (!editingTeamMember.name.trim()) {
      showToast('Please enter the team member name');
      return;
    }

    let updated: TeamMember[];
    if (isNewTeamMember) {
      updated = [...teamMembers, { ...editingTeamMember, order: teamMembers.length + 1 }];
    } else {
      updated = teamMembers.map((m) =>
        m.id === editingTeamMember.id ? editingTeamMember : m
      );
    }

    setTeamMembers(updated);
    StorageService.saveTeamMembers(updated);
    reloadData();
    setEditingTeamMember(null);
    showToast(isNewTeamMember ? 'New team member added' : 'Team member updated');
  };

  const handleDeleteTeamMember = (id: string, name: string) => {
    setConfirmModal({
      title: 'Delete Team Member',
      message: `Are you sure you want to remove "${name}" from the team list on the About Us page?`,
      confirmLabel: 'Delete Member',
      onConfirm: () => {
        const updated = teamMembers.filter((m) => m.id !== id);
        setTeamMembers(updated);
        StorageService.saveTeamMembers(updated);
        reloadData();
        if (editingTeamMember && editingTeamMember.id === id) {
          setEditingTeamMember(null);
        }
        showToast(`Removed "${name}" from team`);
      },
    });
  };

  const handleMoveTeamMember = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= teamMembers.length) return;
    const reordered = [...teamMembers];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    const normalized = reordered.map((m, idx) => ({ ...m, order: idx + 1 }));
    setTeamMembers(normalized);
    StorageService.saveTeamMembers(normalized);
    reloadData();
  };

  // Experience Gallery Management
  const handleCreateNewGalleryItem = () => {
    setIsNewGalleryItem(true);
    const nextOrder = galleryItems.length > 0 ? Math.max(...galleryItems.map(g => g.order || 0)) + 1 : 1;
    setEditingGalleryItem({
      id: `gallery-${Date.now()}`,
      title: 'Himalayan Ridge & Valley Story',
      location: 'North East India',
      tag: 'Trek Experience',
      src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      description: 'Golden morning light illuminating high mountain trails and authentic village hamlets.',
      order: nextOrder
    });
  };

  const handleSaveGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;
    if (!editingGalleryItem.title.trim()) {
      showToast('Please enter a photo story title');
      return;
    }
    if (!editingGalleryItem.src?.trim()) {
      showToast('Please upload or provide a photo URL');
      return;
    }

    const cleanedItem: GalleryItem = {
      ...editingGalleryItem,
      title: editingGalleryItem.title.trim(),
      location: editingGalleryItem.location?.trim() || 'Eastern Himalayas',
      tag: editingGalleryItem.tag?.trim() || 'Visual Story',
      src: editingGalleryItem.src.trim(),
      description: editingGalleryItem.description?.trim() || '',
      order: editingGalleryItem.order || 1
    };

    StorageService.saveGalleryItem(cleanedItem);
    reloadData();
    setEditingGalleryItem(null);
    showToast(`Gallery story "${cleanedItem.title}" saved successfully`);
  };

  const handleDeleteGalleryItem = (id: string, title: string) => {
    setConfirmModal({
      title: 'Delete Gallery Photo',
      message: `Are you sure you want to remove "${title}" from the Travel Experience Gallery?`,
      confirmLabel: 'Delete Photo',
      onConfirm: () => {
        StorageService.deleteGalleryItem(id);
        reloadData();
        if (editingGalleryItem && editingGalleryItem.id === id) {
          setEditingGalleryItem(null);
        }
        showToast(`Removed "${title}" from gallery`);
      }
    });
  };

  const handleMoveGalleryItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryItems.length) return;
    const reordered = [...galleryItems];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    const normalized = reordered.map((g, idx) => ({ ...g, order: idx + 1 }));
    setGalleryItems(normalized);
    StorageService.setGalleryItems(normalized);
    reloadData();
  };

  const handleResetGallery = () => {
    setConfirmModal({
      title: 'Reset Experience Gallery',
      message: 'Restore the Travel Experience Gallery back to the curated Himalayan & North East photography (Yulla Kanda, Tungnath, Kedarnath, Living Root Bridge, etc.)?',
      confirmLabel: 'Reset Gallery',
      onConfirm: () => {
        StorageService.resetGalleryItems();
        reloadData();
        showToast('Gallery restored to curated default stories');
      }
    });
  };

  // Settings Management
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSiteSettings(siteSettings);
    reloadData();
    showToast('Website layout, texts, and details saved successfully!');
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSiteSettings(prev => ({ ...prev, heroImage: dataUrl }));
      showToast('Hero photo loaded from file');
    };
    reader.readAsDataURL(file);
  };

  const handleResetSettingsToDefaults = () => {
    setConfirmModal({
      title: 'Reset Website Layout & Texts',
      message: 'Reset all layout options, hero headlines, story texts, and contact details back to initial Baunduilla defaults?',
      confirmLabel: 'Reset Settings',
      onConfirm: () => {
        const defaults = StorageService.getSiteSettings();
        setSiteSettings({ ...defaults });
        StorageService.updateSiteSettings(defaults);
        reloadData();
        showToast('Website layout & texts reset to recommended defaults');
      }
    });
  };

  const handleResetData = () => {
    setConfirmModal({
      title: 'Reset All Demo Data',
      message: 'Reset all demo packages, destinations, blog posts, and inquiries back to factory defaults? Custom created packages will be cleared.',
      confirmLabel: 'Reset Everything',
      onConfirm: () => {
        StorageService.resetToDefaults();
        reloadData();
        showToast('All website data reset to defaults');
      }
    });
  };

  /* ------------------------------------------------------------- */
  /* If not authenticated, show secure administrator login portal  */
  /* ------------------------------------------------------------- */
    /* ------------------------------------------------------------- */
  /* If not authenticated, show user-based access login portal    */
  /* ------------------------------------------------------------- */
  if (!currentUser) {
    const primarySuperAdmin = users.find(u => u.isPrimarySuperAdmin) || users[0];

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <img
                src="/assets/aistudio/20261023_085549_c2e8a7b5.png"
                alt="Baunduilla"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173F35]/10 text-[#173F35] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E99B54]" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>
            <h2 className="font-sans font-bold text-base sm:text-lg text-[#173F35]">
              Baunduilla Team Portal
            </h2>
            <p className="text-xs text-stone-500">
              Sign in with your assigned team account to access your authorized dashboard modules.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-stone-100 rounded-2xl text-xs font-bold text-stone-600">
            <button
              type="button"
              onClick={() => setLoginTab('credentials')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginTab === 'credentials'
                  ? 'bg-white text-[#173F35] shadow-xs'
                  : 'hover:text-stone-900'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-[#E99B54]" />
              <span>Email & Password</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginTab('personas')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginTab === 'personas'
                  ? 'bg-white text-[#173F35] shadow-xs'
                  : 'hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#E99B54]" />
              <span>Test Personas (1-Click)</span>
            </button>
          </div>

          {/* Tab 1: Email & Password Form */}
          {loginTab === 'credentials' && (
            <form onSubmit={handleCredentialLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Team Email or Mobile *
                </label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. tapabratadeysarkar961@gmail.com"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Password / Access Key *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password or passcode (e.g. admin)"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  className="w-full bg-[#173F35] hover:bg-[#1F4F43] active:scale-98 text-white py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#E99B54]" />
                  <span>Sign In to Dashboard</span>
                </button>

                {primarySuperAdmin && (
                  <button
                    type="button"
                    onClick={() => handleQuickPersonaLogin(primarySuperAdmin)}
                    className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>Instant Login as Primary Super Admin ({primarySuperAdmin.name})</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Tab 2: Test Personas */}
          {loginTab === 'personas' && (
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              <p className="text-[11px] text-stone-500">
                Select an account to test how dashboard modules dynamically adapt based on assigned permissions:
              </p>

              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleQuickPersonaLogin(u)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    u.isPrimarySuperAdmin
                      ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400'
                      : 'bg-stone-50 hover:bg-white border-stone-200 hover:border-[#173F35]/40 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 border border-[#173F35]/30 shadow-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="text-xs text-stone-900 group-hover:text-[#173F35] truncate">
                          {u.name}
                        </strong>
                        {u.isPrimarySuperAdmin && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5 fill-current" />
                            Primary
                          </span>
                        )}
                        {u.name.toLowerCase() === 'devoloper' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            Devoloper
                          </span>
                        )}
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          u.role === 'super_admin' ? 'bg-[#173F35] text-white' :
                          u.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'editor' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-stone-200 text-stone-700'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate">{u.email}</p>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {u.role === 'super_admin' ? (
                          <span className="text-[9px] text-[#173F35] font-semibold">
                            Full Control of All 9 Modules & Users
                          </span>
                        ) : (
                          u.allowedModules.map(m => (
                            <span key={m} className="text-[9px] bg-white border border-stone-200 text-stone-600 px-1.5 py-0.2 rounded font-mono">
                              {m}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-xs font-bold text-[#E99B54] group-hover:underline inline-flex items-center gap-0.5">
                      <span>Login</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-stone-100 text-center space-y-1 text-[11px] text-stone-400">
            <p>
              Default master passcode: <code className="bg-stone-100 px-1 rounded text-stone-700 font-mono">admin</code>
            </p>
            <p className="text-[10px]">
              Super Admin can create team members & assign dashboard module access under <strong className="text-stone-700">Team & Access</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* Authenticated Dashboard View                                  */
  /* ------------------------------------------------------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#173F35] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#E99B54]" />
          <span>{toastMessage}</span>
        </div>
      )}

            {/* Top Bar with Authenticated User Profile */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-[#173F35] text-white flex items-center justify-center font-bold text-base tracking-wider border-2 border-stone-200 shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                currentUser.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
              title={currentUser.status === 'active' ? 'Account Active' : 'Account Suspended'}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-sans font-bold text-base text-[#173F35]">
                {currentUser.name}
              </h2>

              {currentUser.isPrimarySuperAdmin ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-300">
                  <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Primary Super Admin</span>
                </span>
              ) : currentUser.role === 'super_admin' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#173F35] text-white">
                  <Crown className="w-3.5 h-3.5 text-[#E99B54]" />
                  <span>Super Admin</span>
                </span>
              ) : currentUser.role === 'manager' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Operations Manager</span>
                </span>
              ) : currentUser.role === 'editor' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <Edit className="w-3 h-3 text-emerald-600" />
                  <span>Content Editor</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  <span>Custom Role</span>
                </span>
              )}

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                {isSuperAdmin ? 'Full Access (9/9 Modules)' : `${currentUser.allowedModules?.length || 0}/9 Modules Granted`}
              </span>
            </div>

            <p className="text-xs text-stone-500 mt-0.5">
              {currentUser.email} • {currentUser.department || 'Baunduilla Travel Desk'}
            </p>
          </div>
        </div>

        {/* User Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowSwitchUserModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-stone-200"
            title="Switch into another team account to test access permissions"
          >
            <Users className="w-3.5 h-3.5 text-[#E99B54]" />
            <span>Switch Persona</span>
          </button>

          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173F35] bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {isSuperAdmin && (
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              title="Reset demo data to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Dynamic Role-Based Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        {canAccess('overview') && (
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-4 h-4 text-[#E99B54]" />
            <span>Overview</span>
          </button>
        )}

        {canAccess('inquiries') && (
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-2.5 px-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#E99B54]" />
            <span>Customer Inquiries</span>
            {inquiries.filter(i => i.status === 'new').length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#E99B54] text-white text-[10px] flex items-center justify-center font-bold">
                {inquiries.filter(i => i.status === 'new').length}
              </span>
            )}
          </button>
        )}

        {canAccess('packages') && (
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-2.5 px-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4 text-[#E99B54]" />
            <span>Tour Packages ({packages.length})</span>
          </button>
        )}

        {canAccess('destinations') && (
          <button
            onClick={() => setActiveTab('destinations')}
            className={`py-2.5 px-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'destinations'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#E99B54]" />
            <span>Destinations ({destinations.length})</span>
          </button>
        )}

        {canAccess('regions') && (
          <button
            onClick={() => setActiveTab('regions')}
            className={`py-2.5 px-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'regions'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Globe className="w-4 h-4 text-[#E99B54]" />
            <span>Region Categories ({regions.length})</span>
          </button>
        )}

        {canAccess('gallery') && (
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-2.5 px-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Camera className="w-4 h-4 text-[#E99B54]" />
            <span>Experience Gallery ({galleryItems.length})</span>
          </button>
        )}

        {canAccess('blog') && (
          <button
            onClick={() => setActiveTab('blog')}
            className={`py-2.5 px-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'blog'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#E99B54]" />
            <span>Blog Articles ({blogPosts.length})</span>
          </button>
        )}

        {canAccess('settings') && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2.5 px-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <SettingsIcon className="w-4 h-4 text-[#E99B54]" />
            <span>Website Settings</span>
          </button>
        )}

        {/* Super Admin Exclusive Tab: Team & Access Management */}
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2.5 px-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4 text-[#E99B54]" />
            <span>Team & Access ({users.length})</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full border border-amber-300 flex items-center gap-0.5">
              <Crown className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
              Super Admin
            </span>
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('cloud')}
            className={`py-2.5 px-4 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'cloud'
                ? 'bg-[#17324D] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Firebase & Rules</span>
          </button>
        )}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">New Inquiries</span>
              <div className="text-2xl font-bold font-sans text-[#173F35] tracking-tight">
                {inquiries.filter(i => i.status === 'new').length}
              </div>
              <p className="text-[11px] text-stone-500">Requires follow-up</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Published Packages</span>
              <div className="text-2xl font-bold font-sans text-[#17324D] tracking-tight">
                {packages.filter(p => p.published).length}
              </div>
              <p className="text-[11px] text-stone-500">Active catalog offerings</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Destinations</span>
              <div className="text-2xl font-bold font-sans text-[#173F35] tracking-tight">
                {destinations.length}
              </div>
              <p className="text-[11px] text-stone-500">Sikkim, Dooars, Spiti, etc.</p>
            </div>

            <div
              onClick={() => setActiveTab('gallery')}
              className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1.5 cursor-pointer hover:border-[#173F35]/40 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Experience Gallery</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateNewGalleryItem();
                  }}
                  className="text-xs text-[#E99B54] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
              <div className="text-2xl font-bold font-sans text-[#173F35] tracking-tight">
                {galleryItems.length}
              </div>
              <p className="text-[11px] text-stone-500 group-hover:text-[#173F35] transition-colors">Visual travel stories →</p>
            </div>

            <div
              onClick={() => setActiveTab('regions')}
              className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1.5 cursor-pointer hover:border-[#173F35]/40 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Region Zones</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateNewRegion();
                  }}
                  className="text-xs text-[#E99B54] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Create</span>
                </button>
              </div>
              <div className="text-2xl font-bold font-sans text-[#E99B54] tracking-tight">
                {regions.length}
              </div>
              <p className="text-[11px] text-stone-500 group-hover:text-[#173F35] transition-colors">Manage regional zones →</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">WhatsApp Desk</span>
              <div className="text-sm font-mono font-bold text-emerald-700">
                +{siteSettings.whatsappNumber}
              </div>
              <p className="text-xs text-stone-500">Click-to-chat operational</p>
            </div>
          </div>

          {/* Recent Inquiries preview */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-lg text-[#173F35]">
                Recent Inquiries Received
              </h2>
              <button
                onClick={() => setActiveTab('inquiries')}
                className="text-xs font-bold text-[#E99B54] hover:underline"
              >
                View All Inquiries →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Destination / Trip</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {inquiries.slice(0, 5).map((inq) => (
                    <tr key={inq.id} className="hover:bg-stone-50">
                      <td className="p-3">
                        <strong className="block text-stone-900">{inq.customerName}</strong>
                        <span className="text-stone-400 text-[10px]">
                          {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-[#173F35]">{inq.destination}</span>
                        {inq.packageTitle && <p className="text-stone-400 text-[10px]">{inq.packageTitle}</p>}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-stone-600">
                        {inq.phone}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inq.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : inq.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : inq.status === 'booked'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {inq.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setViewingInquiry(inq)}
                          className="text-xs text-[#173F35] font-bold hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB: INQUIRIES                                                */}
      {/* ============================================================= */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-sans font-bold text-base sm:text-lg text-[#173F35]">
                Customer Booking Inquiries ({inquiries.length})
              </h2>
              <p className="text-xs text-stone-500">
                Inquiries submitted via package details, multi-step planner, and contact forms.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#173F35] text-white rounded-xl">
                <tr>
                  <th className="p-3 rounded-l-xl">Date & ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Trip Interest</th>
                  <th className="p-3">Travel Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {inquiries.map((inq) => {
                  const replyWhatsAppUrl = generateWhatsAppLink(
                    inq.phone,
                    `Hello ${inq.customerName}, this is Baunduilla travel desk following up on your inquiry for ${inq.destination}. We would love to assist you with the itinerary and dates!`
                  );

                  return (
                    <tr key={inq.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono text-[10px] text-stone-400">
                        {new Date(inq.createdAt).toLocaleDateString('en-IN')}<br />
                        <span className="text-stone-300">{inq.id}</span>
                      </td>
                      <td className="p-3">
                        <strong className="block text-stone-900">{inq.customerName}</strong>
                        <span className="text-stone-500">{inq.phone}</span>
                      </td>
                      <td className="p-3">
                        <strong className="text-[#173F35]">{inq.destination}</strong>
                        {inq.packageTitle && <p className="text-[10px] text-stone-400">{inq.packageTitle}</p>}
                      </td>
                      <td className="p-3 font-medium text-stone-700">
                        {inq.travelDate || 'Flexible'}
                      </td>
                      <td className="p-3">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                          className="text-[11px] font-bold rounded-lg border border-stone-200 px-2 py-1 bg-stone-50"
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="booked">BOOKED</option>
                          <option value="archived">ARCHIVED</option>
                        </select>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setViewingInquiry(inq)}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1 rounded-lg font-semibold"
                        >
                          Details
                        </button>

                        <a
                          href={replyWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-2.5 py-1 rounded-lg font-semibold inline-flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB: PACKAGES                                                 */}
      {/* ============================================================= */}
      {activeTab === 'packages' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-sans font-bold text-base sm:text-lg text-[#173F35]">
                Manage Tour Packages ({packages.length})
              </h2>
              <p className="text-xs text-stone-500">
                Update base pricing in INR, edit day-by-day itineraries, departure batches, and featured status.
              </p>
            </div>

            <button
              onClick={handleCreateNewPackage}
              className="inline-flex items-center gap-1.5 bg-[#173F35] hover:bg-[#1F4F43] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-[#173F35]">{pkg.destinationName}</span>
                    <span>{pkg.durationDays}D / {pkg.durationNights}N</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-stone-900 line-clamp-1">
                    {pkg.title}
                  </h3>

                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-lg font-bold text-[#17324D]">
                      ₹{pkg.pricePerPerson.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-stone-500">/ person</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pkg.published ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {pkg.published ? 'Published' : 'Draft'}
                    </span>
                    {pkg.featured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/packages/${pkg.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-500 hover:text-[#173F35]"
                      title="View Live Tour Page"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => openPackageModal(pkg, false)}
                      className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-[#173F35]"
                      title="Edit Tour Package (All Details)"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1.5 rounded-lg bg-white border border-stone-200 text-red-500 hover:text-red-700"
                      title="Delete Package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB: DESTINATIONS                                             */}
      {/* ============================================================= */}
      {activeTab === 'destinations' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-sans font-bold text-base sm:text-lg text-[#173F35]">
                Destinations Directory ({destinations.length})
              </h2>
              <p className="text-xs text-stone-500">
                Update region information, best time to visit, and upload cover & gallery photos.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={handleCreateNewRegion}
                className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-stone-200"
                title="Create a new regional zone category"
              >
                <Plus className="w-4 h-4 text-[#E99B54]" />
                <span>Add Region Category</span>
              </button>

              <button
                type="button"
                onClick={handleCreateNewDestination}
                className="inline-flex items-center gap-1.5 bg-[#173F35] hover:bg-[#1F4F43] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4 text-[#E99B54]" />
                <span>Add Destination</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col justify-between space-y-3 hover:shadow-xs transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-[#E99B54] uppercase tracking-wider">{dest.region}</span>
                      {dest.category && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {dest.category === 'Hill' && '🏔️ Hill'}
                          {dest.category === 'Sea' && '🌊 Sea'}
                          {(dest.category === 'Forest' || dest.category === 'Jungle') && '🌲 Forest'}
                          {dest.category === 'Desert' && '🏜️ Desert'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#173F35] mt-0.5 truncate">{dest.name}</h3>
                    <p className="text-stone-600 text-xs mt-0.5 line-clamp-2 leading-relaxed">{dest.shortDescription}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-400 flex-wrap">
                      <span>{dest.gallery?.length || 1} Photos</span>
                      <span>•</span>
                      <span className="text-[#173F35] font-semibold">{dest.attractions?.length || 0} Key Attractions</span>
                      {dest.bestTimeToVisit && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px] sm:max-w-[200px]" title={dest.bestTimeToVisit}>
                            Best: {dest.bestTimeToVisit}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-stone-200/80 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-stone-400 font-mono truncate">
                    /{dest.slug}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      to={`/destinations/${dest.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-[#173F35] transition-colors"
                      title="View Public Destination Page"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsNewDestination(false);
                        setEditingDestination(dest);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-[#173F35] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      title="Edit Destination, Attractions & Photos"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#E99B54]" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDestination(dest.id)}
                      className="p-1.5 rounded-lg bg-white border border-stone-200 text-red-500 hover:text-red-700 hover:border-red-200 shadow-xs transition-colors cursor-pointer"
                      title="Delete Destination"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB: REGION CATEGORIES                                        */}
      {/* ============================================================= */}
      {activeTab === 'regions' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-bold text-base sm:text-lg text-[#173F35]">
                  Region Categories ({regions.length})
                </h2>
                <span className="text-[10px] font-bold text-[#E99B54] bg-[#E99B54]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Zones
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Create and manage regional zones (e.g. North Bengal & Dooars, Sikkim, Meghalaya, Spiti). These categorize tour packages, filter public destination directories, and guide travelers.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreateNewRegion}
              className="inline-flex items-center gap-1.5 bg-[#173F35] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1F4F43] shadow cursor-pointer self-start sm:self-auto transition-all"
            >
              <Plus className="w-4 h-4 text-[#E99B54]" />
              <span>Create Region Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {regions.map((reg) => {
              const linkedDestCount = destinations.filter(
                (d) => d.region?.toLowerCase() === reg.name.toLowerCase()
              ).length;

              return (
                <div
                  key={reg.id}
                  className="bg-stone-50/80 rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="relative h-36 w-full overflow-hidden bg-stone-200">
                      <img
                        src={reg.heroImage}
                        alt={reg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        {reg.badge && (
                          <span className="bg-[#E99B54] text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
                            {reg.badge}
                          </span>
                        )}
                        {reg.featured && (
                          <span className="bg-[#173F35] text-white font-semibold text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-[#E99B54]" />
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 text-white">
                        <h3 className="font-serif font-bold text-lg leading-snug drop-shadow-sm">
                          {reg.name}
                        </h3>
                        <p className="text-[10px] text-stone-200 font-mono">
                          slug: /{reg.slug}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {reg.description || 'No description added yet.'}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/80 text-[11px] text-stone-500 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#E99B54]" />
                          <span>{linkedDestCount} Linked Destination{linkedDestCount === 1 ? '' : 's'}</span>
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">Order #{reg.order || 1}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex items-center justify-end gap-2 border-t border-stone-100 bg-stone-50/50">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewRegion(false);
                        setEditingRegion({ ...reg });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#173F35] hover:border-[#173F35]/30 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      title="Edit Region Category"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#E99B54]" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRegion(reg.id, reg.name)}
                      className="p-1.5 rounded-xl bg-white border border-stone-200 text-red-500 hover:text-red-700 hover:border-red-200 shadow-xs transition-colors cursor-pointer"
                      title="Delete Region Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {regions.length === 0 && (
            <div className="text-center py-12 px-4 text-stone-500 text-xs bg-stone-50 rounded-2xl border border-dashed border-stone-200 flex flex-col items-center justify-center gap-3">
              <MapPin className="w-8 h-8 text-stone-300" />
              <p>No region categories found. Create regional categories to organize tours and destinations.</p>
              <button
                type="button"
                onClick={handleCreateNewRegion}
                className="inline-flex items-center gap-1.5 bg-[#173F35] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1F4F43] transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#E99B54]" />
                <span>Create First Region Category</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB: EXPERIENCE GALLERY                                       */}
      {/* ============================================================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header & Action Controls */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-bold text-base sm:text-lg text-[#173F35]">
                  Travel Experience Gallery ({galleryItems.length})
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Homepage Visual Stories
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-2xl">
                Upload and curate breathtaking photography highlights, captions, and trail locations showcased in the interactive &ldquo;Visual Stories&rdquo; gallery on the homepage.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleResetGallery}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                title="Restore original curated photography presets"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#E99B54]" />
                <span>Reset Default Curations</span>
              </button>

              <button
                type="button"
                onClick={handleCreateNewGalleryItem}
                className="inline-flex items-center gap-1.5 bg-[#173F35] hover:bg-[#1F4F43] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#E99B54]" />
                <span>Add Photo Story</span>
              </button>
            </div>
          </div>

          {/* Gallery Section Heading Customizer */}
          <div className="bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#173F35]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Homepage Section Headline & Subtitle
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  StorageService.updateSiteSettings(siteSettings);
                  reloadData();
                  showToast('Gallery section heading updated!');
                }}
                className="text-xs font-bold text-[#173F35] bg-white border border-stone-200 hover:bg-stone-100 px-3 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
              >
                <Save className="w-3 h-3 text-[#E99B54]" />
                <span>Save Section Titles</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Section Title (Public Homepage)
                </label>
                <input
                  type="text"
                  value={siteSettings.galleryTitle || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, galleryTitle: e.target.value })}
                  placeholder="e.g. Travel Experience Gallery"
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={siteSettings.gallerySubtitle || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, gallerySubtitle: e.target.value })}
                  placeholder="e.g. Real moments from the trails, sacred heights, and lush river valleys."
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                />
              </div>
            </div>
          </div>

          {/* Gallery Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Photo Display */}
                <div className="relative h-56 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-[#E99B54] text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
                      {item.tag || 'Experience'}
                    </span>
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[11px] font-semibold text-[#E99B54] flex items-center gap-1 drop-shadow-sm">
                      <MapPin className="w-3 h-3 text-[#E99B54]" />
                      <span>{item.location}</span>
                    </p>
                    <h3 className="font-serif font-bold text-base leading-snug drop-shadow-sm truncate mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {item.description || 'No caption story added yet.'}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    {/* Reordering Controls */}
                    <div className="flex items-center gap-1 text-stone-400">
                      <span className="text-[10px] font-bold text-stone-400 mr-1 uppercase">Order:</span>
                      <button
                        type="button"
                        onClick={() => handleMoveGalleryItem(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded-lg border border-stone-200 transition-colors ${
                          index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-100 text-stone-700 cursor-pointer'
                        }`}
                        title="Move Left / Earlier"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveGalleryItem(index, 'down')}
                        disabled={index === galleryItems.length - 1}
                        className={`p-1 rounded-lg border border-stone-200 transition-colors ${
                          index === galleryItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-stone-100 text-stone-700 cursor-pointer'
                        }`}
                        title="Move Right / Later"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewGalleryItem(false);
                          setEditingGalleryItem({ ...item });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                        title="Edit photo, caption, or tag"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#E99B54]" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryItem(item.id, item.title)}
                        className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition-colors cursor-pointer"
                        title="Delete photo from gallery"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {galleryItems.length === 0 && (
            <div className="text-center py-12 px-4 text-stone-500 text-xs bg-stone-50 rounded-3xl border border-dashed border-stone-200 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#E99B54] flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-800 text-sm">No Travel Experience Photos Listed</h4>
                <p className="text-stone-500 mt-1 max-w-md">
                  Upload custom tour moments or restore the high-resolution curated photography of the Himalayas and North East.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCreateNewGalleryItem}
                  className="inline-flex items-center gap-1.5 bg-[#173F35] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1F4F43] transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E99B54]" />
                  <span>Add First Photo Story</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetGallery}
                  className="inline-flex items-center gap-1.5 bg-white border border-stone-200 text-stone-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-stone-100 transition-all cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#E99B54]" />
                  <span>Restore Curated Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB: BLOG                                                     */}
      {/* ============================================================= */}
      {activeTab === 'blog' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-sans font-bold text-base sm:text-lg text-[#173F35]">
                Travel Articles ({blogPosts.length})
              </h2>
              <p className="text-xs text-stone-500">
                Manage expedition guides, high altitude packing tips, and field notes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreateNewBlogPost}
              className="inline-flex items-center gap-1.5 bg-[#173F35] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1F4F43] shadow cursor-pointer self-start sm:self-auto transition-all"
            >
              <Plus className="w-4 h-4 text-[#E99B54]" />
              <span>Add Blog Article</span>
            </button>
          </div>

          <div className="space-y-3">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xs transition-shadow"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-200/80">
                    <img
                      src={post.coverImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-[#E99B54] uppercase tracking-wider">{post.category}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${post.published ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 line-clamp-1">{post.title}</h3>
                    <p className="text-stone-500 text-[11px] sm:text-xs">{post.author?.name || 'Author'} • {post.publishedAt} • {post.readTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    to={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-[#173F35] transition-colors"
                    title="View Published Article"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsNewBlogPost(false);
                      setEditingBlogPost(post);
                    }}
                    className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#173F35] transition-colors cursor-pointer"
                    title="Edit Blog Article"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteBlogPost(post.id)}
                    className="p-2 rounded-xl bg-white border border-stone-200 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    title="Delete Article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {blogPosts.length === 0 && (
              <div className="text-center py-12 text-stone-400 text-xs bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                No blog articles found. Click &quot;Add Blog Article&quot; to publish your first story.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB: WEBSITE LAYOUT, TEXTS & SETTINGS STUDIO                  */}
      {/* ============================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 animate-in fade-in duration-200 max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  Devoloper & Admin Studio
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-500 font-medium">Live Website Customizer</span>
              </div>
              <h2 className="font-sans font-bold text-base sm:text-lg text-[#173F35]">
                Website Layout, Texts & Details Studio
              </h2>
              <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
                Full visual and content control: toggle homepage layout sections, customize hero headlines and badges, update the brand story narrative, and configure WhatsApp contact routing.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetSettingsToDefaults}
                className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Restore initial Baunduilla defaults"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Sub-Tabs Selector */}
          <div className="flex items-center gap-2 p-1 bg-stone-100/80 rounded-2xl border border-stone-200/80 overflow-x-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setSettingsSubTab('layout')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                settingsSubTab === 'layout'
                  ? 'bg-white text-[#173F35] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layout className="w-4 h-4 text-[#E99B54]" />
              <span>Layout & Sections</span>
            </button>
            <button
              type="button"
              onClick={() => setSettingsSubTab('menu')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                settingsSubTab === 'menu'
                  ? 'bg-white text-[#173F35] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Hotel className="w-4 h-4 text-[#E99B54]" />
              <span>Main Menu Buttons</span>
            </button>
            <button
              type="button"
              onClick={() => setSettingsSubTab('texts')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                settingsSubTab === 'texts'
                  ? 'bg-white text-[#173F35] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Type className="w-4 h-4 text-[#E99B54]" />
              <span>Hero & Homepage Texts</span>
            </button>
            <button
              type="button"
              onClick={() => setSettingsSubTab('team')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                settingsSubTab === 'team'
                  ? 'bg-white text-[#173F35] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Users className="w-4 h-4 text-[#E99B54]" />
              <span>Team Members ({teamMembers.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSettingsSubTab('story')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                settingsSubTab === 'story'
                  ? 'bg-white text-[#173F35] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#E99B54]" />
              <span>About Us Narrative</span>
            </button>
            <button
              type="button"
              onClick={() => setSettingsSubTab('details')}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                settingsSubTab === 'details'
                  ? 'bg-white text-[#173F35] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Globe className="w-4 h-4 text-[#E99B54]" />
              <span>Contacts & Global Details</span>
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* -------------------------------------------------------- */}
            {/* SUBTAB 1: LAYOUT & SECTIONS                              */}
            {/* -------------------------------------------------------- */}
            {settingsSubTab === 'layout' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Homepage Section Modular Switches</p>
                    <p className="text-amber-800/90 mt-0.5">
                      Enable or disable individual sections of the homepage layout. Changes reflect immediately on save.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Header Navigation Action Buttons (Get A Hotel & Hire A Cab) */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-amber-200/90 bg-amber-50/50 hover:bg-amber-50 transition-colors">
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-800">Main Menu Action Buttons</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                          {siteSettings.hotelButtonEnabled !== false && siteSettings.cabButtonEnabled !== false
                            ? 'Both Enabled'
                            : siteSettings.hotelButtonEnabled !== false || siteSettings.cabButtonEnabled !== false
                            ? '1 Enabled'
                            : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Customize destination links, labels, and switches for &quot;Get A Hotel&quot; and &quot;Hire A Cab&quot; on the website header.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettingsSubTab('menu')}
                      className="text-xs font-bold text-[#173F35] bg-white border border-stone-200 hover:bg-stone-100 px-3 py-1.5 rounded-xl cursor-pointer shrink-0 transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Hotel className="w-3.5 h-3.5 text-amber-600" />
                      <span>Configure Links →</span>
                    </button>
                  </div>

                  {/* Category Carousel */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-800">Destination Category Carousel</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Interactive</span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Displays the 4-category carousel and regional destination slider on the homepage.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSiteSettings({ ...siteSettings, showCategoryCarousel: siteSettings.showCategoryCarousel === false ? true : false })}
                      className="cursor-pointer shrink-0"
                    >
                      {siteSettings.showCategoryCarousel !== false ? (
                        <ToggleRight className="w-9 h-9 text-[#173F35]" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-stone-400" />
                      )}
                    </button>
                  </div>

                  {/* Verified Base Tariff */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-800">Verified Base Tariff Breakdown</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-200 text-stone-700">Pricing</span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Shows the transparent base tariff card and comparison breakdown for all packages.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSiteSettings({ ...siteSettings, showVerifiedTariff: siteSettings.showVerifiedTariff === false ? true : false })}
                      className="cursor-pointer shrink-0"
                    >
                      {siteSettings.showVerifiedTariff !== false ? (
                        <ToggleRight className="w-9 h-9 text-[#173F35]" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-stone-400" />
                      )}
                    </button>
                  </div>

                  {/* Travel Experience Gallery */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-800">Travel Experience Gallery (Visual Stories)</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">{galleryItems.length} Photos</span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Displays the full-bleed curated visual photography gallery showcase on the homepage.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('gallery')}
                      className="text-xs font-bold text-[#173F35] bg-white border border-stone-200 hover:bg-stone-100 px-3 py-1.5 rounded-xl cursor-pointer shrink-0 transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#E99B54]" />
                      <span>Manage Gallery →</span>
                    </button>
                  </div>

                  {/* Traveler Testimonials */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-800">Traveler Reviews & Testimonials Carousel</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">Social Proof</span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Renders the traveler feedback carousel and Google Business Rating badges.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSiteSettings({ ...siteSettings, showTestimonials: siteSettings.showTestimonials === false ? true : false })}
                      className="cursor-pointer shrink-0"
                    >
                      {siteSettings.showTestimonials !== false ? (
                        <ToggleRight className="w-9 h-9 text-[#173F35]" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-stone-400" />
                      )}
                    </button>
                  </div>

                  {/* Blog & Articles */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-800">Baunduilla Dispatch & Articles</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">Guides</span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Shows featured travel guides and Himalayan route articles.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSiteSettings({ ...siteSettings, showBlogSection: siteSettings.showBlogSection === false ? true : false })}
                      className="cursor-pointer shrink-0"
                    >
                      {siteSettings.showBlogSection !== false ? (
                        <ToggleRight className="w-9 h-9 text-[#173F35]" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-stone-400" />
                      )}
                    </button>
                  </div>

                  {/* FAQs Section */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-800">Frequently Asked Questions</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-200 text-stone-700">Support</span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Renders the essential trip preparation and permit questions section.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSiteSettings({ ...siteSettings, showFaqSection: siteSettings.showFaqSection === false ? true : false })}
                      className="cursor-pointer shrink-0"
                    >
                      {siteSettings.showFaqSection !== false ? (
                        <ToggleRight className="w-9 h-9 text-[#173F35]" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-stone-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Theme Accent Preference */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Primary Brand Palette Accent
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'baunduilla-emerald' as const, name: 'Forest Green', hex: '#173F35', desc: 'Himalayan Pine' },
                      { id: 'terracotta-warm' as const, name: 'Terracotta Amber', hex: '#E99B54', desc: 'Sunbeam Accent' },
                      { id: 'himalayan-midnight' as const, name: 'Mountain Navy', hex: '#17324D', desc: 'Outpost Indigo' },
                      { id: 'forest-moss' as const, name: 'Deep Earth', hex: '#202824', desc: 'Rich Charcoal' },
                    ].map((palette) => (
                      <div
                        key={palette.id}
                        onClick={() => setSiteSettings({ ...siteSettings, themeAccent: palette.id })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                          (siteSettings.themeAccent || 'baunduilla-emerald') === palette.id
                            ? 'border-[#173F35] bg-stone-50 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: palette.hex }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">{palette.name}</p>
                          <p className="text-[10px] text-stone-500">{palette.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* SUBTAB: MAIN MENU BUTTONS (HOTEL & CAB LINKS)            */}
            {/* -------------------------------------------------------- */}
            {settingsSubTab === 'menu' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Information Callout */}
                <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Main Menu Action Buttons Configuration</p>
                    <p className="text-amber-800/90 leading-relaxed">
                      Configure the <strong>Get A Hotel</strong> and <strong>Hire A Cab</strong> buttons displayed in the website&apos;s top navigation bar and mobile menu. You can customize the button labels, destination links (custom URLs, WhatsApp chat triggers, or internal site pages), or toggle individual buttons on and off.
                    </p>
                  </div>
                </div>

                {/* Live Header Preview */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Live Header Preview
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      Updates live when saved
                    </span>
                  </div>

                  <div className="bg-white rounded-full p-2.5 px-4 border border-stone-200 shadow-sm flex items-center justify-between gap-3 overflow-x-auto">
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-6 h-6 rounded-lg bg-[#173F35] text-white flex items-center justify-center font-bold text-xs">
                        B
                      </div>
                      <span className="font-serif font-bold text-xs text-[#173F35] hidden sm:inline">Baunduilla</span>
                    </div>

                    <div className="hidden md:flex items-center gap-3 text-[11px] text-stone-400">
                      <span>Home</span>
                      <span>Destinations</span>
                      <span>Packages</span>
                      <span>Treks</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {siteSettings.hotelButtonEnabled !== false && (
                        <div className="text-xs font-semibold text-stone-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                          <Hotel className="w-3.5 h-3.5 text-amber-600" />
                          <span>{siteSettings.hotelButtonText || 'Get A Hotel'}</span>
                        </div>
                      )}

                      {siteSettings.cabButtonEnabled !== false && (
                        <div className="text-xs font-semibold text-stone-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                          <Car className="w-3.5 h-3.5 text-sky-600" />
                          <span>{siteSettings.cabButtonText || 'Hire A Cab'}</span>
                        </div>
                      )}

                      <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Card 1: Get A Hotel Button */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Hotel className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900">Get A Hotel Button</h4>
                          <p className="text-[11px] text-stone-500">Accommodation & Homestay inquiries</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSiteSettings({
                            ...siteSettings,
                            hotelButtonEnabled: siteSettings.hotelButtonEnabled === false ? true : false,
                          })
                        }
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          siteSettings.hotelButtonEnabled !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {siteSettings.hotelButtonEnabled !== false ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                          Button Label Text *
                        </label>
                        <input
                          type="text"
                          value={siteSettings.hotelButtonText || ''}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, hotelButtonText: e.target.value })
                          }
                          placeholder="e.g. Get A Hotel"
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                            Button Link URL or Page Path *
                          </label>
                          {siteSettings.hotelButtonUrl && (
                            <a
                              href={siteSettings.hotelButtonUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#E99B54] hover:underline flex items-center gap-0.5"
                            >
                              <span>Test Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <input
                          type="text"
                          value={siteSettings.hotelButtonUrl || ''}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, hotelButtonUrl: e.target.value })
                          }
                          placeholder="e.g. https://wa.me/917872464356 or /contact or https://booking.com/..."
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                        />
                      </div>

                      {/* 1-Click Link Generators */}
                      <div className="pt-1 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Quick Preset Links
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setSiteSettings({
                                ...siteSettings,
                                hotelButtonUrl: generateWhatsAppLink(
                                  siteSettings.whatsappNumber,
                                  'Hello Baunduilla, I would like to inquire about booking a hotel or homestay.'
                                ),
                              })
                            }
                            className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors"
                          >
                            Direct WhatsApp Query
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setSiteSettings({
                                ...siteSettings,
                                hotelButtonUrl: '/contact',
                              })
                            }
                            className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors"
                          >
                            Contact Page (/contact)
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setSiteSettings({
                                ...siteSettings,
                                hotelButtonUrl: '/plan-my-trip',
                              })
                            }
                            className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors"
                          >
                            Trip Planner (/plan-my-trip)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Hire A Cab Button */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900">Hire A Cab Button</h4>
                          <p className="text-[11px] text-stone-500">Mountain taxi & car rental bookings</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSiteSettings({
                            ...siteSettings,
                            cabButtonEnabled: siteSettings.cabButtonEnabled === false ? true : false,
                          })
                        }
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          siteSettings.cabButtonEnabled !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {siteSettings.cabButtonEnabled !== false ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                          Button Label Text *
                        </label>
                        <input
                          type="text"
                          value={siteSettings.cabButtonText || ''}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, cabButtonText: e.target.value })
                          }
                          placeholder="e.g. Hire A Cab"
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                            Button Link URL or Page Path *
                          </label>
                          {siteSettings.cabButtonUrl && (
                            <a
                              href={siteSettings.cabButtonUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#E99B54] hover:underline flex items-center gap-0.5"
                            >
                              <span>Test Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <input
                          type="text"
                          value={siteSettings.cabButtonUrl || ''}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, cabButtonUrl: e.target.value })
                          }
                          placeholder="e.g. https://wa.me/917872464356 or taxi booking portal or /contact"
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                        />
                      </div>

                      {/* 1-Click Link Generators */}
                      <div className="pt-1 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Quick Preset Links
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setSiteSettings({
                                ...siteSettings,
                                cabButtonUrl: generateWhatsAppLink(
                                  siteSettings.whatsappNumber,
                                  'Hello Baunduilla, I would like to hire a cab or mountain taxi for my trip.'
                                ),
                              })
                            }
                            className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors"
                          >
                            Direct WhatsApp Cab Query
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setSiteSettings({
                                ...siteSettings,
                                cabButtonUrl: '/contact',
                              })
                            }
                            className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors"
                          >
                            Contact Page (/contact)
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setSiteSettings({
                                ...siteSettings,
                                cabButtonUrl: '/plan-my-trip',
                              })
                            }
                            className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors"
                          >
                            Trip Planner (/plan-my-trip)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* SUBTAB 2: HERO & HOMEPAGE TEXTS                          */}
            {/* -------------------------------------------------------- */}
            {settingsSubTab === 'texts' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Hero Top Badge */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Hero Top Pill Badge Text
                  </label>
                  <input
                    type="text"
                    value={siteSettings.heroBadge || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, heroBadge: e.target.value })}
                    placeholder="e.g. Certified Mountain Guides & Forest Safaris"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5">
                    <p className="text-[11px] text-stone-500">
                      Displays with the official mountain guides & forest safaris emblem badge.
                    </p>
                    {siteSettings.heroBadge && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-semibold text-stone-800 shadow-xs">
                        <CertifiedGuideLogo className="w-4 h-4" />
                        <span>{siteSettings.heroBadge}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Headline */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Main Hero Headline *
                  </label>
                  <textarea
                    rows={2}
                    value={siteSettings.heroHeadline || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadline: e.target.value })}
                    placeholder="e.g. Book your adventure journey now!"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    The primary bold headline welcoming visitors. Line breaks are preserved.
                  </p>
                </div>

                {/* Hero Subheadline */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Hero Subheadline / Value Proposition
                  </label>
                  <textarea
                    rows={3}
                    value={siteSettings.heroSubheadline || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, heroSubheadline: e.target.value })}
                    placeholder="e.g. With Baunduilla, explore wildlife safaris in Dooars, living root bridges in Meghalaya, tea garden retreats, and Himalayan road trips. Just start with where you want to go."
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                </div>

                {/* Hero CTA Button Text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Hero Search Placeholder / CTA
                    </label>
                    <input
                      type="text"
                      value={siteSettings.heroCtaText || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroCtaText: e.target.value })}
                      placeholder="e.g. Where to? (e.g. Dooars, Sikkim, Spiti)"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Hero Feature Photo (Upload or URL)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={siteSettings.heroImage || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroImage: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs truncate"
                      />
                      <label className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1 transition-colors">
                        <UploadCloud className="w-3.5 h-3.5 text-[#173F35]" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                {siteSettings.heroImage && (
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
                    <img
                      src={siteSettings.heroImage}
                      alt="Hero preview"
                      className="w-20 h-14 object-cover rounded-xl border border-stone-300 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-800">Hero Media Loaded</p>
                      <p className="text-[11px] text-stone-500 truncate">{siteSettings.heroImage}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSiteSettings({ ...siteSettings, heroImage: '' })}
                      className="text-xs text-rose-600 hover:underline px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* SUBTAB: TEAM MEMBERS (ABOUT US PAGE)                     */}
            {/* -------------------------------------------------------- */}
            {settingsSubTab === 'team' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#173F35] text-white">
                        About Us Page Showcase
                      </span>
                      <span className="text-xs font-bold text-amber-900">
                        {teamMembers.length} Members Listed
                      </span>
                    </div>
                    <h3 className="font-sans font-bold text-base text-[#173F35]">
                      Our Team Members
                    </h3>
                    <p className="text-xs text-amber-900/80 leading-relaxed max-w-xl">
                      Configure the team coordinators shown on the public About Us page. You can add profile photos, set designations/titles, or write personal bios anytime.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateNewTeamMember}
                    className="self-start sm:self-center inline-flex items-center gap-1.5 bg-[#173F35] hover:bg-[#1F4F43] active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#E99B54]" />
                    <span>Add Team Member</span>
                  </button>
                </div>

                {/* Team Members List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member, idx) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#173F35]/30 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {member.photo ? (
                              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-xs">
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
                              <div className="w-14 h-14 rounded-2xl bg-[#173F35] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
                                <span className="text-[#E99B54] font-serif">{member.name.charAt(0) || 'T'}</span>
                              </div>
                            )}

                            <div className="min-w-0">
                              <h4 className="font-serif font-bold text-base text-stone-900 truncate">
                                {member.name}
                              </h4>
                              {member.role && member.role.trim() !== '' ? (
                                <p className="text-xs text-[#E99B54] font-semibold truncate">
                                  {member.role}
                                </p>
                              ) : (
                                <p className="text-[11px] text-stone-400 italic">
                                  (No designation set)
                                </p>
                              )}
                              <span className="text-[10px] font-mono text-stone-400">
                                Position #{idx + 1}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveTeamMember(idx, 'up')}
                              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                              title="Move Up"
                            >
                              <ChevronLeft className="w-4 h-4 rotate-90" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === teamMembers.length - 1}
                              onClick={() => handleMoveTeamMember(idx, 'down')}
                              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                              title="Move Down"
                            >
                              <ChevronRight className="w-4 h-4 rotate-90" />
                            </button>
                          </div>
                        </div>

                        {member.bio && member.bio.trim() !== '' ? (
                          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                            {member.bio}
                          </p>
                        ) : (
                          <p className="text-[11px] text-stone-400 italic bg-stone-50/50 p-2 rounded-xl">
                            No bio added yet. Click &quot;Edit Details&quot; to write a short introduction.
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewTeamMember(false);
                            setEditingTeamMember(member);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#173F35]" />
                          <span>Edit Details & Photo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTeamMember(member.id, member.name)}
                          className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {teamMembers.length === 0 && (
                  <div className="text-center py-12 text-stone-400 text-xs bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
                    <Users className="w-8 h-8 text-stone-300 mx-auto" />
                    <p>No team members listed. Click &quot;Add Team Member&quot; to add Suvankar Paul, Pritam Bose, or Tapabrata Dey Sarkar.</p>
                  </div>
                )}
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* SUBTAB 3: ABOUT US NARRATIVE                             */}
            {/* -------------------------------------------------------- */}
            {settingsSubTab === 'story' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    About Page Story Headline
                  </label>
                  <input
                    type="text"
                    value={siteSettings.aboutStoryTitle || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, aboutStoryTitle: e.target.value })}
                    placeholder="e.g. Born From a Passion for the Eastern Himalayas"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    About Page Story Subtitle / Eyebrow
                  </label>
                  <input
                    type="text"
                    value={siteSettings.aboutStorySubtitle || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, aboutStorySubtitle: e.target.value })}
                    placeholder="e.g. How We Began • Our Journey & Philosophy"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    About Brand Narrative (Paragraphs)
                  </label>
                  <textarea
                    rows={6}
                    value={siteSettings.aboutStoryContent || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, aboutStoryContent: e.target.value })}
                    placeholder="In Bengali folklore and colloquial speech, a 'Baunduilla' is someone with an untethered, wandering heart..."
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Separate paragraphs with a blank line. These appear dynamically on the About Us page.
                  </p>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* SUBTAB 4: CONTACTS & GLOBAL DETAILS                      */}
            {/* -------------------------------------------------------- */}
            {settingsSubTab === 'details' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Official WhatsApp Number (Clean digits with Country Code) *
                  </label>
                  <input
                    type="text"
                    value={siteSettings.whatsappNumber}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 917872464356 (without spaces or +)"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    All prefilled customer inquiry messages are dispatched to this number. India country code prefix is <code className="bg-stone-100 px-1 rounded">91</code> followed by 10 digits.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Customer Phone Display
                    </label>
                    <input
                      type="text"
                      value={siteSettings.contactPhone}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Official Travel Desk Email
                    </label>
                    <input
                      type="email"
                      value={siteSettings.contactEmail}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Base Office Address (Dhupguri, West Bengal)
                  </label>
                  <input
                    type="text"
                    value={siteSettings.address}
                    onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Google Business Profile / Review URL (Good Business Rating Link)
                  </label>
                  <input
                    type="url"
                    value={siteSettings.googleBusinessUrl || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, googleBusinessUrl: e.target.value })}
                    placeholder="e.g. https://maps.app.goo.gl/... or https://g.page/r/.../review"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Destination for the 4.9/5.0 Google Business Rating badges in the hero section and traveler review cards.
                  </p>
                </div>

                {/* Social Media Platforms */}
                <div className="pt-2 border-t border-stone-200/80 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Official Social Media Platforms
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Links displayed across the site footer, contact page, and expedition dispatches.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {/* Facebook */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                          <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                          <span>Facebook URL</span>
                        </label>
                        {siteSettings.facebookUrl && (
                          <a
                            href={siteSettings.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#E99B54] hover:underline flex items-center gap-0.5"
                          >
                            <span>Open Facebook</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <input
                        type="url"
                        value={siteSettings.facebookUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, facebookUrl: e.target.value })}
                        placeholder="https://www.facebook.com/share/..."
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                      />
                    </div>

                    {/* Instagram */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                          <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />
                          <span>Instagram URL</span>
                        </label>
                        {siteSettings.instagramUrl && (
                          <a
                            href={siteSettings.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#E99B54] hover:underline flex items-center gap-0.5"
                          >
                            <span>Open Instagram</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <input
                        type="url"
                        value={siteSettings.instagramUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                        placeholder="https://www.instagram.com/baunduilla?xtok=..."
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                      />
                    </div>

                    {/* YouTube */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                          <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                          <span>YouTube URL</span>
                        </label>
                        {siteSettings.youtubeUrl && (
                          <a
                            href={siteSettings.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#E99B54] hover:underline flex items-center gap-0.5"
                          >
                            <span>Open YouTube</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <input
                        type="url"
                        value={siteSettings.youtubeUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/@baunduilla?si=..."
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Top Bar Operational Notice (Leave empty to hide)
                  </label>
                  <input
                    type="text"
                    value={siteSettings.operationalNotice}
                    onChange={(e) => setSiteSettings({ ...siteSettings, operationalNotice: e.target.value })}
                    placeholder="e.g. All North Sikkim permits are open for winter departures."
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Footer Tagline / Short Summary
                  </label>
                  <input
                    type="text"
                    value={siteSettings.footerTagline || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, footerTagline: e.target.value })}
                    placeholder="e.g. Baunduilla is an Indian adventure travel agency and community..."
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Footer Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={siteSettings.copyrightText || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, copyrightText: e.target.value })}
                    placeholder="e.g. © 2026 Baunduilla Adventures. All rights reserved."
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-stone-500">
                All modifications are saved persistently in browser storage and published live across the app.
              </p>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#173F35] hover:bg-[#1F4F43] active:scale-95 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#E99B54]" />
                <span>Save All Website Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB: CLOUD & FIREBASE BLUEPRINT                               */}
      {/* ============================================================= */}
            {/* ============================================================= */}
      {/* TAB: TEAM & USER-BASED ACCESS CONTROL (SUPER ADMIN EXCLUSIVE)  */}
      {/* ============================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {!isSuperAdmin ? (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-red-900">Restricted Section</h3>
              <p className="text-xs text-red-700 max-w-md mx-auto">
                Only the Super Admin has permission to view, create, and manage team accounts and dashboard module privileges.
              </p>
            </div>
          ) : (
            <>
              {/* Header and Quick Stats */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-sans font-bold text-base sm:text-lg text-[#173F35]">
                        Team & User-Based Access Control
                      </h2>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                        Super Admin Panel
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Create new team users, assign system roles, and grant granular access to specific dashboard sections (Inquiries, Tours, Destinations, Blog, Settings).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateNewUser}
                    className="inline-flex items-center gap-1.5 bg-[#173F35] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1F4F43] shadow cursor-pointer self-start sm:self-auto transition-all"
                  >
                    <UserPlus className="w-4 h-4 text-[#E99B54]" />
                    <span>Create New User</span>
                  </button>
                </div>

                {/* Team Metrics Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-stone-100">
                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-bold uppercase text-stone-400 block mb-0.5">Total Team</span>
                    <span className="text-lg font-bold font-sans text-[#173F35]">{users.length}</span>
                  </div>
                  <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200">
                    <span className="text-[10px] font-bold uppercase text-amber-700 block mb-0.5">Super Admins</span>
                    <span className="text-lg font-bold font-sans text-amber-900">
                      {users.filter(u => u.role === 'super_admin').length}
                    </span>
                  </div>
                  <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-200">
                    <span className="text-[10px] font-bold uppercase text-purple-700 block mb-0.5">Managers & Staff</span>
                    <span className="text-lg font-bold font-sans text-purple-900">
                      {users.filter(u => u.role === 'manager' || u.role === 'admin').length}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-bold uppercase text-stone-400 block mb-0.5">Suspended</span>
                    <span className="text-lg font-bold font-sans text-stone-700">
                      {users.filter(u => u.status === 'suspended').length}
                    </span>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-stone-100">
                  <div className="relative flex-1 max-w-sm">
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Search users by name, email, or department..."
                      className="w-full pl-3 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                    {['all', 'super_admin', 'manager', 'editor'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setUserRoleFilter(r)}
                        className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition-all cursor-pointer ${
                          userRoleFilter === r
                            ? 'bg-[#173F35] text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {r === 'all' ? 'All Roles' : r.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Users Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {users
                  .filter((u) => {
                    const matchesSearch =
                      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      (u.department && u.department.toLowerCase().includes(userSearchQuery.toLowerCase()));
                    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                    return matchesSearch && matchesRole;
                  })
                  .map((user) => (
                    <div
                      key={user.id}
                      className={`bg-white rounded-3xl border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                        user.isPrimarySuperAdmin
                          ? 'border-amber-300 shadow-xs ring-1 ring-amber-200/50'
                          : user.status === 'suspended'
                          ? 'border-red-200 bg-red-50/20'
                          : 'border-stone-200'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* User Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-2xl bg-[#173F35] text-white flex items-center justify-center font-bold text-base tracking-wider border border-stone-200 shadow-xs">
                                {user.name.charAt(0)}
                              </div>
                              <span
                                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                  user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                                }`}
                              />
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="font-serif font-bold text-base text-stone-900">
                                  {user.name}
                                </h3>
                              </div>
                              <p className="text-[11px] text-stone-500">{user.email}</p>
                              <p className="text-[10px] text-stone-400">{user.department || 'Operations'}</p>
                            </div>
                          </div>

                          <div className="shrink-0 flex flex-col items-end gap-1">
                            {user.isPrimarySuperAdmin ? (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                                <Crown className="w-3 h-3 fill-current" />
                                Primary
                              </span>
                            ) : (
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                user.role === 'super_admin' ? 'bg-[#173F35] text-white' :
                                user.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'editor' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-stone-200 text-stone-700'
                              }`}>
                                {user.role.replace('_', ' ')}
                              </span>
                            )}

                            <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                              user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {user.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Assigned Dashboard Modules */}
                        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                            Assigned Dashboard Access ({user.allowedModules.length})
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {user.role === 'super_admin' ? (
                              <span className="text-[11px] font-bold text-[#173F35] flex items-center gap-1">
                                <Crown className="w-3 h-3 text-[#E99B54]" />
                                Full Master Access (All Modules)
                              </span>
                            ) : (
                              user.allowedModules.map((mod) => (
                                <span
                                  key={mod}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-white border border-stone-200 text-stone-700"
                                >
                                  {mod === 'overview' ? '📊 Overview' :
                                   mod === 'inquiries' ? '💬 Inquiries' :
                                   mod === 'packages' ? '🎒 Tours' :
                                   mod === 'destinations' ? '📍 Destinations' :
                                   mod === 'regions' ? '🌐 Regions' :
                                   mod === 'blog' ? '✍️ Blog' :
                                   mod === 'settings' ? '⚙️ Settings' : mod}
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Metadata Footer */}
                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-1">
                          <span>PW: {user.password ? '••••••••' : 'Default'}</span>
                          <span>Last login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-IN') : 'Never'}</span>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleSwitchToUser(user)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#173F35] hover:text-[#E99B54] transition-colors cursor-pointer"
                          title="Switch to this user account view"
                        >
                          <Eye className="w-3 h-3 text-[#E99B54]" />
                          <span>View Dashboard As</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsNewUser(false);
                              setEditingUser({ ...user });
                            }}
                            className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                            title="Edit Role & Permissions"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {!user.isPrimarySuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleToggleUserStatus(user)}
                              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                                user.status === 'active'
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                              }`}
                              title={user.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                            >
                              {user.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          {!user.isPrimarySuperAdmin && user.id !== currentUser.id && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      

      {activeTab === 'cloud' && (
        <div className="bg-[#17324D] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
              <Shield className="w-4 h-4" />
              <span>Firebase Architecture & Security Layer</span>
            </div>
            <h2 className="font-sans text-base sm:text-lg font-bold">
              Cloud Firestore Schema & Fortress Rules
            </h2>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl">
              This application is built with a ready Firebase integration blueprint, intermediate schema representations, and zero-trust security rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-black/30 p-5 rounded-2xl border border-white/10 space-y-3">
              <h3 className="font-bold text-sm text-[#E99B54]">1. Firestore Blueprint Entities</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                The schema is declared strictly in <code className="bg-white/10 px-1 py-0.5 rounded text-white">firebase-blueprint.json</code> matching draft-07 standard.
              </p>
              <ul className="text-xs text-white/80 space-y-1">
                <li>• <code>/destinations</code> - Published regional guides</li>
                <li>• <code>/packages</code> - Tour packages & base INR tariffs</li>
                <li>• <code>/inquiries</code> - Private customer requests with status</li>
                <li>• <code>/blogPosts</code> - Field articles and stories</li>
                <li>• <code>/settings/global</code> - Official business WhatsApp & channels</li>
              </ul>
            </div>

            <div className="bg-black/30 p-5 rounded-2xl border border-white/10 space-y-3">
              <h3 className="font-bold text-sm text-[#E99B54]">2. Hardened Rules & Admin Email</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Rules file: <code className="bg-white/10 px-1 py-0.5 rounded text-white">firestore.rules</code> enforces:
              </p>
              <ul className="text-xs text-white/80 space-y-1">
                <li>• Default deny all unmapped paths</li>
                <li>• Public can read only published packages and destinations</li>
                <li>• Public can create inquiries with strict key & size guards</li>
                <li>• <strong>Inquiry read/list is forbidden to public</strong> (no customer PII leaks)</li>
                <li>• Full admin write access bound to <strong>contact.baunduilla@gmail.com</strong> with verified email</li>
              </ul>
            </div>
          </div>

          <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-2">
            <span className="text-xs font-bold text-stone-300">Environment Variables Reference (.env.example):</span>
            <pre className="text-xs font-mono text-emerald-300 overflow-x-auto p-3 bg-black/50 rounded-xl">
{`# AI Studio Injected Runtime Secrets
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
# Official Admin Email: contact.baunduilla@gmail.com`}
            </pre>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: COMPREHENSIVE TOUR PACKAGE MANAGER (ALL DETAILS)       */}
      {/* ============================================================= */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-4xl w-full rounded-3xl max-h-[92vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F7F5EF]/80 shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#173F35] text-white">
                    {isNewPackage ? 'Listing New Tour Package' : 'Editing Tour Package'}
                  </span>
                  {editingPackage.slug && (
                    <Link
                      to={`/packages/${editingPackage.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-[#173F35] font-semibold underline underline-offset-2"
                      title="Preview live package page"
                    >
                      <span>Preview on website</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
                <h3 className="font-sans font-bold text-base text-[#173F35] mt-0.5 truncate">
                  {editingPackage.title || 'Untitled Tour Package'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setEditingPackage(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors text-sm font-bold shadow-xs shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Navigation Bar */}
            <div className="flex items-center gap-1 px-4 sm:px-6 border-b border-stone-200 overflow-x-auto bg-stone-50/80 text-xs shrink-0 py-2">
              {[
                { id: 'basic', label: 'Overview & Style', icon: Package },
                { id: 'pricing', label: 'Pricing & Batches', icon: Calendar, badge: editingPackage.departureDates?.length },
                { id: 'highlights', label: 'Highlights', icon: Sparkles, badge: editingPackage.highlights?.length },
                { id: 'itinerary', label: 'Day-by-Day Plan', icon: Layers, badge: `${editingPackage.itinerary?.length || 0}D` },
                { id: 'inclusions', label: 'Inclusions & Exclusions', icon: ListChecks },
                { id: 'logistics', label: 'Stay & Transport', icon: HomeIcon },
                { id: 'media', label: 'Photos & Packing', icon: ImageIcon, badge: editingPackage.images?.length },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = pkgModalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPkgModalTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#173F35] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSavePackage} className="flex-1 overflow-y-auto flex flex-col">
              <div className="p-6 space-y-6 flex-1">

                {/* ------------------------------------------------------------- */}
                {/* TAB 1: OVERVIEW & STYLE                                      */}
                {/* ------------------------------------------------------------- */}
                {pkgModalTab === 'basic' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Tour Package Title *
                      </label>
                      <input
                        type="text"
                        value={editingPackage.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          const currentSlug = editingPackage.slug;
                          const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                          setEditingPackage({
                            ...editingPackage,
                            title: newTitle,
                            slug: (!currentSlug || isNewPackage) ? autoSlug : currentSlug
                          });
                        }}
                        placeholder="e.g. Untamed North Bengal & Dooars Wildlife Expedition"
                        className="w-full text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#173F35]/20 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-stone-700 uppercase">
                            URL Slug *
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const autoSlug = editingPackage.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                              setEditingPackage({ ...editingPackage, slug: autoSlug });
                            }}
                            className="text-[11px] text-[#173F35] font-semibold hover:underline"
                          >
                            Sync with title
                          </button>
                        </div>
                        <input
                          type="text"
                          value={editingPackage.slug}
                          onChange={(e) => setEditingPackage({ ...editingPackage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                          placeholder="e.g. north-bengal-wildlife-tour"
                          className="w-full text-xs font-mono px-3 py-2.5 border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Destination Region *
                        </label>
                        <select
                          value={editingPackage.destinationId}
                          onChange={(e) => {
                            const selectedDest = destinations.find(d => d.id === e.target.value);
                            setEditingPackage({
                              ...editingPackage,
                              destinationId: e.target.value,
                              destinationName: selectedDest ? selectedDest.name : editingPackage.destinationName
                            });
                          }}
                          className="w-full text-xs px-3 py-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 font-medium"
                        >
                          {destinations.map(dest => (
                            <option key={dest.id} value={dest.id}>
                              {dest.name} ({dest.region})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Short Summary / Tagline Overview *
                      </label>
                      <textarea
                        rows={2}
                        value={editingPackage.shortDescription}
                        onChange={(e) => setEditingPackage({ ...editingPackage, shortDescription: e.target.value })}
                        placeholder="1-2 sentences summarizing the unique thrill of this journey..."
                        className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Travel Style
                        </label>
                        <select
                          value={editingPackage.travelStyle}
                          onChange={(e) => setEditingPackage({ ...editingPackage, travelStyle: e.target.value as any })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl bg-white"
                        >
                          <option value="Road Trip">Road Trip</option>
                          <option value="Wildlife Safari">Wildlife Safari</option>
                          <option value="Trekking">Trekking</option>
                          <option value="Sightseeing">Sightseeing</option>
                          <option value="Camping">Camping</option>
                          <option value="Family Tour">Family Tour</option>
                          <option value="Cultural & Heritage">Cultural & Heritage</option>
                          <option value="Custom Itinerary">Custom Itinerary</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Trip Difficulty
                        </label>
                        <select
                          value={editingPackage.difficulty || 'Moderate'}
                          onChange={(e) => setEditingPackage({ ...editingPackage, difficulty: e.target.value as any })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl bg-white"
                        >
                          <option value="Easy">Easy (Family / Leisure)</option>
                          <option value="Moderate">Moderate (Active Walking)</option>
                          <option value="Challenging">Challenging (High Altitude / Treks)</option>
                          <option value="Strenuous">Strenuous (Rugged Expeditions)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Trip Type
                        </label>
                        <select
                          value={editingPackage.tripType}
                          onChange={(e) => setEditingPackage({ ...editingPackage, tripType: e.target.value as any })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl bg-white"
                        >
                          <option value="Both">Both (Group & Private)</option>
                          <option value="Group">Small Group Departures Only</option>
                          <option value="Private">Private Custom Trips Only</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Max Group Size (Per Batch)
                        </label>
                        <input
                          type="number"
                          min={2}
                          max={50}
                          value={editingPackage.maxGroupSize || 12}
                          onChange={(e) => setEditingPackage({ ...editingPackage, maxGroupSize: parseInt(e.target.value) || 12 })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl"
                        />
                        <p className="text-[11px] text-stone-500 mt-0.5">Typical small-group comfort size is 8 to 12 persons.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Display Destination Name
                        </label>
                        <input
                          type="text"
                          value={editingPackage.destinationName}
                          onChange={(e) => setEditingPackage({ ...editingPackage, destinationName: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    {/* Visibility Flags */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPackage.published}
                          onChange={(e) => setEditingPackage({ ...editingPackage, published: e.target.checked })}
                          className="w-4 h-4 rounded text-[#173F35] focus:ring-[#173F35]"
                        />
                        <span>Published on Website</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPackage.featured}
                          onChange={(e) => setEditingPackage({ ...editingPackage, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-[#173F35] focus:ring-[#173F35]"
                        />
                        <span>Feature on Homepage</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPackage.isVerifiedPrice}
                          onChange={(e) => setEditingPackage({ ...editingPackage, isVerifiedPrice: e.target.checked })}
                          className="w-4 h-4 rounded text-[#173F35] focus:ring-[#173F35]"
                        />
                        <span>Verified Price Badge</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 2: PRICING & BATCH DATES                                 */}
                {/* ------------------------------------------------------------- */}
                {pkgModalTab === 'pricing' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Base Price / Person (₹) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-500">₹</span>
                          <input
                            type="number"
                            min={1000}
                            value={editingPackage.pricePerPerson}
                            onChange={(e) => setEditingPackage({ ...editingPackage, pricePerPerson: parseInt(e.target.value) || 0 })}
                            className="w-full text-sm font-bold pl-7 pr-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Currency
                        </label>
                        <input
                          type="text"
                          value={editingPackage.currency || 'INR'}
                          onChange={(e) => setEditingPackage({ ...editingPackage, currency: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 border border-stone-300 rounded-xl uppercase font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Duration (Days) *
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={editingPackage.durationDays}
                          onChange={(e) => setEditingPackage({ ...editingPackage, durationDays: parseInt(e.target.value) || 1 })}
                          className="w-full text-xs px-3 py-2.5 border border-stone-300 rounded-xl"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Duration (Nights) *
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={editingPackage.durationNights}
                          onChange={(e) => setEditingPackage({ ...editingPackage, durationNights: parseInt(e.target.value) || 0 })}
                          className="w-full text-xs px-3 py-2.5 border border-stone-300 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    {/* Upcoming Departure Dates / Batches */}
                    <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#E99B54]" />
                            <span>Upcoming Batch Departure Dates ({editingPackage.departureDates?.length || 0})</span>
                          </h4>
                          <p className="text-[11px] text-stone-500">
                            Pre-scheduled departure dates shown to travelers on the package page and booking modal.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPackage({
                              ...editingPackage,
                              departureDates: [...(editingPackage.departureDates || []), '']
                            });
                          }}
                          className="inline-flex items-center gap-1 bg-[#173F35] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#1F4F43]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Date</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
                        {(editingPackage.departureDates || []).map((date, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-stone-200 shadow-2xs">
                            <input
                              type="text"
                              value={date}
                              onChange={(e) => {
                                const updated = [...(editingPackage.departureDates || [])];
                                updated[idx] = e.target.value;
                                setEditingPackage({ ...editingPackage, departureDates: updated });
                              }}
                              placeholder="e.g. 15 Nov 2026 or Weekly Saturdays"
                              className="flex-1 text-xs px-2 py-1 border-none focus:outline-none font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingPackage.departureDates.filter((_, i) => i !== idx);
                                setEditingPackage({ ...editingPackage, departureDates: updated });
                              }}
                              className="p-1 text-stone-400 hover:text-red-500 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {(!editingPackage.departureDates || editingPackage.departureDates.length === 0) && (
                        <p className="text-xs text-stone-400 italic py-2">No batch dates added yet. Click &quot;Add Date&quot; above.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 3: HIGHLIGHTS                                            */}
                {/* ------------------------------------------------------------- */}
                {pkgModalTab === 'highlights' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#E99B54]" />
                          <span>Key Highlights & Tour Selling Points ({editingPackage.highlights?.length || 0})</span>
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          These bullet points appear prominently in the &quot;Key Highlights&quot; card of the tour package page.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPackage({
                            ...editingPackage,
                            highlights: [...(editingPackage.highlights || []), '']
                          });
                        }}
                        className="inline-flex items-center gap-1.5 bg-[#173F35] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-[#1F4F43]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Highlight</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(editingPackage.highlights || []).map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
                          <CheckCircle2 className="w-4 h-4 text-[#E99B54] shrink-0 ml-1" />
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => {
                              const updated = [...editingPackage.highlights];
                              updated[idx] = e.target.value;
                              setEditingPackage({ ...editingPackage, highlights: updated });
                            }}
                            placeholder="e.g. Spotting the Great Indian One-Horned Rhinoceros in Jaldapara"
                            className="flex-1 text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingPackage.highlights.filter((_, i) => i !== idx);
                              setEditingPackage({ ...editingPackage, highlights: updated });
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-500 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {(!editingPackage.highlights || editingPackage.highlights.length === 0) && (
                      <div className="text-center py-8 text-stone-400 text-xs">
                        No highlights added yet. Click &quot;Add Highlight&quot; above to create selling points.
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 4: DAY-BY-DAY ITINERARY                                  */}
                {/* ------------------------------------------------------------- */}
                {pkgModalTab === 'itinerary' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-[#173F35]" />
                          <span>Interactive Day-by-Day Itinerary ({editingPackage.itinerary?.length || 0} Days)</span>
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          Each day renders as an accordion card with title, detailed narrative, meals, stay, and altitude.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextDayNum = (editingPackage.itinerary?.length || 0) + 1;
                          setEditingPackage({
                            ...editingPackage,
                            itinerary: [
                              ...(editingPackage.itinerary || []),
                              {
                                day: nextDayNum,
                                title: `Day ${nextDayNum} Schedule`,
                                description: '',
                                meals: 'Breakfast & Dinner',
                                stay: 'Verified Mountain Homestay / Hotel',
                                altitude: 'N/A'
                              }
                            ]
                          });
                        }}
                        className="inline-flex items-center gap-1.5 bg-[#173F35] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-[#1F4F43]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Day {(editingPackage.itinerary?.length || 0) + 1}</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(editingPackage.itinerary || []).map((dayItem, idx) => (
                        <div
                          key={idx}
                          className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-7 h-7 rounded-xl bg-[#173F35] text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <input
                                type="text"
                                value={dayItem.title}
                                onChange={(e) => {
                                  const updated = [...editingPackage.itinerary];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  setEditingPackage({ ...editingPackage, itinerary: updated });
                                }}
                                placeholder="Day Title, e.g. Pickup from Siliguri & Transfer to Lataguri"
                                className="flex-1 text-xs font-bold px-3 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                                required
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const remaining = editingPackage.itinerary.filter((_, i) => i !== idx);
                                const renumbered = remaining.map((item, i) => ({ ...item, day: i + 1 }));
                                setEditingPackage({ ...editingPackage, itinerary: renumbered });
                              }}
                              className="text-stone-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50"
                              title="Delete this day"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div>
                            <textarea
                              rows={3}
                              value={dayItem.description}
                              onChange={(e) => {
                                const updated = [...editingPackage.itinerary];
                                updated[idx] = { ...updated[idx], description: e.target.value };
                                setEditingPackage({ ...editingPackage, itinerary: updated });
                              }}
                              placeholder="Describe morning departure, sightseeing stops, photo spots, tea walks, and evening schedule..."
                              className="w-full text-xs p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">
                                Meals Included
                              </label>
                              <input
                                type="text"
                                value={dayItem.meals || ''}
                                onChange={(e) => {
                                  const updated = [...editingPackage.itinerary];
                                  updated[idx] = { ...updated[idx], meals: e.target.value };
                                  setEditingPackage({ ...editingPackage, itinerary: updated });
                                }}
                                placeholder="e.g. Breakfast & Dinner"
                                className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">
                                Stay / Accommodation
                              </label>
                              <input
                                type="text"
                                value={dayItem.stay || ''}
                                onChange={(e) => {
                                  const updated = [...editingPackage.itinerary];
                                  updated[idx] = { ...updated[idx], stay: e.target.value };
                                  setEditingPackage({ ...editingPackage, itinerary: updated });
                                }}
                                placeholder="e.g. Riverside Eco Resort, Lataguri"
                                className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">
                                Altitude / Region
                              </label>
                              <input
                                type="text"
                                value={dayItem.altitude || ''}
                                onChange={(e) => {
                                  const updated = [...editingPackage.itinerary];
                                  updated[idx] = { ...updated[idx], altitude: e.target.value };
                                  setEditingPackage({ ...editingPackage, itinerary: updated });
                                }}
                                placeholder="e.g. 1,200 ft / 365 m or N/A"
                                className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const nextDayNum = (editingPackage.itinerary?.length || 0) + 1;
                        setEditingPackage({
                          ...editingPackage,
                          itinerary: [
                            ...(editingPackage.itinerary || []),
                            {
                              day: nextDayNum,
                              title: `Day ${nextDayNum} Schedule`,
                              description: '',
                              meals: 'Breakfast & Dinner',
                              stay: 'Verified Mountain Homestay / Hotel',
                              altitude: 'N/A'
                            }
                          ]
                        });
                      }}
                      className="w-full py-3 rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#173F35] text-stone-600 hover:text-[#173F35] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Day {(editingPackage.itinerary?.length || 0) + 1} to Itinerary</span>
                    </button>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 5: INCLUSIONS & EXCLUSIONS                               */}
                {/* ------------------------------------------------------------- */}
                {pkgModalTab === 'inclusions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
                    
                    {/* Inclusions */}
                    <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>What&apos;s Included ({editingPackage.inclusions?.length || 0})</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPackage({
                              ...editingPackage,
                              inclusions: [...(editingPackage.inclusions || []), '']
                            });
                          }}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200"
                        >
                          + Add Item
                        </button>
                      </div>

                      <div className="space-y-2 pt-1">
                        {(editingPackage.inclusions || []).map((inc, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={inc}
                              onChange={(e) => {
                                const updated = [...editingPackage.inclusions];
                                updated[idx] = e.target.value;
                                setEditingPackage({ ...editingPackage, inclusions: updated });
                              }}
                              placeholder="e.g. All transfers in dedicated commercial SUV"
                              className="flex-1 text-xs px-3 py-1.5 bg-white border border-emerald-200 rounded-lg focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingPackage.inclusions.filter((_, i) => i !== idx);
                                setEditingPackage({ ...editingPackage, inclusions: updated });
                              }}
                              className="text-stone-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exclusions */}
                    <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>What&apos;s Not Included ({editingPackage.exclusions?.length || 0})</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPackage({
                              ...editingPackage,
                              exclusions: [...(editingPackage.exclusions || []), '']
                            });
                          }}
                          className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-white px-2.5 py-1 rounded-lg border border-amber-200"
                        >
                          + Add Item
                        </button>
                      </div>

                      <div className="space-y-2 pt-1">
                        {(editingPackage.exclusions || []).map((exc, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={exc}
                              onChange={(e) => {
                                const updated = [...editingPackage.exclusions];
                                updated[idx] = e.target.value;
                                setEditingPackage({ ...editingPackage, exclusions: updated });
                              }}
                              placeholder="e.g. Flight or train fares to starting hub"
                              className="flex-1 text-xs px-3 py-1.5 bg-white border border-amber-200 rounded-lg focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingPackage.exclusions.filter((_, i) => i !== idx);
                                setEditingPackage({ ...editingPackage, exclusions: updated });
                              }}
                              className="text-stone-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 6: STAY, TRANSPORT & MEALS                               */}
                {/* ------------------------------------------------------------- */}
                {pkgModalTab === 'logistics' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                        <HomeIcon className="w-4 h-4 text-[#173F35]" />
                        <span>Accommodation & Stay Standards</span>
                      </label>
                      <textarea
                        rows={3}
                        value={editingPackage.accommodationInfo || ''}
                        onChange={(e) => setEditingPackage({ ...editingPackage, accommodationInfo: e.target.value })}
                        placeholder="Describe hotel star ratings, authentic homestay amenities, twin/triple sharing arrangements, running hot water..."
                        className="w-full text-xs p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                      />
                    </div>

                    <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-[#173F35]" />
                        <span>Vehicle & Mountain Transport Specifications</span>
                      </label>
                      <textarea
                        rows={3}
                        value={editingPackage.transportationInfo || ''}
                        onChange={(e) => setEditingPackage({ ...editingPackage, transportationInfo: e.target.value })}
                        placeholder="Describe commercial SUV models (Innova, Bolero, Scorpio), experienced mountain drivers, hill permit clearances, pickup and drop points..."
                        className="w-full text-xs p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                      />
                    </div>

                    <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                        <Utensils className="w-4 h-4 text-[#173F35]" />
                        <span>Meal Plans & Dining Experience</span>
                      </label>
                      <textarea
                        rows={3}
                        value={editingPackage.mealsInfo || ''}
                        onChange={(e) => setEditingPackage({ ...editingPackage, mealsInfo: e.target.value })}
                        placeholder="Describe breakfast and dinner inclusions, hygienic home-cooked regional organic food, vegetarian and non-vegetarian flexibility..."
                        className="w-full text-xs p-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                      />
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 7: PHOTOS GALLERY & PACKING GUIDE                        */}
                {/* ------------------------------------------------------------- */}
                {pkgModalTab === 'media' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    
                    {/* Interactive Photo Upload and Link Manager */}
                    <PhotoUploadManager
                      images={editingPackage.images || []}
                      onChange={(updatedImages) => {
                        setEditingPackage({
                          ...editingPackage,
                          images: updatedImages
                        });
                      }}
                      title="Tour Photo Gallery"
                      description="Upload photos from your computer or paste image links. The first photo is the primary cover hero."
                      maxPhotos={25}
                    />

                    {/* Packing Checklist */}
                    <div className="space-y-3 pt-3 border-t border-stone-200">
                      <div className="flex items-center justify-between pb-1">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                            <Backpack className="w-4 h-4 text-[#E99B54]" />
                            <span>Things to Carry / Packing Guide ({editingPackage.thingsToCarry?.length || 0})</span>
                          </h4>
                          <p className="text-[11px] text-stone-500">
                            Checklist of essential permits, identification, clothing, and gear for travelers on this trip.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPackage({
                              ...editingPackage,
                              thingsToCarry: [...(editingPackage.thingsToCarry || []), '']
                            });
                          }}
                          className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-stone-200 border border-stone-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Item</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(editingPackage.thingsToCarry || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-xl border border-stone-200">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const updated = [...editingPackage.thingsToCarry];
                                updated[idx] = e.target.value;
                                setEditingPackage({ ...editingPackage, thingsToCarry: updated });
                              }}
                              placeholder="e.g. Original Govt Photo ID + 4 passport photos"
                              className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingPackage.thingsToCarry.filter((_, i) => i !== idx);
                                setEditingPackage({ ...editingPackage, thingsToCarry: updated });
                              }}
                              className="text-stone-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Modal Sticky Footer */}
              <div className="px-6 py-4 border-t border-stone-200 bg-[#F7F5EF]/90 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>

                  {!isNewPackage && (
                    <button
                      type="button"
                      onClick={() => handleDeletePackage(editingPackage.id)}
                      className="px-3.5 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Package</span>
                    </button>
                  )}

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500">
                    {pkgModalTab !== 'basic' && (
                      <button
                        type="button"
                        onClick={() => {
                          const tabs = ['basic', 'pricing', 'highlights', 'itinerary', 'inclusions', 'logistics', 'media'];
                          const idx = tabs.indexOf(pkgModalTab);
                          if (idx > 0) setPkgModalTab(tabs[idx - 1] as any);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-white text-stone-600 font-medium"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous Tab
                      </button>
                    )}
                    {pkgModalTab !== 'media' && (
                      <button
                        type="button"
                        onClick={() => {
                          const tabs = ['basic', 'pricing', 'highlights', 'itinerary', 'inclusions', 'logistics', 'media'];
                          const idx = tabs.indexOf(pkgModalTab);
                          if (idx < tabs.length - 1) setPkgModalTab(tabs[idx + 1] as any);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-white text-stone-600 font-medium"
                      >
                        Next Tab <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-stone-500 hidden md:inline">
                    All 7 sections will be saved together
                  </span>
                  <button
                    type="submit"
                    className="px-4 sm:px-5 py-2 bg-[#173F35] hover:bg-[#1F4F43] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#E99B54]" />
                    <span>Save Complete Tour Package</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: DESTINATION MANAGER (WITH PHOTO UPLOAD & LINK)         */}
      {/* ============================================================= */}
      {editingDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-3xl w-full rounded-3xl max-h-[92vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F7F5EF]/80 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#173F35] text-white">
                  {isNewDestination ? 'Add New Destination' : 'Edit Destination'}
                </span>
                <h3 className="font-sans font-bold text-base text-[#173F35] mt-0.5">
                  {editingDestination.name || 'Untitled Destination'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingDestination(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors text-sm font-bold shadow-xs shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveDestination} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    value={editingDestination.name}
                    onChange={(e) => setEditingDestination({ ...editingDestination, name: e.target.value })}
                    placeholder="e.g. North Bengal & Dooars"
                    className="w-full text-xs px-3 py-2.5 border border-stone-300 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700 uppercase">
                      Region Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDestination(null);
                        setActiveTab('regions');
                        handleCreateNewRegion();
                      }}
                      className="text-[10px] text-[#E99B54] font-bold hover:underline cursor-pointer flex items-center gap-1"
                      title="Create a new Region Category"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ New Region Category</span>
                    </button>
                  </div>
                  <select
                    value={editingDestination.region}
                    onChange={(e) => setEditingDestination({ ...editingDestination, region: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 border border-stone-300 rounded-xl bg-white"
                  >
                    {regions.map((reg) => (
                      <option key={reg.id} value={reg.name}>
                        {reg.name}
                      </option>
                    ))}
                    {!regions.some(r => r.name === editingDestination.region) && editingDestination.region && (
                      <option value={editingDestination.region}>
                        {editingDestination.region}
                      </option>
                    )}
                  </select>
                </div>
              </div>

              {/* Terrain Category Selection: Hill, Sea, Forest or Desert */}
              <div className="bg-stone-50/90 p-3.5 rounded-2xl border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700 uppercase">
                    Terrain Category * (Hill, Sea, Forest or Desert)
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Selected: <strong className="text-[#173F35] font-bold">
                      {editingDestination.category === 'Jungle' ? 'Forest' : (editingDestination.category || 'Hill')}
                    </strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'Hill', label: 'Hill', emoji: '🏔️', tagline: 'Mountains & Valleys' },
                    { id: 'Sea', label: 'Sea', emoji: '🌊', tagline: 'Beaches & Coastal' },
                    { id: 'Forest', label: 'Forest', emoji: '🌲', tagline: 'Jungles & Wildlife' },
                    { id: 'Desert', label: 'Desert', emoji: '🏜️', tagline: 'Dunes & Canyons' },
                  ].map((cat) => {
                    const isSelected =
                      editingDestination.category === cat.id ||
                      (cat.id === 'Forest' && editingDestination.category === 'Jungle');
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setEditingDestination({
                            ...editingDestination,
                            category: cat.id as any,
                          })
                        }
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-start gap-1 ${
                          isSelected
                            ? 'border-[#173F35] bg-white text-[#173F35] font-bold shadow-sm ring-2 ring-[#173F35]/30'
                            : 'border-stone-200 bg-white/70 hover:bg-white text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">{cat.emoji}</span>
                          <span className="text-xs sm:text-sm font-bold">{cat.label}</span>
                        </div>
                        <span className="text-[10px] text-stone-500 font-normal">
                          {cat.tagline}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingDestination.shortDescription}
                  onChange={(e) => setEditingDestination({ ...editingDestination, shortDescription: e.target.value })}
                  placeholder="Summary for cards and listings..."
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Full Region Overview
                </label>
                <textarea
                  rows={4}
                  value={editingDestination.fullOverview}
                  onChange={(e) => setEditingDestination({ ...editingDestination, fullOverview: e.target.value })}
                  placeholder="Detailed narrative about geography, culture, wildlife, homestays..."
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    value={editingDestination.bestTimeToVisit}
                    onChange={(e) => setEditingDestination({ ...editingDestination, bestTimeToVisit: e.target.value })}
                    placeholder="e.g. October to May"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Suggested Duration
                  </label>
                  <input
                    type="text"
                    value={editingDestination.suggestedDuration}
                    onChange={(e) => setEditingDestination({ ...editingDestination, suggestedDuration: e.target.value })}
                    placeholder="e.g. 5 - 7 Days"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Approximate Budget
                  </label>
                  <input
                    type="text"
                    value={editingDestination.approximateBudget}
                    onChange={(e) => setEditingDestination({ ...editingDestination, approximateBudget: e.target.value })}
                    placeholder="e.g. ₹14,000 / person"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Destination Key Attractions & Landmarks */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-sans font-bold text-xs sm:text-sm text-[#173F35] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#E99B54]" />
                      <span>Key Attractions & Landmarks ({editingDestination.attractions?.length || 0})</span>
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Add major landmarks, viewpoints, national parks, and heritage spots with photos and descriptions.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(editingDestination.attractions || [])];
                      updated.push({
                        name: '',
                        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
                        description: '',
                      });
                      setEditingDestination({ ...editingDestination, attractions: updated });
                    }}
                    className="inline-flex items-center gap-1 bg-[#173F35] hover:bg-[#1F4F43] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#E99B54]" />
                    <span>+ Add Attraction</span>
                  </button>
                </div>

                {(!editingDestination.attractions || editingDestination.attractions.length === 0) ? (
                  <div className="p-5 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 text-xs space-y-2">
                    <p>No key attractions added yet for this destination.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDestination({
                          ...editingDestination,
                          attractions: [
                            {
                              name: '',
                              image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
                              description: '',
                            }
                          ]
                        });
                      }}
                      className="text-xs text-[#E99B54] font-bold hover:underline cursor-pointer"
                    >
                      + Click here to add your first Key Attraction
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editingDestination.attractions.map((att, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#173F35]/10 text-[#173F35]">
                            Attraction #{idx + 1}
                          </span>

                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const list = [...editingDestination.attractions];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  setEditingDestination({ ...editingDestination, attractions: list });
                                }}
                                className="px-2 py-0.5 text-[10px] bg-white border border-stone-200 rounded text-stone-600 hover:text-stone-900 cursor-pointer"
                                title="Move Up"
                              >
                                ↑
                              </button>
                            )}
                            {idx < editingDestination.attractions.length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const list = [...editingDestination.attractions];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  setEditingDestination({ ...editingDestination, attractions: list });
                                }}
                                className="px-2 py-0.5 text-[10px] bg-white border border-stone-200 rounded text-stone-600 hover:text-stone-900 cursor-pointer"
                                title="Move Down"
                              >
                                ↓
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const list = editingDestination.attractions.filter((_, i) => i !== idx);
                                setEditingDestination({ ...editingDestination, attractions: list });
                              }}
                              className="p-1 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors ml-1 cursor-pointer"
                              title="Delete Attraction"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                              Attraction Name *
                            </label>
                            <input
                              type="text"
                              value={att.name}
                              onChange={(e) => {
                                const list = [...editingDestination.attractions];
                                list[idx] = { ...list[idx], name: e.target.value };
                                setEditingDestination({ ...editingDestination, attractions: list });
                              }}
                              placeholder="e.g. Jaldapara Rhino Sanctuary"
                              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                              required
                            />
                          </div>

                          <div>
                            <SingleImageUploader
                              label="Attraction Photo (Upload or Link)"
                              value={att.image || ''}
                              onChange={(url) => {
                                const list = [...editingDestination.attractions];
                                list[idx] = { ...list[idx], image: url };
                                setEditingDestination({ ...editingDestination, attractions: list });
                              }}
                              helperText="Photo displayed on the attraction card."
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                            Attraction Description *
                          </label>
                          <textarea
                            rows={2}
                            value={att.description}
                            onChange={(e) => {
                              const list = [...editingDestination.attractions];
                              list[idx] = { ...list[idx], description: e.target.value };
                              setEditingDestination({ ...editingDestination, attractions: list });
                            }}
                            placeholder="Describe highlights, scenic views, wildlife, or history..."
                            className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Hero Image Uploader */}
              <div className="pt-2 border-t border-stone-200">
                <SingleImageUploader
                  label="Destination Primary Cover Photo (Upload or Link)"
                  value={editingDestination.heroImage || ''}
                  onChange={(newUrl) => setEditingDestination({ ...editingDestination, heroImage: newUrl })}
                  helperText="Primary banner photo displayed on destination cards and hero header."
                />
              </div>

              {/* Destination Gallery Uploader */}
              <div className="pt-4 border-t border-stone-200">
                <PhotoUploadManager
                  images={editingDestination.gallery || []}
                  onChange={(updated) => setEditingDestination({ ...editingDestination, gallery: updated })}
                  title="Destination Regional Photo Gallery"
                  description="Upload local destination photos from your device or paste image links. Used in the destination interactive gallery."
                  maxPhotos={20}
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingDestination(null)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  {!isNewDestination && (
                    <button
                      type="button"
                      onClick={() => handleDeleteDestination(editingDestination.id)}
                      className="px-3.5 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Destination</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2 bg-[#173F35] hover:bg-[#1F4F43] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#E99B54]" />
                  <span>Save Destination</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: BLOG ARTICLE MANAGER                                   */}
      {/* ============================================================= */}
      {editingBlogPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-3xl w-full rounded-3xl max-h-[92vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F7F5EF]/80 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#173F35] text-white">
                  {isNewBlogPost ? 'Create Blog Article' : 'Edit Blog Article'}
                </span>
                <h3 className="font-sans font-bold text-base text-[#173F35] mt-0.5">
                  {editingBlogPost.title || 'Untitled Article'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingBlogPost(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors text-sm font-bold shadow-xs shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveBlogPost} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title and Slug */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={editingBlogPost.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const newSlug = isNewBlogPost
                        ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                        : editingBlogPost.slug;
                      setEditingBlogPost({
                        ...editingBlogPost,
                        title: newTitle,
                        slug: newSlug
                      });
                    }}
                    placeholder="e.g. Hidden Trails of Meghalaya: Waterfalls & Root Bridges"
                    className="w-full text-xs px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={editingBlogPost.slug}
                      onChange={(e) => setEditingBlogPost({ ...editingBlogPost, slug: e.target.value })}
                      placeholder="e.g. hidden-trails-meghalaya"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Category *
                    </label>
                    <select
                      value={editingBlogPost.category}
                      onChange={(e) => setEditingBlogPost({ ...editingBlogPost, category: e.target.value as any })}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl bg-white"
                    >
                      <option value="Travel Guides">Travel Guides</option>
                      <option value="Trekking">Trekking</option>
                      <option value="Itineraries">Itineraries</option>
                      <option value="Budget Travel">Budget Travel</option>
                      <option value="Travel Tips">Travel Tips</option>
                      <option value="Northeast India">Northeast India</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Read Time & Published Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={editingBlogPost.readTime}
                    onChange={(e) => setEditingBlogPost({ ...editingBlogPost, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Published Date
                  </label>
                  <input
                    type="date"
                    value={editingBlogPost.publishedAt}
                    onChange={(e) => setEditingBlogPost({ ...editingBlogPost, publishedAt: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Article Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  value={editingBlogPost.excerpt}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, excerpt: e.target.value })}
                  placeholder="Short summary displayed on blog feed cards and search previews..."
                  className="w-full text-xs p-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                  required
                />
              </div>

              {/* Full Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase">
                    Full Article Content *
                  </label>
                  <span className="text-[11px] text-stone-400">
                    Supports Markdown (### headings, * bullet points)
                  </span>
                </div>
                <textarea
                  rows={9}
                  value={editingBlogPost.content}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, content: e.target.value })}
                  placeholder="Write the full expedition story, route guides, permit procedures, and packing tips..."
                  className="w-full text-xs p-3.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                  required
                />
              </div>

              {/* Cover Image Uploader */}
              <div className="pt-2 border-t border-stone-200">
                <SingleImageUploader
                  label="Article Hero Cover Photo (Upload or Link)"
                  value={editingBlogPost.coverImage || ''}
                  onChange={(newUrl) => setEditingBlogPost({ ...editingBlogPost, coverImage: newUrl })}
                  helperText="Primary banner displayed at the top of the article and on blog listings."
                />
              </div>

              {/* Author & Tags */}
              <div className="pt-2 border-t border-stone-200 space-y-4">
                <h4 className="text-xs font-bold text-stone-700 uppercase">Author Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={editingBlogPost.author?.name || ''}
                      onChange={(e) => setEditingBlogPost({
                        ...editingBlogPost,
                        author: { ...editingBlogPost.author, name: e.target.value }
                      })}
                      placeholder="e.g. Sourav"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                      Author Role / Title
                    </label>
                    <input
                      type="text"
                      value={editingBlogPost.author?.role || ''}
                      onChange={(e) => setEditingBlogPost({
                        ...editingBlogPost,
                        author: { ...editingBlogPost.author, role: e.target.value }
                      })}
                      placeholder="e.g. Siliguri Expedition Lead"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(editingBlogPost.tags) ? editingBlogPost.tags.join(', ') : ''}
                    onChange={(e) => {
                      const splitTags = e.target.value.split(',').map(t => t.trim());
                      setEditingBlogPost({ ...editingBlogPost, tags: splitTags });
                    }}
                    placeholder="e.g. North Bengal, Dooars, Wildlife, Safaris"
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>

                {/* Published status */}
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingBlogPost.published}
                      onChange={(e) => setEditingBlogPost({ ...editingBlogPost, published: e.target.checked })}
                      className="w-4 h-4 rounded text-[#173F35] focus:ring-[#173F35]"
                    />
                    <span>Publish Immediately (Visible to website visitors)</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBlogPost(null)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  {!isNewBlogPost && (
                    <button
                      type="button"
                      onClick={() => handleDeleteBlogPost(editingBlogPost.id)}
                      className="px-3.5 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Article</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2 bg-[#173F35] hover:bg-[#1F4F43] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#E99B54]" />
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: REGION CATEGORY MANAGER                                */}
      {/* ============================================================= */}
      {editingRegion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-2xl w-full rounded-3xl max-h-[92vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F7F5EF]/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#173F35] flex items-center justify-center text-white">
                  <Globe className="w-4 h-4 text-[#E99B54]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#173F35]/10 text-[#173F35]">
                    {isNewRegion ? 'New Region Category' : 'Edit Region Category'}
                  </span>
                  <h3 className="font-sans font-bold text-base text-[#173F35] mt-0.5">
                    {editingRegion.name || 'Create Region Category'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingRegion(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors text-sm font-bold shadow-xs shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveRegion} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Region Category Name *
                  </label>
                  <input
                    type="text"
                    value={editingRegion.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      const newSlug = isNewRegion
                        ? newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                        : editingRegion.slug;
                      setEditingRegion({
                        ...editingRegion,
                        name: newName,
                        slug: newSlug
                      });
                    }}
                    placeholder="e.g. North Bengal & Dooars, Sikkim, Spiti"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 font-medium"
                    required
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Primary zone title shown in destination directory, filters, and cards.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingRegion.slug}
                    onChange={(e) => setEditingRegion({
                      ...editingRegion,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                    })}
                    placeholder="e.g. north-bengal-dooars"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Lowercase web-friendly URL path identifier.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Badge / Tagline Highlight
                  </label>
                  <input
                    type="text"
                    value={editingRegion.badge || ''}
                    onChange={(e) => setEditingRegion({ ...editingRegion, badge: e.target.value })}
                    placeholder="e.g. Tea Estates & Wildlife, Sacred Peaks"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Eye-catching tag badge displayed over the cover card.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Display Priority / Sort Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={editingRegion.order || 1}
                    onChange={(e) => setEditingRegion({ ...editingRegion, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 font-mono"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Lower numbers appear first in lists and carousels.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Region Summary Description
                </label>
                <textarea
                  rows={3}
                  value={editingRegion.description || ''}
                  onChange={(e) => setEditingRegion({ ...editingRegion, description: e.target.value })}
                  placeholder="Describe this geographic zone, landscapes, climate, cultural highlights, and why travelers should explore it..."
                  className="w-full text-xs p-3.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 leading-relaxed"
                />
              </div>

              {/* Cover Photo Upload & Link */}
              <div className="pt-2 border-t border-stone-200">
                <SingleImageUploader
                  label="Region Hero Cover Photo (Upload or Link)"
                  value={editingRegion.heroImage || ''}
                  onChange={(newUrl) => setEditingRegion({ ...editingRegion, heroImage: newUrl })}
                  helperText="High-resolution landscape image displayed as the banner on region cards and lists."
                />

                {/* Quick Inspiration Presets */}
                <div className="mt-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                      Quick Preset Photos (Click to choose)
                    </span>
                    <span className="text-[10px] text-stone-400">Or use Upload Photo above</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      {
                        title: 'Misty Tea & Foothills',
                        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
                      },
                      {
                        title: 'Alpine Snow Summits',
                        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
                      },
                      {
                        title: 'Lush Pine Forests & Rivers',
                        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
                      },
                      {
                        title: 'Waterfalls & Valleys',
                        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
                      }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditingRegion({ ...editingRegion, heroImage: preset.url })}
                        className="text-left group/preset p-1.5 rounded-xl border border-stone-200 bg-white hover:border-[#173F35] transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-12 object-cover rounded-lg mb-1"
                        />
                        <span className="text-[10px] text-stone-600 group-hover/preset:text-[#173F35] font-semibold line-clamp-1">
                          {preset.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Featured in Public Carousels Toggle */}
              <div className="pt-2 border-t border-stone-200">
                <label className="flex items-center gap-2.5 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingRegion.featured ?? true}
                    onChange={(e) => setEditingRegion({ ...editingRegion, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#173F35] focus:ring-[#173F35]"
                  />
                  <span>Feature in Region Category exploration banners across the website</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingRegion(null)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  {!isNewRegion && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRegion(editingRegion.id, editingRegion.name)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2 bg-[#173F35] hover:bg-[#1F4F43] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#E99B54]" />
                  <span>{isNewRegion ? 'Create Region Category' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
            {/* ============================================================= */}
      {/* MODAL: USER & ROLE-BASED ACCESS CONTROL (SUPER ADMIN)          */}
      {/* ============================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-2xl w-full rounded-3xl max-h-[92vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F7F5EF]/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#173F35] flex items-center justify-center text-white">
                  <UserPlus className="w-4 h-4 text-[#E99B54]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#173F35]/10 text-[#173F35]">
                    {isNewUser ? 'Create Team User' : 'Edit User Access Rights'}
                  </span>
                  <h3 className="font-sans font-bold text-base text-[#173F35] mt-0.5">
                    {editingUser.name || 'New Team Member'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors text-sm font-bold shadow-xs shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveUser} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    placeholder="e.g. Sourav Mukherjee"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    placeholder="e.g. sourav@baunduilla.com"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Password / Access Key *
                  </label>
                  <input
                    type="text"
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder="Enter password or passcode"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Department / Role Label
                  </label>
                  <input
                    type="text"
                    value={editingUser.department || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    placeholder="e.g. Inquiries & WhatsApp Desk"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Mobile / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    placeholder="+91 98300 00000"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 font-mono"
                  />
                </div>
              </div>

              {/* Role Selection Presets */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
                  System Role & Fast Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {
                      role: 'super_admin',
                      label: '👑 Super Admin',
                      desc: 'Full control of all modules and user accounts',
                      modules: ['overview', 'inquiries', 'packages', 'destinations', 'regions', 'gallery', 'blog', 'settings', 'users']
                    },
                    {
                      role: 'manager',
                      label: '💬 Inquiries Lead',
                      desc: 'Customer quotes, booking status, and WhatsApp chat',
                      modules: ['overview', 'inquiries']
                    },
                    {
                      role: 'manager',
                      label: '🎒 Catalog Lead',
                      desc: 'Tour packages, destinations, and regional zones',
                      modules: ['overview', 'packages', 'destinations', 'regions', 'gallery']
                    },
                    {
                      role: 'editor',
                      label: '✍️ Content Writer',
                      desc: 'Travel stories, packing guides, and photo gallery',
                      modules: ['overview', 'gallery', 'blog']
                    }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setEditingUser({
                          ...editingUser,
                          role: preset.role as any,
                          allowedModules: preset.modules as any
                        });
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        editingUser.role === preset.role && editingUser.allowedModules.length === preset.modules.length
                          ? 'border-[#173F35] bg-[#173F35]/5 shadow-2xs'
                          : 'border-stone-200 bg-white hover:border-stone-400'
                      }`}
                    >
                      <strong className="block text-xs text-stone-900">{preset.label}</strong>
                      <span className="text-[10px] text-stone-500 line-clamp-2 mt-0.5">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Granular Module Access Checkboxes */}
              <div className="pt-2 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700 uppercase">
                    Granular Dashboard Access Privileges ({editingUser.allowedModules.length}/9 Active)
                  </label>
                  <span className="text-[11px] text-stone-400">Check each section this user may access</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'overview',
                      name: '📊 Overview Dashboard',
                      desc: 'View booking metrics, KPIs, and recent inquiries summary'
                    },
                    {
                      id: 'inquiries',
                      name: '💬 Customer Inquiries',
                      desc: 'View, update booking status, and message clients via WhatsApp'
                    },
                    {
                      id: 'packages',
                      name: '🎒 Tour Packages Catalog',
                      desc: 'Create and update itineraries, dates, inclusions, and verified rates'
                    },
                    {
                      id: 'destinations',
                      name: '📍 Destinations Directory',
                      desc: 'Manage destinations, attractions, weather guides, and photo galleries'
                    },
                    {
                      id: 'regions',
                      name: '🌐 Region Categories',
                      desc: 'Create regional zone categories (North Bengal, Sikkim, Spiti, etc.)'
                    },
                    {
                      id: 'gallery',
                      name: '📷 Experience Gallery',
                      desc: 'Curate homepage visual travel stories, scenic highlights, and captions'
                    },
                    {
                      id: 'blog',
                      name: '✍️ Travel Blog & Stories',
                      desc: 'Draft and publish high-altitude expedition guides and travel notes'
                    },
                    {
                      id: 'settings',
                      name: '⚙️ Global & WhatsApp Settings',
                      desc: 'Update official WhatsApp number, central address, and public notices'
                    },
                    {
                      id: 'users',
                      name: '👥 Team & User Management',
                      desc: 'Create accounts, assign roles, and grant permissions (Super Admin only)',
                      superAdminOnly: true
                    }
                  ].map((mod) => {
                    const isChecked = editingUser.role === 'super_admin' || editingUser.allowedModules.includes(mod.id as any);
                    const isDisabled = mod.superAdminOnly && editingUser.role !== 'super_admin';

                    return (
                      <label
                        key={mod.id}
                        className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                          isDisabled
                            ? 'opacity-50 cursor-not-allowed bg-stone-50 border-stone-200'
                            : isChecked
                            ? 'border-[#173F35]/40 bg-[#173F35]/5 cursor-pointer shadow-2xs'
                            : 'border-stone-200 bg-white hover:border-stone-300 cursor-pointer'
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={isDisabled || editingUser.role === 'super_admin'}
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingUser({
                                ...editingUser,
                                allowedModules: [...editingUser.allowedModules, mod.id as any]
                              });
                            } else {
                              setEditingUser({
                                ...editingUser,
                                allowedModules: editingUser.allowedModules.filter(m => m !== mod.id)
                              });
                            }
                          }}
                          className="w-4 h-4 rounded mt-0.5 text-[#173F35] focus:ring-[#173F35]"
                        />
                        <div className="min-w-0">
                          <strong className="block text-xs text-stone-900 leading-tight">
                            {mod.name}
                          </strong>
                          <span className="text-[10px] text-stone-500 leading-normal block mt-0.5">
                            {mod.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status and Action Checkboxes */}
              <div className="pt-2 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.status === 'active'}
                    disabled={editingUser.isPrimarySuperAdmin}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.checked ? 'active' : 'suspended' })}
                    className="w-4 h-4 rounded text-[#173F35] focus:ring-[#173F35]"
                  />
                  <span>Account Active (Allowed to log in)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.canPublishContent ?? true}
                    onChange={(e) => setEditingUser({ ...editingUser, canPublishContent: e.target.checked })}
                    className="w-4 h-4 rounded text-[#173F35] focus:ring-[#173F35]"
                  />
                  <span>Permission to publish live changes</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  {!isNewUser && !editingUser.isPrimarySuperAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(editingUser.id, editingUser.name)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Delete Account
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2 bg-[#173F35] hover:bg-[#1F4F43] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#E99B54]" />
                  <span>{isNewUser ? 'Create User Account' : 'Save User Access'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: QUICK PERSONA SWITCHER                                 */}
      {/* ============================================================= */}
      {showSwitchUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#E99B54]" />
                <h3 className="font-serif font-bold text-lg text-[#173F35]">Switch Active Team Persona</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSwitchUserModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Select an account to view the admin portal from their role and permitted modules:
            </p>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {users.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => handleSwitchToUser(u)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-[#173F35] bg-[#173F35]/5 ring-1 ring-[#173F35]/30'
                        : 'border-stone-200 bg-stone-50/60 hover:bg-white hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#173F35] text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 border border-stone-200 shadow-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong className="text-xs text-stone-900 truncate">{u.name}</strong>
                          {u.isPrimarySuperAdmin && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white flex items-center gap-0.5">
                              <Crown className="w-2.5 h-2.5 fill-current" />
                              Primary
                            </span>
                          )}
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            u.role === 'super_admin' ? 'bg-[#173F35] text-white' :
                            u.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                            u.role === 'editor' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-stone-200 text-stone-700'
                          }`}>
                            {u.role.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 truncate">{u.email}</p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {u.role === 'super_admin' ? 'All 8 Modules Authorized' : `${u.allowedModules.length} Modules Authorized (${u.allowedModules.join(', ')})`}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCurrent ? (
                        <span className="text-[10px] font-bold text-[#173F35] bg-[#173F35]/10 px-2 py-1 rounded-lg">
                          Current
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[#E99B54] hover:underline">
                          Switch →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      

      {/* MODAL: VIEW INQUIRY DETAILS                                   */}
      {/* ============================================================= */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-5 border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#E99B54]">Inquiry Detail</span>
                <h3 className="font-sans font-bold text-base text-[#173F35]">{viewingInquiry.customerName}</h3>
              </div>
              <button
                onClick={() => setViewingInquiry(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <p><strong>Mobile:</strong> {viewingInquiry.phone}</p>
              <p><strong>Email:</strong> {viewingInquiry.email}</p>
              <p><strong>Destination:</strong> {viewingInquiry.destination}</p>
              {viewingInquiry.packageTitle && <p><strong>Specific Package:</strong> {viewingInquiry.packageTitle}</p>}
              <p><strong>Preferred Dates:</strong> {viewingInquiry.travelDate || 'Flexible'}</p>
              <p><strong>Travellers:</strong> {viewingInquiry.travellers ? `${viewingInquiry.travellers.adults} Adults, ${viewingInquiry.travellers.children} Children` : 'General Inquiry'}</p>
              {viewingInquiry.startingCity && <p><strong>Starting City:</strong> {viewingInquiry.startingCity}</p>}
              {viewingInquiry.budgetPerPerson && <p><strong>Budget / Person:</strong> {viewingInquiry.budgetPerPerson}</p>}
              {viewingInquiry.requirements && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong>Notes / Special Requirements:</strong>
                  <p className="mt-1 italic">{viewingInquiry.requirements}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t flex items-center justify-between gap-3">
              <a
                href={generateWhatsAppLink(
                  viewingInquiry.phone,
                  `Hello ${viewingInquiry.customerName}, this is Baunduilla travel desk following up on your inquiry for ${viewingInquiry.destination}!`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message on WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(viewingInquiry.id)}
                  className="px-3.5 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setViewingInquiry(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: TEAM MEMBER MANAGER (NAME, DESIGNATION, PHOTO, BIO)   */}
      {/* ============================================================= */}
      {editingTeamMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-xl w-full rounded-3xl max-h-[92vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F7F5EF]/80 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#173F35] text-white">
                  {isNewTeamMember ? 'Add Team Member' : 'Edit Team Member'}
                </span>
                <h3 className="font-sans font-bold text-base text-[#173F35] mt-0.5">
                  {editingTeamMember.name || 'Untitled Member'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTeamMember(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveTeamMember} className="overflow-y-auto p-6 space-y-5 flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingTeamMember.name}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, name: e.target.value })
                  }
                  placeholder="e.g. Suvankar Paul, Pritam Bose, Tapabrata Dey Sarkar"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Designation / Role (Optional)
                </label>
                <input
                  type="text"
                  value={editingTeamMember.role || ''}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, role: e.target.value })
                  }
                  placeholder="e.g. Founder & Safari Coordinator (Leave blank to hide)"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  If left blank, no designation will be displayed under the name on the public site.
                </p>
              </div>

              {/* Photo Uploader */}
              <div>
                <SingleImageUploader
                  label="Profile Photo (Upload from PC or Paste Image URL)"
                  value={editingTeamMember.photo || ''}
                  onChange={(url) =>
                    setEditingTeamMember({ ...editingTeamMember, photo: url })
                  }
                  helperText="Upload a profile picture from your phone/computer or paste an image link. If left blank, a handsome letter monogram will be displayed."
                  placeholderUrl="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Biography / Background Story (Optional)
                </label>
                <textarea
                  rows={3}
                  value={editingTeamMember.bio || ''}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })
                  }
                  placeholder="Share a few words about this coordinator's travel passion, mountain experience, or hospitality background..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTeamMember(null)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  {!isNewTeamMember && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteTeamMember(editingTeamMember.id, editingTeamMember.name)
                      }
                      className="px-3.5 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#173F35] hover:bg-[#1F4F43] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#E99B54]" />
                  <span>{isNewTeamMember ? 'Add Member' : 'Save Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: EXPERIENCE GALLERY ITEM MANAGER                        */}
      {/* ============================================================= */}
      {editingGalleryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-xl w-full rounded-3xl max-h-[92vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F7F5EF]/80 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#173F35] text-white">
                  {isNewGalleryItem ? 'Add Photo to Experience Gallery' : 'Edit Travel Experience Photo'}
                </span>
                <h3 className="font-sans font-bold text-base text-[#173F35] mt-0.5">
                  {editingGalleryItem.title || 'Untitled Visual Story'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingGalleryItem(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors text-sm font-bold shadow-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveGalleryItem} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Photo Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={editingGalleryItem.title}
                  onChange={(e) =>
                    setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })
                  }
                  placeholder="e.g. Yulla Kanda Sacred Lake, Tungnath Temple, Kedarnath Peaks"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Location / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingGalleryItem.location}
                    onChange={(e) =>
                      setEditingGalleryItem({ ...editingGalleryItem, location: e.target.value })
                    }
                    placeholder="e.g. Kinnaur, Himachal or Chopta, Uttarakhand"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Tag / Badge Label
                  </label>
                  <input
                    type="text"
                    value={editingGalleryItem.tag}
                    onChange={(e) =>
                      setEditingGalleryItem({ ...editingGalleryItem, tag: e.target.value })
                    }
                    placeholder="e.g. Highest Shiva, Living Bridge, Sacred Kinnaur"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                  />
                </div>
              </div>

              {/* Tag Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold text-stone-400">Quick Tags:</span>
                {['Sacred Kinnaur', 'Highest Shiva', 'Living Bridge', 'Ridge Peak', 'Alpine Lake', 'Panch Kedar', 'Trek Story', 'Wildlife'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEditingGalleryItem({ ...editingGalleryItem, tag: t })}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Single Image Uploader */}
              <div>
                <SingleImageUploader
                  label="Gallery Photograph (Upload from PC or Paste Image URL) *"
                  value={editingGalleryItem.src || ''}
                  onChange={(url) =>
                    setEditingGalleryItem({ ...editingGalleryItem, src: url })
                  }
                  helperText="Upload a high-resolution landscape photo from your device, or paste a secure image URL."
                  placeholderUrl="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
                />
              </div>

              {/* Scenic Presets */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  1-Click Scenic Himalayan Presets
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    {
                      label: 'Yulla Kanda',
                      url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
                      loc: 'Kinnaur, Himachal',
                      tag: 'Sacred Kinnaur'
                    },
                    {
                      label: 'Tungnath Temple',
                      url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
                      loc: 'Rudraprayag, Uttarakhand',
                      tag: 'Highest Shiva'
                    },
                    {
                      label: 'Chandrashila Peak',
                      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
                      loc: 'Garhwal Himalayas',
                      tag: 'Ridge Peak'
                    },
                    {
                      label: 'Kedarnath Valley',
                      url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
                      loc: 'Garhwal, Uttarakhand',
                      tag: 'Sacred Peak'
                    },
                    {
                      label: 'Root Bridge',
                      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
                      loc: 'Cherrapunji, Meghalaya',
                      tag: 'Living Heritage'
                    },
                    {
                      label: 'Dawki Umngot',
                      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
                      loc: 'Dawki, Meghalaya',
                      tag: 'Crystal River'
                    },
                    {
                      label: 'Gurudongmar Lake',
                      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                      loc: 'North Sikkim',
                      tag: 'Sacred Glacial'
                    },
                    {
                      label: 'North Bengal Tea',
                      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
                      loc: 'Dooars, North Bengal',
                      tag: 'Forest Foothills'
                    }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() =>
                        setEditingGalleryItem({
                          ...editingGalleryItem,
                          src: preset.url,
                          title: editingGalleryItem.title || preset.label,
                          location: preset.loc,
                          tag: preset.tag
                        })
                      }
                      className="px-2 py-1.5 bg-white border border-stone-200 hover:border-[#173F35] rounded-xl text-[11px] font-semibold text-stone-700 hover:text-[#173F35] transition-colors text-left truncate cursor-pointer shadow-2xs"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Story Caption / Experience Narrative (Optional)
                </label>
                <textarea
                  rows={3}
                  value={editingGalleryItem.description || ''}
                  onChange={(e) =>
                    setEditingGalleryItem({ ...editingGalleryItem, description: e.target.value })
                  }
                  placeholder="Describe the moment, altitude, local folklore, or travel tip for this spot..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 focus:border-[#173F35]"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingGalleryItem(null)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  {!isNewGalleryItem && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteGalleryItem(editingGalleryItem.id, editingGalleryItem.title)
                      }
                      className="px-3.5 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#173F35] hover:bg-[#1F4F43] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#E99B54]" />
                  <span>{isNewGalleryItem ? 'Add to Gallery' : 'Save Photo Story'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Action Confirmation Modal (Iframe-safe, replaces blocked window.confirm) */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-stone-900">{confirmModal.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5">Please confirm to proceed</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmModal.confirmLabel || 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
