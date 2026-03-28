import { useState } from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHunts } from '../hooks/useHunts';
import { useProgressContext } from '../hooks/useProgressContext';
import HuntCard from '../components/hunts/HuntCard';
import type { Difficulty } from '../types';
import { getMissingHuntUnlocks, isHuntUnlocked } from '../lib/unlocks';

const difficultyFilters: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export default function Hunts() {
  const hunts = useHunts();
  const { getProgress, getHuntProgress } = useProgressContext();
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'all'>('all');

  const filtered =
    activeDifficulty === 'all'
      ? hunts
      : hunts.filter((h) => h.difficulty === activeDifficulty);

  return (
    <div className="flex-1 px-4 pt-6 pb-24 animate-fade-in">
      <h1 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Compass size={22} className="text-blue-600" />
        Scavenger Hunts
      </h1>

      {/* Difficulty filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-1">
        {difficultyFilters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveDifficulty(value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap
                       transition-all active:scale-95 ${
                         activeDifficulty === value
                           ? 'bg-slate-800 text-white shadow-sm'
                           : 'bg-white text-slate-500 border border-slate-200'
                       }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-slate-400 mt-3 mb-3">
        Showing {filtered.length} of {hunts.length} hunts
      </p>

      {/* Hunt cards */}
      <div className="space-y-3">
        {filtered.map((hunt) => {
          const completedCount = hunt.challengeIds.filter(
            (cid) => getProgress(cid).status === 'completed',
          ).length;
          const locked = !isHuntUnlocked(hunt, getProgress);
          const missing = getMissingHuntUnlocks(hunt, getProgress);

          return (
            <HuntCard
              key={hunt.id}
              hunt={hunt}
              huntProgress={getHuntProgress(hunt.id)}
              completedCount={completedCount}
              locked={locked}
              lockedMessage={locked ? `Unlock by completing: ${missing.join(', ')}` : undefined}
            />
          );
        })}
      </div>

      {/* Browse all challenges link */}
      <div className="mt-6 text-center">
        <Link
          to="/challenges"
          className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-2"
        >
          Browse all individual challenges →
        </Link>
      </div>
    </div>
  );
}
