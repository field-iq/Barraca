import type { LucideIcon } from 'lucide-react';
export function StatCard({ label, value, delta, icon: Icon }: { label: string; value: string; delta?: string; icon?: LucideIcon }) {
  return (
    <div className="flex items-start justify-between rounded-soft bg-nm-surface p-6 shadow-soft">
      <div><p className="text-xs font-semibold uppercase tracking-[.12em] text-nm-muted">{label}</p><p className="mt-2 font-heading text-4xl">{value}</p>{delta && <p className="mt-1 text-xs text-nm-success">{delta}</p>}</div>
      {Icon && <span className="grid size-11 place-items-center rounded-full text-nm-accent shadow-soft-inset-sm"><Icon className="size-4" /></span>}
    </div>
  );
}
