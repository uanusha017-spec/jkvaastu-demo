import type { Timestamp } from 'firebase/firestore';

export const PROPERTY_TYPES = [
  'Owned Home',
  'Rented Home',
  'New Construction',
  'Apartment / Flat',
  'Office / Commercial',
  'Factory / Industry',
  'Plot / Land',
] as const;

export const SERVICE_CATEGORIES = [
  'Vastu for House',
  'Vastu for Business',
  'Career & Job',
  'Health & Chakras',
  'Marriage & Relationships',
  'Education & Study',
  'New Property Selection',
] as const;

export const PREFERRED_SLOTS = [
  'Morning (09:30 - 12:30)',
  'Afternoon (14:00 - 17:00)',
  'Evening (17:30 - 20:00)',
] as const;

export const CONSULTATION_MODES = [
  'Online Video',
  'On-Site Visit',
  'Phone Consultation',
] as const;

export const APPOINTMENT_STATUSES = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
] as const;

export const BLOG_CATEGORIES = [
  'Vastu Principles',
  'Home Vastu',
  'Business Vastu',
  'Career & Wealth',
  'Health & Chakras',
  'Education & Marriage',
] as const;

export const VIDEO_CATEGORIES = [
  'Webinar',
  'Home Vastu',
  'Business Vastu',
  'Chakra & Energy',
  'Client Story',
] as const;

export const INQUIRY_STATUSES = ['new', 'replied', 'archived'] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
export type PreferredSlot = (typeof PREFERRED_SLOTS)[number];
export type ConsultationMode = (typeof CONSULTATION_MODES)[number];
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type VideoCategory = (typeof VIDEO_CATEGORIES)[number];
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];
export type PublishStatus = 'draft' | 'published';

export interface Appointment {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  city: string;
  propertyType: PropertyType;
  serviceCategory: ServiceCategory;
  preferredDate: string;
  preferredSlot: PreferredSlot;
  consultationMode: ConsultationMode;
  notes: string;
  status: AppointmentStatus;
  adminNotes: string;
  userId: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  readTime: string;
  status: PublishStatus;
  featured: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface VideoResource {
  id: string;
  title: string;
  category: VideoCategory;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  description: string;
  status: PublishStatus;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  city: string;
  serviceUsed: string;
  quote: string;
  rating: number;
  status: PublishStatus;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  userId: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface SiteSettings {
  brandName: string;
  founderName: string;
  phone: string;
  whatsapp: string;
  email: string;
  locations: string;
  officeHours: string;
  logoUrl: string;
  googlePlaceId?: string;
  googleBusinessQuery?: string;
  updatedAt?: Timestamp | null;
}

// Validation constants synchronized verbatim with firebase-blueprint.json & firestore.rules
export const FIELD_LIMITS = {
  fullName: { min: 2, max: 100 },
  email: { min: 5, max: 120 },
  phone: { min: 7, max: 25 },
  birthDate: { max: 20 },
  city: { min: 2, max: 80 },
  notes: { max: 1500 },
  adminNotes: { max: 1500 },
  blogTitle: { min: 3, max: 180 },
  blogSlug: { min: 2, max: 140, pattern: /^[a-z0-9-]+$/ },
  blogExcerpt: { min: 10, max: 450 },
  blogContent: { min: 20, max: 15000 },
  videoTitle: { min: 3, max: 160 },
  videoUrl: { min: 5, max: 500 },
  videoDescription: { min: 5, max: 1000 },
  quote: { min: 10, max: 1000 },
  subject: { min: 2, max: 150 },
  message: { min: 5, max: 2000 },
} as const;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 130);
}

export function clampString(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export function isValidEmailFormat(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
}

export function formatTimestamp(ts?: Timestamp | null): string {
  if (!ts) return 'Just now';
  try {
    const date = typeof ts.toDate === 'function' ? ts.toDate() : new Date();
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Recent';
  }
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}
