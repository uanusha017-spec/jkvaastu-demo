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

  if (lower.startsWith('service/')) {
    const slug = lower.slice('service/'.length);
    const matched = getServiceBySlug(slug);
    return {
      page: 'services',
      serviceSlug: matched ? matched.slug : null,
      serviceGroupId: matched ? matched.groupId : null,
    };
  }

  if (lower.startsWith('services/')) {
    const gid = lower.slice('services/'.length);
    const group = getServiceGroupById(gid);
    return {
      page: 'services',
      serviceSlug: null,
      serviceGroupId: group ? group.id : null,
    };
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
      setRoute({
        page: 'services',
        serviceSlug: matched ? matched.slug : null,
        serviceGroupId: matched ? matched.groupId : groupId || null,
      });
      window.location.hash = `service/${slug}`;
    } else if (groupId) {
      setRoute({
        page: 'services',
        serviceSlug: null,
        serviceGroupId: groupId,
      });
      window.location.hash = `services/${groupId}`;
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
