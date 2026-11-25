import React from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import type { PublicPage } from '../components/Navbar';

interface TermsPageProps {
  onNavigate: (page: PublicPage) => void;
  onOpenBooking: () => void;
}

interface TermsSection {
  id: string;
  index: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate, onOpenBooking }) => {
  const { siteSettings } = useFirebase();

  const sections: TermsSection[] = [
    {
      id: 'acceptance-eligibility',
      index: '01',
      title: 'Acceptance of Terms & Eligibility',
      paragraphs: [
        `By accessing or using the ${siteSettings.brandName} website, booking a Vastu consultation, or interacting with our digital tools, you agree to be bound by these Terms and Conditions and our Privacy Policy.`,
        'You must be at least 18 years of age and legally competent to enter into a binding agreement under the Indian Contract Act, 1872. If you are booking a consultation on behalf of a family, business, or organization, you represent that you have authority to do so.',
        'Providing inaccurate, misleading, or fraudulent contact or property details may result in the cancellation of an appointment or restriction of portal access.',
      ],
    },
    {
      id: 'scope-of-services',
      index: '02',
      title: 'Scope of Vastu Consultation Services',
      paragraphs: [
        `${siteSettings.brandName}, led by ${siteSettings.founderName}, offers residential, commercial, industrial, and life-oriented Vastu Shastra advisory services, including on-site visits, floor-plan reviews, online video consultations, and directional energy balancing recommendations.`,
        'Our approach prioritizes practical, non-demolition remedies—such as directional alignment, placement adjustments, and five-element harmonization—designed for both owned and rented properties. All recommendations are advisory in nature and intended to complement, not replace, qualified civil engineering, architectural, structural, medical, financial, or legal advice.',
      ],
    },
    {
      id: 'appointments-scheduling',
      index: '03',
      title: 'Appointments, Scheduling & Cancellations',
      paragraphs: [
        'Submitting an appointment request through this website initiates a booking inquiry. A consultation slot is considered confirmed only after our Hubballi consultation desk verifies availability and confirms the date, time, mode (on-site, online video, or phone), and applicable consultation fee with you.',
      ],
      bullets: [
        'Clients are requested to provide accurate floor plans, property orientation details, and relevant birth dates prior to the scheduled session so the assessment can be conducted thoroughly.',
        'If you need to reschedule or cancel a confirmed appointment, please notify our desk at least 24 hours in advance by phone or email.',
        'For on-site visits outside Hubballi, travel logistics and scheduling windows are mutually agreed upon prior to dispatch.',
      ],
    },
    {
      id: 'direction-finder-tool',
      index: '04',
      title: 'Favorable Directions Calculator & Website Resources',
      paragraphs: [
        'The "Find Your Four Favorable Directions" calculator, published articles, and educational webinar resources on this website are provided strictly for general awareness and educational guidance.',
        'Automated directional calculations based on date of birth and gender offer a generalized directional overview and do not substitute for a comprehensive on-site or floor-plan Vastu evaluation tailored to your full property layout and family occupants.',
      ],
    },
    {
      id: 'user-responsibilities',
      index: '05',
      title: 'User Accounts & Acceptable Use',
      paragraphs: [
        'Where sign-in functionality is used (such as tracking appointments or authorized administrative access), you are responsible for maintaining the confidentiality of your login credentials and for all activity conducted under your account.',
      ],
      bullets: [
        'You agree not to submit unlawful, defamatory, or harmful content through appointment notes or contact inquiry forms.',
        'You agree not to attempt unauthorized access to administrative sections, server infrastructure, or stored consultation records.',
        'Automated scraping, reproduction, or commercial resale of website content without written permission is strictly prohibited.',
      ],
    },
    {
      id: 'intellectual-property',
      index: '06',
      title: 'Intellectual Property Rights',
      paragraphs: [
        `All brand assets, logos, text, service descriptions, graphics, photography, videos, and consultation materials published on this platform are the intellectual property of ${siteSettings.brandName} or its licensors and are protected under applicable Indian copyright and trademark laws.`,
        'You may view and print individual informational pages for personal, non-commercial reference only. Any copying, redistribution, modification, or commercial publication requires prior written consent.',
      ],
    },
    {
      id: 'disclaimers',
      index: '07',
      title: 'Disclaimers & No Guaranteed Outcomes',
      paragraphs: [
        `All website content and Vastu consultancy services are provided on an "as is" and "as available" basis. While ${siteSettings.brandName} applies traditional Vastu Shastra principles and decades of practical consulting experience, individual outcomes depend on numerous personal, environmental, and external factors.`,
        `${siteSettings.brandName} makes no express or implied warranties guaranteeing specific financial, health, career, educational, relationship, or business results. Decisions regarding real estate purchases, renovations, healthcare, or investments remain solely the client’s responsibility.`,
      ],
    },
    {
      id: 'limitation-of-liability',
      index: '08',
      title: 'Limitation of Liability',
      paragraphs: [
        `To the maximum extent permitted by applicable law, ${siteSettings.brandName}, its founder, and its consultants shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of your use of this website, reliance on published articles or tools, temporary technical interruptions, or any structural or interior modifications you independently choose to undertake.`,
      ],
    },
    {
      id: 'changes-to-terms',
      index: '09',
      title: 'Modifications to These Terms',
      paragraphs: [
        'We may update these Terms and Conditions periodically to reflect changes in our consultation offerings, operational practices, or legal requirements. Revised terms take effect upon publication on this page, and continued use of the website constitutes acceptance of the updated terms.',
      ],
    },
    {
      id: 'governing-law',
      index: '10',
      title: 'Governing Law & Jurisdiction',
      paragraphs: [
        'These Terms and Conditions are governed by and construed in accordance with the laws of India. Any dispute arising from or relating to the use of this website or our consultation services shall be subject to the exclusive jurisdiction of the competent courts in Hubballi, Karnataka, India.',
      ],
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="py-14 lg:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-medium">Terms &amp; Conditions</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-xs font-medium text-orange-700 mb-2">Legal &amp; Consultation Terms</p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1] [text-wrap:balance]">
                Terms &amp; Conditions
              </h1>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Please read these terms carefully before using the {siteSettings.brandName} website,
                directional tools, or Vastu consultation services.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Last Updated: November 2026</span>
                <span aria-hidden="true">·</span>
                <span>Jurisdiction: Hubballi, Karnataka, India</span>
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start lg:self-end shrink-0">
              <button
                type="button"
                aria-current="page"
                className="px-3.5 py-2 text-xs font-semibold rounded-md bg-white text-slate-900 shadow-sm whitespace-nowrap cursor-default"
              >
                Terms &amp; Conditions
              </button>
              <button
                type="button"
                onClick={() => onNavigate('privacy')}
                className="px-3.5 py-2 text-xs font-medium rounded-md text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sticky Table of Contents */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Sticky Section Index */}
            <aside className="lg:col-span-3 lg:sticky lg:top-28 space-y-6">
              <div className="border-t border-slate-200 pt-5">
                <p className="text-xs font-semibold text-slate-900 mb-3">On This Page</p>
                <nav aria-label="Terms sections" className="space-y-1.5">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className="w-full text-left py-1 text-xs text-slate-600 hover:text-orange-700 transition-colors flex items-baseline gap-2 cursor-pointer"
                    >
                      <span className="font-mono text-orange-700 tabular-nums shrink-0">
                        {section.index}.
                      </span>
                      <span>{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <p className="text-xs font-semibold text-slate-900">Need Clarification?</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reach our consultation desk before scheduling if you have questions regarding
                  scope, fees, or on-site visits.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 hover:text-orange-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Contact Our Desk
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </aside>

            {/* Legal Sections */}
            <div className="lg:col-span-9 max-w-3xl space-y-10">
              {sections.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 pb-10 border-b border-slate-200 last:border-b-0 last:pb-0"
                >
                  <p className="font-mono text-xs text-orange-700 tabular-nums mb-1.5">
                    {section.index}.
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-4 space-y-2.5 text-sm sm:text-base text-slate-600 leading-relaxed list-disc pl-5 marker:text-orange-600">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}

              {/* Contact & Consultation Footer Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
                <div>
                  <p className="text-xs font-medium text-orange-700 mb-1">Consultation Desk</p>
                  <h3 className="font-display text-2xl font-semibold text-slate-900">
                    Questions Regarding These Terms
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    For inquiries related to these Terms and Conditions or your scheduled
                    consultation, contact {siteSettings.brandName} directly:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                    <span>{siteSettings.locations}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-600 shrink-0" />
                    <a
                      href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                      className="hover:text-orange-700 transition-colors tabular-nums"
                    >
                      {siteSettings.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="hover:text-orange-700 transition-colors break-all"
                    >
                      {siteSettings.email}
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Book Consultation
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('privacy')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Read Privacy Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
