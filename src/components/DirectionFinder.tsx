import React, { useState } from 'react';
import { ArrowRight, Compass, RotateCcw } from 'lucide-react';
import {
  calculateFavorableDirections,
  type CompassDirection,
  type DirectionProfile,
} from '../data/vastuContent';

interface DirectionFinderProps {
  onBookWithDob: (birthDate: string) => void;
}

const COMPASS_POINTS: { dir: CompassDirection; short: string; angleDeg: number }[] = [
  { dir: 'North', short: 'N', angleDeg: 0 },
  { dir: 'North-East', short: 'NE', angleDeg: 45 },
  { dir: 'East', short: 'E', angleDeg: 90 },
  { dir: 'South-East', short: 'SE', angleDeg: 135 },
  { dir: 'South', short: 'S', angleDeg: 180 },
  { dir: 'South-West', short: 'SW', angleDeg: 225 },
  { dir: 'West', short: 'W', angleDeg: 270 },
  { dir: 'North-West', short: 'NW', angleDeg: 315 },
];

const CompassRose: React.FC<{ profile: DirectionProfile }> = ({ profile }) => {
  const rankMap = new Map<CompassDirection, number>();
  profile.favorable.forEach((f) => rankMap.set(f.direction, f.rank));

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 240 240"
        className="w-48 h-48 sm:w-56 sm:h-56"
        role="img"
        aria-label={`Compass diagram showing favorable directions for Kua ${profile.energyNumber}`}
      >
        <circle cx="120" cy="120" r="108" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        <circle cx="120" cy="120" r="68" fill="none" stroke="#e2e8f0" strokeDasharray="3 3" />

        {COMPASS_POINTS.map((pt) => {
          const rad = ((pt.angleDeg - 90) * Math.PI) / 180;
          const xOuter = 120 + Math.cos(rad) * 86;
          const yOuter = 120 + Math.sin(rad) * 86;
          const xLine = 120 + Math.cos(rad) * 62;
          const yLine = 120 + Math.sin(rad) * 62;
          const rank = rankMap.get(pt.dir);
          const isFav = Boolean(rank);

          return (
            <g key={pt.dir}>
              <line
                x1="120"
                y1="120"
                x2={xLine}
                y2={yLine}
                stroke={isFav ? (rank === 1 ? '#ea580c' : '#059669') : '#cbd5e1'}
                strokeWidth={isFav ? (rank === 1 ? 2.5 : 2) : 1}
              />
              <circle
                cx={xOuter}
                cy={yOuter}
                r={rank === 1 ? 19 : 16}
                fill={isFav ? (rank === 1 ? '#ea580c' : '#ecfdf5') : '#ffffff'}
                stroke={isFav ? (rank === 1 ? '#c2410c' : '#10b981') : '#cbd5e1'}
                strokeWidth={isFav ? 1.8 : 1}
              />
              <text
                x={xOuter}
                y={yOuter + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontWeight={isFav ? 700 : 500}
                fill={rank === 1 ? '#ffffff' : isFav ? '#065f46' : '#64748b'}
              >
                {pt.short}
              </text>
              {rank && (
                <text
                  x={xOuter}
                  y={yOuter + (rank === 1 ? 12 : 10)}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight={700}
                  fill={rank === 1 ? '#ffedd5' : '#047857'}
                >
                  #{rank}
                </text>
              )}
            </g>
          );
        })}

        <circle cx="120" cy="120" r="26" fill="#0f172a" />
        <text
          x="120"
          y="115"
          textAnchor="middle"
          fontSize="8"
          fill="#fb923c"
          fontWeight="600"
        >
          KUA
        </text>
        <text
          x="120"
          y="130"
          textAnchor="middle"
          fontSize="16"
          fill="#ffffff"
          fontWeight="700"
        >
          {profile.energyNumber}
        </text>
      </svg>
      <p className="text-[11px] text-slate-500 mt-1 text-center">
        Orange = #1 Prosperity · Green = #2–#4 Favorable
      </p>
    </div>
  );
};

