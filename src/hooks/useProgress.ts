import { useState, useCallback } from 'react';
import type { UserProfile, ChallengeProgress, CompletionRating, HuntProgress } from '../types';
import { getLevelForPoints } from '../data/levels';

const STORAGE_KEY = 'universal-hunt-progress';

function getDefaultProfile(): UserProfile {
  const level = getLevelForPoints(0);
  return {
    displayName: 'Explorer',
    totalPoints: 0,
    level: level.level,
    levelTitle: level.title,
    challengeProgress: {},
    huntProgress: {},
    createdAt: new Date().toISOString(),
  };
}

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UserProfile;
      // Migration: ensure huntProgress exists for users from before hunts feature
      if (!parsed.huntProgress) parsed.huntProgress = {};
      return parsed;
    }
  } catch {
    // corrupted data — start fresh
  }
  return getDefaultProfile();
}

function saveProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/**
 * Hook that manages the user's progress.
 * Reads from and writes to localStorage so progress survives page refreshes.
 */
export function useProgress() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);

  const persist = useCallback((updater: (prev: UserProfile) => UserProfile) => {
    setProfile((prev) => {
      const updated = updater(prev);
      // Recalculate level from points
      const level = getLevelForPoints(updated.totalPoints);
      const next = {
        ...updated,
        level: level.level,
        levelTitle: level.title,
      };
      saveProfile(next);
      return next;
    });
  }, []);

  /** Get progress for a single challenge */
  const getProgress = useCallback(
    (challengeId: string): ChallengeProgress => {
      return (
        profile.challengeProgress[challengeId] ?? {
          challengeId,
          status: 'not-attempted',
          stars: 0,
          hintsUsed: 0,
          verification: {},
        }
      );
    },
    [profile],
  );

  /** Mark a challenge as in-progress */
  const markInProgress = useCallback(
    (challengeId: string) => {
      persist((prev) => {
        const existing = prev.challengeProgress[challengeId];
        // Don't downgrade from completed
        if (existing?.status === 'completed') return prev;
        return {
          ...prev,
          challengeProgress: {
            ...prev.challengeProgress,
            [challengeId]: {
              ...(existing ?? {
                challengeId,
                stars: 0 as CompletionRating,
                hintsUsed: 0,
                verification: {},
              }),
              challengeId,
              status: 'in-progress',
              verification: existing?.verification ?? {},
            },
          },
        };
      });
    },
    [persist],
  );

  /** Mark a challenge as completed with a star rating, and award points */
  const markCompleted = useCallback(
    (challengeId: string, stars: CompletionRating, pointsEarned: number) => {
      persist((prev) => {
        const existing = prev.challengeProgress[challengeId];
        const alreadyCompleted = existing?.status === 'completed';
        // Only award points if not already completed
        const pointsDelta = alreadyCompleted ? 0 : pointsEarned;
        return {
          ...prev,
          totalPoints: prev.totalPoints + pointsDelta,
          challengeProgress: {
            ...prev.challengeProgress,
            [challengeId]: {
              challengeId,
              status: 'completed',
              stars: alreadyCompleted
                ? (Math.max(existing.stars, stars) as CompletionRating)
                : stars,
              hintsUsed: existing?.hintsUsed ?? 0,
              completedAt: new Date().toISOString(),
              verification: existing?.verification ?? {},
            },
          },
        };
      });
    },
    [persist],
  );

  /** Record that a hint was used */
  const revealHint = useCallback(
    (challengeId: string) => {
      persist((prev) => {
        const existing = prev.challengeProgress[challengeId] ?? {
          challengeId,
          status: 'in-progress' as const,
          stars: 0 as CompletionRating,
          hintsUsed: 0,
          verification: {},
        };
        return {
          ...prev,
          challengeProgress: {
            ...prev.challengeProgress,
            [challengeId]: {
              ...existing,
              status: existing.status === 'not-attempted' ? 'in-progress' : existing.status,
              hintsUsed: existing.hintsUsed + 1,
              verification: existing.verification ?? {},
            },
          },
        };
      });
    },
    [persist],
  );

  /** Record that the user has verified their current location */
  const verifyLocation = useCallback(
    (challengeId: string) => {
      persist((prev) => {
        const existing = prev.challengeProgress[challengeId] ?? {
          challengeId,
          status: 'in-progress' as const,
          stars: 0 as CompletionRating,
          hintsUsed: 0,
          verification: {},
        };

        return {
          ...prev,
          challengeProgress: {
            ...prev.challengeProgress,
            [challengeId]: {
              ...existing,
              status: existing.status === 'not-attempted' ? 'in-progress' : existing.status,
              verification: {
                ...existing.verification,
                locationVerifiedAt: new Date().toISOString(),
              },
            },
          },
        };
      });
    },
    [persist],
  );

  /** Record that the user confirmed the required photo step */
  const confirmPhoto = useCallback(
    (challengeId: string, confirmed: boolean) => {
      persist((prev) => {
        const existing = prev.challengeProgress[challengeId] ?? {
          challengeId,
          status: 'in-progress' as const,
          stars: 0 as CompletionRating,
          hintsUsed: 0,
          verification: {},
        };

        return {
          ...prev,
          challengeProgress: {
            ...prev.challengeProgress,
            [challengeId]: {
              ...existing,
              status: existing.status === 'not-attempted' ? 'in-progress' : existing.status,
              verification: {
                ...existing.verification,
                photoConfirmedAt: confirmed ? new Date().toISOString() : undefined,
              },
            },
          },
        };
      });
    },
    [persist],
  );

  /** Update the display name */
  const setDisplayName = useCallback(
    (name: string) => {
      persist((prev) => ({ ...prev, displayName: name }));
    },
    [persist],
  );

  // ── Hunt progress methods ─────────────────────────

  /** Get progress for a specific hunt */
  const getHuntProgress = useCallback(
    (huntId: string): HuntProgress => {
      return (
        profile.huntProgress[huntId] ?? {
          huntId,
          status: 'not-started',
          bonusClaimed: false,
        }
      );
    },
    [profile],
  );

  /** Mark a hunt as started (in-progress) */
  const startHunt = useCallback(
    (huntId: string) => {
      persist((prev) => {
        const existing = prev.huntProgress[huntId];
        // Don't downgrade from completed
        if (existing?.status === 'completed') return prev;
        return {
          ...prev,
          huntProgress: {
            ...prev.huntProgress,
            [huntId]: {
              ...(existing ?? { huntId, bonusClaimed: false }),
              huntId,
              status: 'in-progress' as const,
              startedAt: existing?.startedAt ?? new Date().toISOString(),
            },
          },
        };
      });
    },
    [persist],
  );

  /** Claim the bonus for completing all challenges in a hunt */
  const claimHuntBonus = useCallback(
    (huntId: string, bonusPoints: number) => {
      persist((prev) => {
        const existing = prev.huntProgress[huntId];
        // Don't double-claim
        if (existing?.bonusClaimed) return prev;
        return {
          ...prev,
          totalPoints: prev.totalPoints + bonusPoints,
          huntProgress: {
            ...prev.huntProgress,
            [huntId]: {
              huntId,
              status: 'completed' as const,
              startedAt: existing?.startedAt ?? new Date().toISOString(),
              completedAt: new Date().toISOString(),
              bonusClaimed: true,
            },
          },
        };
      });
    },
    [persist],
  );

  /** Reset all progress — use with confirmation! */
  const resetAll = useCallback(() => {
    const fresh = getDefaultProfile();
    saveProfile(fresh);
    setProfile(fresh);
  }, []);

  return {
    profile,
    getProgress,
    markInProgress,
    markCompleted,
    revealHint,
    verifyLocation,
    confirmPhoto,
    setDisplayName,
    getHuntProgress,
    startHunt,
    claimHuntBonus,
    resetAll,
  };
}
