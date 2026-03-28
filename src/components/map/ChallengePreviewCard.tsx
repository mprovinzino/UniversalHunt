import { useNavigate } from 'react-router-dom';
import { X, Search, Camera, MousePointerClick, Timer, ChevronRight, Star } from 'lucide-react';
import type { Challenge, ChallengeProgress } from '../../types';
import { getTheme } from '../../themes';

const typeConfig: Record<string, { Icon: typeof Search; label: string }> = {
  find: { Icon: Search, label: 'Find' },
  photo: { Icon: Camera, label: 'Photo' },
  interact: { Icon: MousePointerClick, label: 'Interact' },
  timed: { Icon: Timer, label: 'Timed' },
};

const difficultyColors: Record<string, string> = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
};

interface ChallengePreviewCardProps {
  challenge: Challenge;
  progress: ChallengeProgress;
  onClose: () => void;
}

export default function ChallengePreviewCard({
  challenge,
  progress,
  onClose,
}: ChallengePreviewCardProps) {
  const navigate = useNavigate();
  const theme = getTheme(challenge.theme);
  const { Icon: TypeIcon, label: typeLabel } = typeConfig[challenge.type] ?? typeConfig.find;
  const isCompleted = progress.status === 'completed';

  return (
    <div className="absolute bottom-20 left-3 right-3 z-20 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Top color bar */}
        <div className="h-1.5" style={{ backgroundColor: theme.primary }} />

        <div className="p-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
          >
            <X size={16} className="text-slate-500" />
          </button>

          {/* Title + type */}
          <div className="flex items-start gap-3 pr-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${theme.primary}15` }}
            >
              <TypeIcon size={20} color={theme.primary} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm leading-tight truncate">
                {challenge.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                  style={{
                    color: difficultyColors[challenge.difficulty],
                    backgroundColor: `${difficultyColors[challenge.difficulty]}15`,
                  }}
                >
                  {challenge.difficulty}
                </span>
                <span className="text-[10px] text-slate-400">{typeLabel}</span>
                <span className="text-[10px] text-slate-400">&middot;</span>
                <span className="text-[10px] font-medium text-amber-500">
                  {challenge.points} pts
                </span>
              </div>
            </div>
          </div>

          {/* Status + action */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            {/* Status badge */}
            {isCompleted ? (
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= progress.stars ? 'text-amber-400' : 'text-slate-200'}
                      fill={s <= progress.stars ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-xs text-emerald-600 font-medium ml-1">Completed</span>
              </div>
            ) : progress.status === 'in-progress' ? (
              <span className="text-xs text-blue-600 font-medium">In Progress</span>
            ) : (
              <span className="text-xs text-slate-400">Not started</span>
            )}

            {/* View details button */}
            <button
              onClick={() => navigate(`/challenges/${challenge.id}`)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-white
                         active:scale-95 transition-transform"
              style={{ backgroundColor: theme.primary }}
            >
              View Details
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
