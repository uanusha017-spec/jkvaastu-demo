import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { JK_SERVICE_GROUPS, type ServiceGroupId } from '../data/jkvaastuCatalog';
import type { PublicPage } from './Navbar';
import { SafeImage } from './SafeImage';

interface FooterProps {
  onNavigate: (page: PublicPage) => void;
  onOpenService: (slug?: string, groupId?: ServiceGroupId) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenService, onOpenBooking }) => {
  const { siteSettings } = useFirebase();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-slate-800">
          {/* Brand with Enlarged Official Horizontal Logo */}
          <div className="space-y-4">
            <div className="inline-block bg-white rounded-xl p-1 overflow-hidden">
              <SafeImage
                src={siteSettings.logoUrl || '/assets/aistudio/jk_vasstu_logo_d124cfd2.jpeg'}
                alt={siteSettings.brandName}
                fallbackLabel={siteSettings.brandName}
                className="h-32 sm:h-36 w-auto object-contain scale-[1.08]"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Scientific, prediction-oriented Vastu Shastra guidance by {siteSettings.founderName}.
              Connect, balance, and channelize cosmic energy without structural demolition.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us &amp; Jaydevji
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenService(undefined, undefined)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Services Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('blogs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Blogs &amp; Webinars
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Service Categories (Clickable) */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-white mb-4">Vastu Services</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {JK_SERVICE_GROUPS.map((group) => (
                <li key={group.id}>
                  <button
                    type="button"
                    onClick={() => onOpenService(undefined, group.id)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {group.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => onOpenService('vastu-for-main-front-door', 'vastu-for-house')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Main Front Door &amp; Kitchen
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details (JK Vaastu) */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-white mb-4">Consultation Desk</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{siteSettings.locations}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <a
                  href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors tabular-nums"
                >
                  {siteSettings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="hover:text-white transition-colors"
                >
                  {siteSettings.email}
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-4 py-2 text-xs font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {siteSettings.brandName}. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => onNavigate('terms')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Terms &amp; Conditions
            </button>
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
