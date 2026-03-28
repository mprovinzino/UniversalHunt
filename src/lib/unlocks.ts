import type { Challenge, Hunt, ChallengeProgress } from '../types';

type ProgressLookup = (challengeId: string) => ChallengeProgress;

export function getMissingChallengePrerequisites(
  challenge: Challenge,
  getProgress: ProgressLookup,
): string[] {
  return (challenge.prerequisiteChallengeIds ?? []).filter(
    (challengeId) => getProgress(challengeId).status !== 'completed',
  );
}

export function isChallengeUnlocked(challenge: Challenge, getProgress: ProgressLookup) {
  return getMissingChallengePrerequisites(challenge, getProgress).length === 0;
}

export function getMissingHuntUnlocks(hunt: Hunt, getProgress: ProgressLookup): string[] {
  return (hunt.unlockChallengeIds ?? []).filter(
    (challengeId) => getProgress(challengeId).status !== 'completed',
  );
}

export function isHuntUnlocked(hunt: Hunt, getProgress: ProgressLookup) {
  return getMissingHuntUnlocks(hunt, getProgress).length === 0;
}
