import type { ParkTheme } from '../../themes';

interface ThemedHeaderProps {
  theme: ParkTheme;
  displayName: string;
  levelTitle: string;
  totalPoints: number;
}

export default function ThemedHeader({
  theme,
  displayName,
  levelTitle,
  totalPoints,
}: ThemedHeaderProps) {
  // Get initials for the avatar (first letter of each word, max 2)
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 text-white"
      style={{
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
      }}
    >
      {/* Subtle radial decoration */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 50%), ' +
            'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 40%)',
        }}
      />

      <div className="relative flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center
                        text-lg font-bold backdrop-blur-sm border border-white/30">
          {initials}
        </div>

        {/* Name + level */}
        <div className="flex-1">
          <p className="font-bold text-lg leading-tight truncate">{displayName}</p>
          <p className="text-sm opacity-80">{levelTitle}</p>
        </div>

        {/* Points */}
        <div className="text-right">
          <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
          <p className="text-xs opacity-80">points</p>
        </div>
      </div>
    </div>
  );
}
