'use client';
import { cn } from '@/lib/cn';

export interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; label?: string; disabled?: boolean; className?: string }
export function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer select-none', disabled && 'opacity-50 pointer-events-none', className)}>
      <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)}
        className="nm-transition relative h-8 w-14 rounded-pill bg-nm-surface shadow-soft-inset">
        <span className={cn('nm-transition absolute top-1 size-6 rounded-full shadow-soft-sm',
          checked ? 'left-7 bg-nm-accent' : 'left-1 bg-nm-surface')} />
      </button>
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
}
