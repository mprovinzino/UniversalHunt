import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { useChallenges } from '../hooks/useChallenges';
import { useProgressContext } from '../hooks/useProgressContext';
import { getTheme } from '../themes';
import type { Challenge, Park, ChallengeType } from '../types';
import { universalHotels, type ResortHotel } from '../data/resort';

import ChallengeMarker from '../components/map/ChallengeMarker';
import ChallengePreviewCard from '../components/map/ChallengePreviewCard';
import MapFilterBar from '../components/map/MapFilterBar';
import ResortPointMarker from '../components/map/ResortPointMarker';
import { useCalibrationDrafts } from '../hooks/useCalibrationDrafts';

interface CalibrationPoint {
  lat: number;
  lng: number;
  zoom: number;
}

const mapToken = import.meta.env.VITE_MAPBOX_TOKEN?.trim();

if (mapToken) {
  mapboxgl.accessToken = mapToken;
}

/** Universal Orlando resort center */
const RESORT_CENTER: [number, number] = [-81.4684, 28.4743];

/** Bounding box to keep the map within the resort area */
const RESORT_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [-81.4850, 28.4600], // southwest
  [-81.4500, 28.4900], // northeast
];

// ── Search zone circle helpers ─────────────────────────
/** Generates a GeoJSON circle from a center point + radius in meters */
function createCircle(
  center: [number, number],
  radiusMeters: number,
  points = 64,
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coords: [number, number][] = [];
  const km = radiusMeters / 1000;
  const distanceX = km / (111.32 * Math.cos((center[1] * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([center[0] + x, center[1] + y]);
  }
  coords.push(coords[0]); // close the ring

  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [coords] },
  };
}

