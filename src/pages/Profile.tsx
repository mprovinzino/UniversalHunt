import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pencil, Check, X, Crosshair, Star, Lightbulb,
  Trophy, RotateCcw, Calendar, AlertTriangle, Compass, ClipboardList, Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useChallenges } from '../hooks/useChallenges';
import { useProgressContext } from '../hooks/useProgressContext';
import { themes } from '../themes';
import { getLevelForPoints, pointsToNextLevel } from '../data/levels';
import { parks } from '../data/parks';
import ThemedHeader from '../components/layout/ThemedHeader';

export default function Profile() {
  const challenges = useChallenges();
  const { profile, setDisplayName, resetAll } = useProgressContext();
  const theme = themes.default;

  // Editable name state
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(profile.displayName);

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // --- Derived stats ---
  const completedEntries = Object.values(profile.challengeProgress).filter(
    (p) => p.status === 'completed',
  );
  const completedCount = completedEntries.length;

  const totalHintsUsed = Object.values(profile.challengeProgress).reduce(
    (sum, p) => sum + p.hintsUsed,
    0,
  );

  const avgStars =
    completedCount > 0
      ? completedEntries.reduce((sum, p) => sum + p.stars, 0) / completedCount
      : 0;

  const huntsCompleted = Object.values(profile.huntProgress).filter(
    (h) => h.status === 'completed',
  ).length;

  // Level progress
  const currentLevel = getLevelForPoints(profile.totalPoints);
  const nextLevel = pointsToNextLevel(profile.totalPoints);
  const isMaxLevel = nextLevel === null;
  const progressPercent = nextLevel
    ? Math.min(
        100,
        ((profile.totalPoints - currentLevel.minPoints) /
          (nextLevel.next.minPoints - currentLevel.minPoints)) *
          100,
      )
    : 100;

  // Per-park breakdown
  const parkBreakdown = parks.map((park) => {
    const parkChallenges = challenges.filter((c) => c.park === park.id);
    const parkCompleted = parkChallenges.filter(
      (c) => profile.challengeProgress[c.id]?.status === 'completed',
    ).length;
    return { ...park, total: parkChallenges.length, completed: parkCompleted };
  });

  // Member since
  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // --- Handlers ---
  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed.length > 0) {
      setDisplayName(trimmed);
    } else {
      setEditValue(profile.displayName);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(profile.displayName);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 px-4 pt-6 pb-24 animate-fade-in">
      {/* Themed header */}
      <ThemedHeader
        theme={theme}
        displayName={profile.displayName}
        levelTitle={profile.levelTitle}
        totalPoints={profile.totalPoints}
      />

      {/* Editable display name */}
      <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <p className="text-xs text-slate-400 mb-2">Display Name</p>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              maxLength={24}
              autoFocus
              className="flex-1 text-base font-semibold text-slate-800 border-b-2
                         border-blue-400 outline-none bg-transparent py-1"
            />
            <button
              onClick={handleSave}
              className="min-w-[44px] min-h-[44px] rounded-lg bg-green-50 flex items-center
                         justify-center active:scale-95 transition-transform"
            >
              <Check size={18} className="text-green-600" />
            </button>
            <button
              onClick={handleCancel}
              className="min-w-[44px] min-h-[44px] rounded-lg bg-red-50 flex items-center
                         justify-center active:scale-95 transition-transform"
            >
              <X size={18} className="text-red-400" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-slate-800 truncate">
              {profile.displayName}
            </p>
            <button
              onClick={() => {
                setEditValue(profile.displayName);
                setIsEditing(true);
              }}
              className="min-w-[44px] min-h-[44px] rounded-lg bg-slate-50 flex items-center
                         justify-center active:scale-95 transition-transform"
            >
              <Pencil size={16} className="text-slate-400" />
            </button>
          </div>
        )}
      </div>

      {/* Level progress */}
      <div className="mt-3 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            <p className="text-sm font-semibold text-slate-800">
              Level {profile.level} — {profile.levelTitle}
            </p>
          </div>
          <p className="text-sm font-bold" style={{ color: theme.primary }}>
            {profile.totalPoints} pts
          </p>
        </div>

        {isMaxLevel ? (
          <div className="bg-amber-50 rounded-lg p-2 text-center">
            <p className="text-xs font-medium text-amber-700">
              Max Level Reached!
            </p>
          </div>
        ) : (
          <>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: theme.primary,
                }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5 text-right">
              {nextLevel.remaining} pts to {nextLevel.next.title}
            </p>
          </>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <StatCard label="Completed" value={completedCount} Icon={Crosshair} color="#3B82F6" />
        <StatCard label="Total Points" value={profile.totalPoints} Icon={Star} color="#F59E0B" />
        <StatCard label="Hunts Done" value={huntsCompleted} Icon={Compass} color="#10B981" />
        <StatCard
          label="Avg Stars"
          value={avgStars > 0 ? avgStars.toFixed(1) : '—'}
          Icon={Trophy}
          color="#8B5CF6"
        />
        <StatCard label="Hints Used" value={totalHintsUsed} Icon={Lightbulb} color="#F97316" />
      </div>

      {/* Per-park progress */}
      {parkBreakdown.some((p) => p.total > 0) && (
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Park Progress</h2>
          <div className="space-y-3">
            {parkBreakdown
              .filter((p) => p.total > 0)
              .map((park) => (
                <div key={park.id}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-slate-600">{park.name}</p>
                    <p className="text-xs text-slate-400">
                      {park.completed} of {park.total}
                    </p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(park.completed / park.total) * 100}%`,
                        backgroundColor: park.color,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Reset progress */}
      <div className="mt-6">
        <Link
          to="/admin"
          className="w-full mb-3 py-3 rounded-xl text-slate-700 font-medium text-sm
                     border border-slate-200 bg-white active:scale-[0.98] transition-transform
                     flex items-center justify-center gap-2"
        >
          <ClipboardList size={16} />
          Open Field Testing Dashboard
        </Link>

        <Link
          to="/field-ops"
          className="w-full mb-3 py-3 rounded-xl text-slate-700 font-medium text-sm
                     border border-slate-200 bg-white active:scale-[0.98] transition-transform
                     flex items-center justify-center gap-2"
        >
          <Users size={16} />
          Open Shared Field Ops Board
        </Link>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 rounded-xl text-red-500 font-medium text-sm
                       border-2 border-red-200 active:scale-[0.98] transition-transform
                       flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            Reset All Progress
          </button>
        ) : (
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-red-500" />
              <p className="text-sm font-semibold text-red-700">Are you sure?</p>
            </div>
            <p className="text-xs text-red-600 mb-3">
              This will erase all your progress, points, and completed challenges.
              This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium
                           bg-white text-slate-600 border border-slate-200
                           active:scale-[0.98] transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAll();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium
                           bg-red-500 text-white
                           active:scale-[0.98] transition-transform"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Member since */}
      <div className="mt-4 mb-2 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <Calendar size={12} />
          <span>Member since {memberSince}</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  Icon,
  color,
}: {
  label: string;
  value: number | string;
  Icon: LucideIcon;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={16} color={color} strokeWidth={2} />
      </div>
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
