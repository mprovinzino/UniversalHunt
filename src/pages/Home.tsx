import { useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Camera,
  Footprints,
  Hotel,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import { useChallenges } from '../hooks/useChallenges';
import { useHunts } from '../hooks/useHunts';
import { useProgressContext } from '../hooks/useProgressContext';
import { themes, getTheme } from '../themes';
import ThemedHeader from '../components/layout/ThemedHeader';
import { resortDistricts, universalHotels } from '../data/resort';
import { isHuntUnlocked } from '../lib/unlocks';

export default function Home() {
  const navigate = useNavigate();
  const challenges = useChallenges();
  const hunts = useHunts();
  const { profile, getProgress, getHuntProgress } = useProgressContext();
  const theme = themes.default;

  const completedCount = Object.values(profile.challengeProgress).filter(
    (progress) => progress.status === 'completed',
  ).length;

  const unlockedFeaturedHunts = hunts
    .filter((hunt) => hunt.featured)
    .map((hunt) => ({
      hunt,
      unlocked: isHuntUnlocked(hunt, getProgress),
      completed: hunt.challengeIds.filter(
        (challengeId) => getProgress(challengeId).status === 'completed',
      ).length,
      huntProgress: getHuntProgress(hunt.id),
    }))
    .sort((a, b) => Number(b.unlocked) - Number(a.unlocked) || a.hunt.sortOrder - b.hunt.sortOrder)
    .slice(0, 4);

  const districtCards = resortDistricts.map((district) => ({
    ...district,
    huntCount: hunts.filter((hunt) => hunt.parks.includes(district.park)).length,
    challengeCount: challenges.filter((challenge) => challenge.park === district.park).length,
  }));

  return (
    <div className="flex-1 px-4 pt-6 pb-24 animate-fade-in">
      <ThemedHeader
        theme={theme}
        displayName={profile.displayName}
        levelTitle={profile.levelTitle}
        totalPoints={profile.totalPoints}
      />

      <section
        className="relative overflow-hidden rounded-[28px] mt-4 p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
        style={{
          background:
            'linear-gradient(135deg, #0F172A 0%, #155E75 38%, #1D4ED8 68%, #F97316 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, white 0%, transparent 28%), radial-gradient(circle at 85% 15%, #FDE68A 0%, transparent 18%), radial-gradient(circle at 50% 100%, #67E8F9 0%, transparent 24%)' }} />
        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/70">
            Universal Orlando Scavenger Adventure
          </p>
          <h1 className="mt-2 text-[28px] font-black leading-tight">
            Explore the resort like a real-world treasure hunt.
          </h1>
          <p className="mt-3 text-sm text-white/82 max-w-xl leading-relaxed">
            Universal Hunt turns Universal Studios, Islands of Adventure, CityWalk, and the lagoon
            into connected scavenger routes with clues, photo proof, and park-by-park hunt paths.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <MiniStat label="Completed" value={completedCount} Icon={Trophy} />
            <MiniStat label="Hotels" value={universalHotels.length} Icon={Hotel} />
            <MiniStat label="Hunts" value={hunts.length} Icon={Compass} />
          </div>

          <div className="mt-5 flex gap-2 flex-wrap">
            <button
              onClick={() => navigate('/hunts')}
              className="px-4 py-3 rounded-full bg-white text-slate-900 text-sm font-semibold flex items-center gap-2"
            >
              Start A Hunt
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => navigate('/map')}
              className="px-4 py-3 rounded-full bg-white/12 border border-white/20 text-white text-sm font-semibold"
            >
              Open Resort Map
            </button>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-800">How It Works</h2>
          <span className="text-xs text-slate-400">Built for park days and no-ticket days</span>
        </div>
        <div className="grid gap-3">
          <HowCard
            Icon={MapPin}
            title="Pick your district"
            text="Choose a route in Universal Studios, Islands of Adventure, CityWalk, or a larger resort-core crossover."
            color="#155E75"
          />
          <HowCard
            Icon={Footprints}
            title="Follow clue-driven hunts"
            text="Each hunt groups together a path of challenges so you can explore one district at a time or connect multiple areas."
            color="#1D4ED8"
          />
          <HowCard
            Icon={Camera}
            title="Capture proof as you go"
            text="Use location checks and proof photos while you test updates in the parks, then review what needs work later."
            color="#F97316"
          />
        </div>
      </section>

      <section className="mt-5">
        <h2 className="text-base font-semibold text-slate-800 mb-3">Choose Your Path</h2>
        <div className="space-y-3">
          {districtCards.map((district) => (
            <button
              key={district.id}
              onClick={() => navigate(district.park === 'citywalk' ? '/map' : '/hunts')}
              className="w-full text-left bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="p-4" style={{ background: `linear-gradient(135deg, ${district.color}18, white 68%)` }}>
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: `${district.color}20`, color: district.color }}
                  >
                    {district.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-800">{district.name}</p>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {district.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-white text-slate-600 border border-slate-100">
                        {district.challengeCount} challenges
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-white text-slate-600 border border-slate-100">
                        {district.huntCount} hunts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="text-base font-semibold text-slate-800 mb-3">Featured Hunt Paths</h2>
        <div className="space-y-3">
          {unlockedFeaturedHunts.map(({ hunt, unlocked, completed, huntProgress }) => {
            const huntTheme = getTheme(hunt.theme);
            const total = hunt.challengeIds.length;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <button
                key={hunt.id}
                onClick={() => navigate(unlocked ? `/hunts/${hunt.id}` : '/hunts')}
                className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: `${huntTheme.primary}18` }}
                  >
                    {hunt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-800 truncate">{hunt.title}</p>
                      <span
                        className="text-[11px] font-semibold px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: unlocked ? `${huntTheme.primary}15` : '#E2E8F0',
                          color: unlocked ? huntTheme.primary : '#64748B',
                        }}
                      >
                        {unlocked ? hunt.scope.replace('-', ' ') : 'locked'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {hunt.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
                      <span>{hunt.estimatedTime}</span>
                      <span>&middot;</span>
                      <span>{hunt.parks.length} resort zones</span>
                      <span>&middot;</span>
                      <span>{completed}/{total} complete</span>
                    </div>
                    {(huntProgress.status === 'in-progress' || completed > 0) && (
                      <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${percent}%`, backgroundColor: huntTheme.primary }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MiniStat({
  label,
  value,
  Icon,
}: {
  label: string;
  value: number;
  Icon: typeof Trophy;
}) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 px-3 py-3">
      <Icon size={16} className="text-white/80" />
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
      <p className="text-[11px] text-white/70">{label}</p>
    </div>
  );
}

function HowCard({
  Icon,
  title,
  text,
  color,
}: {
  Icon: typeof MapPin;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={18} color={color} />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500 leading-relaxed">{text}</p>
    </div>
  );
}