// ── Map page component ─────────────────────────────────
export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  // Store map instance in state so React re-renders when it's set
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const challenges = useChallenges();
  const { getProgress } = useProgressContext();

  // Filters
  const [activePark, setActivePark] = useState<Park | 'all'>('all');
  const [activeType, setActiveType] = useState<ChallengeType | 'all'>('all');

  // Preview card
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<ResortHotel | null>(null);
  const [showHotels, setShowHotels] = useState(true);
  const [pinpointMode, setPinpointMode] = useState(false);
  const [calibrationPoint, setCalibrationPoint] = useState<CalibrationPoint | null>(null);
  const [calibrationRadius, setCalibrationRadius] = useState(40);
  const [copyMessage, setCopyMessage] = useState('');
  const [activeCalibrationChallengeId, setActiveCalibrationChallengeId] = useState('');
  const pinpointModeRef = useRef(pinpointMode);
  const { drafts, saveDraft } = useCalibrationDrafts();

  // Filter challenges
  const filtered = challenges.filter((c) => {
    if (activePark !== 'all' && c.park !== activePark) return false;
    if (activeType !== 'all' && c.type !== activeType) return false;
    return true;
  });

  useEffect(() => {
    pinpointModeRef.current = pinpointMode;
  }, [pinpointMode]);

  // ── Initialize map ─────────────────────────────────
  useEffect(() => {
    if (!mapToken || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: RESORT_CENTER,
      zoom: 15.5,
      minZoom: 14,
      maxZoom: 19,
      maxBounds: RESORT_BOUNDS,
      attributionControl: false,
      pitchWithRotate: false,
    });

    // Add compact attribution in bottom-right
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      'bottom-right',
    );

    // Add zoom buttons (top-right, below filters)
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    const markReady = () => setMapReady(true);

    // The 'load' event fires when style + tiles are ready.
    // Also listen to 'idle' as a fallback for environments
    // where 'load' may not fire (e.g., headless browsers).
    if (map.loaded()) {
      markReady();
    } else {
      map.on('load', markReady);
      map.once('idle', markReady);
    }

    // Tap on empty map = close preview
    map.on('click', (event) => {
      if (pinpointModeRef.current) {
        setCalibrationPoint({
          lat: event.lngLat.lat,
          lng: event.lngLat.lng,
          zoom: map.getZoom(),
        });
        setSelectedHotel(null);
        return;
      }

      setSelectedChallenge(null);
      setSelectedHotel(null);
    });

    // Store in state so child components re-render
    setMapInstance(map);

    return () => {
      map.remove();
      setMapInstance(null);
      setMapReady(false);
    };
  }, []);

  // ── Search zone circle layers ──────────────────────
  useEffect(() => {
    if (!mapToken || !mapInstance || !mapReady) return;

    const sourceId = 'search-zones';

    // Build GeoJSON FeatureCollection for visible challenges
    const features = filtered.map((c) => {
      const circle = createCircle(
        [c.coordinates.lng, c.coordinates.lat],
        c.searchRadius,
      );
      const theme = getTheme(c.theme);
      const progress = getProgress(c.id);
      circle.properties = {
        color: progress.status === 'completed' ? '#10B981' : theme.primary,
        challengeId: c.id,
      };
      return circle;
    });

    const geojson: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
      type: 'FeatureCollection',
      features,
    };

    // Update or create source + layer
    const existing = mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
    if (existing) {
      existing.setData(geojson);
    } else {
      mapInstance.addSource(sourceId, { type: 'geojson', data: geojson });

      mapInstance.addLayer({
        id: 'search-zones-fill',
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,       // invisible at zoom 15
            16, 0.15,    // fade in
            18, 0.2,     // slightly more opaque when zoomed in
          ],
        },
      });

      mapInstance.addLayer({
        id: 'search-zones-outline',
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.5,
          'line-opacity': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,
            16, 0.3,
            18, 0.5,
          ],
        },
      });
    }
  }, [mapInstance, mapReady, filtered, getProgress]);

  // Handle marker click
  const handleMarkerClick = useCallback((challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setSelectedHotel(null);
    setActiveCalibrationChallengeId(challenge.id);
    setCalibrationRadius(drafts[challenge.id]?.searchRadius ?? challenge.searchRadius);

    // Fly to the challenge
    mapInstance?.flyTo({
      center: [challenge.coordinates.lng, challenge.coordinates.lat],
      zoom: 17,
      duration: 600,
    });
  }, [drafts, mapInstance]);

  const handleHotelClick = useCallback((hotel: ResortHotel) => {
    setSelectedHotel(hotel);
    setSelectedChallenge(null);
    mapInstance?.flyTo({
      center: [hotel.coordinates.lng, hotel.coordinates.lat],
      zoom: 15.8,
      duration: 600,
    });
  }, [mapInstance]);

  useEffect(() => {
    if (!mapInstance || !calibrationPoint) return;

    const el = document.createElement('div');
    el.style.width = '18px';
    el.style.height = '18px';
    el.style.borderRadius = '999px';
    el.style.background = '#0EA5E9';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.35)';

    const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([calibrationPoint.lng, calibrationPoint.lat])
      .addTo(mapInstance);

    return () => {
      marker.remove();
    };
  }, [calibrationPoint, mapInstance]);

  const copyText = useCallback(async (value: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage(successMessage);
    } catch {
      setCopyMessage('Copy failed on this device.');
    }
  }, []);

  const copyCoordinates = useCallback(() => {
    if (!calibrationPoint) return;
    void copyText(
      `${calibrationPoint.lat.toFixed(6)}, ${calibrationPoint.lng.toFixed(6)}`,
      'Coordinates copied.',
    );
  }, [calibrationPoint, copyText]);

  const copyJsonSnippet = useCallback(() => {
    if (!calibrationPoint) return;
    void copyText(
      `"coordinates": { "lat": ${calibrationPoint.lat.toFixed(6)}, "lng": ${calibrationPoint.lng.toFixed(6)} },\n"searchRadius": ${calibrationRadius}`,
      'JSON calibration snippet copied.',
    );
  }, [calibrationPoint, calibrationRadius, copyText]);

  const saveCalibrationDraft = useCallback(() => {
    if (!calibrationPoint || !activeCalibrationChallengeId) return;

    saveDraft({
      challengeId: activeCalibrationChallengeId,
      lat: Number(calibrationPoint.lat.toFixed(6)),
      lng: Number(calibrationPoint.lng.toFixed(6)),
      zoom: Number(calibrationPoint.zoom.toFixed(2)),
      searchRadius: calibrationRadius,
      capturedAt: new Date().toISOString(),
    });
    setCopyMessage('Calibration draft saved to the admin review queue.');
  }, [activeCalibrationChallengeId, calibrationPoint, calibrationRadius, saveDraft]);

  if (!mapToken) {
    return (
      <div className="flex-1 px-4 pt-6 pb-24 animate-fade-in">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-lg font-bold text-slate-800">Map setup needed</p>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Add a `VITE_MAPBOX_TOKEN` value to your local environment to enable the live resort map.
          </p>
          <p className="mt-3 text-xs text-slate-400">
            You can still browse {challenges.length} challenge{challenges.length !== 1 ? 's' : ''}{' '}
            and {new Set(challenges.map((challenge) => challenge.park)).size} parks from the hunt views.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              to="/hunts"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#1565C0' }}
            >
              Browse Hunts
            </Link>
            <Link
              to="/challenges"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700"
            >
              View Challenges
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 animate-fade-in" style={{ bottom: '60px' }}>
      {/* Map container — fills the screen above the bottom nav */}
      <div
        ref={mapContainer}
        className="w-full h-full"
      />

      {/* Filter bar overlaid on top of map */}
      <MapFilterBar
        activePark={activePark}
        onParkSelect={setActivePark}
        activeType={activeType}
        onTypeSelect={setActiveType}
        showHotels={showHotels}
        onToggleHotels={() => setShowHotels((prev) => !prev)}
        pinpointMode={pinpointMode}
        onTogglePinpointMode={() => {
          setPinpointMode((prev) => !prev);
          setCopyMessage('');
        }}
      />

      {/* Challenge markers — rendered as React components that manage DOM markers */}
      {mapInstance &&
        filtered.map((c) => (
          <ChallengeMarker
            key={c.id}
            map={mapInstance}
            challenge={c}
            progress={getProgress(c.id)}
            onClick={handleMarkerClick}
          />
        ))}

      {mapInstance &&
        showHotels &&
        universalHotels.map((hotel) => (
          <ResortPointMarker
            key={hotel.id}
            map={mapInstance}
            point={hotel}
            onClick={handleHotelClick}
          />
        ))}

      {/* Preview card when a marker is tapped */}
      {selectedChallenge && (
        <ChallengePreviewCard
          challenge={selectedChallenge}
          progress={getProgress(selectedChallenge.id)}
          onClose={() => setSelectedChallenge(null)}
        />
      )}

      {selectedHotel && (
        <div className="absolute bottom-20 left-3 right-3 z-20 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="h-1.5" style={{ backgroundColor: selectedHotel.color }} />
            <div className="p-4">
              <button
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ×
              </button>
              <div className="flex items-start gap-3 pr-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${selectedHotel.color}15`, color: selectedHotel.color }}
                >
                  {selectedHotel.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm leading-tight">
                    {selectedHotel.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{selectedHotel.walkingArea}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Resort-core hotel marker. Great for arrival-day routes, hotel-loop hunts, and no-ticket exploration planning.
              </p>
            </div>
          </div>
        </div>
      )}

      {pinpointMode && (
        <div className="absolute left-3 right-3 bottom-20 z-20 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Pinpoint Mode</p>
                <p className="text-xs text-slate-500 mt-1">
                  Zoom in until the map labels the exact object or venue, then tap the map to drop a calibration pin.
                </p>
              </div>
              <button
                onClick={() => {
                  setPinpointMode(false);
                  setCopyMessage('');
                }}
                className="text-xs font-semibold text-slate-400"
              >
                Done
              </button>
            </div>

            {selectedChallenge && (
              <div className="mt-3 rounded-xl bg-sky-50 border border-sky-200 px-3 py-2">
                <p className="text-xs font-semibold text-sky-700">Calibrating challenge</p>
                <p className="text-sm text-sky-900 mt-0.5">{selectedChallenge.title}</p>
              </div>
            )}

            {calibrationPoint ? (
              <div className="mt-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-3">
                  <label className="text-[11px] uppercase tracking-wide text-slate-400 block mb-1">
                    Save this pin for challenge
                  </label>
                  <select
                    value={activeCalibrationChallengeId}
                    onChange={(event) => {
                      const nextChallengeId = event.target.value;
                      setActiveCalibrationChallengeId(nextChallengeId);

                      const nextChallenge = challenges.find((challenge) => challenge.id === nextChallengeId);
                      if (nextChallenge) {
                        setCalibrationRadius(
                          drafts[nextChallengeId]?.searchRadius ?? nextChallenge.searchRadius,
                        );
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white"
                  >
                    <option value="">Select a challenge</option>
                    {filtered.map((challenge) => (
                      <option key={challenge.id} value={challenge.id}>
                        {challenge.title}
                      </option>
                    ))}
                  </select>
                  {activeCalibrationChallengeId && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <PinReadout
                        label="Current Lat"
                        value={
                          filtered.find((challenge) => challenge.id === activeCalibrationChallengeId)
                            ?.coordinates.lat.toFixed(6) ?? 'n/a'
                        }
                      />
                      <PinReadout
                        label="Current Lng"
                        value={
                          filtered.find((challenge) => challenge.id === activeCalibrationChallengeId)
                            ?.coordinates.lng.toFixed(6) ?? 'n/a'
                        }
                      />
                    </div>
                  )}
                  {activeCalibrationChallengeId && drafts[activeCalibrationChallengeId] && (
                    <p className="mt-2 text-xs text-slate-400">
                      Existing draft saved for this challenge. Saving again will replace it.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <PinReadout label="Lat" value={calibrationPoint.lat.toFixed(6)} />
                  <PinReadout label="Lng" value={calibrationPoint.lng.toFixed(6)} />
                  <PinReadout label="Zoom" value={calibrationPoint.zoom.toFixed(2)} />
                  <PinReadout label="Radius" value={`${calibrationRadius}m`} />
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <label className="text-[11px] uppercase tracking-wide text-slate-400 block mb-2">
                    Search radius
                  </label>
                  <input
                    type="range"
                    min={15}
                    max={120}
                    step={5}
                    value={calibrationRadius}
                    onChange={(event) => setCalibrationRadius(Number(event.target.value))}
                    className="w-full"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Tighter object pin</span>
                    <span>{calibrationRadius} meters</span>
                    <span>Broader area</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    onClick={copyCoordinates}
                    className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold"
                  >
                    Copy Coords
                  </button>
                  <button
                    onClick={copyJsonSnippet}
                    className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    Copy JSON Snippet
                  </button>
                  <button
                    onClick={saveCalibrationDraft}
                    disabled={!activeCalibrationChallengeId}
                    className="px-3 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => {
                      setCalibrationPoint(null);
                      setCopyMessage('');
                    }}
                    className="px-3 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold"
                  >
                    Clear Pin
                  </button>
                </div>

                {copyMessage && (
                  <p className="mt-2 text-xs text-emerald-600">{copyMessage}</p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-400">
                No calibration pin yet. Tap the exact spot on the map after zooming in.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Challenge count badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        {!selectedChallenge && !pinpointMode && (
          <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
            {filtered.length} challenge{filtered.length !== 1 ? 's' : ''} and {showHotels ? universalHotels.length : 0} hotel marker{showHotels && universalHotels.length !== 1 ? 's' : ''} visible
          </div>
        )}
      </div>
    </div>
  );
}

function PinReadout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
