import { useTour } from '../core/adapters/react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Banner from './Banner';
import StatsRow from './StatsRow';
import RevenueChart from './RevenueChart';
import InvoicesTable from './InvoicesTable';
import ToursPanel from './ToursPanel';
import ThemeStudio from './ThemeStudio';
import ProCard from './ProCard';
import EventLog from './EventLog';
import SpecPlayground from './SpecPlayground';

export default function Shell() {
  const { context } = useTour();
  const isPro = context.plan === 'pro';

  return (
    <div className="min-h-screen bg-[#f5f6fb] text-slate-900 antialiased">
      <Sidebar />
      <div className="md:pl-60">
        <Topbar />
        <main className="mx-auto max-w-[1200px] space-y-6 p-4 sm:p-6">
          <Banner />
          <StatsRow />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-6">
              <RevenueChart />
              <InvoicesTable />
            </div>
            <div className="space-y-6">
              <ToursPanel />
              <ThemeStudio />
              {isPro && <ProCard />}
              <EventLog />
            </div>
          </div>

          <SpecPlayground />

          <footer className="pb-6 pt-2 text-center text-[11.5px] text-slate-400">
            Opentutorial — spec-driven in-app tour engine · zero runtime deps ·
            validated JSON DSL · theming via CSS variables
          </footer>
        </main>
      </div>
    </div>
  );
}
