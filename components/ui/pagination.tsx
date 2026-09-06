'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
export function Pagination({ page, pages, onChange, className }: { page: number; pages: number; onChange: (p: number) => void; className?: string }) {
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(n => n === 1 || n === pages || Math.abs(n - page) <= 1);
  const btn = 'nm-transition grid size-10 place-items-center rounded-full bg-nm-surface text-sm font-semibold disabled:opacity-40';
  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-2', className)}>
      <button aria-label="Previous" disabled={page === 1} onClick={() => onChange(page - 1)} className={cn(btn, 'shadow-soft-sm hover:shadow-soft')}><ChevronLeft className="size-4" /></button>
      {nums.map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          {i > 0 && nums[i - 1] !== n - 1 && <span className="px-1 text-nm-muted">…</span>}
          <button aria-current={n === page ? 'page' : undefined} onClick={() => onChange(n)} className={cn(btn, n === page ? 'shadow-soft-inset-sm text-nm-accent' : 'shadow-soft-sm hover:shadow-soft')}>{n}</button>
        </span>
      ))}
      <button aria-label="Next" disabled={page === pages} onClick={() => onChange(page + 1)} className={cn(btn, 'shadow-soft-sm hover:shadow-soft')}><ChevronRight className="size-4" /></button>
    </nav>
  );
}
