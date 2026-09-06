'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
export interface AccordionItem { id: string; title: string; content: React.ReactNode }
export function Accordion({ items, single = true, className }: { items: AccordionItem[]; single?: boolean; className?: string }) {
  const [open, setOpen] = useState<string[]>([]);
  const toggle = (id: string) => setOpen(o => o.includes(id) ? o.filter(x => x !== id) : single ? [id] : [...o, id]);
  return (
    <div className={cn('grid gap-4', className)}>
      {items.map(it => {
        const on = open.includes(it.id);
        return (
          <div key={it.id} className={cn('nm-transition rounded-soft bg-nm-surface', on ? 'shadow-soft-inset' : 'shadow-soft')}>
            <button aria-expanded={on} onClick={() => toggle(it.id)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold">
              {it.title}
              <span className={cn('grid size-8 shrink-0 place-items-center rounded-full shadow-soft-sm nm-transition', on && 'rotate-45 text-nm-accent')}><Plus className="size-4" /></span>
            </button>
            {on && <div className="animate-nm-in px-6 pb-6 text-sm leading-relaxed text-nm-muted">{it.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
