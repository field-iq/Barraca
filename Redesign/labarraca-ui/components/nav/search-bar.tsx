'use client';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';
export function SearchBar({ value, onChange, placeholder = 'Search tables, robes, timbers…', className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <form role="search" onSubmit={e => e.preventDefault()} className={cn('flex h-14 items-center gap-3 rounded-pill px-3 pl-6 shadow-soft-inset', className)}>
      <Search className="size-5 text-nm-muted" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="flex-1 bg-transparent text-base outline-none placeholder:text-nm-muted/70" />
      {value && <button type="button" aria-label="Clear" onClick={() => onChange('')} className="grid size-9 place-items-center rounded-full shadow-soft-sm"><X className="size-4" /></button>}
    </form>
  );
}
