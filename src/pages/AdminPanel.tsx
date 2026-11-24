import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  Database,
  Download,
  FileText,
  Inbox,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquareQuote,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import {
  useFirebase,
  type AppointmentInput,
  type BlogInput,
  type TestimonialInput,
  type VideoInput,
} from '../context/FirebaseContext';
import { JKVAASTU_MEDIA_GALLERY } from '../data/vastuContent';
import { SafeImage } from '../components/SafeImage';
import { GoogleBusinessPicker } from '../components/GoogleBusinessPicker';
import {
  APPOINTMENT_STATUSES,
  BLOG_CATEGORIES,
  CONSULTATION_MODES,
  formatTimestamp,
  INQUIRY_STATUSES,
  isValidEmailFormat,
  PREFERRED_SLOTS,
  PROPERTY_TYPES,
  SERVICE_CATEGORIES,
  slugify,
  VIDEO_CATEGORIES,
  type Appointment,
  type AppointmentStatus,
  type BlogCategory,
  type BlogPost,
  type ConsultationMode,
  type InquiryStatus,
  type PreferredSlot,
  type PropertyType,
  type PublishStatus,
  type ServiceCategory,
  type Testimonial,
  type VideoCategory,
  type VideoResource,
} from '../types/models';

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

type AdminTab =
  | 'overview'
  | 'appointments'
  | 'blogs'
  | 'videos'
  | 'testimonials'
  | 'inquiries'
  | 'settings';

