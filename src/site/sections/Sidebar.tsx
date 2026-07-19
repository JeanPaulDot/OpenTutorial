const NAV = [
  { label: 'Overview', icon: '◈', active: true },
  { label: 'Reports', icon: '▤', active: false },
  { label: 'Customers', icon: '◉', active: false },
  { label: 'Invoices', icon: '▦', active: false },
  { label: 'Automations', icon: '⚡', active: false },
  { label: 'Settings', icon: '⚙', active: false },
];

export default function Sidebar() {
  return (
    <aside
      data-tour="sidebar"
      className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-[#12121c] text-slate-300 md:flex"
    >
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6d5cff] to-[#9d8bff] text-white font-bold text-sm">
          P
        </div>
        <div>
          <div className="text-sm font-semibold text-white leading-tight">Pulseboard</div>
          <div className="text-[11px] text-slate-500 leading-tight">analytics suite</div>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
              item.active
                ? 'bg-[#6d5cff]/15 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <span className="w-4 text-center text-xs">{item.icon}</span>
            {item.label}
            {item.active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#6d5cff]" />}
          </button>
        ))}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-bold text-white">
            AK
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-white">Ava Kim</div>
            <div className="truncate text-[11px] text-slate-500">ava@acme.co</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
