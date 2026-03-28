import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import BottomNav from './components/BottomNav';

const Home = lazy(() => import('./pages/Home'));
const Map = lazy(() => import('./pages/Map'));
const Challenges = lazy(() => import('./pages/Challenges'));
const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const Hunts = lazy(() => import('./pages/Hunts'));
const HuntDetail = lazy(() => import('./pages/HuntDetail'));
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<RouteLoadingState />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/hunts" element={<Hunts />} />
              <Route path="/hunts/:id" element={<HuntDetail />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/challenges/:id" element={<ChallengeDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>

        <BottomNav />
      </BrowserRouter>
    </ProgressProvider>
  );
}

function RouteLoadingState() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 pb-24">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto rounded-full border-4 border-slate-200 border-t-slate-500 animate-spin" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading adventure...</p>
      </div>
    </div>
  );
}
