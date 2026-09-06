'use client';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
export function QuantityInput({ value, onChange, min = 1, max = 99, className }: { value: number; onChange: (v: number) => void; min?: number; max?: number; className?: string }) {
  const b = 'nm-transition grid size-9 place-items-center rounded-full bg-nm-surface shadow-soft-sm hover:shadow-soft active:shadow-soft-inset-sm disabled:opacity-40';
  return (
    <div className={cn('inline-flex h-12 items-center gap-2 rounded-pill px-1.5 shadow-soft-inset', className)}>
      <button aria-label="Decrease" disabled={value <= min} onClick={() => onChange(value - 1)} className={b}><Minus className="size-4" /></button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button aria-label="Increase" disabled={value >= max} onClick={() => onChange(value + 1)} className={b}><Plus className="size-4" /></button>
    </div>
  );
}