export const DirectionFinder: React.FC<DirectionFinderProps> = ({ onBookWithDob }) => {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [profile, setProfile] = useState<DirectionProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      setError('Please enter your exact Date of Birth to compute your personalized chart.');
      return;
    }
    const res = calculateFavorableDirections(birthDate, gender, fullName);
    if (!res) {
      setError('Please select a valid date of birth between 1920 and 2026.');
      return;
    }
    setError(null);
    setProfile(res);
  };

  const handleReset = () => {
    setFullName('');
    setBirthDate('');
    setGender('male');
    setProfile(null);
    setError(null);
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Explanation & Form */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-medium text-orange-700 mb-2">
                Personalized Directional Assessment
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                Find Your Four Favorable Directions
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Scientific Vastu calculates your exact Kua Energy Index (1–9) from your Date of
                Birth and Gender—including the Feb 4 solar-year transition—to reveal your ranked
                four favorable and four unfavorable compass directions.
              </p>
            </div>

            <form
              onSubmit={handleCalculate}
              className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="name-finder"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Your Name (Optional)
                </label>
                <input
                  id="name-finder"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={80}
                  placeholder="e.g., Rajesh Kulkarni"
                  className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
                />
              </div>

              <div>
                <label
                  htmlFor="dob-finder"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Exact Date of Birth (Family Head or Individual) *
                </label>
                <input
                  id="dob-finder"
                  type="date"
                  value={birthDate}
                  min="1920-01-01"
                  max="2026-12-31"
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600 tabular-nums"
                  required
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-700 mb-1.5">Gender *</span>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      gender === 'male'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      gender === 'female'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {error && <p className="text-xs text-red-700">{error}</p>}

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Compass className="w-4 h-4" />
                  Calculate My Exact Directions
                </button>
                {profile && (
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Reset calculator"
                    className="inline-flex items-center justify-center p-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Result Output */}
          <div className="lg:col-span-7">
            {!profile ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-orange-700">
                    Accurate Eight Mansions / Kua Calculation
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
                    Enter Your Date of Birth &amp; Gender to Generate Your Personalized Chart
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Every individual receives a unique ranked directional profile based on their
                    exact birth year, solar transition date, and gender:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs font-semibold text-slate-900">
                      1. Exact Kua Index &amp; Compass Rose
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Shows the exact math used for your birth year (including Jan 1 – Feb 3 solar
                      year adjustment) and plots your 1st through 4th favorable compass sectors.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs font-semibold text-slate-900">
                      2. Ranked Life-Area Directions
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Pinpoints your exact #1 Prosperity, #2 Health, #3 Marriage &amp; Harmony, and
                      #4 Education &amp; Focus directions in degrees.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs font-semibold text-slate-900">
                      3. Main Door, Sleep &amp; Work Alignment
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Practical non-demolition facing and sleeping orientations tailored to your
                      exact Kua profile and dominant element.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-xs font-semibold text-slate-900">
                      4. Unfavorable Sectors Ranked
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Identifies which four directions to minimize for desks, beds, and main
                      entrances along with supportive colors and chakras.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 space-y-6">
                {/* Top Summary + Visual Compass Rose */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-6 border-b border-slate-200">
                  <div className="md:col-span-7 space-y-2.5">
                    <p className="text-xs text-slate-500">
                      {profile.fullName ? `${profile.fullName} · ` : ''}
                      DOB <span className="font-mono tabular-nums text-slate-800">{profile.birthDate}</span> ·{' '}
                      <span className="capitalize">{profile.gender}</span>
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
                      Kua {profile.energyNumber} — {profile.groupName}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Element: <strong className="text-slate-900">{profile.element}</strong> ·
                      Trigram: <strong className="text-slate-900">{profile.trigram}</strong> ·
                      Chakras: <strong className="text-slate-900">{profile.primaryChakra}</strong>
                    </p>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
                      <p>
                        <strong className="text-slate-800">Verified Calculation:</strong>{' '}
                        {profile.formulaSummary}
                      </p>
                      <p className="tabular-nums">
                        Solar Year Used: <strong className="text-slate-800">{profile.solarYearUsed}</strong>
                        {profile.solarAdjustmentApplied
                          ? ' (Adjusted −1 yr for Jan 1 – Feb 3 pre-Lichun birth date)'
                          : ' (Standard solar calendar year)'}
                      </p>
                      <p>
                        Supportive Colors:{' '}
                        <strong className="text-slate-800">
                          {profile.favorableColors.join(', ')}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-5 flex justify-center">
                    <CompassRose profile={profile} />
                  </div>
                </div>

                {/* Ranked Four Favorable Directions */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 mb-3">
                    Your Ranked Four Favorable Directions (Exact Compass Degrees)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {profile.favorable.map((item) => (
                      <div
                        key={item.direction}
                        className={`p-4 rounded-lg border ${
                          item.rank === 1
                            ? 'bg-orange-50/70 border-orange-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-base font-semibold text-slate-900">
                            #{item.rank} {item.direction}
                          </p>
                          <span className="font-mono text-[11px] text-slate-600 tabular-nums">
                            {item.degrees}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-orange-700 mt-0.5">
                          {item.category}
                        </p>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {item.benefit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Space Application */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Main Entrance</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {profile.mainDoorRecommendation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Sleeping Head Direction</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {profile.sleepRecommendation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Work &amp; Study Facing</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {profile.workRecommendation}
                    </p>
                  </div>
                </div>

                {/* Ranked Unfavorable Directions */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <p className="text-xs font-semibold text-slate-800">
                    Four Unfavorable Directions to Minimize
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {profile.unfavorable.map((u) => (
                      <div
                        key={u.direction}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-800">{u.direction}</span>
                          <span className="text-[11px] text-slate-500">
                            {u.severity} · <span className="font-mono tabular-nums">{u.degrees}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{u.caution}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-500">
                    Want a floor-plan audit matching your Kua {profile.energyNumber} chart?
                  </p>
                  <button
                    type="button"
                    onClick={() => onBookWithDob(birthDate)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-orange-700 hover:text-orange-800 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Request Full Property Audit
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
