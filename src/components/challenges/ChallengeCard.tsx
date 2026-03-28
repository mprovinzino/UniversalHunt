import { Link } from 'react-router-dom';
import { Search, Camera, MousePointerClick, Timer, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Challenge, ChallengeType, ChallengeProgress } from '../../types';
import { getTheme } from '../../themes';
import StarRating from './StarRating';

const typeIcons: Record<ChallengeType, LucideIcon> = {
  find: Search,
  photo: Camera,
  interact: MousePointerClick,
  timed: Timer,
};

const typeLabels: Record<ChallengeType, string> = {
  find: 'Find',
  photo: 'Photo',
  interact: 'Interact',
  timed: 'Timed',
};

interface ChallengeCardProps {
  challenge: Challenge;
  progress: ChallengeProgress;
  locked?: boolean;
  lockedMessage?: string;
}

export default function ChallengeCard({
  challenge,
  progress,
  locked = false,
  lockedMessage,
}: ChallengeCardProps) {
  const theme = getTheme(challenge.theme);
  const TypeIcon = typeIcons[challenge.type];
  const isCompleted = progress.status === 'completed';

  return (
    <Link
      to={locked ? '/challenges' : `/challenges/${challenge.id}`}
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
          style={{ backgroundColor: theme.primary }}
        />

        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {/* Type icon in themed circle */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${theme.primary}15` }}
              >
                <TypeIcon size={20} color={theme.primary} strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 leading-tight">
                  {challenge.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">
                  {theme.name} &middot; {typeLabels[challenge.type]}
                </p>

                {/* Progress status */}
                <div className="flex items-center gap-2 mt-2">
                  {locked ? (
                    <>
                      <Lock size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-500 truncate">
                        {lockedMessage ?? 'Locked'}
                      </span>
                    </>
                  ) : (
                    <>
                      <StarRating stars={progress.stars} color={theme.primary} size={14} />
                      <span className="text-xs text-slate-500">
                        {isCompleted
                          ? 'Completed'
                          : progress.status === 'in-progress'
                            ? 'In progress'
                            : 'Not attempted'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Points badge */}
            <span
              className="ml-3 shrink-0 text-sm font-bold rounded-full px-2.5 py-1 text-white"
              style={{ backgroundColor: locked ? '#94A3B8' : isCompleted ? '#16A34A' : theme.primary }}
            >
              {challenge.points} pts
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
