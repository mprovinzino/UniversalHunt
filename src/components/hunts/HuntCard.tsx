import { Link } from 'react-router-dom';
import { Clock, MapPin, CheckCircle, Gift, Lock } from 'lucide-react';
import type { Hunt, HuntProgress } from '../../types';
import { getTheme } from '../../themes';

const scopeLabels: Record<string, { label: string; icon: string }> = {
  land: { label: 'Land', icon: '🏝️' },
  park: { label: 'Park', icon: '🎢' },
  'cross-park': { label: 'Both Parks', icon: '🌐' },
};

const difficultyColors: Record<string, string> = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
};

interface HuntCardProps {
  hunt: Hunt;
  huntProgress: HuntProgress;
  completedCount: number;
  locked?: boolean;
  lockedMessage?: string;
}

export default function HuntCard({
  hunt,
  huntProgress,
  completedCount,
  locked = false,
  lockedMessage,
}: HuntCardProps) {
  const theme = getTheme(hunt.theme);
  const totalChallenges = hunt.challengeIds.length;
  const allDone = completedCount >= totalChallenges;
  const isCompleted = huntProgress.status === 'completed' && huntProgress.bonusClaimed;
  const canClaimBonus = allDone && !huntProgress.bonusClaimed;
  const scope = scopeLabels[hunt.scope] ?? scopeLabels.park;

  const accentColor = locked ? '#94A3B8' : isCompleted ? '#10B981' : theme.primary;

  return (
    <Link
      to={locked ? '/hunts' : `/hunts/${hunt.id}`}
      className="block bg-white rounded-xl shadow-sm border border-slate-100
                 active:scale-[0.98] transition-transform overflow-hidden"
      onClick={(event) => {
        if (locked) event.preventDefault();
      }}
    >
      <div className="flex">
        {/* Themed left accent bar */}
        <div
          className="w-1.5 shrink-0 rounded-l-xl"
          style={{ backgroundColor: accentColor }}
        />

        <div className="flex-1 p-4">
          {/* Top row: icon + title + bonus badge */}
          <div className="flex items-start gap-3">
            {/* Hunt emoji in themed circle */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-lg"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              {hunt.icon}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 leading-tight">{hunt.title}</p>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{hunt.description}</p>
            </div>

            {/* Bonus badge */}
            {locked ? (
              <span className="shrink-0 text-xs font-bold rounded-full px-2.5 py-1 bg-slate-100 text-slate-500 flex items-center gap-1">
                <Lock size={12} />
                Locked
              </span>
            ) : canClaimBonus ? (
              <span className="shrink-0 text-xs font-bold rounded-full px-2.5 py-1 bg-amber-100 text-amber-700 animate-pulse">
                <Gift size={12} className="inline -mt-0.5 mr-0.5" />
                Claim!
              </span>
            ) : isCompleted ? (
              <span className="shrink-0 text-xs font-bold rounded-full px-2.5 py-1 bg-emerald-100 text-emerald-700">
                <CheckCircle size={12} className="inline -mt-0.5 mr-0.5" />
                Done
              </span>
            ) : (
              <span
                className="shrink-0 text-xs font-bold rounded-full px-2.5 py-1 text-white"
                style={{ backgroundColor: accentColor }}
              >
                +{hunt.bonusPoints}
              </span>
            )}
          </div>

          {/* Meta badges */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span
              className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
              style={{
                color: difficultyColors[hunt.difficulty],
                backgroundColor: `${difficultyColors[hunt.difficulty]}15`,
              }}
            >
              {hunt.difficulty}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <Clock size={10} />
              {hunt.estimatedTime}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              {scope.icon} {scope.label}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <MapPin size={10} />
              {totalChallenges} challenge{totalChallenges !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5">
            {locked && lockedMessage && (
              <p className="text-[10px] text-slate-400 mb-2">{lockedMessage}</p>
            )}
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-400 font-medium">
                {completedCount} of {totalChallenges} completed
              </span>
              {completedCount > 0 && (
                <span className="text-[10px] font-semibold" style={{ color: accentColor }}>
                  {Math.round((completedCount / totalChallenges) * 100)}%
                </span>
              )}
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(completedCount / totalChallenges) * 100}%`,
                  backgroundColor: accentColor,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
