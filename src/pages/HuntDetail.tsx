import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Gift, Search, Camera,
  MousePointerClick, Timer, CheckCircle2, Trophy, Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useHunts } from '../hooks/useHunts';
import { useChallenges } from '../hooks/useChallenges';
import { useProgressContext } from '../hooks/useProgressContext';
import { getTheme } from '../themes';
import type { ChallengeType } from '../types';
import { getMissingChallengePrerequisites, getMissingHuntUnlocks, isChallengeUnlocked, isHuntUnlocked } from '../lib/unlocks';

const typeIcons: Record<ChallengeType, LucideIcon> = {
  find: Search,
  photo: Camera,
  interact: MousePointerClick,
  timed: Timer,
};

const scopeLabels: Record<string, string> = {
  land: '🏝️ Land Hunt',
  park: '🎢 Park Hunt',
  'cross-park': '🌐 Both Parks',
};

export default function HuntDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hunts = useHunts();
  const allChallenges = useChallenges();
  const {
    getProgress, getHuntProgress, startHunt, claimHuntBonus, markInProgress,
  } = useProgressContext();

  const hunt = hunts.find((h) => h.id === id);
  if (!hunt) {
    return (
      <div className="flex-1 flex items-center justify-center pb-24">
        <p className="text-slate-400">Hunt not found</p>
      </div>
    );
  }

  const theme = getTheme(hunt.theme);
  const huntProgress = getHuntProgress(hunt.id);

  // Build ordered challenge list for this hunt
  const huntChallenges = hunt.challengeIds
    .map((cid) => allChallenges.find((c) => c.id === cid))
    .filter(Boolean) as NonNullable<ReturnType<typeof allChallenges.find>>[];

  const completedCount = huntChallenges.filter(
    (c) => getProgress(c.id).status === 'completed',
  ).length;
  const totalChallenges = huntChallenges.length;
  const allDone = completedCount >= totalChallenges;
  const canClaimBonus = allDone && !huntProgress.bonusClaimed;
  const isFullyCompleted = huntProgress.bonusClaimed;
  const huntLocked = !isHuntUnlocked(hunt, getProgress);
  const missingUnlocks = getMissingHuntUnlocks(hunt, getProgress);

  const handleStartHunt = () => {
    if (huntLocked) return;
    startHunt(hunt.id);
    // Also mark the first incomplete challenge as in-progress
    const firstIncomplete = huntChallenges.find(
      (c) => getProgress(c.id).status !== 'completed',
    );
    if (firstIncomplete) {
      markInProgress(firstIncomplete.id);
    }
  };

  const handleClaimBonus = () => {
    claimHuntBonus(hunt.id, hunt.bonusPoints);
  };

  return (
    <div className="flex-1 pb-24 animate-fade-in">
      {/* Themed header */}
      <div
        className="px-4 pt-5 pb-5"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent || theme.primary}dd)`,
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center mb-3
                     active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        {/* Hunt icon + title */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">{hunt.icon}</span>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">{hunt.title}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/20 text-white"
              >
                {hunt.difficulty}
              </span>
              <span className="text-xs text-white/80 flex items-center gap-0.5">
                <Clock size={12} /> {hunt.estimatedTime}
              </span>
              <span className="text-xs text-white/80">
                {scopeLabels[hunt.scope]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-3">
        {/* Description card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-4">
          <p className="text-sm text-slate-600 leading-relaxed">{hunt.description}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Trophy size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-amber-600">
              +{hunt.bonusPoints} bonus points for completing all challenges
            </span>
          </div>
        </div>

        {/* Progress summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">Progress</span>
            <span className="text-sm font-bold" style={{ color: theme.primary }}>
              {completedCount} / {totalChallenges}
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalChallenges > 0 ? (completedCount / totalChallenges) * 100 : 0}%`,
                backgroundColor: allDone ? '#10B981' : theme.primary,
              }}
            />
          </div>
          {allDone && (
            <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
              <CheckCircle2 size={12} /> All challenges complete!
            </p>
          )}
        </div>

        {huntLocked && (
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 mb-4">
            <p className="text-sm font-semibold text-slate-700">Hunt locked</p>
            <p className="text-sm text-slate-500 mt-1">
              Complete these challenge prerequisites first: {missingUnlocks.join(', ')}
            </p>
          </div>
        )}

        {/* Challenge checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-4">
          {huntChallenges.map((challenge, index) => {
            const progress = getProgress(challenge.id);
            const isCompleted = progress.status === 'completed';
            const TypeIcon = typeIcons[challenge.type];
            const cTheme = getTheme(challenge.theme);
            const challengeLocked = !isChallengeUnlocked(challenge, getProgress);
            const missingChallenges = getMissingChallengePrerequisites(challenge, getProgress);

            return (
              <Link
                key={challenge.id}
                to={challengeLocked ? `/hunts/${hunt.id}` : `/challenges/${challenge.id}`}
                className={`flex items-center gap-3 p-3.5 active:bg-slate-50 transition-colors
                           ${index > 0 ? 'border-t border-slate-100' : ''}
                           ${isCompleted ? 'bg-emerald-50/40' : ''}
                           ${challengeLocked ? 'opacity-70' : ''}`}
                onClick={(event) => {
                  if (challengeLocked) event.preventDefault();
                }}
              >
                {/* Step number or checkmark */}
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cTheme.primary}15` }}
                  >
                    <TypeIcon size={14} color={cTheme.primary} />
                  </div>
                )}

                {/* Challenge info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-tight truncate
                                ${isCompleted ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {challenge.title}
                  </p>
                  {challengeLocked ? (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Locked until: {missingChallenges.join(', ')}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-0.5 capitalize">
                      {challenge.difficulty} &middot; {challenge.points} pts
                    </p>
                  )}
                </div>

                {/* Step badge */}
                <span className="text-[10px] text-slate-300 font-medium shrink-0">
                  {index + 1}/{totalChallenges}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Start Hunt button (when not yet started) */}
        {huntProgress.status === 'not-started' && !allDone && !huntLocked && (
          <button
            onClick={handleStartHunt}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-base
                       active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.primary }}
          >
            <Sparkles size={18} />
            Start This Hunt
          </button>
        )}

        {/* Bonus claim section */}
        {canClaimBonus && !huntLocked && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5
                          border border-amber-200 text-center">
            <Sparkles size={28} className="text-amber-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-slate-800">
              You completed this hunt!
            </p>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Claim your bonus reward
            </p>
            <button
              onClick={handleClaimBonus}
              className="px-6 py-3 rounded-xl bg-amber-500 text-white font-bold text-base
                         active:scale-[0.98] transition-transform shadow-md
                         flex items-center justify-center gap-2 mx-auto"
            >
              <Gift size={18} />
              Claim +{hunt.bonusPoints} Bonus Points
            </button>
          </div>
        )}

        {/* Already claimed */}
        {isFullyCompleted && (
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center">
            <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-1" />
            <p className="text-sm font-semibold text-emerald-700">
              Hunt Complete! Bonus +{hunt.bonusPoints} pts claimed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
