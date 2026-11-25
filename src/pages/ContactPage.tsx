import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { OfficeLocationMap } from '../components/OfficeLocationMap';
import { isValidEmailFormat } from '../types/models';

interface ContactPageProps {
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenBooking }) => {
  const { siteSettings, createInquiry, myAppointments, user } = useFirebase();

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!isValidEmailFormat(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (phone.trim().length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (subject.trim().length < 2 || message.trim().length < 5) {
      setError('Please provide a subject and brief message.');
      return;
    }

    setSubmitting(true);
    try {
      await createInquiry({ fullName, email, phone, subject, message });
      setSent(true);
      setSubject('');
      setMessage('');
    } catch {
      setError('Unable to send your inquiry right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-medium text-orange-700 mb-3">Contact {siteSettings.brandName}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1]">
            Speak With Our Consultation Desk
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Reach out directly to {siteSettings.founderName} and the {siteSettings.brandName} team
            at {siteSettings.locations} for residential, commercial, or online consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Official JK Vaastu Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-7 space-y-6">
              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-500">Direct Call &amp; Consultation</p>
                  <a
                    href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                    className="text-base font-semibold text-slate-900 hover:text-orange-700 transition-colors tabular-nums"
                  >
                    {siteSettings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-500">Email</p>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="text-base font-semibold text-slate-900 hover:text-orange-700 transition-colors"
                  >
                    {siteSettings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-500">Consultation Office</p>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                    {siteSettings.locations}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-500">Consultation Hours</p>
                  <p className="text-sm font-medium text-slate-800">{siteSettings.officeHours}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </button>
                <a
                  href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp Chat
                </a>
              </div>
            </div>

            {myAppointments.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">
                  Your Recent Appointments ({myAppointments.length})
                </h2>
                <div className="divide-y divide-slate-100">
                  {myAppointments.slice(0, 4).map((appt) => (
                    <div key={appt.id} className="py-3 text-xs flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900">{appt.serviceCategory}</p>
                        <p className="text-slate-500 tabular-nums mt-0.5">
                          {appt.preferredDate} · {appt.consultationMode}
                        </p>
                      </div>
                      <span className="font-mono uppercase text-[11px] text-slate-700">
                        {appt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Inquiry Form stored in Firestore */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-xl p-7 sm:p-9">
              <h2 className="font-display text-3xl font-semibold text-slate-900">
                Send an Inquiry
              </h2>
              <p className="text-sm text-slate-600 mt-1.5">
                Have a question about floor plans, rented properties, or webinar dates? Send us a
                message and our team will reply promptly.
              </p>

              {sent ? (
                <div className="mt-6 p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    Message Received
                  </div>
                  <p className="text-sm text-emerald-900/80">
                    Thank you for writing to {siteSettings.brandName}. Your inquiry has been stored
                    securely and synced with our desk.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="text-xs font-semibold text-emerald-900 underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                        required
                        maxLength={100}
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        maxLength={25}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600 tabular-nums"
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
                        required
                        maxLength={120}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        maxLength={150}
                        placeholder="e.g., Floor plan audit for 3BHK flat"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      maxLength={2000}
                      placeholder="Tell us about your property, city, and what guidance you are seeking..."
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-orange-600 disabled:opacity-60 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Google Map — Pride Icon Mall, Gokul Rd, Hubballi */}
        <div className="mt-14">
          <div className="mb-5">
            <p className="text-xs font-medium text-orange-700 mb-1.5">Directions &amp; Map</p>
            <h2 className="font-display text-3xl font-semibold text-slate-900 tracking-tight">
              Find Our Office on Google Maps
            </h2>
          </div>
          <OfficeLocationMap
            address={siteSettings.locations}
            brandName={siteSettings.brandName}
            heightClass="h-[340px] sm:h-[420px] lg:h-[460px]"
          />
        </div>
      </div>
    </div>
  );
};
