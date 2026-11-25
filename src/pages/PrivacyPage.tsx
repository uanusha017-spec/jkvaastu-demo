import React from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import type { PublicPage } from '../components/Navbar';

interface PrivacyPageProps {
  onNavigate: (page: PublicPage) => void;
  onOpenBooking: () => void;
}

interface PrivacySection {
  id: string;
  index: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate, onOpenBooking }) => {
  const { siteSettings } = useFirebase();

  const sections: PrivacySection[] = [
    {
      id: 'information-collected',
      index: '01',
      title: 'Information We Collect',
      paragraphs: [
        `At ${siteSettings.brandName}, we respect your privacy and collect only the information needed to provide personalized Vastu consultations, respond to inquiries, and operate this website reliably.`,
      ],
      bullets: [
        'Appointment & Contact Details: Full name, phone number, email address, city, property type, selected Vastu service, preferred date and time slot, consultation mode, and notes you choose to share.',
        'Personalized Vastu Inputs: Date of birth and gender when provided for personalized directional assessments or consultation preparation.',
        'Account Authentication Data: Basic profile identifiers (name, email address, and verified user ID) if you sign in via Google Authentication to view appointments or manage authorized portal settings.',
        'Technical & Browser Data: Standard device, browser, and local preference data necessary to render pages smoothly and protect against abuse.',
      ],
    },
    {
      id: 'how-we-use',
      index: '02',
      title: 'How We Use Your Information',
      paragraphs: [
        'Information you voluntarily share with us is used strictly for legitimate consultation and communication purposes:',
      ],
      bullets: [
        'Scheduling, confirming, rescheduling, and delivering on-site, online video, or telephone Vastu consultations.',
        'Preparing tailored directional and five-element harmonization guidance relevant to your residential or commercial space.',
        'Responding to questions submitted through our Contact Us form or direct consultation desk channels.',
        'Maintaining website performance, security, and accurate consultation records across our administrative desk.',
      ],
    },
    {
      id: 'direction-finder-privacy',
      index: '03',
      title: 'Favorable Directions Calculator Privacy',
      paragraphs: [
        'When you enter your date of birth and gender into the "Find Your Four Favorable Directions" tool on the home page, the directional calculation is executed directly inside your browser to display your immediate results.',
        'We do not store calculator inputs on our servers unless you actively choose to proceed and submit an appointment booking request.',
      ],
    },
    {
      id: 'storage-and-security',
      index: '04',
      title: 'Data Storage & Security Measures',
      paragraphs: [
        'Appointment bookings and contact inquiries submitted through this portal are transmitted over encrypted HTTPS connections and stored securely on Google Cloud / Firebase Firestore infrastructure protected by role-based security rules and authentication controls.',
        'While we implement reasonable administrative and technical safeguards to protect client information against unauthorized access or disclosure, no method of electronic storage or internet transmission can be guaranteed 100% secure.',
      ],
    },
    {
      id: 'third-party-services',
      index: '05',
      title: 'Third-Party Services & Embedded Maps',
      paragraphs: [
        'To provide a reliable user experience, this website integrates selected third-party platforms that operate under their own privacy policies:',
      ],
      bullets: [
        `Google Maps Platform: Powers the interactive office location map for our Hubballi consultation desk (${siteSettings.locations}).`,
        'Google Firebase & Authentication: Provides secure database persistence and verified Google sign-in.',
        'Embedded Video Resources: Educational Vastu webinars or videos linked or played through external video hosts are subject to the respective provider’s terms and privacy notices.',
      ],
    },
    {
      id: 'sharing-and-confidentiality',
      index: '06',
      title: 'Confidentiality & Information Sharing',
      paragraphs: [
        `${siteSettings.brandName} does not sell, rent, or trade your personal contact information, birth details, or property consultation notes to third-party marketers.`,
        'Access to submitted appointment and inquiry records is restricted to authorized personnel at our consultation desk. We may disclose information only where required by applicable Indian law, lawful government request, or to protect our legal rights and platform security.',
      ],
    },
    {
      id: 'retention-and-rights',
      index: '07',
      title: 'Data Retention & Your Rights',
      paragraphs: [
        'We retain appointment and inquiry records only for as long as necessary to fulfill your consultation, provide follow-up support, and satisfy legal or accounting obligations.',
        `You may request access to, correction of, or deletion of your submitted personal details at any time by contacting our office at ${siteSettings.email} or calling ${siteSettings.phone}. We will verify your request and process it promptly.`,
      ],
    },
    {
      id: 'childrens-privacy',
      index: '08',
      title: 'Children’s Privacy',
      paragraphs: [
        'Our consultation booking services are directed to adults aged 18 and above. Where a family consultation includes directional study guidance for students or minors, such details should be submitted solely by a parent or legal guardian.',
      ],
    },
    {
      id: 'policy-updates',
      index: '09',
      title: 'Updates to This Privacy Policy',
      paragraphs: [
        'We may revise this Privacy Policy occasionally to reflect updates in our services, security practices, or Indian data protection regulations. Any updates will be published on this page with an updated effective date.',
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
            <span className="text-slate-900 font-medium">Privacy Policy</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-xs font-medium text-orange-700 mb-2">Client Confidentiality &amp; Data Care</p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1] [text-wrap:balance]">
                Privacy Policy
              </h1>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                How {siteSettings.brandName} collects, safeguards, and handles your personal and
                property consultation details.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Last Updated: November 2026</span>
                <span aria-hidden="true">·</span>
                <span>Office: {siteSettings.locations}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start lg:self-end shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('terms')}
                className="px-3.5 py-2 text-xs font-medium rounded-md text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
              >
                Terms &amp; Conditions
              </button>
              <button
                type="button"
                aria-current="page"
                className="px-3.5 py-2 text-xs font-semibold rounded-md bg-white text-slate-900 shadow-sm whitespace-nowrap cursor-default"
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
                <nav aria-label="Privacy policy sections" className="space-y-1.5">
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
                <p className="text-xs font-semibold text-slate-900">Data Request?</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Want to update or remove an appointment or contact inquiry record? Reach out to
                  our consultation desk directly.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 hover:text-orange-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Contact Privacy Desk
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </aside>

            {/* Privacy Sections */}
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

              {/* Privacy Contact Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
                <div>
                  <p className="text-xs font-medium text-orange-700 mb-1">Privacy Contact</p>
                  <h3 className="font-display text-2xl font-semibold text-slate-900">
                    Contact Us About Your Privacy
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    If you have questions about how your consultation details are handled or would
                    like to request removal of your records, reach {siteSettings.brandName} at:
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
                    onClick={() => onNavigate('terms')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Read Terms &amp; Conditions
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
