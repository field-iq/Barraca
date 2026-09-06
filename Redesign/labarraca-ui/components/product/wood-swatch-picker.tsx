'use client';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
export interface Timber { id: string; name: string; hex: string; note?: string }
export function WoodSwatchPicker({ timbers, value, onChange }: { timbers: Timber[]; value: string; onChange: (id: string) => void }) {
  const sel = timbers.find(t => t.id === value);
  return (
    <div className="grid gap-4">
      <div className="flex justify-between text-sm"><span className="font-medium">Timber</span><span className="text-nm-muted">{sel?.name}{sel?.note && ` · ${sel.note}`}</span></div>
      <div className="flex flex-wrap gap-4">
        {timbers.map(t => (
          <button key={t.id} type="button" title={t.name} aria-label={t.name} aria-pressed={t.id === value} onClick={() => onChange(t.id)}
            className={cn('nm-transition grid size-14 place-items-center rounded-full p-1.5', t.id === value ? 'shadow-soft-inset' : 'shadow-soft hover:shadow-soft-lg')}>
            <span className="grid size-full place-items-center rounded-full text-white/90" style={{ background: `linear-gradient(135deg, ${t.hex}, color-mix(in oklch, ${t.hex}, black 25%))` }}>{t.id === value && <Check className="size-4" strokeWidth={3} />}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
