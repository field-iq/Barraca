'use client';
import { cn } from '@/lib/cn';

export interface RadioOption { value: string; label: string; hint?: string }
export interface RadioGroupProps { name: string; value: string; onChange: (v: string) => void; options: RadioOption[]; className?: string }
export function RadioGroup({ name, value, onChange, options, className }: RadioGroupProps) {
  return (
    <div role="radiogroup" aria-label={name} className={cn('grid gap-3', className)}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <label key={o.value} className={cn('nm-transition flex items-center gap-3 rounded-soft-sm px-4 py-3 cursor-pointer bg-nm-surface',
            on ? 'shadow-soft-inset-sm' : 'shadow-soft-sm hover:shadow-soft')}>
            <input type="radio" name={name} value={o.value} checked={on} onChange={() => onChange(o.value)} className="sr-only" />
            <span className={cn('grid size-5 place-items-center rounded-full shadow-soft-inset-sm')}>
              <span className={cn('size-2.5 rounded-full nm-transition', on ? 'bg-nm-accent scale-100' : 'scale-0')} />
            </span>
            <span className="text-sm font-medium">{o.label}</span>
            {o.hint && <span className="ml-auto text-xs text-nm-muted">{o.hint}</span>}
          </label>
        );
      })}
    </div>
  );
}
