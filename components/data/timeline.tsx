import { cn } from '@/lib/cn';
export interface TimelineStep { title: string; body: string; date?: string; state: 'done' | 'active' | 'todo' }
export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="grid gap-0">
      {steps.map((s, i) => (
        <li key={s.title} className="grid grid-cols-[28px_1fr] gap-5">
          <div className="grid justify-items-center"><span className={cn('grid size-7 place-items-center rounded-full', s.state === 'done' ? 'bg-nm-accent shadow-soft-xs' : s.state === 'active' ? 'shadow-soft-inset-sm' : 'shadow-soft-sm')}>{s.state === 'active' && <span className="size-2.5 animate-pulse rounded-full bg-nm-accent" />}</span>{i < steps.length - 1 && <span className="my-1 w-1 flex-1 rounded-pill shadow-soft-inset-sm" />}</div>
          <div className="pb-8"><div className="flex items-baseline justify-between gap-3"><p className={cn('font-semibold', s.state === 'todo' && 'text-nm-muted')}>{s.title}</p>{s.date && <span className="text-xs text-nm-muted">{s.date}</span>}</div><p className="mt-1 text-sm text-nm-muted">{s.body}</p></div>
        </li>
      ))}
    </ol>
  );
}
