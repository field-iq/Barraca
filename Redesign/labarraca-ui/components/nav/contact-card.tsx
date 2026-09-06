import { MapPin, Phone, Clock } from 'lucide-react';
export function ContactCard({ address, phone, hours }: { address: string; phone: string; hours: string }) {
  const rows = [[MapPin, address], [Phone, phone], [Clock, hours]] as const;
  return (
    <div className="grid gap-4 rounded-soft bg-nm-surface p-7 shadow-soft">
      <h3 className="text-2xl">Visit the workshop</h3>
      {rows.map(([Icon, text]) => (
        <div key={text} className="flex items-center gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full text-nm-accent shadow-soft-inset-sm"><Icon className="size-4" /></span><span className="text-sm">{text}</span></div>
      ))}
    </div>
  );
}
