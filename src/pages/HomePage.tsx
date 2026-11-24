import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import {
  CONSULTATION_STEPS,
  CORE_PILLARS,
  FAQ_ITEMS,
  STARTER_BLOGS,
  STARTER_VIDEOS,
} from '../data/vastuContent';
import { JK_SERVICE_GROUPS, type ServiceGroupId } from '../data/jkvaastuCatalog';
import { DirectionFinder } from '../components/DirectionFinder';
import { OfficeLocationMap } from '../components/OfficeLocationMap';
import { SafeImage } from '../components/SafeImage';
import type { PublicPage } from '../components/Navbar';
import { formatTimestamp, type ServiceCategory } from '../types/models';

interface HomePageProps {
  onNavigate: (page: PublicPage) => void;
  onOpenService: (slug?: string, groupId?: ServiceGroupId) => void;
  onOpenBooking: (options?: { service?: ServiceCategory; birthDate?: string }) => void;
  onOpenBlogSlug: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenService,
  onOpenBooking,
  onOpenBlogSlug,
}) => {
  const { siteSettings, publicBlogs, publicVideos } = useFirebase();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const displayedBlogs = publicBlogs.length > 0 ? publicBlogs.slice(0, 3) : STARTER_BLOGS.slice(0, 3);
  const featuredVideo = publicVideos.length > 0 ? publicVideos[0] : STARTER_VIDEOS[0];

  return (
    <div>
      {/* 1. Hero Section — Responsive 2-Column Split (Uncropped 3:2 Visual, Zero Overlapping Text) */}
      <section className="bg-white pt-8 pb-14 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-medium text-orange-700 mb-3 sm:mb-4">
                Scientific Vastu Shastra · Pride Icon Complex, Gokul Road, Hubballi · Online Worldwide
              </p>
              <h1 className="font-display text-[clamp(2.1rem,4.1vw,3.75rem)] leading-[1.08] font-semibold tracking-tight text-slate-900">
                Harmonize Your Space Without Structural Demolition
              </h1>
              <p className="mt-4 sm:mt-6 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                {siteSettings.brandName}, guided by {siteSettings.founderName}, brings a
                prediction-oriented, scientific approach to Vastu Shastra. Personalized to the
                family head’s date of birth, we help you connect, balance, and channelize cosmic
                energy across owned or rented homes and commercial workplaces.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={() => onOpenBooking()}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Book Consultation
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors cursor-pointer whitespace-nowrap"
                >
                  About {siteSettings.brandName} &amp; {siteSettings.founderName}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 w-full">
              <div className="w-full aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 bg-slate-950 shadow-sm">
                <SafeImage
                  src="/jkvaastu/hero-transform.png"
                  alt="JK Vaastu home and workspace spatial transformation with Jaydevji"
                  fallbackLabel="JK Vaastu Architectural Balance"
                  loading="eager"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="mt-3 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 px-1">
                <span>Owned &amp; Rented Residences · Corporate Workspaces</span>
                <span className="font-medium text-slate-700">Zero Structural Breakage</span>
              </p>
            </div>
          </div>

          {/* Full-width 4-Column Proof Strip below Hero Split */}
          <div className="mt-10 sm:mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-medium text-slate-900 tabular-nums">
                1,000+
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Families and commercial enterprises guided across India
              </p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-medium text-slate-900 tabular-nums">
                300+
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Students mentored with focused study directional alignment
              </p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-medium text-slate-900 tabular-nums">
                0%
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Structural demolition or costly wall alterations required
              </p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-medium text-slate-900 tabular-nums">
                7 Chakras
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Aligned through personalized natal directions &amp; space balance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Overview — All 4 JK Vaastu Categories (House, Residence, Commercial, Other) */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-orange-700 mb-2">Services Overview</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                Vastu For House, Residence, Commercial &amp; Other Services
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                Select any service below to explore authentic JK Vaastu principles, room-by-room
                Vastu tips, and non-demolition consultation options.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenService(undefined, undefined)}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-orange-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Explore All 23 Services
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {JK_SERVICE_GROUPS.map((group) => (
              <article
                key={group.id}
                className="group bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden flex flex-col transition-colors"
              >
                <button
                  type="button"
                  onClick={() => onOpenService(undefined, group.id)}
                  className="aspect-[16/9] bg-slate-100 overflow-hidden block w-full cursor-pointer"
                >
                  <SafeImage
                    src={group.coverImage}
                    alt={group.label}
                    fallbackLabel={group.label}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </button>

                <div className="p-6 sm:p-7 flex-1 flex flex-col">
                  <p className="text-xs text-slate-500">
                    {group.items.length} Specialized Guides · JK Vaastu
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 mt-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenService(undefined, group.id)}
                      className="text-left hover:text-orange-700 transition-colors cursor-pointer"
                    >
                      {group.label}
                    </button>
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {group.summary}
                  </p>

                  {/* Clickable Sub-Services List */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                      {group.items.slice(0, 6).map((item) => (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={() => onOpenService(item.slug, group.id)}
                          className="text-left text-xs font-medium text-slate-700 hover:text-orange-700 transition-colors py-0.5 truncate cursor-pointer"
                        >
                          &rarr; {item.title.replace(/^Vastu For /i, '')}
                        </button>
                      ))}
                    </div>
                    {group.items.length > 6 && (
                      <button
                        type="button"
                        onClick={() => onOpenService(undefined, group.id)}
                        className="mt-2 text-xs font-semibold text-orange-700 hover:text-orange-800 cursor-pointer"
                      >
                        + {group.items.length - 6} more in {group.label}
                      </button>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => onOpenService(undefined, group.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-orange-700 cursor-pointer whitespace-nowrap"
                    >
                      View {group.label}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenBooking({ service: group.bookingCategory })}
                      className="text-xs font-semibold text-orange-700 hover:text-orange-800 cursor-pointer whitespace-nowrap"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Three Core Pillars: Connect · Balance · Channelize */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-medium text-orange-700 mb-2">Core Scientific Principles</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Connect, Balance, and Channelize Cosmic Energy
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Every persistent challenge in health, career, finances, education, or relationships
              reflects an energy blockage between your natal directions and your living environment.
            </p>
          </div>

          <div className="space-y-12">
            {CORE_PILLARS.map((pillar, idx) => (
              <div
                key={pillar.index}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-slate-50 border border-slate-200 rounded-xl overflow-hidden"
              >
                <div
                  className={`lg:col-span-5 min-h-[240px] bg-slate-100 ${
                    idx % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                >
                  <SafeImage
                    src={pillar.image}
                    alt={pillar.title}
                    fallbackLabel={pillar.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                  <p className="text-xs font-medium text-slate-500">
                    <span className="font-mono tabular-nums text-orange-700">{pillar.index}.</span>{' '}
                    {pillar.subtitle}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 mt-2">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                  <p className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-500">
                    Key Mechanism:{' '}
                    <span className="text-slate-800 font-medium">{pillar.mechanism}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Favorable Direction Calculator */}
      <DirectionFinder
        onBookWithDob={(dob) => onOpenBooking({ birthDate: dob, service: 'Vastu for House' })}
      />

      {/* 5. Consultation Process & Featured Webinar Showcase */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-8">
              <div>
                <p className="text-xs font-medium text-orange-400 mb-2">Consultation Workflow</p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                  How a JK Vaastu Consultation Works
                </h2>
              </div>

              <div className="divide-y divide-slate-800 border-y border-slate-800">
                {CONSULTATION_STEPS.map((item) => (
                  <div key={item.step} className="py-5 flex gap-5">
                    <span className="font-mono text-sm text-orange-400 tabular-nums pt-0.5 shrink-0">
                      {item.step}.
                    </span>
                    <div>
                      <h3 className="font-sans text-base font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Video / Webinar */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="relative aspect-[16/10] bg-slate-800">
                  <SafeImage
                    src={featuredVideo.thumbnailUrl || '/jkvaastu/hero-workspace.png'}
                    alt={featuredVideo.title}
                    fallbackLabel="JK Vaastu Webinar"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-6">
                    <button
                      type="button"
                      onClick={() => onNavigate('blogs')}
                      className="inline-flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Explore Videos &amp; Webinars
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <p className="text-xs text-slate-400">
                    {featuredVideo.category} · {featuredVideo.duration}
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {featuredVideo.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {featuredVideo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Latest Editorial Blogs */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-medium text-orange-700 mb-2">Knowledge Library</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                Latest Vastu Insights &amp; Practical Guides
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('blogs')}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-orange-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Read All Articles
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedBlogs.map((blog) => (
              <article
                key={blog.slug}
                onClick={() => onOpenBlogSlug(blog.slug)}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col cursor-pointer hover:border-slate-300 transition-colors"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  <SafeImage
                    src={blog.coverImage}
                    alt={blog.title}
                    fallbackLabel={blog.category}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs text-slate-500">
                    {blog.category} · {blog.readTime}
                    {'createdAt' in blog && blog.createdAt
                      ? ` · ${formatTimestamp(blog.createdAt as Parameters<typeof formatTimestamp>[0])}`
                      : ''}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-slate-900 mt-2 group-hover:text-orange-700 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3 flex-1">
                    {blog.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Visit Our Hubballi Consultation Center (Live Google Map) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-orange-700 mb-2">Consultation Office</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                Visit Us at Pride Icon Complex, Gokul Road, Hubballi
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                {siteSettings.locations} · {siteSettings.officeHours}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-orange-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Contact Desk &amp; Inquiry Form
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <OfficeLocationMap
            address={siteSettings.locations}
            brandName={siteSettings.brandName}
            heightClass="h-[300px] sm:h-[360px] lg:h-[400px]"
          />
        </div>
      </section>

      {/* 9. Frequently Asked Questions */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-medium text-orange-700 mb-2">Common Questions</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {FAQ_ITEMS.map((faq, i) => {
              const expanded = openFaq === i;
              return (
                <div key={faq.question} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(expanded ? null : i)}
                    aria-expanded={expanded}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-base font-medium text-slate-900">{faq.question}</span>
                    {expanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {expanded && (
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed pr-8">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
