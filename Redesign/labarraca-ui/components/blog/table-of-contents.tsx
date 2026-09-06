'use client';
import { cn } from '@/lib/cn';
export function TableOfContents({ items, active, onSelect }: { items: { id: string; label: string }[]; active?: string; onSelect?: (id: string) => void }) {
  return (
    <nav aria-label="On this page" className="rounded-soft p-5 shadow-soft-inset">
      <p className="text-xs font-semibold uppercase tracking-[.14em] text-nm-muted">On this page</p>
      <ol className="mt-3 grid gap-1">{items.map(it => <li key={it.id}><button onClick={() => onSelect?.(it.id)} className={cn('nm-transition w-full rounded-pill px-4 py-2 text-left text-sm', active === it.id ? 'bg-nm-surface font-semibold text-nm-accent shadow-soft-sm' : 'text-nm-muted hover:text-nm-text')}>{it.label}</button></li>)}</ol>
    </nav>
  );
}
