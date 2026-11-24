import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import {
  getServiceBySlug,
  getServiceGroupById,
  JK_ABOUT_US,
  JK_SERVICE_GROUPS,
  type ServiceGroupId,
} from '../data/jkvaastuCatalog';
import { SafeImage } from '../components/SafeImage';
import type { ServiceCategory } from '../types/models';

interface ServicesPageProps {
  selectedSlug?: string | null;
  selectedGroupId?: ServiceGroupId | null;
  onSelectService: (slug?: string, groupId?: ServiceGroupId) => void;
  onOpenBooking: (options?: { service?: ServiceCategory }) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  selectedSlug,
  selectedGroupId,
  onSelectService,
  onOpenBooking,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | ServiceGroupId>(
    selectedGroupId || 'all'
  );

  useEffect(() => {
    if (selectedGroupId) {
      setActiveFilter(selectedGroupId);
    } else if (!selectedSlug) {
      setActiveFilter('all');
    }
  }, [selectedGroupId, selectedSlug]);

  const activeService = getServiceBySlug(selectedSlug);

  // =========================================================================
  // INDIVIDUAL SERVICE DETAIL VIEW (all 23 jkvaastu.com dropdown subpages)
  // =========================================================================
  if (activeService) {
    const parentGroup = getServiceGroupById(activeService.groupId);
    const siblings = parentGroup ? parentGroup.items : [];

    return (
      <div className="bg-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-8">
            <button
              type="button"
              onClick={() => onSelectService(undefined, undefined)}
              className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-orange-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Services Overview
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => onSelectService(undefined, activeService.groupId)}
              className="hover:text-orange-700 cursor-pointer"
            >
              {activeService.groupLabel}
            </button>
            <span>/</span>
            <span className="text-slate-900 font-medium">{activeService.title}</span>
          </div>

          {/* Service Hero Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch pb-14 border-b border-slate-200">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-medium text-orange-700 mb-2">
                {activeService.groupLabel} · JK Vaastu
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1]">
                {activeService.title}
              </h1>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                {activeService.introHeading}
              </p>

              <div className="mt-4 space-y-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                {activeService.introParagraphs.map((paragraph, idx) => (
                  <p key={`${activeService.slug}-p-${idx}`}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onOpenBooking({ service: activeService.bookingCategory })}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Schedule {activeService.title} Consultation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[300px] lg:min-h-[420px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={activeService.image}
                  alt={activeService.title}
                  fallbackLabel={activeService.title}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Authentic Vastu Tips fetched from jkvaastu.com */}
          {activeService.tips.length > 0 && (
            <section className="py-14 border-b border-slate-200">
              <div className="max-w-2xl mb-8">
                <p className="text-xs font-medium text-orange-700 mb-1.5">Practical Guidance</p>
                <h2 className="font-display text-3xl font-semibold text-slate-900 tracking-tight">
                  Key Vastu Tips for {activeService.title.replace(/^Vastu For /i, '')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeService.tips.map((tip, idx) => (
                  <div
                    key={`${tip.heading}-${idx}`}
                    className="p-6 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <p className="font-mono text-xs text-orange-700 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}.
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-slate-900 mt-1.5">
                      {tip.heading}
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {tip.points.map((pt, pIdx) => (
                        <li
                          key={`${tip.heading}-pt-${pIdx}`}
                          className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed"
                        >
                          <Check className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Included Services & Why Choose JK Vaastu */}
          <section className="py-14 border-b border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-7 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs font-medium text-orange-700 mb-1.5">Consultation Scope</p>
              <h2 className="font-display text-2xl font-semibold text-slate-900">
                Our Vastu Services Include
              </h2>
              <ul className="mt-4 space-y-2.5">
                {JK_ABOUT_US.includedServices.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-7 bg-slate-950 text-white rounded-xl flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-orange-400 mb-1.5">Why Choose JK Vaastu?</p>
                <h2 className="font-display text-2xl font-semibold text-white">
                  Practical, Logical &amp; Non-Demolition Guidance
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {JK_ABOUT_US.whyChoose.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => onOpenBooking({ service: activeService.bookingCategory })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer"
                >
                  Book Online or On-Site Audit
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* Related Services in Same Dropdown Category */}
          {siblings.length > 1 && (
            <section className="pt-14">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
                  More in {activeService.groupLabel}
                </h2>
                <button
                  type="button"
                  onClick={() => onSelectService(undefined, activeService.groupId)}
                  className="text-xs font-semibold text-orange-700 hover:text-orange-800 cursor-pointer whitespace-nowrap"
                >
                  View Category Overview
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {siblings
                  .filter((item) => item.slug !== activeService.slug)
                  .map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => onSelectService(item.slug, item.groupId)}
                      className="group text-left bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden flex flex-col cursor-pointer transition-colors"
                    >
                      <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                        <SafeImage
                          src={item.image}
                          alt={item.title}
                          fallbackLabel={item.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-orange-700 transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 flex-1">
                          {item.summary}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // FULL SERVICES OVERVIEW (All 4 jkvaastu.com dropdown groups + sub-services)
  // =========================================================================
  const visibleGroups =
    activeFilter === 'all'
      ? JK_SERVICE_GROUPS
      : JK_SERVICE_GROUPS.filter((g) => g.id === activeFilter);

  return (
    <div className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-medium text-orange-700 mb-3">
            Services Overview · JK Vaastu Consultation Catalog
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1]">
            Vastu For House, Residence, Commercial &amp; Life Services
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Explore our complete Vastu consultation directory covering individual home rooms, new
            residences and flats, commercial spaces and industries, and personal life verticals—all
            with authentic guidance and non-demolition remedies.
          </p>
        </div>

        {/* Interactive Category Tabs */}
        <div className="mt-10 flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all');
              onSelectService(undefined, undefined);
            }}
            className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Categories (23 Services)
          </button>
          {JK_SERVICE_GROUPS.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => {
                setActiveFilter(group.id);
                onSelectService(undefined, group.id);
              }}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeFilter === group.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {group.label} ({group.items.length})
            </button>
          ))}
        </div>

        {/* Category Sections */}
        <div className="mt-12 space-y-20">
          {visibleGroups.map((group) => (
            <section
              key={group.id}
              className="space-y-8 pb-16 border-b border-slate-200 last:border-b-0 last:pb-0"
            >
              {/* Category Overview Banner */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <div className="lg:col-span-5 h-full min-h-[240px] bg-slate-100">
                  <SafeImage
                    src={group.coverImage}
                    alt={group.label}
                    fallbackLabel={group.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:col-span-7 p-6 sm:p-8">
                  <p className="text-xs font-medium text-orange-700 mb-1.5">
                    {group.items.length} Specialized Consultations
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                    {group.label}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {group.summary}
                  </p>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => onOpenBooking({ service: group.bookingCategory })}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-orange-600 rounded-lg transition-colors cursor-pointer"
                    >
                      Book {group.label} Consultation
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-services Grid inside this Dropdown Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((service) => (
                  <article
                    key={service.slug}
                    className="group bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden flex flex-col transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectService(service.slug, group.id)}
                      className="aspect-[16/10] bg-slate-100 overflow-hidden block w-full cursor-pointer"
                    >
                      <SafeImage
                        src={service.image}
                        alt={service.title}
                        fallbackLabel={service.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </button>

                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-xs text-slate-500">
                        {group.label}
                        {service.tips.length > 0 ? ` · ${service.tips.length} Vastu Tips` : ''}
                      </p>
                      <h3 className="font-display text-2xl font-semibold text-slate-900 mt-1.5 group-hover:text-orange-700 transition-colors">
                        <button
                          type="button"
                          onClick={() => onSelectService(service.slug, group.id)}
                          className="text-left cursor-pointer"
                        >
                          {service.title}
                        </button>
                      </h3>
                      <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3 flex-1">
                        {service.summary}
                      </p>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => onSelectService(service.slug, group.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-orange-700 cursor-pointer whitespace-nowrap"
                        >
                          Read Full Guide
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenBooking({ service: service.bookingCategory })}
                          className="text-xs font-medium text-orange-700 hover:text-orange-800 cursor-pointer whitespace-nowrap"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
