'use client';
import { useState } from 'react';
export function BeforeAfter({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="rounded-soft-lg p-4 shadow-soft">
      <div className="relative aspect-[16/10] select-none overflow-hidden rounded-soft shadow-soft-inset">
        <img src={after} alt={alt + ' after'} className="absolute inset-0 size-full object-cover" />
        <img src={before} alt={alt + ' before'} className="absolute inset-0 size-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
        <div className="absolute inset-y-0 w-1 -translate-x-1/2 bg-nm-bg" style={{ left: pos + '%' }}><span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-nm-surface text-xs font-bold shadow-soft">⇔</span></div>
        <input type="range" min={0} max={100} value={pos} onChange={e => setPos(+e.target.value)} aria-label="Compare" className="absolute inset-0 size-full cursor-ew-resize opacity-0" />
        <span className="absolute left-4 top-4 rounded-pill bg-nm-surface px-3 py-1 text-xs font-semibold shadow-soft-sm">Raw slab</span>
        <span className="absolute right-4 top-4 rounded-pill bg-nm-surface px-3 py-1 text-xs font-semibold shadow-soft-sm">Finished</span>
      </div>
    </div>
  );
}
