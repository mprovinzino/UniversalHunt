import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Challenge, ChallengeProgress } from '../../types';
import { getTheme } from '../../themes';

/** Icon SVG per challenge type — simple inline for perf */
const typeIcons: Record<string, string> = {
  find: `<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  photo: `<rect x="4" y="7" width="16" height="12" rx="2" stroke="white" stroke-width="2" fill="none"/><circle cx="12" cy="13" r="3" stroke="white" stroke-width="2" fill="none"/>`,
  interact: `<path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  timed: `<circle cx="12" cy="12" r="9" stroke="white" stroke-width="2" fill="none"/><path d="M12 7v5l3 3" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>`,
};

/** Checkmark SVG for completed challenges */
const checkSvg = `<circle cx="12" cy="12" r="9" fill="white"/><path d="M8 12l3 3 5-5" stroke="#10B981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

interface ChallengeMarkerProps {
  map: mapboxgl.Map;
  challenge: Challenge;
  progress: ChallengeProgress;
  onClick: (challenge: Challenge) => void;
}

export default function ChallengeMarker({
  map,
  challenge,
  progress,
  onClick,
}: ChallengeMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    const theme = getTheme(challenge.theme);
    const isCompleted = progress.status === 'completed';
    const color = isCompleted ? '#10B981' : theme.primary;
    const iconSvg = isCompleted
      ? checkSvg
      : typeIcons[challenge.type] || typeIcons.find;

    // Build the marker HTML
    const el = document.createElement('div');
    el.className = 'challenge-marker';
    el.style.cursor = 'pointer';
    el.innerHTML = `
      <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 42C18 42 33 27 33 16C33 7.716 26.284 1 18 1C9.716 1 3 7.716 3 16C3 27 18 42 18 42Z"
              fill="${color}" stroke="white" stroke-width="2"/>
        <g transform="translate(6 4)">
          <svg width="24" height="24" viewBox="0 0 24 24">${iconSvg}</svg>
        </g>
      </svg>
    `;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick(challenge);
    });

    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([challenge.coordinates.lng, challenge.coordinates.lat])
      .addTo(map);

    markerRef.current = marker;

    return () => {
      marker.remove();
    };
  }, [map, challenge, progress, onClick]);

  return null;
}
