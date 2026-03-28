import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ClueRevealerProps {
  hint: string;
  clues: string[];
  hintsUsed: number;
  onRevealHint: () => void;
  themeColor: string;
}

export default function ClueRevealer({
  hint,
  clues,
  hintsUsed,
  onRevealHint,
  themeColor,
}: ClueRevealerProps) {
  const [localRevealed, setLocalRevealed] = useState(hintsUsed);
  const totalClues = clues.length;

  const handleReveal = () => {
    if (localRevealed < totalClues) {
      setLocalRevealed((prev) => prev + 1);
      onRevealHint();
    }
  };

  return (
    <div className="space-y-3">
      {/* Always-visible hint */}
      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
        <p className="text-xs font-medium text-amber-700 mb-1">Hint</p>
        <p className="text-sm text-amber-900">{hint}</p>
      </div>

      {/* Progressive clues */}
      {clues.map((clue, i) => {
        const isRevealed = i < localRevealed;
        return (
          <div
            key={i}
            className={`rounded-lg p-3 border transition-all ${
              isRevealed
                ? 'bg-white border-slate-200'
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {isRevealed ? (
                <Eye size={14} color={themeColor} />
              ) : (
                <EyeOff size={14} className="text-slate-300" />
              )}
              <p className="text-xs font-medium" style={{ color: isRevealed ? themeColor : '#94A3B8' }}>
                Clue {i + 1}
              </p>
            </div>
            {isRevealed ? (
              <p className="text-sm text-slate-700">{clue}</p>
            ) : (
              <p className="text-sm text-slate-300 italic">Hidden — reveal to see this clue</p>
            )}
          </div>
        );
      })}

      {/* Reveal button */}
      {localRevealed < totalClues && (
        <button
          onClick={handleReveal}
          className="w-full py-3 rounded-lg text-sm font-medium border-2 border-dashed
                     active:scale-[0.98] transition-transform"
          style={{ borderColor: `${themeColor}40`, color: themeColor }}
        >
          Reveal Next Clue (-5 pts)
        </button>
      )}
    </div>
  );
}
