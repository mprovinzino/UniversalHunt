import type { Park } from '../../types';
import { parks } from '../../data/parks';

interface ParkFilterPillsProps {
  activePark: Park | 'all';
  onSelect: (park: Park | 'all') => void;
}

export default function ParkFilterPills({ activePark, onSelect }: ParkFilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {/* "All" pill */}
      <ParkPill
        abbreviation="All"
        color="#475569"
        isActive={activePark === 'all'}
        onTap={() => onSelect('all')}
      />

      {/* One pill per park */}
      {parks.map((park) => (
        <ParkPill
          key={park.id}
          abbreviation={park.abbreviation}
          color={park.color}
          isActive={activePark === park.id}
          onTap={() => onSelect(park.id)}
        />
      ))}
    </div>
  );
}

function ParkPill({
  abbreviation,
  color,
  isActive,
  onTap,
}: {
  abbreviation: string;
  color: string;
  isActive: boolean;
  onTap: () => void;
}) {
  return (
    <button
      onClick={onTap}
      className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center
                 text-xs font-bold transition-all active:scale-95"
      style={{
        backgroundColor: isActive ? color : `${color}15`,
        color: isActive ? '#fff' : color,
        boxShadow: isActive ? `0 2px 8px ${color}40` : 'none',
      }}
    >
      {abbreviation}
    </button>
  );
}
