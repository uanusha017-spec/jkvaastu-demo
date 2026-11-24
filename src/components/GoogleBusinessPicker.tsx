import React, { useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Check, MapPin, Search, Star } from 'lucide-react';

interface FoundPlace {
  id: string;
  displayName: string;
  formattedAddress: string;
  rating: number | null;
  userRatingCount: number | null;
}

interface GoogleBusinessPickerProps {
  currentPlaceId: string;
  currentQuery: string;
  onSelectBusiness: (placeId: string, query: string) => void;
}

export const GoogleBusinessPicker: React.FC<GoogleBusinessPickerProps> = ({
  currentPlaceId,
  currentQuery,
  onSelectBusiness,
}) => {
  const placesLib = useMapsLibrary('places');
  const [searchInput, setSearchInput] = useState(currentQuery || 'JK Vaastu Bangalore');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<FoundPlace[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!placesLib || !searchInput.trim()) return;
    setSearching(true);
    setError(null);
    try {
      // Places API (New) Text Search via modern Place class
      // Reference: https://developers.google.com/maps/documentation/javascript/place-search?utm_campaign=gmp_mcp_codeassist_v1_aistudio
      const searchResult = (await placesLib.Place.searchByText({
        textQuery: searchInput.trim(),
        fields: ['id', 'displayName', 'formattedAddress', 'rating', 'userRatingCount'],
        maxResultCount: 5,
      })) as {
        places?: Array<{
          id?: string;
          displayName?: string | null;
          formattedAddress?: string | null;
          rating?: number | null;
          userRatingCount?: number | null;
        }>;
      };
      const places = searchResult.places;

      if (!places || places.length === 0) {
        setResults([]);
        setError('No Google Business listings matched that search. Try adding your city name.');
        return;
      }

      setResults(
        places.map((p) => ({
          id: p.id || '',
          displayName: p.displayName || 'Unnamed Listing',
          formattedAddress: p.formattedAddress || '',
          rating: typeof p.rating === 'number' ? p.rating : null,
          userRatingCount: typeof p.userRatingCount === 'number' ? p.userRatingCount : null,
        }))
      );
    } catch (err) {
      console.error('Google Business search failed:', err);
      setError('Unable to search Google Business listings right now. Check your network or API settings.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
      <div>
        <p className="text-xs font-semibold text-slate-900">
          Connect Live Google Business Profile (Reviews Feed)
        </p>
        <p className="text-xs text-slate-600 mt-0.5">
          Search for your Google Business Profile below and connect its Place ID so live Google
          reviews automatically sync to your Testimonials section (newest &amp; updated first).
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="e.g. JK Vaastu Bangalore or JK Vaastu Hubballi"
            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={!placesLib || searching}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-orange-600 disabled:opacity-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          {searching ? 'Searching...' : 'Find Google Business'}
        </button>
      </div>

      {error && <p className="text-xs text-red-700">{error}</p>}

      {results.length > 0 && (
        <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden">
          {results.map((place) => {
            const isConnected = currentPlaceId === place.id;
            return (
              <div
                key={place.id}
                className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {place.displayName}
                  </p>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {place.formattedAddress}
                  </p>
                  {place.rating !== null && (
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 tabular-nums">
                      <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                      {place.rating.toFixed(1)} ({place.userRatingCount ?? 0} Google reviews)
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBusiness(place.id, place.displayName)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer shrink-0 ${
                    isConnected
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {isConnected && <Check className="w-3.5 h-3.5" />}
                  {isConnected ? 'Selected' : 'Connect Profile'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
