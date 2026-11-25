import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  PRIMARY_ADMIN_EMAIL,
} from '../firebase';
import {
  DEFAULT_SITE_SETTINGS,
  STARTER_BLOGS,
  STARTER_TESTIMONIALS,
  STARTER_VIDEOS,
} from '../data/vastuContent';
import {
  clampString,
  FIELD_LIMITS,
  slugify,
  type Appointment,
  type AppointmentStatus,
  type BlogCategory,
  type BlogPost,
  type ConsultationMode,
  type ContactInquiry,
  type InquiryStatus,
  type PreferredSlot,
  type PropertyType,
  type PublishStatus,
  type ServiceCategory,
  type SiteSettings,
  type Testimonial,
  type VideoCategory,
  type VideoResource,
} from '../types/models';

export interface AppointmentInput {
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
  status?: AppointmentStatus;
  adminNotes?: string;
}

export interface BlogInput {
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
}

export interface VideoInput {
  title: string;
  category: VideoCategory;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  description: string;
  status: PublishStatus;
}

export interface TestimonialInput {
  clientName: string;
  role: string;
  city: string;
  serviceUsed: string;
  quote: string;
  rating: number;
  status: PublishStatus;
}

export interface InquiryInput {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FirebaseContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  signingIn: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  siteSettings: SiteSettings;
  publicBlogs: BlogPost[];
  publicVideos: VideoResource[];
  publicTestimonials: Testimonial[];
  publicLoading: boolean;

  // Admin synced collections (live across all devices)
  allAppointments: Appointment[];
  allBlogs: BlogPost[];
  allVideos: VideoResource[];
  allTestimonials: Testimonial[];
  allInquiries: ContactInquiry[];
  myAppointments: Appointment[];
  adminLoading: boolean;

  // CRUD operations
  createAppointment: (input: AppointmentInput, asAdmin?: boolean) => Promise<string>;
  updateAppointment: (id: string, input: Partial<AppointmentInput> & { status?: AppointmentStatus; adminNotes?: string }) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;

  createBlog: (input: BlogInput) => Promise<string>;
  updateBlog: (id: string, input: BlogInput) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  createVideo: (input: VideoInput) => Promise<string>;
  updateVideo: (id: string, input: VideoInput) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;

  createTestimonial: (input: TestimonialInput) => Promise<string>;
  updateTestimonial: (id: string, input: TestimonialInput) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  createInquiry: (input: InquiryInput) => Promise<string>;
  updateInquiryStatus: (id: string, status: InquiryStatus) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  saveSiteSettings: (settings: Omit<SiteSettings, 'updatedAt'>) => Promise<void>;
  seedInitialContent: () => Promise<{ blogsAdded: number; videosAdded: number; testimonialsAdded: number }>;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

function sortByCreatedDesc<T extends { createdAt?: Timestamp | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aMs = a.createdAt && typeof a.createdAt.toMillis === 'function' ? a.createdAt.toMillis() : 0;
    const bMs = b.createdAt && typeof b.createdAt.toMillis === 'function' ? b.createdAt.toMillis() : 0;
    return bMs - aMs;
  });
}

