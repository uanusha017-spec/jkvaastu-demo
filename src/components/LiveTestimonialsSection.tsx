import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { ExternalLink, RefreshCw, Star } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { STARTER_TESTIMONIALS } from '../data/vastuContent';
import { formatTimestamp } from '../types/models';

export interface LiveGoogleBusinessMeta {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  rating: number | null;
  userRatingCount: number | null;
  googleMapsURI: string | null;
  fetchedAt: Date;
}

interface UnifiedReview {
  id: string;
  source: 'google' | 'client';
  authorName: string;
  authorSubtitle: string;
  authorUri?: string | null;
  authorPhotoUri?: string | null;
  rating: number;
  quote: string;
  dateLabel: string;
  timestampMs: number;
  reviewUri?: string | null;
  serviceTag: string;
}

interface LiveTestimonialsSectionProps {
  compact?: boolean;
  onViewAll?: () => void;
}

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

function parsePublishTimeMs(publishTime: unknown): number {
  if (!publishTime) return 0;
  if (publishTime instanceof Date) return publishTime.getTime();
  if (typeof publishTime === 'string' || typeof publishTime === 'number') {
    const ms = new Date(publishTime).getTime();
    return Number.isNaN(ms) ? 0 : ms;
  }
  return 0;
}

function formatDateFromMs(ms: number): string {
  if (!ms) return 'Recent';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(ms));
  } catch {
    return 'Recent';
  }
}

interface PlacesReviewShape {
  rating?: number | null;
  text?: string | null;
  publishTime?: Date | string | number | null;
  relativePublishTimeDescription?: string | null;
  googleMapsURI?: string | null;
  authorAttribution?: {
    displayName?: string | null;
    uri?: string | null;
    photoURI?: string | null;
  } | null;
}

interface PlacesPlaceShape {
  id?: string;
  displayName?: string | null;
  formattedAddress?: string | null;
  rating?: number | null;
  userRatingCount?: number | null;
  reviews?: PlacesReviewShape[] | null;
  googleMapsURI?: string | null;
}

const LiveGoogleReviewsFetcher: React.FC<{
  placeId?: string;
  searchQuery?: string;
  refreshNonce: number;
  onLoaded: (meta: LiveGoogleBusinessMeta | null, reviews: UnifiedReview[], error: string | null) => void;
  onLoadingChange: (loading: boolean) => void;
}> = ({ placeId, searchQuery, refreshNonce, onLoaded, onLoadingChange }) => {
  const placesLib = useMapsLibrary('places');

  const fetchLiveReviews = useCallback(async () => {
    if (!placesLib) return;
    onLoadingChange(true);

    try {
      // Modern Places API (New) — Place class (replaces disabled legacy PlacesService)
      // Reference: https://developers.google.com/maps/documentation/javascript/place?utm_campaign=gmp_mcp_codeassist_v1_aistudio
      const fields = [
        'id',
        'displayName',
        'formattedAddress',
        'rating',
        'userRatingCount',
        'reviews',
        'googleMapsURI',
      ];

      let targetPlace: PlacesPlaceShape | null = null;
      const trimmedId = (placeId || '').trim();

      if (trimmedId) {
        const place = new placesLib.Place({ id: trimmedId });
        await place.fetchFields({ fields });
        targetPlace = place as unknown as PlacesPlaceShape;
      } else {
        const primaryQuery = (searchQuery || 'JK Vaastu Bangalore').trim();
        const searchRes = (await placesLib.Place.searchByText({
          textQuery: primaryQuery,
          fields,
          maxResultCount: 3,
        })) as { places?: PlacesPlaceShape[] };
        if (searchRes.places && searchRes.places.length > 0) {
          targetPlace =
            searchRes.places.find((p) => (p.reviews && p.reviews.length > 0) || p.rating) ||
            searchRes.places[0];
        } else if (primaryQuery.toLowerCase() !== 'jk vaastu') {
          const fallbackRes = (await placesLib.Place.searchByText({
            textQuery: 'JK Vaastu',
            fields,
            maxResultCount: 3,
          })) as { places?: PlacesPlaceShape[] };
          if (fallbackRes.places && fallbackRes.places.length > 0) {
            targetPlace = fallbackRes.places[0];
          }
        }
      }

      if (!targetPlace) {
        onLoaded(null, [], 'No matching Google Business listing found yet for this query.');
        return;
      }

      const rawReviews: PlacesReviewShape[] = Array.isArray(targetPlace.reviews)
        ? targetPlace.reviews
        : [];
      const mappedReviews: UnifiedReview[] = rawReviews
        .map((rev: PlacesReviewShape, idx: number): UnifiedReview => {
          const ms = parsePublishTimeMs(rev.publishTime);
          const author = rev.authorAttribution;
          const textValue = typeof rev.text === 'string' ? rev.text.trim() : '';
          return {
            id: `gmb-${targetPlace?.id || 'place'}-${ms || idx}-${idx}`,
            source: 'google',
            authorName: author?.displayName || 'Google Reviewer',
            authorSubtitle: rev.relativePublishTimeDescription || formatDateFromMs(ms),
            authorUri: author?.uri || null,
            authorPhotoUri: author?.photoURI || null,
            rating: typeof rev.rating === 'number' ? rev.rating : 5,
            quote:
              textValue ||
              `Rated ${typeof rev.rating === 'number' ? rev.rating : 5} out of 5 stars on Google Business Profile.`,
            dateLabel: rev.relativePublishTimeDescription
              ? `${rev.relativePublishTimeDescription}${ms ? ` · ${formatDateFromMs(ms)}` : ''}`
              : formatDateFromMs(ms),
            timestampMs: ms,
            reviewUri: rev.googleMapsURI || targetPlace?.googleMapsURI || null,
            serviceTag: 'Google Business Review',
          };
        })
        // Strictly newest / most recently updated Google reviews first
        .sort((a: UnifiedReview, b: UnifiedReview) => b.timestampMs - a.timestampMs);

      const meta: LiveGoogleBusinessMeta = {
        placeId: targetPlace.id || trimmedId,
        displayName: targetPlace.displayName || 'JK Vaastu',
        formattedAddress: targetPlace.formattedAddress || 'Bangalore & Hubballi, Karnataka',
        rating: typeof targetPlace.rating === 'number' ? targetPlace.rating : null,
        userRatingCount:
          typeof targetPlace.userRatingCount === 'number' ? targetPlace.userRatingCount : null,
        googleMapsURI: targetPlace.googleMapsURI || null,
        fetchedAt: new Date(),
      };

      onLoaded(meta, mappedReviews, null);
    } catch (err) {
      console.error('Unable to load live Google Business reviews:', err);
      onLoaded(
        null,
        [],
        'Unable to load live Google Business reviews right now. Client testimonials remain available below.'
      );
    } finally {
      onLoadingChange(false);
    }
  }, [placesLib, placeId, searchQuery, onLoaded, onLoadingChange]);

  useEffect(() => {
    fetchLiveReviews();
  }, [fetchLiveReviews, refreshNonce]);

  return null;
};

