import type { ThemeKey } from '../types';

export interface Level {
  level: number;
  title: string;
  minPoints: number;
  theme: ThemeKey;
}

export const levels: Level[] = [
  { level: 1, title: 'Rookie Explorer',    minPoints: 0,    theme: 'default' },
  { level: 2, title: 'Park Wanderer',      minPoints: 50,   theme: 'default' },
  { level: 3, title: 'Competent Scout',    minPoints: 150,  theme: 'default' },
  { level: 4, title: 'Seasoned Hunter',    minPoints: 300,  theme: 'jurassic' },
  { level: 5, title: 'Park Ranger',        minPoints: 500,  theme: 'marvel' },
  { level: 6, title: 'Island Legend',       minPoints: 800,  theme: 'wizarding' },
  { level: 7, title: 'Universal Master',   minPoints: 1200, theme: 'wizarding' },
];

/** Given a point total, return the matching level */
export function getLevelForPoints(points: number): Level {
  // Walk backwards through the levels to find the highest one the user qualifies for
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].minPoints) return levels[i];
  }
  return levels[0];
}

/** How many points until the next level? Returns null if max level. */
export function pointsToNextLevel(points: number): { next: Level; remaining: number } | null {
  const current = getLevelForPoints(points);
  const nextIdx = levels.findIndex((l) => l.level === current.level) + 1;
  if (nextIdx >= levels.length) return null;
  const next = levels[nextIdx];
  return { next, remaining: next.minPoints - points };
}
