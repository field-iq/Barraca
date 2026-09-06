'use client';
import { cn } from '@/lib/cn';
export interface DimensionOption { id: string; label: string; seats?: string; priceDelta?: number }
export function DimensionSelector({ options, value, onChange, label = 'Size' }: { options: DimensionOption[]; value: string; onChange: (id: string) => void; label?: string }) {
  return (
    <div className="grid gap-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map(o => (
          <button key={o.id} type="button" aria-pressed={o.id === value} onClick={() => onChange(o.id)}
            className={cn('nm-transition rounded-soft-sm bg-nm-surface p-4 text-left', o.id === value ? 'shadow-soft-inset text-nm-accent' : 'shadow-soft-sm hover:shadow-soft')}>
            <span className="block text-sm font-semibold">{o.label}</span>
            <span className="mt-1 flex justify-between text-xs text-nm-muted"><span>{o.seats}</span>{o.priceDelta ? <span>+${o.priceDelta}</span> : <span>included</span>}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