export const LiveTestimonialsSection: React.FC<LiveTestimonialsSectionProps> = ({
  compact = false,
  onViewAll,
}) => {
  const { siteSettings, publicTestimonials } = useFirebase();
  const [filter, setFilter] = useState<'all' | 'google' | 'client'>('all');
  const [googleMeta, setGoogleMeta] = useState<LiveGoogleBusinessMeta | null>(null);
  const [googleReviews, setGoogleReviews] = useState<UnifiedReview[]>([]);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const handleGoogleLoaded = useCallback(
    (meta: LiveGoogleBusinessMeta | null, reviews: UnifiedReview[], err: string | null) => {
      setGoogleMeta(meta);
      setGoogleReviews(reviews);
      setGoogleError(err);
    },
    []
  );

  // Firestore client testimonials sorted newest/updated first (fallback to starter stories if DB empty)
  const clientReviews = useMemo<UnifiedReview[]>(() => {
    if (publicTestimonials.length > 0) {
      return publicTestimonials
        .map((t) => {
          const updatedMs =
            t.updatedAt && typeof t.updatedAt.toMillis === 'function' ? t.updatedAt.toMillis() : 0;
          const createdMs =
            t.createdAt && typeof t.createdAt.toMillis === 'function' ? t.createdAt.toMillis() : 0;
          const bestMs = updatedMs || createdMs;
          const wasUpdated = updatedMs > 0 && createdMs > 0 && updatedMs - createdMs > 5000;

          return {
            id: `db-${t.id}`,
            source: 'client' as const,
            authorName: t.clientName,
            authorSubtitle: `${t.role} · ${t.city}`,
            rating: t.rating,
            quote: t.quote,
            dateLabel: wasUpdated
              ? `Updated ${formatTimestamp(t.updatedAt)}`
              : formatTimestamp(t.updatedAt || t.createdAt),
            timestampMs: bestMs,
            serviceTag: t.serviceUsed,
          };
        })
        .sort((a, b) => b.timestampMs - a.timestampMs);
    }

    return STARTER_TESTIMONIALS.map((t, idx) => ({
      id: `starter-${idx}`,
      source: 'client' as const,
      authorName: t.clientName,
      authorSubtitle: `${t.role} · ${t.city}`,
      rating: t.rating,
      quote: t.quote,
      dateLabel: 'Verified Client',
      timestampMs: (STARTER_TESTIMONIALS.length - idx) * 1000,
      serviceTag: t.serviceUsed,
    }));
  }, [publicTestimonials]);

  // Unified newest-first feed: most recently updated/published reviews always come first
  const visibleReviews = useMemo(() => {
    let list: UnifiedReview[];
    if (filter === 'google') {
      list = [...googleReviews].sort((a, b) => b.timestampMs - a.timestampMs);
    } else if (filter === 'client') {
      list = [...clientReviews].sort((a, b) => b.timestampMs - a.timestampMs);
    } else {
      list = [...googleReviews, ...clientReviews].sort((a, b) => b.timestampMs - a.timestampMs);
    }
    return compact ? list.slice(0, 6) : list;
  }, [filter, googleReviews, clientReviews, compact]);

  const writeReviewUrl = googleMeta?.placeId
    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(googleMeta.placeId)}`
    : googleMeta?.googleMapsURI || null;

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      {MAPS_API_KEY && (
        <LiveGoogleReviewsFetcher
          placeId={siteSettings.googlePlaceId}
          searchQuery={siteSettings.googleBusinessQuery || `${siteSettings.brandName} Bangalore`}
          refreshNonce={refreshNonce}
          onLoaded={handleGoogleLoaded}
          onLoadingChange={setLoadingGoogle}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header & Live Google Business Summary Strip */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-orange-700 mb-2">
              Live Google Business Reviews &amp; Client Outcomes
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
              Verified Reviews — Latest &amp; Updated First
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              Connected live to Google Business Profile reviews and our verified consultation desk.
              Newly posted and updated reviews appear at the top automatically, with earlier stories
              below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {MAPS_API_KEY && (
              <button
                type="button"
                onClick={() => setRefreshNonce((n) => n + 1)}
                disabled={loadingGoogle}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingGoogle ? 'animate-spin' : ''}`} />
                {loadingGoogle ? 'Syncing Google Reviews...' : 'Refresh Live Reviews'}
              </button>
            )}
            {writeReviewUrl && (
              <a
                href={writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-orange-600 rounded-lg transition-colors whitespace-nowrap"
              >
                Review on Google
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Live Google Business Profile Rating Summary Bar */}
        {googleMeta && (
          <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500">
                Google Business Profile · Reviews powered by Google
              </p>
              <p className="font-display text-2xl font-semibold text-slate-900">
                {googleMeta.displayName}
              </p>
              <p className="text-xs text-slate-600">{googleMeta.formattedAddress}</p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {googleMeta.rating !== null && (
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                      {googleMeta.rating.toFixed(1)}
                    </span>
                    <div className="flex items-center text-orange-600" aria-label={`${googleMeta.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(googleMeta.rating || 5)
                              ? 'fill-orange-500 text-orange-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                    {googleMeta.userRatingCount !== null
                      ? `Based on ${googleMeta.userRatingCount.toLocaleString('en-IN')} Google reviews`
                      : 'Verified Google Business listing'}
                  </p>
                </div>
              )}

              {googleMeta.googleMapsURI && (
                <a
                  href={googleMeta.googleMapsURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 hover:text-orange-800 underline underline-offset-4 whitespace-nowrap"
                >
                  Open on Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {googleError && !googleMeta && (
          <p className="mt-4 text-xs text-slate-500">{googleError}</p>
        )}

        {/* Filter Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Reviews ({googleReviews.length + clientReviews.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('google')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'google'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Google Business ({googleReviews.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('client')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'client'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Client Stories ({clientReviews.length})
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Sorted dynamically: most recent &amp; updated first
          </p>
        </div>

        {/* Review Cards Grid */}
        {visibleReviews.length === 0 ? (
          <div className="mt-8 p-10 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-sm font-medium text-slate-800">
              {filter === 'google'
                ? loadingGoogle
                  ? 'Loading live reviews from Google Business Profile...'
                  : 'No public Google Business reviews returned for the currently linked Place ID yet. You can select your Google Business listing from Admin Panel -> Site & Contact.'
                : 'No testimonials published yet.'}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleReviews.map((item) => (
              <blockquote
                key={item.id}
                className="p-7 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <p className="text-xs text-slate-500">
                      <span
                        className={
                          item.source === 'google'
                            ? 'font-semibold text-orange-700'
                            : 'font-medium text-slate-700'
                        }
                      >
                        {item.serviceTag}
                      </span>{' '}
                      · <span className="font-mono tabular-nums text-slate-700">{item.rating}.0 / 5.0</span>
                    </p>
                    <div className="flex items-center gap-0.5 text-orange-500 shrink-0" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-3.5 h-3.5 ${
                            n <= Math.round(item.rating)
                              ? 'fill-orange-500 text-orange-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-base text-slate-800 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <footer className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    {item.authorUri ? (
                      <a
                        href={item.authorUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-slate-900 hover:text-orange-700 transition-colors"
                      >
                        {item.authorName}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-slate-900">{item.authorName}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{item.dateLabel}</p>
                  </div>

                  {item.source === 'google' && item.reviewUri ? (
                    <a
                      href={item.reviewUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 shrink-0"
                    >
                      Google
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500 shrink-0">{item.authorSubtitle}</span>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        )}

        {compact && onViewAll && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 border border-slate-300 hover:border-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              View All Live Google &amp; Client Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
