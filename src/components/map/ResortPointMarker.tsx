import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { ResortHotel } from '../../data/resort';

interface ResortPointMarkerProps {
  map: mapboxgl.Map;
  point: ResortHotel;
  onClick: (point: ResortHotel) => void;
}

export default function ResortPointMarker({ map, point, onClick }: ResortPointMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'resort-point-marker';
    el.style.width = '34px';
    el.style.height = '34px';
    el.style.borderRadius = '999px';
    el.style.border = '2px solid white';
    el.style.background = point.color;
    el.style.color = 'white';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.fontSize = '16px';
    el.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.2)';
    el.textContent = point.icon;

    el.addEventListener('click', (event) => {
      event.stopPropagation();
      onClick(point);
    });

    const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([point.coordinates.lng, point.coordinates.lat])
      .addTo(map);

    markerRef.current = marker;

    return () => {
      marker.remove();
    };
  }, [map, onClick, point]);

  return null;
}
