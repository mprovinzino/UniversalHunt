import type { Coordinates, Park } from '../types';

export interface ResortDistrict {
  id: string;
  name: string;
  shortName: string;
  description: string;
  park: Park;
  coordinates: Coordinates;
  color: string;
  icon: string;
}

export interface ResortHotel {
  id: string;
  name: string;
  category: 'hotel';
  coordinates: Coordinates;
  walkingArea: string;
  color: string;
  icon: string;
}

export const resortDistricts: ResortDistrict[] = [
  {
    id: 'district-usf',
    name: 'Universal Studios Florida',
    shortName: 'USF',
    description: 'Movie moments, wizarding alleyways, and classic studio streets.',
    park: 'universal-studios',
    coordinates: { lat: 28.4748, lng: -81.4677 },
    color: '#1565C0',
    icon: '🎬',
  },
  {
    id: 'district-ioa',
    name: 'Islands of Adventure',
    shortName: 'IOA',
    description: 'Mythic islands, coasters, heroes, and prehistoric encounters.',
    park: 'islands-of-adventure',
    coordinates: { lat: 28.4716, lng: -81.4716 },
    color: '#6A1B9A',
    icon: '🌀',
  },
  {
    id: 'district-citywalk',
    name: 'CityWalk',
    shortName: 'CW',
    description: 'The public access spine of the resort with shops, dining, and entry approaches.',
    park: 'citywalk',
    coordinates: { lat: 28.4736, lng: -81.4692 },
    color: '#0F766E',
    icon: '🌴',
  },
  {
    id: 'district-lagoon',
    name: 'Central Lagoon',
    shortName: 'Lagoon',
    description: 'The waterfront zone linking the parks, CityWalk, and resort-core hotel loop.',
    park: 'citywalk',
    coordinates: { lat: 28.4732, lng: -81.4728 },
    color: '#0891B2',
    icon: '🌊',
  },
];

export const universalHotels: ResortHotel[] = [
  {
    id: 'hotel-hard-rock',
    name: 'Hard Rock Hotel',
    category: 'hotel',
    coordinates: { lat: 28.4769, lng: -81.4733 },
    walkingArea: 'Northwest resort loop',
    color: '#DC2626',
    icon: '🏨',
  },
  {
    id: 'hotel-portofino',
    name: 'Loews Portofino Bay Hotel',
    category: 'hotel',
    coordinates: { lat: 28.4804, lng: -81.4745 },
    walkingArea: 'West lagoon edge',
    color: '#1D4ED8',
    icon: '🏨',
  },
  {
    id: 'hotel-royal-pacific',
    name: 'Loews Royal Pacific Resort',
    category: 'hotel',
    coordinates: { lat: 28.4757, lng: -81.4687 },
    walkingArea: 'North lagoon edge',
    color: '#7C3AED',
    icon: '🏨',
  },
  {
    id: 'hotel-sapphire-falls',
    name: 'Loews Sapphire Falls Resort',
    category: 'hotel',
    coordinates: { lat: 28.4668, lng: -81.4662 },
    walkingArea: 'South lagoon edge',
    color: '#0369A1',
    icon: '🏨',
  },
  {
    id: 'hotel-aventura',
    name: 'Universal Aventura Hotel',
    category: 'hotel',
    coordinates: { lat: 28.4650, lng: -81.4637 },
    walkingArea: 'South resort core',
    color: '#0F766E',
    icon: '🏨',
  },
  {
    id: 'hotel-cabana-bay',
    name: 'Universal Cabana Bay Beach Resort',
    category: 'hotel',
    coordinates: { lat: 28.4643, lng: -81.4608 },
    walkingArea: 'South resort core',
    color: '#EA580C',
    icon: '🏨',
  },
];
