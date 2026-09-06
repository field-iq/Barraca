import { cn } from '@/lib/cn';
export function CalendarMonth({ month, events }: { month: Date; events: { date: Date; label: string }[] }) {
  const y = month.getFullYear(), m = month.getMonth(); const first = (new Date(y, m, 1).getDay() + 6) % 7; const days = new Date(y, m + 1, 0).getDate();
  return (
    <div className="rounded-soft-lg bg-nm-surface p-6 shadow-soft">
      <h3 className="text-2xl">{month.toLocaleString('en-AU', { month: 'long', year: 'numeric' })}</h3>
      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase text-nm-muted">{['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <span key={d}>{d}</span>)}</div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {Array.from({ length: first }).map((_, i) => <span key={'e' + i} />)}
        {Array.from({ length: days }, (_, i) => { const ev = events.filter(e => e.date.getDate() === i + 1 && e.date.getMonth() === m);
          return <div key={i} className={cn('min-h-[72px] rounded-soft-sm p-2 text-xs', ev.length ? 'shadow-soft' : 'shadow-soft-inset-sm text-nm-muted')}><span className="font-semibold">{i + 1}</span>{ev.map(e => <p key={e.label} className="mt-1 truncate rounded-pill bg-nm-accent px-2 py-0.5 text-[10px] font-semibold text-nm-accent-fg">{e.label}</p>)}</div>; })}
      </div>
    </div>
  );
}
