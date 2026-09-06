'use client';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CheckboxProps { checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode; description?: string; className?: string }
export function Checkbox({ checked, onChange, label, description, className }: CheckboxProps) {
  return (
    <label className={cn('flex items-start gap-3 cursor-pointer select-none', className)}>
      <button type="button" role="checkbox" aria-checked={checked} onClick={() => onChange(!checked)}
        className={cn('nm-transition mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-nm-surface',
          checked ? 'shadow-soft-inset-sm text-nm-accent' : 'shadow-soft-sm text-transparent')}>
        <Check className="size-4" strokeWidth={3} />
      </button>
      <span className="text-sm">
        <span className="font-medium">{label}</span>
        {description && <span className="block text-nm-muted">{description}</span>}
      </span>
    </label>
  );
}
