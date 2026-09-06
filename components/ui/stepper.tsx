import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
export function Stepper({ steps, current, className }: { steps: string[]; current: number; className?: string }) {
  return (
    <ol className={cn('flex items-center gap-3', className)}>
      {steps.map((s, i) => {
        const done = i < current, active = i === current;
        return (
          <li key={s} className="flex flex-1 items-center gap-3 last:flex-none">
            <span className={cn('grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold nm-transition',
              done ? 'bg-nm-accent text-nm-accent-fg shadow-soft-xs' : active ? 'shadow-soft-inset-sm text-nm-accent' : 'shadow-soft-sm text-nm-muted')}>
              {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn('hidden text-sm sm:block', active ? 'font-semibold' : 'text-nm-muted')}>{s}</span>
            {i < steps.length - 1 && <span className="h-1 flex-1 rounded-pill shadow-soft-inset-sm" />}
          </li>
        );
      })}
    </ol>
  );
}
