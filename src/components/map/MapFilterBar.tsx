import { Search, Camera, MousePointerClick, Timer, Crosshair } from 'lucide-react';
import type { Park, ChallengeType } from '../../types';
import { parks } from '../../data/parks';

interface MapFilterBarProps {
  activePark: Park | 'all';
  onParkSelect: (park: Park | 'all') => void;
  activeType: ChallengeType | 'all';
  onTypeSelect: (type: ChallengeType | 'all') => void;
  showHotels: boolean;
  onToggleHotels: () => void;
  pinpointMode: boolean;
  onTogglePinpointMode: () => void;
}

const typeFilters: { type: ChallengeType | 'all'; Icon: typeof Search; label: string }[] = [
  { type: 'all', Icon: Search, label: 'All' },
  { type: 'find', Icon: Search, label: 'Find' },
  { type: 'photo', Icon: Camera, label: 'Photo' },
  { type: 'interact', Icon: MousePointerClick, label: 'Act' },
  { type: 'timed', Icon: Timer, label: 'Timed' },
];

export default function MapFilterBar({
  activePark,
  onParkSelect,
  activeType,
  onTypeSelect,
  showHotels,
  onToggleHotels,
  pinpointMode,
  onTogglePinpointMode,
}: MapFilterBarProps) {
  return (
    <div className="absolute top-3 left-3 right-3 z-10 flex flex-col gap-2">
      {/* Park pills row */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
        <ParkPill
          label="All Parks"
          color="#475569"
          isActive={activePark === 'all'}
          onClick={() => onParkSelect('all')}
        />
        {parks.map((p) => (
          <ParkPill
            key={p.id}
            label={p.abbreviation}
            color={p.color}
            isActive={activePark === p.id}
            onClick={() => onParkSelect(p.id)}
          />
        ))}
      </div>

      {/* Type pills row */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
        {typeFilters.map(({ type, Icon, label }) => (
          <button
            key={type}
            onClick={() => onTypeSelect(type)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold
                       shadow-sm backdrop-blur-sm transition-all active:scale-95
                       ${
                         activeType === type
                           ? 'bg-slate-800 text-white shadow-md'
                           : 'bg-white/90 text-slate-600'
                       }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
        <button
          onClick={onToggleHotels}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold
                     shadow-sm backdrop-blur-sm transition-all active:scale-95 ${
                       showHotels ? 'bg-emerald-700 text-white shadow-md' : 'bg-white/90 text-slate-600'
                     }`}
        >
          Hotels
        </button>
        <button
          onClick={onTogglePinpointMode}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold
                     shadow-sm backdrop-blur-sm transition-all active:scale-95 ${
                       pinpointMode ? 'bg-sky-700 text-white shadow-md' : 'bg-white/90 text-slate-600'
                     }`}
        >
          <Crosshair size={12} />
          Pinpoint
        </button>
      </div>
    </div>
  );
}

function ParkPill({
  label,
  color,
  isActive,
  onClick,
}: {
  label: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap
                 shadow-sm backdrop-blur-sm transition-all active:scale-95
                 ${isActive ? 'text-white shadow-md' : 'bg-white/90'}`}
      style={
        isActive
          ? { backgroundColor: color, color: 'white' }
          : { color }
      }
    >
      {label}
    </button>
  );
}
