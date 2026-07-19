export default function ProCard() {
  return (
    <section
      data-tour="pro-card"
      className="rounded-xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-amber-400/90 px-1.5 py-0.5 text-[10px] font-bold text-white">PRO</span>
        <h2 className="text-[15px] font-semibold text-slate-900">Anomaly alerts</h2>
      </div>
      <p className="mt-1 text-[11.5px] text-slate-500">This card only exists when the plan switch is on Pro.</p>
      <ul className="mt-3 space-y-2 text-[12.5px] text-slate-700">
        <li className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
          Revenue dipped 8% vs forecast on Tuesday
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
          Signup conversion spiked after the pricing change
        </li>
      </ul>
    </section>
  );
}
