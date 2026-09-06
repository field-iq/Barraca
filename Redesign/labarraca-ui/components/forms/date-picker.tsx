'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
export function DatePicker({ value, onChange, disabledDay }: { value?: Date; onChange: (d: Date) => void; disabledDay?: (d: Date) => boolean }) {
  const [view, setView] = useState(new Date(value ?? Date.now()));
  const y = view.getFullYear(), m = view.getMonth();
  const first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
  const same = (a?: Date, b?: Date) => a && b && a.toDateString() === b.toDateString();
  return (
    <div className="w-[320px] rounded-soft bg-nm-surface p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <button aria-label="Previous month" onClick={() => setView(new Date(y, m - 1, 1))} className="grid size-9 place-items-center rounded-full shadow-soft-sm active:shadow-soft-inset-sm"><ChevronLeft className="size-4" /></button>
        <span className="font-heading text-lg">{view.toLocaleString('en-AU', { month: 'long', year: 'numeric' })}</span>
        <button aria-label="Next month" onClick={() => setView(new Date(y, m + 1, 1))} className="grid size-9 place-items-center rounded-full shadow-soft-sm active:shadow-soft-inset-sm"><ChevronRight className="size-4" /></button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-nm-muted">{DAYS.map(d => <span key={d}>{d}</span>)}</div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {Array.from({ length: first }).map((_, i) => <span key={'e' + i} />)}
        {Array.from({ length: days }, (_, i) => { const d = new Date(y, m, i + 1); const off = disabledDay?.(d); const on = same(d, value); const today = same(d, new Date());
          return <button key={i} disabled={off} onClick={() => onChange(d)} className={cn('nm-transition grid aspect-square place-items-center rounded-full text-sm', on ? 'bg-nm-accent text-nm-accent-fg shadow-soft-xs' : off ? 'text-nm-muted/40' : 'hover:shadow-soft-sm', today && !on && 'text-nm-accent font-bold')}>{i + 1}</button>; })}
      </div>
    </div>
  );
}
