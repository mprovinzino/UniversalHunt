// ============================================
// Park land theme system
// ============================================
// Each park land has its own color palette so the
// app "feels" like you're in that part of the park.
// We keep it simple: a primary color, a secondary,
// a background tint, matching text color, and an accent.
// ============================================

import type { ThemeKey } from '../types';

export interface ParkTheme {
  /** Human-readable name like "Wizarding World" */
  name: string;
  /** Main brand color for buttons, headers, etc. */
  primary: string;
  /** Supporting color for badges, borders, etc. */
  secondary: string;
  /** Light background tint for cards/pages */
  background: string;
  /** Darker text-safe version of the primary */
  text: string;
  /** Bright pop color for highlights & notifications */
  accent: string;
  /** Emoji icon for quick recognition */
  icon: string;
}

/**
 * Every theme in the app. The key matches the `theme` field
 * on each challenge in challenges.json.
 */
export const themes: Record<ThemeKey, ParkTheme> = {
  wizarding: {
    name: 'Wizarding World',
    primary: '#5B2C8E',    // deep purple
    secondary: '#C9A84C',  // gold
    background: '#F5F0FF', // soft lavender
    text: '#3B1A5E',       // dark purple
    accent: '#E8C547',     // bright gold
    icon: '🧙',
  },
  jurassic: {
    name: 'Jurassic Park',
    primary: '#1B5E20',    // forest green
    secondary: '#F9A825',  // amber
    background: '#F1F8E9', // pale green
    text: '#1B3A1B',       // dark green
    accent: '#FF8F00',     // deep amber
    icon: '🦖',
  },
  marvel: {
    name: 'Marvel Super Hero Island',
    primary: '#B71C1C',    // bold red
    secondary: '#1565C0',  // hero blue
    background: '#FFF3F0', // soft red tint
    text: '#7F1010',       // dark red
    accent: '#2196F3',     // bright blue
    icon: '🦸',
  },
  springfield: {
    name: 'Springfield',
    primary: '#F9A825',    // Simpsons yellow
    secondary: '#1E88E5',  // sky blue
    background: '#FFFDE7', // pale yellow
    text: '#5D4037',       // brown (readable on yellow)
    accent: '#FF6F00',     // Simpsons orange
    icon: '🍩',
  },
  citywalk: {
    name: 'CityWalk',
    primary: '#0F766E',    // teal neon
    secondary: '#F97316',  // orange glow
    background: '#ECFEFF', // pale aqua
    text: '#134E4A',       // dark teal
    accent: '#06B6D4',     // cyan
    icon: '🌴',
  },
  default: {
    name: 'Universal Orlando',
    primary: '#1565C0',    // Universal blue
    secondary: '#6A1B9A',  // purple accent
    background: '#F8FAFC', // neutral light
    text: '#1E293B',       // slate dark
    accent: '#0D47A1',     // deep blue
    icon: '🎢',
  },
};

/** Helper: get a theme by key, falls back to "default" if key is unknown */
export function getTheme(key: ThemeKey): ParkTheme {
  return themes[key] ?? themes.default;
}
