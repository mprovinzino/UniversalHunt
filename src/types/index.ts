// ============================================
// Core types for the Universal Hunt app
// ============================================

/** Which park or public resort district a challenge belongs to */
export type Park = 'universal-studios' | 'islands-of-adventure' | 'citywalk' | 'volcano-bay';

/** Themed land within a park */
export type Land =
  | 'wizarding-world'
  | 'jurassic-park'
  | 'marvel'
  | 'springfield'
  | 'seuss-landing'
  | 'skull-island'
  | 'lost-continent'
  | 'new-york'
  | 'hollywood'
  | 'san-francisco'
  | 'production-central'
  | 'kid-zone'
  | 'citywalk'
  | 'central-lagoon'
  | 'volcano-bay';

/** Visual theme key — maps to color palettes in our theme system */
export type ThemeKey =
  | 'wizarding'
  | 'jurassic'
  | 'marvel'
  | 'springfield'
  | 'citywalk'
  | 'default';

/** How hard a challenge is */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** What kind of challenge it is */
export type ChallengeType = 'find' | 'photo' | 'interact' | 'timed';

/** GPS coordinates */
export interface Coordinates {
  lat: number;
  lng: number;
}

/** Whether content is live, hidden for authoring, or retired */
export type PublishStatus = 'active' | 'draft' | 'retired';

/** Future-proofed verification hints for challenge completion */
export interface ChallengeVerification {
  photo?: boolean;
  location?: boolean;
  castInteraction?: boolean;
  timer?: boolean;
}

/** Authoring metadata for operational or seasonal availability */
export interface ChallengeAvailability {
  mayBeUnavailable?: boolean;
  weatherSensitive?: boolean;
  availabilityNote?: string;
}

/** A single scavenger hunt challenge */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  park: Park;
  land: Land;
  coordinates: Coordinates;
  points: number;
  difficulty: Difficulty;
  type: ChallengeType;
  theme: ThemeKey;
  hint: string;
  clues: string[];
  photoRequired: boolean;
  searchRadius: number;
  estimatedTime: string;
  tags: string[];
  maxStars: number;
  status?: PublishStatus;
  featured?: boolean;
  prerequisiteChallengeIds?: string[];
  verification?: ChallengeVerification;
  availability?: ChallengeAvailability;
}

// ============================================
// Progress tracking types
// ============================================

/** Star rating: 0 = not attempted, 1-3 = how well they did */
export type CompletionRating = 0 | 1 | 2 | 3;

export interface ChallengeVerificationProgress {
  locationVerifiedAt?: string;
  photoConfirmedAt?: string;
}

/** Progress on a single challenge */
export interface ChallengeProgress {
  challengeId: string;
  status: 'not-attempted' | 'in-progress' | 'completed';
  stars: CompletionRating;
  hintsUsed: number;
  completedAt?: string;
  verification?: ChallengeVerificationProgress;
}

/** The user's full profile stored in localStorage */
export interface UserProfile {
  displayName: string;
  totalPoints: number;
  level: number;
  levelTitle: string;
  challengeProgress: Record<string, ChallengeProgress>;
  huntProgress: Record<string, HuntProgress>;
  createdAt: string;
}

// ============================================
// Hunt types — curated scavenger hunts
// ============================================

/** How wide a hunt's scope is */
export type HuntScope = 'land' | 'park' | 'cross-park';

/** A curated scavenger hunt — a collection of challenges */
export interface Hunt {
  id: string;
  title: string;
  description: string;
  scope: HuntScope;
  difficulty: Difficulty;
  theme: ThemeKey;
  parks: Park[];
  lands: Land[];
  challengeIds: string[];
  estimatedTime: string;
  bonusPoints: number;
  icon: string;
  sortOrder: number;
  status?: PublishStatus;
  featured?: boolean;
  unlockChallengeIds?: string[];
}

/** Tracks a user's progress on a specific hunt */
export interface HuntProgress {
  huntId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
  bonusClaimed: boolean;
}
