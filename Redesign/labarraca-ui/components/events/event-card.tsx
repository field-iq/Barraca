import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
export interface WorkshopEvent { date: Date; title: string; body: string; place: string; spots?: number }
export function EventCard({ e }: { e: WorkshopEvent }) {
  return (
    <article className="grid grid-cols-[72px_1fr] gap-5 rounded-soft bg-nm-surface p-5 shadow-soft">
      <div className="grid aspect-square place-content-center rounded-soft-sm text-center shadow-soft-inset"><span className="text-[10px] font-bold uppercase tracking-wider text-nm-accent">{e.date.toLocaleString('en-AU', { month: 'short' })}</span><span className="font-heading text-3xl leading-none">{e.date.getDate()}</span></div>
      <div className="grid gap-2">
        <h3 className="text-xl leading-tight">{e.title}</h3><p className="text-sm text-nm-muted">{e.body}</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-1.5 text-xs text-nm-muted"><MapPin className="size-3.5" />{e.place}{e.spots !== undefined && ` · ${e.spots} spots left`}</span><Button size="sm">Reserve</Button></div>
      </div>
    </article>
  );
}