interface AdminPanelProps {
  onBackToSite: () => void;
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'text-amber-700',
  new: 'text-amber-700',
  draft: 'text-slate-500',
  confirmed: 'text-emerald-700',
  published: 'text-emerald-700',
  replied: 'text-emerald-700',
  completed: 'text-slate-800',
  archived: 'text-slate-500',
  cancelled: 'text-red-700',
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSite }) => {
  const {
    user,
    authReady,
    isAdmin,
    signingIn,
    authError,
    signInWithGoogle,
    logout,
    siteSettings,
    allAppointments,
    allBlogs,
    allVideos,
    allTestimonials,
    allInquiries,
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
    updateInquiryStatus,
    deleteInquiry,
    saveSiteSettings,
    seedInitialContent,
  } = useFirebase();

  const [tab, setTab] = useState<AdminTab>('overview');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ kind: string; id: string } | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Appointment Form Modal State
  const [apptModalOpen, setApptModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [apptForm, setApptForm] = useState<AppointmentInput>({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    city: 'Bengaluru',
    propertyType: 'Owned Home',
    serviceCategory: 'Vastu for House',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredSlot: 'Morning (09:30 - 12:30)',
    consultationMode: 'Online Video',
    notes: '',
    status: 'pending',
    adminNotes: '',
  });

  // Blog Form Modal State
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<BlogInput>({
    title: '',
    slug: '',
    category: 'Vastu Principles',
    excerpt: '',
    content: '',
    coverImage: '/jkvaastu/blog-energy.png',
    author: 'Jaydevji',
    readTime: '5 min read',
    status: 'published',
    featured: false,
  });

  // Video Form Modal State
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoResource | null>(null);
  const [videoForm, setVideoForm] = useState<VideoInput>({
    title: '',
    category: 'Webinar',
    videoUrl: '',
    thumbnailUrl: '/jkvaastu/hero-transform.png',
    duration: '25 min',
    description: '',
    status: 'published',
  });

  // Testimonial Form Modal State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Testimonial | null>(null);
  const [testForm, setTestForm] = useState<TestimonialInput>({
    clientName: '',
    role: '',
    city: 'Bengaluru',
    serviceUsed: 'Vastu for House',
    quote: '',
    rating: 5,
    status: 'published',
  });

  // Site Settings Form State
  const [settingsDraft, setSettingsDraft] = useState({
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSettingsDraft({
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
  }, [siteSettings]);

  const notify = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Filtered lists
  const filteredAppointments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allAppointments.filter((a) => {
      const okStatus = statusFilter === 'all' || a.status === statusFilter;
      const okSearch =
        !q ||
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.serviceCategory.toLowerCase().includes(q);
      return okStatus && okSearch;
    });
  }, [allAppointments, search, statusFilter]);

  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allBlogs.filter((b) => {
      const okStatus = statusFilter === 'all' || b.status === statusFilter;
      const okSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);
      return okStatus && okSearch;
    });
  }, [allBlogs, search, statusFilter]);

  const filteredVideos = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allVideos.filter((v) => {
      const okStatus = statusFilter === 'all' || v.status === statusFilter;
      const okSearch = !q || v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
      return okStatus && okSearch;
    });
  }, [allVideos, search, statusFilter]);

  const filteredTestimonials = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allTestimonials.filter((t) => {
      const okStatus = statusFilter === 'all' || t.status === statusFilter;
      const okSearch =
        !q ||
        t.clientName.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.serviceUsed.toLowerCase().includes(q);
      return okStatus && okSearch;
    });
  }, [allTestimonials, search, statusFilter]);

  const filteredInquiries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allInquiries.filter((i) => {
      const okStatus = statusFilter === 'all' || i.status === statusFilter;
      const okSearch =
        !q ||
        i.fullName.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.subject.toLowerCase().includes(q);
      return okStatus && okSearch;
    });
  }, [allInquiries, search, statusFilter]);

  // CSV Export for Appointments
  const exportAppointmentsCsv = () => {
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Birth Date',
      'City',
      'Property Type',
      'Service',
      'Preferred Date',
      'Slot',
      'Mode',
      'Status',
      'Notes',
      'Admin Notes',
    ];
    const escapeCell = (val: string) => `"${String(val || '').replace(/"/g, '""')}"`;
    const rows = filteredAppointments.map((a) =>
      [
        a.id,
        a.fullName,
        a.email,
        a.phone,
        a.birthDate,
        a.city,
        a.propertyType,
        a.serviceCategory,
        a.preferredDate,
        a.preferredSlot,
        a.consultationMode,
        a.status,
        a.notes,
        a.adminNotes,
      ]
        .map(escapeCell)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jk-vaastu-appointments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Auth Gate — Loading
  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <p className="text-sm text-slate-600">Verifying administrator session...</p>
      </div>
    );
  }

  // Auth Gate — Not Signed In
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8">
          <div className="mb-6 space-y-2">
            <SafeImage
              src={siteSettings.logoUrl || '/jkvaastu/logo.png'}
              alt={siteSettings.brandName}
              className="h-14 w-auto max-w-[220px] object-contain"
            />
            <p className="text-xs text-slate-500">Multi-Device Cloud Admin Console</p>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Sign in with your authorized Google account to manage appointments, publish blogs,
            upload webinars, and edit contact details across all devices.
          </p>

          {authError && (
            <div className="mb-4 p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg">
              {authError}
            </div>
          )}

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={signingIn}
            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-slate-900 hover:bg-orange-600 disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
          >
            {signingIn ? 'Opening Google Sign-In...' : 'Sign in with Google'}
          </button>

          <button
            type="button"
            onClick={onBackToSite}
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  // Auth Gate — Signed In But Not Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 space-y-5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 inline-flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-slate-900">
              Administrator Access Required
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              You are signed in as <strong className="text-slate-900">{user.email}</strong>, which
              does not currently have administrator privileges for {siteSettings.brandName}.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Switch Account
            </button>
            <button
              type="button"
              onClick={onBackToSite}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // CRUD Handlers
  // ===========================================================================

  const openCreateAppt = () => {
    setEditingAppt(null);
    setApptForm({
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      city: 'Bengaluru',
      propertyType: 'Owned Home',
      serviceCategory: 'Vastu for House',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredSlot: 'Morning (09:30 - 12:30)',
      consultationMode: 'Online Video',
      notes: '',
      status: 'confirmed',
      adminNotes: '',
    });
    setApptModalOpen(true);
  };

  const openEditAppt = (appt: Appointment) => {
    setEditingAppt(appt);
    setApptForm({
      fullName: appt.fullName,
      email: appt.email,
      phone: appt.phone,
      birthDate: appt.birthDate || '',
      city: appt.city,
      propertyType: appt.propertyType,
      serviceCategory: appt.serviceCategory,
      preferredDate: appt.preferredDate,
      preferredSlot: appt.preferredSlot,
      consultationMode: appt.consultationMode,
      notes: appt.notes || '',
      status: appt.status,
      adminNotes: appt.adminNotes || '',
    });
    setApptModalOpen(true);
  };

  const handleSaveAppt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (apptForm.fullName.trim().length < 2 || !isValidEmailFormat(apptForm.email)) {
      notify('error', 'Please enter a valid client name and email address.');
      return;
    }
    setSaving(true);
    try {
      if (editingAppt) {
        await updateAppointment(editingAppt.id, apptForm);
        notify('success', 'Appointment updated and synced across all devices.');
      } else {
        await createAppointment(apptForm, true);
        notify('success', 'New appointment created and synced across all devices.');
      }
      setApptModalOpen(false);
    } catch {
      notify('error', 'Failed to save appointment.');
    } finally {
      setSaving(false);
    }
  };

  const openCreateBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      slug: '',
      category: 'Vastu Principles',
      excerpt: '',
      content: '',
      coverImage: '/jkvaastu/blog-energy.png',
      author: siteSettings.founderName || 'Jaydevji',
      readTime: '5 min read',
      status: 'published',
      featured: false,
    });
    setBlogModalOpen(true);
  };

  const openEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      author: blog.author,
      readTime: blog.readTime,
      status: blog.status,
      featured: blog.featured,
    });
    setBlogModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blogForm.title.trim().length < 3 || blogForm.content.trim().length < 20) {
      notify('error', 'Blog title (3+ chars) and content (20+ chars) are required.');
      return;
    }
    setSaving(true);
    try {
      const prepared = { ...blogForm, slug: slugify(blogForm.slug || blogForm.title) };
      if (editingBlog) {
        await updateBlog(editingBlog.id, prepared);
        notify('success', 'Blog post updated across all devices.');
      } else {
        await createBlog(prepared);
        notify('success', 'Blog post published and synced across all devices.');
      }
      setBlogModalOpen(false);
    } catch {
      notify('error', 'Failed to save blog post.');
    } finally {
      setSaving(false);
    }
  };

  const openCreateVideo = () => {
    setEditingVideo(null);
    setVideoForm({
      title: '',
      category: 'Webinar',
      videoUrl: '',
      thumbnailUrl: '/jkvaastu/hero-transform.png',
      duration: '30 min',
      description: '',
      status: 'published',
    });
    setVideoModalOpen(true);
  };

  const openEditVideo = (v: VideoResource) => {
    setEditingVideo(v);
    setVideoForm({
      title: v.title,
      category: v.category,
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl,
      duration: v.duration,
      description: v.description,
      status: v.status,
    });
    setVideoModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videoForm.title.trim().length < 3 || videoForm.videoUrl.trim().length < 5) {
      notify('error', 'Please enter a valid video title and URL.');
      return;
    }
    setSaving(true);
    try {
      if (editingVideo) {
        await updateVideo(editingVideo.id, videoForm);
        notify('success', 'Video entry updated.');
      } else {
        await createVideo(videoForm);
        notify('success', 'Video added and synced across all devices.');
      }
      setVideoModalOpen(false);
    } catch {
      notify('error', 'Failed to save video.');
    } finally {
      setSaving(false);
    }
  };

  const openCreateTest = () => {
    setEditingTest(null);
    setTestForm({
      clientName: '',
      role: '',
      city: 'Bengaluru',
      serviceUsed: 'Vastu for House',
      quote: '',
      rating: 5,
      status: 'published',
    });
    setTestModalOpen(true);
  };

  const openEditTest = (t: Testimonial) => {
    setEditingTest(t);
    setTestForm({
      clientName: t.clientName,
      role: t.role,
      city: t.city,
      serviceUsed: t.serviceUsed,
      quote: t.quote,
      rating: t.rating,
      status: t.status,
    });
    setTestModalOpen(true);
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (testForm.clientName.trim().length < 2 || testForm.quote.trim().length < 10) {
      notify('error', 'Please enter client name and a testimonial quote (10+ characters).');
      return;
    }
    setSaving(true);
    try {
      if (editingTest) {
        await updateTestimonial(editingTest.id, testForm);
        notify('success', 'Testimonial updated.');
      } else {
        await createTestimonial(testForm);
        notify('success', 'Testimonial added across all devices.');
      }
      setTestModalOpen(false);
    } catch {
      notify('error', 'Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      if (pendingDelete.kind === 'appointment') await deleteAppointment(pendingDelete.id);
      if (pendingDelete.kind === 'blog') await deleteBlog(pendingDelete.id);
      if (pendingDelete.kind === 'video') await deleteVideo(pendingDelete.id);
      if (pendingDelete.kind === 'testimonial') await deleteTestimonial(pendingDelete.id);
      if (pendingDelete.kind === 'inquiry') await deleteInquiry(pendingDelete.id);
      notify('success', 'Record permanently deleted from Cloud Firestore.');
    } catch {
      notify('error', 'Could not delete record.');
    } finally {
      setPendingDelete(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteSettings(settingsDraft);
      notify('success', 'Site & Contact details updated live across all devices.');
    } catch {
      notify('error', 'Could not update site settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSeedContent = async () => {
    setSeeding(true);
    try {
      const res = await seedInitialContent();
      notify(
        'success',
        `Synced starter records to Cloud Firestore (${res.blogsAdded} blogs, ${res.videosAdded} videos, ${res.testimonialsAdded} testimonials).`
      );
    } catch {
      notify('error', 'Failed to seed starter records.');
    } finally {
      setSeeding(false);
    }
  };

  const pendingApptsCount = allAppointments.filter((a) => a.status === 'pending').length;
  const newInquiriesCount = allInquiries.filter((i) => i.status === 'new').length;

  const NAV_SECTIONS: { id: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <Calendar className="w-4 h-4" />,
      count: allAppointments.length,
    },
    { id: 'blogs', label: 'Blogs', icon: <FileText className="w-4 h-4" />, count: allBlogs.length },
    {
      id: 'videos',
      label: 'Videos & Webinars',
      icon: <Video className="w-4 h-4" />,
      count: allVideos.length,
    },
    {
      id: 'inquiries',
      label: 'Contact Inquiries',
      icon: <Inbox className="w-4 h-4" />,
      count: allInquiries.length,
    },
    { id: 'settings', label: 'Site & Contact', icon: <Settings className="w-4 h-4" /> },
  ];

  const switchTab = (next: AdminTab) => {
    setTab(next);
    setSearch('');
    setStatusFilter('all');
    setPendingDelete(null);
    if (next === 'settings') {
      setSettingsDraft({
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
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar (256px) */}
      <aside className="w-full lg:w-64 bg-slate-950 text-slate-300 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col shrink-0">
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <SafeImage
              src={siteSettings.logoUrl || '/jkvaastu/logo.png'}
              alt={siteSettings.brandName}
              className="w-8 h-8 object-contain rounded bg-white p-0.5 shrink-0"
            />
            <span className="font-display text-xl font-semibold text-white truncate">
              {siteSettings.brandName}
            </span>
          </div>
          <button
            type="button"
            onClick={onBackToSite}
            className="text-xs text-slate-400 hover:text-white cursor-pointer whitespace-nowrap"
          >
            View Site
          </button>
        </div>

        <nav className="p-3 flex-1 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {NAV_SECTIONS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => switchTab(item.id)}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {item.icon}
                  {item.label}
                </span>
                {typeof item.count === 'number' && (
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      active ? 'text-orange-100' : 'text-slate-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 hidden lg:block space-y-3">
          <div className="text-xs">
            <p className="font-medium text-white truncate">{user.displayName || 'Administrator'}</p>
            <p className="text-slate-500 truncate mt-0.5">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Breadcrumb Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-2 min-w-0">
            <span className="truncate">Admin Console</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 capitalize truncate">
              {NAV_SECTIONS.find((s) => s.id === tab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {tab === 'appointments' && (
              <>
                <button
                  type="button"
                  onClick={exportAppointmentsCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={openCreateAppt}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Appointment
                </button>
              </>
            )}
            {tab === 'blogs' && (
              <button
                type="button"
                onClick={openCreateBlog}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                New Blog Post
              </button>
            )}
            {tab === 'videos' && (
              <button
                type="button"
                onClick={openCreateVideo}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Video
              </button>
            )}
            {tab === 'testimonials' && (
              <button
                type="button"
                onClick={openCreateTest}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Testimonial
              </button>
            )}
            {tab === 'overview' && (
              <button
                type="button"
                onClick={openCreateAppt}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                New Appointment
              </button>
            )}
          </div>
        </header>

        {/* Inline Feedback Toast */}
        {toast && (
          <div
            className={`mx-6 mt-5 px-4 py-3 text-xs font-medium rounded-lg border flex items-center justify-between gap-4 ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Viewport Canvas */}
        <main className="p-6 flex-1 space-y-6">
          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500">Total Appointments</p>
                  <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-1.5">
                    {allAppointments.length}
                  </p>
                  <p className="text-xs text-amber-700 mt-1 tabular-nums">
                    {pendingApptsCount} pending confirmation
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500">Blog Articles</p>
                  <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-1.5">
                    {allBlogs.length}
                  </p>
                  <p className="text-xs text-emerald-700 mt-1 tabular-nums">
                    {allBlogs.filter((b) => b.status === 'published').length} published live
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500">Videos &amp; Webinars</p>
                  <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-1.5">
                    {allVideos.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 tabular-nums">
                    {allVideos.filter((v) => v.status === 'published').length} published live
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-xs text-slate-500">Contact Inquiries</p>
                  <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-1.5">
                    {allInquiries.length}
                  </p>
                  <p className="text-xs text-amber-700 mt-1 tabular-nums">
                    {newInquiriesCount} awaiting reply
                  </p>
                </div>
              </div>

              {(allBlogs.length === 0 || allVideos.length === 0) && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <Database className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">
                        Populate Cloud Database with Starter JK Vaastu Content
                      </h2>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Save the curated starter articles, webinars, and contact settings into
                        Cloud Firestore so you can edit or delete them from any device.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSeedContent}
                    disabled={seeding}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-orange-600 disabled:opacity-60 rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {seeding ? 'Syncing...' : 'Seed Starter Records'}
                  </button>
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Recent Appointments</h2>
                  <button
                    type="button"
                    onClick={() => switchTab('appointments')}
                    className="text-xs font-medium text-orange-700 hover:underline cursor-pointer"
                  >
                    Manage All
                  </button>
                </div>
                {adminLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map((k) => (
                      <div key={k} className="h-9 bg-slate-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : allAppointments.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-500">
                    No appointments recorded yet. Bookings made from any device will appear here
                    automatically.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="px-5 py-3 font-medium">Client</th>
                          <th className="px-5 py-3 font-medium">Service</th>
                          <th className="px-5 py-3 font-medium">Date &amp; Mode</th>
                          <th className="px-5 py-3 font-medium">Status</th>
                          <th className="px-5 py-3 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {allAppointments.slice(0, 6).map((a) => (
                          <tr key={a.id} className="hover:bg-slate-50">
                            <td className="px-5 py-3">
                              <p className="font-medium text-slate-900">{a.fullName}</p>
                              <p className="text-slate-500 tabular-nums">{a.phone}</p>
                            </td>
                            <td className="px-5 py-3 text-slate-700">
                              <p>{a.serviceCategory}</p>
                              <p className="text-slate-500">{a.propertyType}</p>
                            </td>
                            <td className="px-5 py-3 text-slate-700 tabular-nums">
                              <p>{a.preferredDate}</p>
                              <p className="text-slate-500">{a.consultationMode}</p>
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`font-mono uppercase text-[11px] font-medium ${
                                  STATUS_STYLE[a.status] || 'text-slate-700'
                                }`}
                              >
                                {a.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => openEditAppt(a)}
                                className="text-xs font-medium text-slate-700 hover:text-orange-700 cursor-pointer"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* APPOINTMENTS CRUD TAB */}
          {tab === 'appointments' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
                  {(['all', ...APPOINTMENT_STATUSES] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 text-xs font-medium capitalize rounded-md cursor-pointer ${
                        statusFilter === st
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search client, phone, city..."
                    className="w-full sm:w-64 pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <p className="text-sm font-medium text-slate-800">No appointments found.</p>
                  <button
                    type="button"
                    onClick={openCreateAppt}
                    className="px-4 py-2 text-xs font-medium text-white bg-orange-600 rounded-lg cursor-pointer"
                  >
                    Create First Appointment
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Client &amp; Contact</th>
                        <th className="px-4 py-3 font-medium">Property &amp; Service</th>
                        <th className="px-4 py-3 font-medium">Schedule</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAppointments.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50 align-top">
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-slate-900">{a.fullName}</p>
                            <p className="text-slate-600 tabular-nums mt-0.5">{a.phone}</p>
                            <p className="text-slate-500">{a.email}</p>
                            {a.birthDate && (
                              <p className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                                DOB: {a.birthDate}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-medium text-slate-900">{a.serviceCategory}</p>
                            <p className="text-slate-600 mt-0.5">
                              {a.propertyType} · {a.city}
                            </p>
                            {a.notes && (
                              <p className="text-[11px] text-slate-500 mt-1 max-w-xs line-clamp-2">
                                {a.notes}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3.5 tabular-nums">
                            <p className="font-medium text-slate-900">{a.preferredDate}</p>
                            <p className="text-slate-600 mt-0.5">{a.preferredSlot}</p>
                            <p className="text-slate-500">{a.consultationMode}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              aria-label={`Change status for ${a.fullName}`}
                              value={a.status}
                              onChange={async (e) => {
                                await updateAppointment(a.id, {
                                  status: e.target.value as AppointmentStatus,
                                });
                                notify('success', `Status updated to ${e.target.value}.`);
                              }}
                              className="px-2.5 py-1.5 text-xs font-medium border border-slate-300 rounded-md bg-white focus:outline-none focus:border-orange-600"
                            >
                              {APPOINTMENT_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditAppt(a)}
                                aria-label="Edit appointment"
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              {pendingDelete?.kind === 'appointment' && pendingDelete.id === a.id ? (
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="px-2 py-1 text-[11px] font-semibold text-white bg-red-600 rounded cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPendingDelete(null)}
                                    className="px-2 py-1 text-[11px] text-slate-600 bg-slate-100 rounded cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setPendingDelete({ kind: 'appointment', id: a.id })}
                                  aria-label="Delete appointment"
                                  className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* BLOGS CRUD TAB */}
          {tab === 'blogs' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
                  {(['all', 'published', 'draft'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 text-xs font-medium capitalize rounded-md cursor-pointer ${
                        statusFilter === st
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full sm:w-64 pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              {filteredBlogs.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <p className="text-sm font-medium text-slate-800">No blog posts in Cloud Firestore yet.</p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={openCreateBlog}
                      className="px-4 py-2 text-xs font-medium text-white bg-orange-600 rounded-lg cursor-pointer"
                    >
                      Write New Blog
                    </button>
                    <button
                      type="button"
                      onClick={handleSeedContent}
                      disabled={seeding}
                      className="px-4 py-2 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Seed Starter Blogs
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Article</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Updated</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBlogs.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <SafeImage
                                src={b.coverImage}
                                alt={b.title}
                                className="w-12 h-9 object-cover rounded border border-slate-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate max-w-md">
                                  {b.title}
                                </p>
                                <p className="text-slate-500">
                                  By {b.author} · {b.readTime}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{b.category}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-mono uppercase text-[11px] font-medium ${
                                STATUS_STYLE[b.status]
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 tabular-nums">
                            {formatTimestamp(b.updatedAt)}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditBlog(b)}
                                aria-label="Edit blog post"
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              {pendingDelete?.kind === 'blog' && pendingDelete.id === b.id ? (
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="px-2 py-1 text-[11px] font-semibold text-white bg-red-600 rounded cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPendingDelete(null)}
                                    className="px-2 py-1 text-[11px] text-slate-600 bg-slate-100 rounded cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setPendingDelete({ kind: 'blog', id: b.id })}
                                  aria-label="Delete blog post"
                                  className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VIDEOS & WEBINARS CRUD TAB */}
          {tab === 'videos' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-slate-600">
                  Manage YouTube embeds, direct MP4 recordings, and live webinar links.
                </p>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search videos..."
                    className="w-56 pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              {filteredVideos.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <p className="text-sm font-medium text-slate-800">No videos saved yet.</p>
                  <button
                    type="button"
                    onClick={openCreateVideo}
                    className="px-4 py-2 text-xs font-medium text-white bg-orange-600 rounded-lg cursor-pointer"
                  >
                    Add First Video
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredVideos.map((v) => (
                    <div
                      key={v.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <SafeImage
                          src={v.thumbnailUrl}
                          alt={v.title}
                          className="w-20 h-12 object-cover rounded border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">
                            {v.category} · {v.duration} ·{' '}
                            <span className={`font-mono uppercase ${STATUS_STYLE[v.status]}`}>
                              {v.status}
                            </span>
                          </p>
                          <p className="text-sm font-semibold text-slate-900 truncate">{v.title}</p>
                          <p className="text-xs text-slate-500 truncate max-w-md">{v.videoUrl}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditVideo(v)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                        >
                          Edit
                        </button>
                        {pendingDelete?.kind === 'video' && pendingDelete.id === v.id ? (
                          <>
                            <button
                              type="button"
                              onClick={handleConfirmDelete}
                              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-md cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(null)}
                              className="px-2.5 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-md cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPendingDelete({ kind: 'video', id: v.id })}
                            className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TESTIMONIALS CRUD TAB */}
          {tab === 'testimonials' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-600">
                  Ordered dynamically: <strong className="text-slate-900">newly added &amp; updated testimonials appear first</strong>, merged live with Google Business reviews on the public website.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('settings')}
                  className="text-xs font-semibold text-orange-700 hover:text-orange-800 cursor-pointer whitespace-nowrap"
                >
                  Configure Google Business Profile &rarr;
                </button>
              </div>
              {filteredTestimonials.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <p className="text-sm font-medium text-slate-800">No testimonials saved yet.</p>
                  <button
                    type="button"
                    onClick={openCreateTest}
                    className="px-4 py-2 text-xs font-medium text-white bg-orange-600 rounded-lg cursor-pointer"
                  >
                    Add Client Testimonial
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredTestimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <p className="text-xs text-slate-500">
                          {t.serviceUsed} · <span className="font-mono tabular-nums">{t.rating}/5</span> ·{' '}
                          <span className={`font-mono uppercase ${STATUS_STYLE[t.status]}`}>
                            {t.status}
                          </span>
                        </p>
                        <p className="text-sm text-slate-800 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                        <p className="text-xs font-semibold text-slate-900">
                          {t.clientName}{' '}
                          <span className="font-normal text-slate-500">
                            — {t.role}, {t.city}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditTest(t)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                        >
                          Edit
                        </button>
                        {pendingDelete?.kind === 'testimonial' && pendingDelete.id === t.id ? (
                          <>
                            <button
                              type="button"
                              onClick={handleConfirmDelete}
                              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-md cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(null)}
                              className="px-2.5 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-md cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPendingDelete({ kind: 'testimonial', id: t.id })}
                            className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTACT INQUIRIES TAB */}
          {tab === 'inquiries' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  {(['all', ...INQUIRY_STATUSES] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 text-xs font-medium capitalize rounded-md cursor-pointer ${
                        statusFilter === st
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search inquiries..."
                    className="w-56 pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  No contact messages yet. Submissions from the Contact Us page sync here live.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <p className="text-xs text-slate-500">
                          {formatTimestamp(inq.createdAt)} ·{' '}
                          <span className={`font-mono uppercase ${STATUS_STYLE[inq.status]}`}>
                            {inq.status}
                          </span>
                        </p>
                        <p className="text-sm font-semibold text-slate-900">{inq.subject}</p>
                        <p className="text-xs text-slate-700 leading-relaxed">{inq.message}</p>
                        <p className="text-xs text-slate-500 pt-1">
                          {inq.fullName} · {inq.email} ·{' '}
                          <span className="tabular-nums">{inq.phone}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          aria-label={`Update inquiry status for ${inq.fullName}`}
                          value={inq.status}
                          onChange={async (e) => {
                            await updateInquiryStatus(inq.id, e.target.value as InquiryStatus);
                            notify('success', 'Inquiry status updated.');
                          }}
                          className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                        >
                          {INQUIRY_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        {pendingDelete?.kind === 'inquiry' && pendingDelete.id === inq.id ? (
                          <>
                            <button
                              type="button"
                              onClick={handleConfirmDelete}
                              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-md cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(null)}
                              className="px-2.5 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-md cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPendingDelete({ kind: 'inquiry', id: inq.id })}
                            className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SITE & CONTACT SETTINGS TAB */}
          {tab === 'settings' && (
            <form
              onSubmit={handleSaveSettings}
              className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl space-y-5"
            >
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Brand, Logo &amp; Contact Us Settings
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Updates here immediately synchronize across the header, footer, WhatsApp links,
                  and Contact Us page on all devices.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={settingsDraft.brandName}
                    onChange={(e) =>
                      setSettingsDraft((s) => ({ ...s, brandName: e.target.value }))
                    }
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Lead Consultant / Founder
                  </label>
                  <input
                    type="text"
                    value={settingsDraft.founderName}
                    onChange={(e) =>
                      setSettingsDraft((s) => ({ ...s, founderName: e.target.value }))
                    }
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={settingsDraft.phone}
                    onChange={(e) => setSettingsDraft((s) => ({ ...s, phone: e.target.value }))}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    WhatsApp Digits (Country Code + Number)
                  </label>
                  <input
                    type="text"
                    value={settingsDraft.whatsapp}
                    onChange={(e) => setSettingsDraft((s) => ({ ...s, whatsapp: e.target.value }))}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600 tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={settingsDraft.email}
                    onChange={(e) => setSettingsDraft((s) => ({ ...s, email: e.target.value }))}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Office Hours
                  </label>
                  <input
                    type="text"
                    value={settingsDraft.officeHours}
                    onChange={(e) =>
                      setSettingsDraft((s) => ({ ...s, officeHours: e.target.value }))
                    }
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Office Locations
                </label>
                <input
                  type="text"
                  value={settingsDraft.locations}
                  onChange={(e) => setSettingsDraft((s) => ({ ...s, locations: e.target.value }))}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Logo Path or URL
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <SafeImage
                    src={settingsDraft.logoUrl}
                    alt="Logo preview"
                    className="h-12 w-auto max-w-[180px] object-contain rounded border border-slate-200 px-2 py-1 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={settingsDraft.logoUrl}
                    onChange={(e) => setSettingsDraft((s) => ({ ...s, logoUrl: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              {/* Live Google Business Profile Reviews Connector */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                {MAPS_API_KEY && (
                  <GoogleBusinessPicker
                    currentPlaceId={settingsDraft.googlePlaceId}
                    currentQuery={settingsDraft.googleBusinessQuery}
                    onSelectBusiness={(placeId, query) => {
                      setSettingsDraft((s) => ({
                        ...s,
                        googlePlaceId: placeId,
                        googleBusinessQuery: query,
                      }));
                      notify('success', 'Google Business listing selected. Click Save Live Settings to sync across devices.');
                    }}
                  />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Google Business Place ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.googlePlaceId}
                      onChange={(e) =>
                        setSettingsDraft((s) => ({ ...s, googlePlaceId: e.target.value }))
                      }
                      placeholder="Auto-filled when you connect a listing above"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Google Business Search Query
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.googleBusinessQuery}
                      onChange={(e) =>
                        setSettingsDraft((s) => ({ ...s, googleBusinessQuery: e.target.value }))
                      }
                      placeholder="e.g. JK Vaastu Bangalore"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-60 rounded-lg cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Live Settings'}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>

      {/* APPOINTMENT MODAL */}
      {apptModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                {editingAppt ? 'Edit Appointment' : 'Create Appointment'}
              </h3>
              <button
                type="button"
                onClick={() => setApptModalOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAppt} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={apptForm.fullName}
                    onChange={(e) => setApptForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={apptForm.phone}
                    onChange={(e) => setApptForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg tabular-nums"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={apptForm.email}
                    onChange={(e) => setApptForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={apptForm.birthDate}
                    onChange={(e) => setApptForm((f) => ({ ...f, birthDate: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={apptForm.city}
                    onChange={(e) => setApptForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Property Type</label>
                  <select
                    value={apptForm.propertyType}
                    onChange={(e) =>
                      setApptForm((f) => ({ ...f, propertyType: e.target.value as PropertyType }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {PROPERTY_TYPES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Service</label>
                  <select
                    value={apptForm.serviceCategory}
                    onChange={(e) =>
                      setApptForm((f) => ({
                        ...f,
                        serviceCategory: e.target.value as ServiceCategory,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {SERVICE_CATEGORIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={apptForm.status}
                    onChange={(e) =>
                      setApptForm((f) => ({ ...f, status: e.target.value as AppointmentStatus }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {APPOINTMENT_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={apptForm.preferredDate}
                    onChange={(e) => setApptForm((f) => ({ ...f, preferredDate: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Slot</label>
                  <select
                    value={apptForm.preferredSlot}
                    onChange={(e) =>
                      setApptForm((f) => ({ ...f, preferredSlot: e.target.value as PreferredSlot }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {PREFERRED_SLOTS.map((sl) => (
                      <option key={sl} value={sl}>
                        {sl}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mode</label>
                  <select
                    value={apptForm.consultationMode}
                    onChange={(e) =>
                      setApptForm((f) => ({
                        ...f,
                        consultationMode: e.target.value as ConsultationMode,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {CONSULTATION_MODES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Client Notes</label>
                <textarea
                  rows={2}
                  value={apptForm.notes}
                  onChange={(e) => setApptForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Consultant Internal Remarks
                </label>
                <textarea
                  rows={2}
                  value={apptForm.adminNotes}
                  onChange={(e) => setApptForm((f) => ({ ...f, adminNotes: e.target.value }))}
                  placeholder="Recommended remedies, follow-up date, floor plan observations..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setApptModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-60 rounded-lg cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG MODAL */}
      {blogModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                {editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}
              </h3>
              <button
                type="button"
                onClick={() => setBlogModalOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveBlog} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => {
                      const nextTitle = e.target.value;
                      setBlogForm((f) => ({
                        ...f,
                        title: nextTitle,
                        slug: editingBlog ? f.slug : slugify(nextTitle),
                      }));
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) =>
                      setBlogForm((f) => ({ ...f, category: e.target.value as BlogCategory }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {BLOG_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={blogForm.author}
                    onChange={(e) => setBlogForm((f) => ({ ...f, author: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    required
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm((f) => ({ ...f, readTime: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Cover Image (Choose from JK Vaastu Media)
                  </label>
                  <select
                    value={
                      JKVAASTU_MEDIA_GALLERY.some((m) => m.url === blogForm.coverImage)
                        ? blogForm.coverImage
                        : ''
                    }
                    onChange={(e) => {
                      if (e.target.value) setBlogForm((f) => ({ ...f, coverImage: e.target.value }));
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">Custom URL below...</option>
                    {JKVAASTU_MEDIA_GALLERY.map((m) => (
                      <option key={m.url} value={m.url}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Or Direct Image URL
                  </label>
                  <input
                    type="text"
                    value={blogForm.coverImage}
                    onChange={(e) => setBlogForm((f) => ({ ...f, coverImage: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm((f) => ({ ...f, excerpt: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Article Content *
                </label>
                <textarea
                  rows={7}
                  required
                  value={blogForm.content}
                  onChange={(e) => setBlogForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200">
                <div className="flex items-center gap-5">
                  <select
                    value={blogForm.status}
                    onChange={(e) =>
                      setBlogForm((f) => ({ ...f, status: e.target.value as PublishStatus }))
                    }
                    className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blogForm.featured}
                      onChange={(e) => setBlogForm((f) => ({ ...f, featured: e.target.checked }))}
                    />
                    Featured article
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBlogModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-60 rounded-lg cursor-pointer"
                  >
                    {saving ? 'Saving...' : 'Save Blog Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIDEO MODAL */}
      {videoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                {editingVideo ? 'Edit Video / Webinar' : 'Add Video / Webinar'}
              </h3>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveVideo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={videoForm.category}
                    onChange={(e) =>
                      setVideoForm((f) => ({ ...f, category: e.target.value as VideoCategory }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {VIDEO_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm((f) => ({ ...f, duration: e.target.value }))}
                    placeholder="e.g., 35 min"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  YouTube, MP4, or Webinar URL *
                </label>
                <input
                  type="url"
                  required
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm((f) => ({ ...f, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Thumbnail Image
                </label>
                <select
                  value={
                    JKVAASTU_MEDIA_GALLERY.some((m) => m.url === videoForm.thumbnailUrl)
                      ? videoForm.thumbnailUrl
                      : JKVAASTU_MEDIA_GALLERY[0].url
                  }
                  onChange={(e) => setVideoForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                >
                  {JKVAASTU_MEDIA_GALLERY.map((m) => (
                    <option key={m.url} value={m.url}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={videoForm.description}
                  onChange={(e) => setVideoForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <select
                  value={videoForm.status}
                  onChange={(e) =>
                    setVideoForm((f) => ({ ...f, status: e.target.value as PublishStatus }))
                  }
                  className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setVideoModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg cursor-pointer"
                  >
                    {saving ? 'Saving...' : 'Save Video'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {testModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold text-slate-900">
                {editingTest ? 'Edit Testimonial' : 'Add Client Testimonial'}
              </h3>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTest} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={testForm.clientName}
                    onChange={(e) => setTestForm((f) => ({ ...f, clientName: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Role / Profession *
                  </label>
                  <input
                    type="text"
                    required
                    value={testForm.role}
                    onChange={(e) => setTestForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={testForm.city}
                    onChange={(e) => setTestForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Service *</label>
                  <input
                    type="text"
                    required
                    value={testForm.serviceUsed}
                    onChange={(e) => setTestForm((f) => ({ ...f, serviceUsed: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Rating</label>
                  <select
                    value={testForm.rating}
                    onChange={(e) => setTestForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} / 5
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={testForm.quote}
                  onChange={(e) => setTestForm((f) => ({ ...f, quote: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <select
                  value={testForm.status}
                  onChange={(e) =>
                    setTestForm((f) => ({ ...f, status: e.target.value as PublishStatus }))
                  }
                  className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTestModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg cursor-pointer"
                  >
                    {saving ? 'Saving...' : 'Save Testimonial'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
