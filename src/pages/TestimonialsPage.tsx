import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LiveTestimonialsSection } from '../components/LiveTestimonialsSection';

interface TestimonialsPageProps {
  onOpenBooking: () => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onOpenBooking }) => {
  return (
    <div className="bg-white">
      <LiveTestimonialsSection />

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-5">
          <p className="text-xs font-medium text-orange-700">Experience Scientific Vastu</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            Ready to Harmonize Your Home or Workplace?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Schedule an online video, phone, or on-site consultation with JK Vaastu for practical,
            non-demolition directional guidance personalized to your space.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer"
            >
              Book Consultation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
