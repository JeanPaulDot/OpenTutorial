const ROWS = [
  { id: 'INV-2041', customer: 'Northwind Labs', amount: '$1,240.00', status: 'Paid', date: 'Jul 14' },
  { id: 'INV-2040', customer: 'Helios Energy', amount: '$860.50', status: 'Paid', date: 'Jul 13' },
  { id: 'INV-2039', customer: 'Bluefin Analytics', amount: '$2,150.00', status: 'Pending', date: 'Jul 12' },
  { id: 'INV-2038', customer: 'Kite & Anchor', amount: '$430.00', status: 'Overdue', date: 'Jul 09' },
  { id: 'INV-2037', customer: 'Mistral AI', amount: '$1,980.75', status: 'Paid', date: 'Jul 08' },
];

const STATUS_STYLE: Record<string, string> = {
  Paid: 'bg-emerald-50 text-emerald-600',
  Pending: 'bg-amber-50 text-amber-600',
  Overdue: 'bg-rose-50 text-rose-600',
};

export default function InvoicesTable() {
  return (
    <section data-tour="invoices-table" className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">Recent invoices</h2>
          <p className="text-[12px] text-slate-500">Exports and payments share one audit trail</p>
        </div>
        <button className="text-[12px] font-semibold text-[#6d5cff] hover:underline">View all →</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
              <th className="pb-2 pr-4 font-medium">Invoice</th>
              <th className="pb-2 pr-4 font-medium">Customer</th>
              <th className="pb-2 pr-4 font-medium">Amount</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="py-2.5 pr-4 font-mono text-[12px] text-slate-500">{r.id}</td>
                <td className="py-2.5 pr-4 font-medium text-slate-800">{r.customer}</td>
                <td className="py-2.5 pr-4 text-slate-700">{r.amount}</td>
                <td className="py-2.5 pr-4">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="py-2.5 text-slate-500">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
