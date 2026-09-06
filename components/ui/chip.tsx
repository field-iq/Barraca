'use client';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
export interface ChipProps { label: string; selected?: boolean; onClick?: () => void; onRemove?: () => void; className?: string }
export function Chip({ label, selected, onClick, onRemove, className }: ChipProps) {
  return (
    <span className={cn('nm-transition inline-flex h-9 items-center gap-2 rounded-pill bg-nm-surface pl-4 text-sm font-medium', onRemove ? 'pr-2' : 'pr-4',
      selected ? 'shadow-soft-inset-sm text-nm-accent' : 'shadow-soft-sm hover:shadow-soft', onClick && 'cursor-pointer', className)} onClick={onClick} role={onClick ? 'button' : undefined}>
      {label}
      {onRemove && <button type="button" aria-label={`Remove ${label}`} onClick={e => { e.stopPropagation(); onRemove(); }} className="grid size-5 place-items-center rounded-full hover:bg-nm-sunken"><X className="size-3" /></button>}
    </span>
  );
}