function sortByUpdatedDesc<T extends { updatedAt?: Timestamp | null; createdAt?: Timestamp | null }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const aMs =
      (a.updatedAt && typeof a.updatedAt.toMillis === 'function' ? a.updatedAt.toMillis() : 0) ||
      (a.createdAt && typeof a.createdAt.toMillis === 'function' ? a.createdAt.toMillis() : 0);
    const bMs =
      (b.updatedAt && typeof b.updatedAt.toMillis === 'function' ? b.updatedAt.toMillis() : 0) ||
      (b.createdAt && typeof b.createdAt.toMillis === 'function' ? b.createdAt.toMillis() : 0);
    return bMs - aMs;
  });
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [publicBlogs, setPublicBlogs] = useState<BlogPost[]>([]);
  const [publicVideos, setPublicVideos] = useState<VideoResource[]>([]);
  const [publicTestimonials, setPublicTestimonials] = useState<Testimonial[]>([]);
  const [publicLoading, setPublicLoading] = useState(true);

  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [allVideos, setAllVideos] = useState<VideoResource[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);
  const [allInquiries, setAllInquiries] = useState<ContactInquiry[]>([]);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // 1. Auth & Admin Verification
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      const isPrimary =
        nextUser.emailVerified &&
        nextUser.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();

      if (isPrimary) {
        setIsAdmin(true);
        setAuthReady(true);
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, 'admins', nextUser.uid));
        setIsAdmin(nextUser.emailVerified && adminDoc.exists());
      } catch {
        setIsAdmin(false);
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsub();
  }, []);

  // 2. Public live Firestore listeners (synced across all devices)
  useEffect(() => {
    let loadedCount = 0;
    const markLoaded = () => {
      loadedCount += 1;
      if (loadedCount >= 3) setPublicLoading(false);
    };

    const unsubSettings = onSnapshot(
      doc(db, 'siteSettings', 'main'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as SiteSettings;
          const normalizedSavedLocation = data.locations?.trim().toLowerCase() || '';
          const isLegacyDefaultAddress =
            normalizedSavedLocation === 'bangalore and hubballi, karnataka, india' ||
            normalizedSavedLocation === 'pride icon complex, gokul road, hubballi, karnataka, india';
          const normalizedSavedLogo = data.logoUrl?.trim() || '';
          const isLegacyDefaultLogo =
            !normalizedSavedLogo || normalizedSavedLogo === '/jkvaastu/logo.png';
          setSiteSettings({
            ...DEFAULT_SITE_SETTINGS,
            ...data,
            locations: isLegacyDefaultAddress
              ? DEFAULT_SITE_SETTINGS.locations
              : data.locations || DEFAULT_SITE_SETTINGS.locations,
            logoUrl: isLegacyDefaultLogo
              ? DEFAULT_SITE_SETTINGS.logoUrl
              : data.logoUrl || DEFAULT_SITE_SETTINGS.logoUrl,
          });
        } else {
          setSiteSettings(DEFAULT_SITE_SETTINGS);
        }
      },
      (err) => {
        console.warn('Site settings read notice:', err.message);
      }
    );

    const unsubBlogs = onSnapshot(
      query(collection(db, 'blogs'), where('status', '==', 'published')),
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, 'id'>) }));
        setPublicBlogs(sortByCreatedDesc(rows));
        markLoaded();
      },
      (err) => {
        markLoaded();
        handleFirestoreError(err, OperationType.LIST, 'blogs');
      }
    );

    const unsubVideos = onSnapshot(
      query(collection(db, 'videos'), where('status', '==', 'published')),
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<VideoResource, 'id'>) }));
        setPublicVideos(sortByCreatedDesc(rows));
        markLoaded();
      },
      (err) => {
        markLoaded();
        handleFirestoreError(err, OperationType.LIST, 'videos');
      }
    );

    const unsubTestimonials = onSnapshot(
      query(collection(db, 'testimonials'), where('status', '==', 'published')),
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, 'id'>) }));
        setPublicTestimonials(sortByUpdatedDesc(rows));
        markLoaded();
      },
      (err) => {
        markLoaded();
        handleFirestoreError(err, OperationType.LIST, 'testimonials');
      }
    );

    return () => {
      unsubSettings();
      unsubBlogs();
      unsubVideos();
      unsubTestimonials();
    };
  }, []);

  // 3. Authenticated user's own appointments
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setMyAppointments([]);
      return;
    }

    const unsubMyAppts = onSnapshot(
      query(collection(db, 'appointments'), where('userId', '==', user.uid)),
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Appointment, 'id'>) }));
        setMyAppointments(sortByCreatedDesc(rows));
      },
      (err) => {
        console.warn('User appointments listener error:', err.message);
      }
    );

    return () => unsubMyAppts();
  }, [authReady, user]);

  // 4. Admin live listeners (all collections synced across all devices)
  useEffect(() => {
    if (!authReady || !user || !isAdmin) {
      setAllAppointments([]);
      setAllBlogs([]);
      setAllVideos([]);
      setAllTestimonials([]);
      setAllInquiries([]);
      setAdminLoading(false);
      return;
    }

    setAdminLoading(true);
    let synced = 0;
    const markSynced = () => {
      synced += 1;
      if (synced >= 5) setAdminLoading(false);
    };

    const unsubAppts = onSnapshot(
      collection(db, 'appointments'),
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Appointment, 'id'>) }));
        setAllAppointments(sortByCreatedDesc(rows));
        markSynced();
      },
      (err) => {
        markSynced();
        handleFirestoreError(err, OperationType.LIST, 'appointments');
      }
    );

    const unsubBlogs = onSnapshot(
      collection(db, 'blogs'),
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, 'id'>) }));
        setAllBlogs(sortByCreatedDesc(rows));
        markSynced();
      },
      (err) => {
        markSynced();
        handleFirestoreError(err, OperationType.LIST, 'blogs');
      }
    );

    const unsubVideos = onSnapshot(
      collection(db, 'videos'),
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<VideoResource, 'id'>) }));
        setAllVideos(sortByCreatedDesc(rows));
        markSynced();
      },
      (err) => {
        markSynced();
        handleFirestoreError(err, OperationType.LIST, 'videos');
      }
    );

    const unsubTestimonials = onSnapshot(
      collection(db, 'testimonials'),
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, 'id'>) }));
        setAllTestimonials(sortByUpdatedDesc(rows));
        markSynced();
      },
      (err) => {
        markSynced();
        handleFirestoreError(err, OperationType.LIST, 'testimonials');
      }
    );

    const unsubInquiries = onSnapshot(
      collection(db, 'inquiries'),
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactInquiry, 'id'>) }));
        setAllInquiries(sortByCreatedDesc(rows));
        markSynced();
      },
      (err) => {
        markSynced();
        handleFirestoreError(err, OperationType.LIST, 'inquiries');
      }
    );

    return () => {
      unsubAppts();
      unsubBlogs();
      unsubVideos();
      unsubTestimonials();
      unsubInquiries();
    };
  }, [authReady, user, isAdmin]);

  const signInWithGoogle = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to complete Google sign-in.';
      setAuthError(msg);
    } finally {
      setSigningIn(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    await signOut(auth);
  };

  // ===========================================================================
  // CRUD Mutations (Blueprint-synchronized payload clamping & serverTimestamp)
  // ===========================================================================

  const createAppointment = async (input: AppointmentInput, asAdmin = false): Promise<string> => {
    const path = 'appointments';
    try {
      const uid = user && user.emailVerified ? user.uid : 'guest';
      const payload = {
        fullName: clampString(input.fullName, FIELD_LIMITS.fullName.max),
        email: clampString(input.email, FIELD_LIMITS.email.max),
        phone: clampString(input.phone, FIELD_LIMITS.phone.max),
        birthDate: clampString(input.birthDate || '', FIELD_LIMITS.birthDate.max),
        city: clampString(input.city, FIELD_LIMITS.city.max),
        propertyType: input.propertyType,
        serviceCategory: input.serviceCategory,
        preferredDate: clampString(input.preferredDate, 25),
        preferredSlot: input.preferredSlot,
        consultationMode: input.consultationMode,
        notes: clampString(input.notes || '', FIELD_LIMITS.notes.max),
        status: asAdmin && isAdmin && input.status ? input.status : ('pending' as AppointmentStatus),
        adminNotes: asAdmin && isAdmin ? clampString(input.adminNotes || '', FIELD_LIMITS.adminNotes.max) : '',
        userId: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, path), payload);
      return ref.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateAppointment = async (
    id: string,
    input: Partial<AppointmentInput> & { status?: AppointmentStatus; adminNotes?: string }
  ): Promise<void> => {
    const path = `appointments/${id}`;
    try {
      const cleanUpdate: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
      };
      if (input.fullName !== undefined) cleanUpdate.fullName = clampString(input.fullName, FIELD_LIMITS.fullName.max);
      if (input.email !== undefined) cleanUpdate.email = clampString(input.email, FIELD_LIMITS.email.max);
      if (input.phone !== undefined) cleanUpdate.phone = clampString(input.phone, FIELD_LIMITS.phone.max);
      if (input.birthDate !== undefined) cleanUpdate.birthDate = clampString(input.birthDate, FIELD_LIMITS.birthDate.max);
      if (input.city !== undefined) cleanUpdate.city = clampString(input.city, FIELD_LIMITS.city.max);
      if (input.propertyType !== undefined) cleanUpdate.propertyType = input.propertyType;
      if (input.serviceCategory !== undefined) cleanUpdate.serviceCategory = input.serviceCategory;
      if (input.preferredDate !== undefined) cleanUpdate.preferredDate = clampString(input.preferredDate, 25);
      if (input.preferredSlot !== undefined) cleanUpdate.preferredSlot = input.preferredSlot;
      if (input.consultationMode !== undefined) cleanUpdate.consultationMode = input.consultationMode;
      if (input.notes !== undefined) cleanUpdate.notes = clampString(input.notes, FIELD_LIMITS.notes.max);
      if (input.status !== undefined) cleanUpdate.status = input.status;
      if (input.adminNotes !== undefined) cleanUpdate.adminNotes = clampString(input.adminNotes, FIELD_LIMITS.adminNotes.max);

      await updateDoc(doc(db, 'appointments', id), cleanUpdate);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    const path = `appointments/${id}`;
    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const createBlog = async (input: BlogInput): Promise<string> => {
    const path = 'blogs';
    try {
      const safeSlug = slugify(input.slug || input.title) || `post-${Date.now()}`;
      const payload = {
        title: clampString(input.title, FIELD_LIMITS.blogTitle.max),
        slug: clampString(safeSlug, FIELD_LIMITS.blogSlug.max),
        category: input.category,
        excerpt: clampString(input.excerpt, FIELD_LIMITS.blogExcerpt.max),
        content: clampString(input.content, FIELD_LIMITS.blogContent.max),
        coverImage: clampString(input.coverImage || '/jkvaastu/blog-energy.png', 500),
        author: clampString(input.author || 'Jaydevji', 100),
        readTime: clampString(input.readTime || '5 min read', 30),
        status: input.status,
        featured: Boolean(input.featured),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, path), payload);
      return ref.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateBlog = async (id: string, input: BlogInput): Promise<void> => {
    const path = `blogs/${id}`;
    try {
      const safeSlug = slugify(input.slug || input.title) || `post-${Date.now()}`;
      await updateDoc(doc(db, 'blogs', id), {
        title: clampString(input.title, FIELD_LIMITS.blogTitle.max),
        slug: clampString(safeSlug, FIELD_LIMITS.blogSlug.max),
        category: input.category,
        excerpt: clampString(input.excerpt, FIELD_LIMITS.blogExcerpt.max),
        content: clampString(input.content, FIELD_LIMITS.blogContent.max),
        coverImage: clampString(input.coverImage || '/jkvaastu/blog-energy.png', 500),
        author: clampString(input.author || 'Jaydevji', 100),
        readTime: clampString(input.readTime || '5 min read', 30),
        status: input.status,
        featured: Boolean(input.featured),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteBlog = async (id: string): Promise<void> => {
    const path = `blogs/${id}`;
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const createVideo = async (input: VideoInput): Promise<string> => {
    const path = 'videos';
    try {
      const payload = {
        title: clampString(input.title, FIELD_LIMITS.videoTitle.max),
        category: input.category,
        videoUrl: clampString(input.videoUrl, FIELD_LIMITS.videoUrl.max),
        thumbnailUrl: clampString(input.thumbnailUrl || '/jkvaastu/hero-transform.png', 500),
        duration: clampString(input.duration || '15 min', 30),
        description: clampString(input.description, FIELD_LIMITS.videoDescription.max),
        status: input.status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, path), payload);
      return ref.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateVideo = async (id: string, input: VideoInput): Promise<void> => {
    const path = `videos/${id}`;
    try {
      await updateDoc(doc(db, 'videos', id), {
        title: clampString(input.title, FIELD_LIMITS.videoTitle.max),
        category: input.category,
        videoUrl: clampString(input.videoUrl, FIELD_LIMITS.videoUrl.max),
        thumbnailUrl: clampString(input.thumbnailUrl || '/jkvaastu/hero-transform.png', 500),
        duration: clampString(input.duration || '15 min', 30),
        description: clampString(input.description, FIELD_LIMITS.videoDescription.max),
        status: input.status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteVideo = async (id: string): Promise<void> => {
    const path = `videos/${id}`;
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const createTestimonial = async (input: TestimonialInput): Promise<string> => {
    const path = 'testimonials';
    try {
      const payload = {
        clientName: clampString(input.clientName, 100),
        role: clampString(input.role, 100),
        city: clampString(input.city, 80),
        serviceUsed: clampString(input.serviceUsed, 100),
        quote: clampString(input.quote, FIELD_LIMITS.quote.max),
        rating: Math.min(5, Math.max(1, Number(input.rating) || 5)),
        status: input.status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, path), payload);
      return ref.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateTestimonial = async (id: string, input: TestimonialInput): Promise<void> => {
    const path = `testimonials/${id}`;
    try {
      await updateDoc(doc(db, 'testimonials', id), {
        clientName: clampString(input.clientName, 100),
        role: clampString(input.role, 100),
        city: clampString(input.city, 80),
        serviceUsed: clampString(input.serviceUsed, 100),
        quote: clampString(input.quote, FIELD_LIMITS.quote.max),
        rating: Math.min(5, Math.max(1, Number(input.rating) || 5)),
        status: input.status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteTestimonial = async (id: string): Promise<void> => {
    const path = `testimonials/${id}`;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const createInquiry = async (input: InquiryInput): Promise<string> => {
    const path = 'inquiries';
    try {
      const uid = user && user.emailVerified ? user.uid : 'guest';
      const payload = {
        fullName: clampString(input.fullName, FIELD_LIMITS.fullName.max),
        email: clampString(input.email, FIELD_LIMITS.email.max),
        phone: clampString(input.phone, FIELD_LIMITS.phone.max),
        subject: clampString(input.subject, FIELD_LIMITS.subject.max),
        message: clampString(input.message, FIELD_LIMITS.message.max),
        status: 'new' as InquiryStatus,
        userId: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, path), payload);
      return ref.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateInquiryStatus = async (id: string, status: InquiryStatus): Promise<void> => {
    const path = `inquiries/${id}`;
    try {
      await updateDoc(doc(db, 'inquiries', id), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteInquiry = async (id: string): Promise<void> => {
    const path = `inquiries/${id}`;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const saveSiteSettings = async (settings: Omit<SiteSettings, 'updatedAt'>): Promise<void> => {
    const path = 'siteSettings/main';
    try {
      await setDoc(doc(db, 'siteSettings', 'main'), {
        brandName: clampString(settings.brandName, 80),
        founderName: clampString(settings.founderName, 80),
        phone: clampString(settings.phone, 30),
        whatsapp: clampString(settings.whatsapp, 30),
        email: clampString(settings.email, 120),
        locations: clampString(settings.locations, 200),
        officeHours: clampString(settings.officeHours, 120),
        logoUrl: clampString(settings.logoUrl, 500),
        googlePlaceId: clampString(settings.googlePlaceId || '', 160),
        googleBusinessQuery: clampString(settings.googleBusinessQuery || 'JK Vaastu Bangalore', 160),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const seedInitialContent = async () => {
    let blogsAdded = 0;
    let videosAdded = 0;
    let testimonialsAdded = 0;

    if (allBlogs.length === 0) {
      for (const b of STARTER_BLOGS) {
        await createBlog(b);
        blogsAdded += 1;
      }
    }

    if (allVideos.length === 0) {
      for (const v of STARTER_VIDEOS) {
        await createVideo(v);
        videosAdded += 1;
      }
    }

    if (allTestimonials.length === 0) {
      for (const t of STARTER_TESTIMONIALS) {
        await createTestimonial(t);
        testimonialsAdded += 1;
      }
    }

    await saveSiteSettings({
      brandName: siteSettings.brandName,
      founderName: siteSettings.founderName,
      phone: siteSettings.phone,
      whatsapp: siteSettings.whatsapp,
      email: siteSettings.email,
      locations: siteSettings.locations,
      officeHours: siteSettings.officeHours,
      logoUrl: siteSettings.logoUrl,
      googlePlaceId: siteSettings.googlePlaceId || '',
      googleBusinessQuery: siteSettings.googleBusinessQuery || 'JK Vaastu Bangalore',
    });

    return { blogsAdded, videosAdded, testimonialsAdded };
  };

  const value = useMemo<FirebaseContextValue>(
    () => ({
      user,
      authReady,
      isAdmin,
      signingIn,
      authError,
      signInWithGoogle,
      logout,
      siteSettings,
      publicBlogs,
      publicVideos,
      publicTestimonials,
      publicLoading,
      allAppointments,
      allBlogs,
      allVideos,
      allTestimonials,
      allInquiries,
      myAppointments,
      adminLoading,
      createAppointment,
      updateAppointment,
      deleteAppointment,
      createBlog,
      updateBlog,
      deleteBlog,
      createVideo,
      updateVideo,
      deleteVideo,
      createTestimonial,
      updateTestimonial,
      deleteTestimonial,
      createInquiry,
      updateInquiryStatus,
      deleteInquiry,
      saveSiteSettings,
      seedInitialContent,
    }),
    [
      user,
      authReady,
      isAdmin,
      signingIn,
      authError,
      siteSettings,
      publicBlogs,
      publicVideos,
      publicTestimonials,
      publicLoading,
      allAppointments,
      allBlogs,
      allVideos,
      allTestimonials,
      allInquiries,
      myAppointments,
      adminLoading,
    ]
  );

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

export function useFirebase(): FirebaseContextValue {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used inside FirebaseProvider');
  }
  return ctx;
}
