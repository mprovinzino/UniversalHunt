import { useMemo } from 'react';
import { challenges } from '../content';
import type { Challenge } from '../types';

/**
 * Returns all challenges loaded from the static JSON file.
 * Later this could fetch from an API — for now it's bundled data.
 */
export function useChallenges(): Challenge[] {
  return useMemo(() => challenges, []);
}
