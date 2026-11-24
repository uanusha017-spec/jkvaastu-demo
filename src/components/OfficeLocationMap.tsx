import React, { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';

interface ResolvedOfficeLocation {
  position: { lat: number; lng: number };
  displayName: string;
  formattedAddress: string;
  googleMapsURI: string | null;
}

interface OfficeLocationMapProps {
  address: string;
  brandName: string;
  heightClass?: string;
}

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

interface PlacesLocationLike {
  lat: number | (() => number);
  lng: number | (() => number);
}

interface PlaceSearchItem {
  id?: string;
  displayName?: string | null;
  formattedAddress?: string | null;
  location?: PlacesLocationLike | null;
  googleMapsURI?: string | null;
}

function extractLatLng(loc: PlacesLocationLike | null | undefined): { lat: number; lng: number } | null {
  if (!loc) return null;
  const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
  const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
  if (typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat) && !Number.isNaN(lng)) {
    return { lat, lng };
  }
  return null;
}

const MapViewportController: React.FC<{ position: { lat: number; lng: number } | null }> = ({
  position,
}) => {
  const map = useMap();
  useEffect(() => {
    if (map && position) {
      map.panTo(position);
      map.setZoom(16);
    }
  }, [map, position]);
  return null;
};

const InteractiveOfficeMapInner: React.FC<OfficeLocationMapProps> = ({
  address,
  brandName,
  heightClass = 'h-[320px] sm:h-[380px] lg:h-[420px]',
}) => {
  const placesLib = useMapsLibrary('places');
  const [resolved, setResolved] = useState<ResolvedOfficeLocation | null>(null);
  const [infoOpen, setInfoOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placesLib) return;
    let active = true;

    const locateOffice = async () => {
      setLoading(true);
      setError(null);
      try {
        // Modern Places API (New) — resolve exact coordinates dynamically from Google Maps
        // Reference: https://developers.google.com/maps/documentation/javascript/place-search?utm_campaign=gmp_mcp_codeassist_v1_aistudio
        const queries = [
          address.trim(),
          'Pride Icon Complex, Gokul Road, Hubballi, Karnataka',
          'Gokul Road, Hubballi, Karnataka',
        ].filter(Boolean);

        let found: PlaceSearchItem | null = null;

        for (const q of queries) {
          const res = (await placesLib.Place.searchByText({
            textQuery: q,
            fields: ['id', 'displayName', 'formattedAddress', 'location', 'googleMapsURI'],
            maxResultCount: 1,
          })) as { places?: PlaceSearchItem[] };

          if (res.places && res.places.length > 0 && extractLatLng(res.places[0].location)) {
            found = res.places[0];
            break;
          }
        }

        if (!active) return;

        const coords = extractLatLng(found?.location);
        if (found && coords) {
          setResolved({
            position: coords,
            displayName: found.displayName || 'Pride Icon Complex',
            formattedAddress: found.formattedAddress || address,
            googleMapsURI: found.googleMapsURI || null,
          });
        } else {
          setError('Unable to locate the exact map pin right now. Use the directions link below.');
        }
      } catch (err) {
        console.error('Failed to resolve office map location:', err);
        if (active) {
          setError('Unable to load the interactive map right now. Please check your network.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    locateOffice();
    return () => {
      active = false;
    };
  }, [placesLib, address]);

  const directionsHref =
    resolved?.googleMapsURI ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <MapPin className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900">
              {brandName} · Consultation Center Location
            </p>
            <p className="text-xs text-slate-600 truncate sm:whitespace-normal">
              {resolved?.formattedAddress || address}
            </p>
          </div>
        </div>
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-orange-600 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" />
          Get Directions
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Explicit container height prevents CF2 map collapse across all devices */}
      <div className={`relative w-full ${heightClass} bg-slate-100`}>
        {loading && !resolved && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-xs text-slate-500">
            Loading Google Maps for {address}...
          </div>
        )}

        {error && !resolved && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <p className="text-xs text-slate-600 max-w-sm">{error}</p>
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 underline"
            >
              Open Pride Icon Complex, Gokul Road, Hubballi in Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {resolved && (
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={resolved.position}
            defaultZoom={16}
            gestureHandling="cooperative"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            className="w-full h-full"
          >
            <MapViewportController position={resolved.position} />
            <AdvancedMarker
              position={resolved.position}
              title={`${brandName} — ${resolved.displayName}`}
              onClick={() => setInfoOpen((prev) => !prev)}
            >
              <Pin
                background="#ea580c"
                borderColor="#9a3412"
                glyphColor="#ffffff"
                scale={1.2}
              />
            </AdvancedMarker>

            {infoOpen && (
              <InfoWindow
                position={resolved.position}
                pixelOffset={[0, -38]}
                onCloseClick={() => setInfoOpen(false)}
              >
                <div className="p-1 max-w-[230px] space-y-1">
                  <p className="text-xs font-bold text-slate-900">{brandName}</p>
                  <p className="text-[11px] font-medium text-orange-700">
                    Pride Icon Complex, Gokul Road, Hubballi
                  </p>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {resolved.formattedAddress}
                  </p>
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 pt-1 text-[11px] font-semibold text-orange-700 hover:underline"
                  >
                    Open in Google Maps
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </InfoWindow>
            )}
          </Map>
        )}
      </div>
    </div>
  );
};

export const OfficeLocationMap: React.FC<OfficeLocationMapProps> = (props) => {
  if (!MAPS_API_KEY) {
    const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.address)}`;
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-900">{props.brandName} Office</p>
          <p className="text-sm text-slate-700 mt-1">{props.address}</p>
        </div>
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-orange-600 rounded-lg whitespace-nowrap"
        >
          <Navigation className="w-3.5 h-3.5" />
          Open in Google Maps
        </a>
      </div>
    );
  }

  return <InteractiveOfficeMapInner {...props} />;
};
