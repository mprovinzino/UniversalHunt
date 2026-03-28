import type { Park } from '../types';

export interface ParkMeta {
  id: Park;
  name: string;
  abbreviation: string;
  color: string;
}

export const parks: ParkMeta[] = [
  { id: 'universal-studios',      name: 'Universal Studios',      abbreviation: 'US', color: '#1565C0' },
  { id: 'islands-of-adventure',   name: 'Islands of Adventure',   abbreviation: 'IA', color: '#6A1B9A' },
  { id: 'citywalk',               name: 'CityWalk',               abbreviation: 'CW', color: '#0F766E' },
  { id: 'volcano-bay',            name: 'Volcano Bay',            abbreviation: 'VB', color: '#E65100' },
];
