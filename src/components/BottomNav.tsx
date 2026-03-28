import { NavLink } from 'react-router-dom';
import { Home, Map, Compass, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { themes } from '../themes';

const tabs: { to: string; label: string; Icon: LucideIcon }[] = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/map', label: 'Map', Icon: Map },
  { to: '/hunts', label: 'Hunts', Icon: Compass },
  { to: '/profile', label: 'Profile', Icon: User },
];

const activeColor = themes.default.primary;

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/60
                 shadow-[0_-1px_3px_rgba(0,0,0,0.06)]
                 flex justify-around items-center z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-3 min-w-[64px] min-h-[48px]
             justify-center transition-colors
             ${isActive ? '' : 'text-slate-400'}`
          }
          style={({ isActive }) =>
            isActive ? { color: activeColor } : undefined
          }
        >
          {({ isActive }) => (
            <>
              <tab.Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
