import { useMemo } from 'react';
import { hunts } from '../content';
import type { Hunt } from '../types';

/**
 * Returns all hunts loaded from the static JSON file,
 * sorted by sortOrder for consistent display.
 */
export function useHunts(): Hunt[] {
  return useMemo(() => hunts, []);
}
