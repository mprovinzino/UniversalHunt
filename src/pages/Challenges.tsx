import { useState } from 'react';
import { Crosshair } from 'lucide-react';
import { useChallenges } from '../hooks/useChallenges';
import { useProgressContext } from '../hooks/useProgressContext';
import ChallengeCard from '../components/challenges/ChallengeCard';
import ParkFilterPills from '../components/ui/ParkFilterPills';
import type { Park } from '../types';
import { getMissingChallengePrerequisites, isChallengeUnlocked } from '../lib/unlocks';

export default function Challenges() {
  const challenges = useChallenges();
  const { getProgress } = useProgressContext();
  const [activePark, setActivePark] = useState<Park | 'all'>('all');

  const filtered =
    activePark === 'all'
      ? challenges
      : challenges.filter((c) => c.park === activePark);

  return (
    <div className="flex-1 px-4 pt-6 pb-24 animate-fade-in">
      <h1 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Crosshair size={22} className="text-blue-600" />
        All Challenges
      </h1>

      {/* Park filter pills */}
      <ParkFilterPills activePark={activePark} onSelect={setActivePark} />

      {/* Filtered count */}
      <p className="text-xs text-slate-400 mt-3 mb-3">
        Showing {filtered.length} of {challenges.length} challenges
      </p>

      {/* Challenge list */}
      <div className="space-y-3">
        {filtered.map((c) => (
          (() => {
            const locked = !isChallengeUnlocked(c, getProgress);
            const missing = getMissingChallengePrerequisites(c, getProgress);
            return (
          <ChallengeCard
            key={c.id}
            challenge={c}
            progress={getProgress(c.id)}
            locked={locked}
            lockedMessage={
              locked ? `Complete first: ${missing.join(', ')}` : undefined
            }
          />
            );
          })()
        ))}
      </div>
    </div>
  );
}
