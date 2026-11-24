import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { JK_ABOUT_US } from '../data/jkvaastuCatalog';
import { CONSULTATION_STEPS, CORE_PILLARS, SEVEN_CHAKRAS } from '../data/vastuContent';
import { SafeImage } from '../components/SafeImage';

interface AboutPageProps {
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking }) => {
  const { siteSettings } = useFirebase();

  return (
    <div className="bg-white">
      {/* 1. Authentic JK Vaastu About Us Hero & Brand Mission (fetched from jkvaastu.com/about-us/) */}
      <section className="py-16 lg:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-medium text-orange-700 mb-3">{JK_ABOUT_US.eyebrow}</p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1]">
                {JK_ABOUT_US.headline}
              </h1>
              {JK_ABOUT_US.leadParagraphs.map((para) => (
                <p key={para} className="mt-5 text-base text-slate-600 leading-relaxed">
                  {para}
                </p>
              ))}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Book a Consultation with {siteSettings.founderName}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[340px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={JK_ABOUT_US.images.cover}
                  alt={`About ${siteSettings.brandName}`}
                  fallbackLabel={siteSettings.brandName}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Jaydevji + Mission, Vision & Approach (authentic jkvaastu.com content & portraits) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
          {/* Founder Story Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-slate-200 rounded-xl p-6 sm:p-10">
            <div className="lg:col-span-5">
              <div className="aspect-[4/4] max-h-[420px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={JK_ABOUT_US.images.portrait}
                  alt={`${siteSettings.founderName} — Lead Vastu Consultant at ${siteSettings.brandName}`}
                  fallbackLabel={siteSettings.founderName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-medium text-orange-700">Founder &amp; Guide</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                {JK_ABOUT_US.founderTitle}
              </h2>
              {JK_ABOUT_US.founderParagraphs.map((para) => (
                <p key={para} className="text-base text-slate-600 leading-relaxed">
                  {para}
                </p>
              ))}

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-900 mb-3">Why Choose JK Vaastu?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {JK_ABOUT_US.whyChoose.map((point) => (
                    <div key={point} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mission · Vision · Approach Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="bg-white border border-slate-200 rounded-xl p-7">
              <p className="font-mono text-xs text-orange-700 tabular-nums">01 · Purpose</p>
              <h3 className="font-display text-2xl font-semibold text-slate-900 mt-2">
                Our Mission
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{JK_ABOUT_US.mission}</p>
            </article>

            <article className="bg-white border border-slate-200 rounded-xl p-7">
              <p className="font-mono text-xs text-orange-700 tabular-nums">02 · Direction</p>
              <h3 className="font-display text-2xl font-semibold text-slate-900 mt-2">
                Our Vision
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{JK_ABOUT_US.vision}</p>
            </article>

            <article className="bg-white border border-slate-200 rounded-xl p-7">
              <p className="font-mono text-xs text-orange-700 tabular-nums">03 · Methodology</p>
              <h3 className="font-display text-2xl font-semibold text-slate-900 mt-2">
                Our Approach
              </h3>
              <div className="mt-3 space-y-3 text-sm text-slate-600 leading-relaxed">
                {JK_ABOUT_US.approach.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 3. Scientific Vastu Three-Pillar Framework */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
            <div className="lg:col-span-7">
              <p className="text-xs font-medium text-orange-700 mb-2">
                Scientific Non-Demolition Methodology
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                Three Pillars of Practical Energy Harmonization
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                Personalized to the family head’s date of birth, our consultation connects,
                balances, and channelizes cosmic energy across owned or rented homes and workplaces
                with zero structural breakage.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={JK_ABOUT_US.images.consult}
                  alt="JK Vaastu consultation session"
                  fallbackLabel="JK Vaastu Consultation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_PILLARS.map((pillar) => (
              <div
                key={pillar.index}
                className="bg-slate-50 border border-slate-200 rounded-xl p-7 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-sm text-orange-700 tabular-nums">
                    {pillar.index}.
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-slate-900 mt-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{pillar.subtitle}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mt-4">
                    {pillar.description}
                  </p>
                </div>
                <p className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-700 font-medium">
                  {pillar.mechanism}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Seven Chakras Matrix */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12 items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-medium text-orange-700 mb-2">Human Energy Centers</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                Channelizing Cosmic Energy Through the Seven Chakras
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm text-slate-600 leading-relaxed">
                Unfavorable property directions silently drain subtle energy centers, contributing
                to financial strain, poor focus, or restless sleep. Proper directional alignment
                recharges all seven chakras naturally.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SEVEN_CHAKRAS.map((chakra) => (
              <div
                key={chakra.number}
                className="p-6 bg-white border border-slate-200 rounded-xl"
              >
                <p className="text-xs text-slate-500">
                  <span className="font-mono tabular-nums text-orange-700">{chakra.number}.</span>{' '}
                  {chakra.element} · {chakra.location}
                </p>
                <h3 className="font-display text-2xl font-semibold text-slate-900 mt-2">
                  {chakra.sanskrit}
                </h3>
                <p className="text-xs font-medium text-slate-700 mt-0.5">{chakra.english}</p>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">{chakra.influence}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Consultation Scope & Sequence */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <SafeImage
                src={JK_ABOUT_US.images.sanctuary}
                alt="JK Vaastu Architectural Guidance"
                fallbackLabel="JK Vaastu Vision"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs font-semibold text-slate-900 mb-3">Our Vastu Services Include</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {JK_ABOUT_US.includedServices.map((svc) => (
                  <li key={svc} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-orange-600 mt-0.5 shrink-0" />
                    <span>{svc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-medium text-orange-700 mb-2">Consultation Process</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                Making Ancient Spatial Wisdom Practical for Modern Living
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Whether you occupy an urban flat in Bengaluru, manage an enterprise in Hubballi, or
                are planning a new construction anywhere in the world, our consultation follows a
                transparent four-step methodology.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {CONSULTATION_STEPS.map((s) => (
                <div key={s.step} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <p className="font-mono text-xs text-orange-700 tabular-nums">{s.step}.</p>
                  <h3 className="text-sm font-semibold text-slate-900 mt-1">{s.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
