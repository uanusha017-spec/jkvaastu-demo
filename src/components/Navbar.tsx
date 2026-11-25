import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { JK_SERVICE_GROUPS, type ServiceGroupId } from '../data/jkvaastuCatalog';
import { SafeImage } from './SafeImage';

export type PublicPage =
  | 'home'
  | 'about'
  | 'services'
  | 'blogs'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'admin';

interface NavbarProps {
  activePage: PublicPage;
  activeServiceSlug?: string | null;
  onNavigate: (page: PublicPage) => void;
  onOpenService: (slug?: string, groupId?: ServiceGroupId) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  activeServiceSlug,
  onNavigate,
  onOpenService,
  onOpenBooking,
}) => {
  const { siteSettings } = useFirebase();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [mobileGroupOpen, setMobileGroupOpen] = useState<ServiceGroupId | null>('vastu-for-house');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesMenuOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleNav = (page: PublicPage) => {
    setMobileOpen(false);
    setServicesMenuOpen(false);
    onNavigate(page);
  };

  const handleSelectService = (slug?: string, groupId?: ServiceGroupId) => {
    setMobileOpen(false);
    setServicesMenuOpen(false);
    onOpenService(slug, groupId);
  };

  const navLinkClass = (isActive: boolean) =>
    `relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 ${
      isActive
        ? 'text-slate-900 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-orange-600'
        : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[88px] sm:h-[104px] lg:h-[116px] flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: Prominent Enlarged Official JK Vaastu Logo */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          aria-label={`${siteSettings.brandName} — Home`}
          className="flex items-center text-left shrink-0 cursor-pointer overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 rounded-md"
        >
          <SafeImage
            src={siteSettings.logoUrl || '/assets/aistudio/jk_vasstu_logo_d124cfd2.jpeg'}
            alt={siteSettings.brandName}
            fallbackLabel={siteSettings.brandName}
            loading="eager"
            className="h-[82px] sm:h-[98px] lg:h-[110px] w-auto object-contain scale-[1.12]"
          />
        </button>

        {/* Zone 2: Concise single-line navigation links + Services Dropdown Menu */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
          <button
            type="button"
            onClick={() => handleNav('about')}
            className={navLinkClass(activePage === 'about')}
          >
            About Us
          </button>

          {/* Services Dropdown Trigger + 4-Column Mega Panel (House, Residence, Commercial, Other) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setServicesMenuOpen((prev) => !prev)}
              aria-expanded={servicesMenuOpen}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1 ${navLinkClass(activePage === 'services')}`}
            >
              Services
              <ChevronDown
                className={`w-4 h-4 transition-transform ${servicesMenuOpen ? 'rotate-180 text-orange-600' : ''}`}
              />
            </button>

            {servicesMenuOpen && (
              <div className="fixed left-1/2 -translate-x-1/2 top-[116px] w-[min(96vw,960px)] bg-white border border-slate-200 rounded-xl shadow-xl p-6 z-50">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
                  <div>
                    <p className="text-xs font-medium text-orange-700">JK Vaastu Services Directory</p>
                    <p className="font-display text-xl font-semibold text-slate-900">
                      Explore House, Commercial &amp; Life Vastu Consultations
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectService(undefined, undefined)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Services Overview
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {JK_SERVICE_GROUPS.map((group) => (
                    <div key={group.id} className="space-y-3">
                      <button
                        type="button"
                        onClick={() => handleSelectService(undefined, group.id)}
                        className="group w-full text-left cursor-pointer"
                      >
                        <div className="aspect-[16/9] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 mb-2">
                          <SafeImage
                            src={group.coverImage}
                            alt={group.label}
                            fallbackLabel={group.label}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                          />
                        </div>
                        <p className="font-sans text-xs font-semibold text-slate-900 group-hover:text-orange-700 transition-colors flex items-center justify-between">
                          <span>{group.label}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-600" />
                        </p>
                      </button>

                      <ul className="space-y-1 border-t border-slate-100 pt-2">
                        {group.items.map((item) => {
                          const isCurrent = activeServiceSlug === item.slug;
                          return (
                            <li key={item.slug}>
                              <button
                                type="button"
                                onClick={() => handleSelectService(item.slug, group.id)}
                                className={`w-full text-left py-1 text-xs transition-colors cursor-pointer ${
                                  isCurrent
                                    ? 'font-semibold text-orange-700'
                                    : 'text-slate-600 hover:text-orange-700'
                                }`}
                              >
                                {item.title}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleNav('blogs')}
            className={navLinkClass(activePage === 'blogs')}
          >
            Blogs
          </button>

          <button
            type="button"
            onClick={() => handleNav('contact')}
            className={navLinkClass(activePage === 'contact')}
          >
            Contact
          </button>

          <button
            type="button"
            onClick={() => handleNav('admin')}
            className={navLinkClass(activePage === 'admin')}
          >
            Admin
          </button>
        </nav>

        {/* Zone 3: 1 Primary CTA button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Book Consultation
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Expandable Service Dropdown Categories */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-2 max-h-[82vh] overflow-y-auto">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`block w-full text-left py-2 text-sm font-medium cursor-pointer ${
              activePage === 'home' ? 'text-orange-700' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('about')}
            className={`block w-full text-left py-2 text-sm font-medium cursor-pointer ${
              activePage === 'about' ? 'text-orange-700' : 'text-slate-700'
            }`}
          >
            About Us
          </button>

          {/* Expandable Services Dropdowns */}
          <div className="py-2 border-y border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleSelectService(undefined, undefined)}
                className={`text-sm font-semibold cursor-pointer ${
                  activePage === 'services' ? 'text-orange-700' : 'text-slate-900'
                }`}
              >
                Services Overview
              </button>
            </div>

            {JK_SERVICE_GROUPS.map((group) => {
              const expanded = mobileGroupOpen === group.id;
              return (
                <div key={group.id} className="pl-2">
                  <button
                    type="button"
                    onClick={() => setMobileGroupOpen(expanded ? null : group.id)}
                    className="w-full flex items-center justify-between py-1.5 text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expanded && (
                    <div className="pl-3 pb-2 space-y-1 border-l border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleSelectService(undefined, group.id)}
                        className="block w-full text-left py-1 text-xs font-medium text-orange-700 cursor-pointer"
                      >
                        All {group.label}
                      </button>
                      {group.items.map((item) => (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={() => handleSelectService(item.slug, group.id)}
                          className="block w-full text-left py-1 text-xs text-slate-600 hover:text-orange-700 cursor-pointer"
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleNav('blogs')}
            className={`block w-full text-left py-2 text-sm font-medium cursor-pointer ${
              activePage === 'blogs' ? 'text-orange-700' : 'text-slate-700'
            }`}
          >
            Blogs &amp; Webinars
          </button>
          <button
            type="button"
            onClick={() => handleNav('contact')}
            className={`block w-full text-left py-2 text-sm font-medium cursor-pointer ${
              activePage === 'contact' ? 'text-orange-700' : 'text-slate-700'
            }`}
          >
            Contact Us
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin')}
            className={`block w-full text-left py-2 text-sm font-medium cursor-pointer ${
              activePage === 'admin' ? 'text-orange-700' : 'text-slate-700'
            }`}
          >
            Admin Panel
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer"
            >
              Book Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
