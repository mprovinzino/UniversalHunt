import studioChallenges from './challenges/universal-studios.json';
import ioaChallenges from './challenges/islands-of-adventure.json';
import citywalkChallenges from './challenges/citywalk.json';
import studioHunts from './hunts/universal-studios.json';
import citywalkHunts from './hunts/citywalk.json';
import ioaHunts from './hunts/islands-of-adventure.json';
import resortHunts from './hunts/resort.json';
import type { Challenge, Hunt, PublishStatus } from '../types';

function getStatus(status?: PublishStatus): PublishStatus {
  return status ?? 'active';
}

function validateUniqueIds<T extends { id: string }>(items: T[], label: string) {
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.id)) {
      throw new Error(`Duplicate ${label} id found: ${item.id}`);
    }
    seen.add(item.id);
  }
}

function validateHuntReferences(huntsToValidate: Hunt[], challengesToValidate: Challenge[]) {
  const challengeIds = new Set(challengesToValidate.map((challenge) => challenge.id));

  for (const hunt of huntsToValidate) {
    for (const challengeId of hunt.challengeIds) {
      if (!challengeIds.has(challengeId)) {
        throw new Error(`Hunt "${hunt.id}" references missing challenge "${challengeId}"`);
      }
    }
  }
}

function sortByOrder<T extends { sortOrder?: number; title: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    if ((a.sortOrder ?? 0) !== (b.sortOrder ?? 0)) {
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    }
    return a.title.localeCompare(b.title);
  });
}

const allChallenges = [
  ...(studioChallenges as Challenge[]),
  ...(ioaChallenges as Challenge[]),
  ...(citywalkChallenges as Challenge[]),
];
const allHunts = [
  ...(studioHunts as Hunt[]),
  ...(citywalkHunts as Hunt[]),
  ...(ioaHunts as Hunt[]),
  ...(resortHunts as Hunt[]),
];

validateUniqueIds(allChallenges, 'challenge');
validateUniqueIds(allHunts, 'hunt');
validateHuntReferences(allHunts, allChallenges);

export const challenges = allChallenges.filter((challenge) => getStatus(challenge.status) === 'active');
export const hunts = sortByOrder(
  allHunts.filter((hunt) => getStatus(hunt.status) === 'active'),
);

export const featuredChallenges = challenges.filter((challenge) => challenge.featured);
export const featuredHunts = hunts.filter((hunt) => hunt.featured);

export const challengeById = Object.fromEntries(
  challenges.map((challenge) => [challenge.id, challenge]),
) as Record<string, Challenge>;

export const huntById = Object.fromEntries(
  hunts.map((hunt) => [hunt.id, hunt]),
) as Record<string, Hunt>;
