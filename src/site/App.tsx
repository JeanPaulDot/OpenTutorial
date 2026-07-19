import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';

const Home = lazy(() => import('./pages/Home'));
const Demo = lazy(() => import('./pages/Demo'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-slate-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#6d5cff]" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </Suspense>
  );
}
