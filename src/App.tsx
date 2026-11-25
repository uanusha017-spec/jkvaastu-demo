import React, { useCallback, useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FirebaseProvider } from './context/FirebaseContext';
import { Navbar, type PublicPage } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { BlogsVideosPage } from './pages/BlogsVideosPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AdminPanel } from './pages/AdminPanel';
import {
  getServiceBySlug,
  getServiceGroupById,
  type ServiceGroupId,
} from './data/jkvaastuCatalog';
import type { ServiceCategory } from './types/models';

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

interface ParsedRoute {
  page: PublicPage;
  serviceSlug: string | null;
  serviceGroupId: ServiceGroupId | null;
}

function parseHashRoute(): ParsedRoute {
  const rawHash = window.location.hash.replace(/^#/, '').trim();
  const lower = rawHash.toLowerCase();

  const segments = lower.split('/').filter(Boolean);

  if (segments.length >= 1) {
    const first = segments[0];
    const second = segments[1];

    // Direct group URLs: #vastu-for-house, #vastu-for-house/<slug>, #vastu-for-commercial/<slug>, etc.
    // Also gracefully redirect legacy #vastu-for-residence URLs to vastu-for-house.
    const matchedGroup = getServiceGroupById(first);
    if (matchedGroup) {
      const matchedItem = second ? getServiceBySlug(second) : null;
      return {
        page: 'services',
        serviceSlug: matchedItem ? matchedItem.slug : null,
        serviceGroupId: matchedItem ? matchedItem.groupId : matchedGroup.id,
      };
    }

    // Legacy #service/<slug> URLs
    if (first === 'service' && second) {
      const matched = getServiceBySlug(second);
      return {
        page: 'services',
        serviceSlug: matched ? matched.slug : null,
        serviceGroupId: matched ? matched.groupId : null,
      };
    }

    // Legacy #services/<groupId> URLs
    if (first === 'services' && second) {
      const group = getServiceGroupById(second);
      return {
        page: 'services',
        serviceSlug: null,
        serviceGroupId: group ? group.id : null,
      };
    }
  }

  if (lower === 'terms' || lower === 'terms-and-conditions') {
    return { page: 'terms', serviceSlug: null, serviceGroupId: null };
  }

  if (lower === 'privacy' || lower === 'privacy-policy') {
    return { page: 'privacy', serviceSlug: null, serviceGroupId: null };
  }

  if (
    lower === 'about' ||
    lower === 'services' ||
    lower === 'blogs' ||
    lower === 'contact' ||
    lower === 'admin'
  ) {
    return { page: lower, serviceSlug: null, serviceGroupId: null };
  }

  return { page: 'home', serviceSlug: null, serviceGroupId: null };
}

function AppShell() {
  const [route, setRoute] = useState<ParsedRoute>(() => parseHashRoute());
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDefaults, setBookingDefaults] = useState<{
    service?: ServiceCategory;
    birthDate?: string;
  }>({});
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((nextPage: PublicPage) => {
    setRoute({ page: nextPage, serviceSlug: null, serviceGroupId: null });
    window.location.hash = nextPage === 'home' ? '' : nextPage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openService = useCallback((slug?: string, groupId?: ServiceGroupId) => {
    if (slug) {
      const matched = getServiceBySlug(slug);
      const resolvedGroupId = matched ? matched.groupId : groupId || 'vastu-for-house';
      setRoute({
        page: 'services',
        serviceSlug: matched ? matched.slug : null,
        serviceGroupId: resolvedGroupId,
      });
      window.location.hash = `${resolvedGroupId}/${slug}`;
    } else if (groupId) {
      setRoute({
        page: 'services',
        serviceSlug: null,
        serviceGroupId: groupId,
      });
      window.location.hash = groupId;
    } else {
      setRoute({ page: 'services', serviceSlug: null, serviceGroupId: null });
      window.location.hash = 'services';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openBooking = useCallback(
    (options?: { service?: ServiceCategory; birthDate?: string }) => {
      setBookingDefaults(options || {});
      setBookingOpen(true);
    },
    []
  );

  const openBlogSlug = useCallback(
    (slug: string) => {
      setSelectedBlogSlug(slug);
      navigate('blogs');
    },
    [navigate]
  );

  const clearInitialSlug = useCallback(() => setSelectedBlogSlug(null), []);

  if (route.page === 'admin') {
    return <AdminPanel onBackToSite={() => navigate('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar
        activePage={route.page}
        activeServiceSlug={route.serviceSlug}
        onNavigate={navigate}
        onOpenService={openService}
        onOpenBooking={() => openBooking()}
      />

      <main className="flex-1">
        {route.page === 'home' && (
          <HomePage
            onNavigate={navigate}
            onOpenService={openService}
            onOpenBooking={openBooking}
            onOpenBlogSlug={openBlogSlug}
          />
        )}
        {route.page === 'about' && <AboutPage onOpenBooking={() => openBooking()} />}
        {route.page === 'services' && (
          <ServicesPage
            selectedSlug={route.serviceSlug}
            selectedGroupId={route.serviceGroupId}
            onSelectService={openService}
            onOpenBooking={openBooking}
          />
        )}
        {route.page === 'blogs' && (
          <BlogsVideosPage
            initialBlogSlug={selectedBlogSlug}
            onClearInitialSlug={clearInitialSlug}
            onOpenBooking={() => openBooking()}
          />
        )}
        {route.page === 'contact' && <ContactPage onOpenBooking={() => openBooking()} />}
        {route.page === 'terms' && (
          <TermsPage onNavigate={navigate} onOpenBooking={() => openBooking()} />
        )}
        {route.page === 'privacy' && (
          <PrivacyPage onNavigate={navigate} onOpenBooking={() => openBooking()} />
        )}
      </main>

      <Footer
        onNavigate={navigate}
        onOpenService={openService}
        onOpenBooking={() => openBooking()}
      />

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        defaultService={bookingDefaults.service}
        defaultBirthDate={bookingDefaults.birthDate}
      />
    </div>
  );
}

export default function App() {
  const content = (
    <FirebaseProvider>
      <AppShell />
    </FirebaseProvider>
  );

  return (
    <ErrorBoundary>
      {MAPS_API_KEY ? (
        <APIProvider apiKey={MAPS_API_KEY} libraries={['places', 'marker']} language="en" region="IN">
          {content}
        </APIProvider>
      ) : (
        content
      )}
    </ErrorBoundary>
  );
}
