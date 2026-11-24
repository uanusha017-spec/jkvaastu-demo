import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import {
  CONSULTATION_MODES,
  isValidEmailFormat,
  PREFERRED_SLOTS,
  PROPERTY_TYPES,
  SERVICE_CATEGORIES,
  type ConsultationMode,
  type PreferredSlot,
  type PropertyType,
  type ServiceCategory,
} from '../types/models';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  defaultService?: ServiceCategory;
  defaultBirthDate?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  open,
  onClose,
  defaultService,
  defaultBirthDate,
}) => {
  const { createAppointment, user, siteSettings } = useFirebase();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [propertyType, setPropertyType] = useState<PropertyType>('Owned Home');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('Vastu for House');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredSlot, setPreferredSlot] = useState<PreferredSlot>('Morning (09:30 - 12:30)');
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('Online Video');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setConfirmedId(null);
      if (defaultService) setServiceCategory(defaultService);
      if (defaultBirthDate) setBirthDate(defaultBirthDate);
      if (user) {
        if (!fullName && user.displayName) setFullName(user.displayName);
        if (!email && user.email) setEmail(user.email);
      }
    }
  }, [open, defaultService, defaultBirthDate, user]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!isValidEmailFormat(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (phone.trim().length < 7) {
      setError('Please enter a valid phone or WhatsApp number.');
      return;
    }
    if (city.trim().length < 2) {
      setError('Please specify your city or property location.');
      return;
    }

    setSubmitting(true);
    try {
      const id = await createAppointment({
        fullName,
        email,
        phone,
        birthDate,
        city,
        propertyType,
        serviceCategory,
        preferredDate,
        preferredSlot,
        consultationMode,
        notes,
      });
      setConfirmedId(id);
    } catch (err) {
      setError(
        err instanceof Error
          ? 'Could not submit booking. Please check your details and try again.'
          : 'Unexpected error while saving appointment.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl my-8 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2
              id="booking-modal-title"
              className="font-display text-2xl font-semibold text-slate-900"
            >
              Book Vastu Consultation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              With {siteSettings.founderName} · {siteSettings.brandName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 inline-flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-slate-900">
              Consultation Request Received
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{fullName}</strong>. Your appointment
              request for <strong className="text-slate-900">{serviceCategory}</strong> on{' '}
              <span className="font-mono tabular-nums">{preferredDate}</span> has been saved and
              synced with our consultation desk.
            </p>
            <p className="text-xs font-mono text-slate-500 tabular-nums">
              Reference ID: {confirmedId}
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${siteSettings.brandName}, I just booked a consultation (Ref: ${confirmedId}) for ${serviceCategory} on ${preferredDate}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                Message on WhatsApp
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3.5 text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  maxLength={25}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600 tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  maxLength={120}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Date of Birth (Family Head)
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600 tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru / Hubballi"
                  required
                  maxLength={80}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Property Type *
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-orange-600"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Consultation Focus *
                </label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-orange-600"
                >
                  {SERVICE_CATEGORIES.map((sc) => (
                    <option key={sc} value={sc}>
                      {sc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600 tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Time *
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value as PreferredSlot)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-orange-600"
                >
                  {PREFERRED_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mode *</label>
                <select
                  value={consultationMode}
                  onChange={(e) => setConsultationMode(e.target.value as ConsultationMode)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-orange-600"
                >
                  {CONSULTATION_MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Describe Your Property &amp; Concerns
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1500}
                placeholder="Share entrance facing direction, owned/rented status, or key challenges (career, health, business, education, relationships)..."
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-60 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                {submitting ? 'Submitting...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
