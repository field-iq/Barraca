import { MapPin, Clock, ArrowRight } from 'lucide-react';
export function ContactCard({ title, address, hours, mapHref, directionsLabel }: { title: string; address: string; hours: string; mapHref?: string; directionsLabel?: string }) {
  const rows = [[MapPin, address], [Clock, hours]] as const;
  return (
    <div className="grid gap-4 rounded-soft bg-nm-surface p-7 shadow-soft">
      <h3 className="font-heading text-2xl text-nm-text">{title}</h3>
      {rows.map(([Icon, text]) => (
        <div key={text} className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full text-nm-accent shadow-soft-inset-sm"><Icon className="size-4" /></span><span className="text-sm text-nm-text">{text}</span></div>
      ))}
      {mapHref && (
        <a href={mapHref} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-nm-accent hover:underline">
          {directionsLabel} <ArrowRight className="size-4" />
        </a>
      )}
    </div>
  );
}
