import { cn } from '@/lib/cn';
export function Divider({ label, className }: { label?: string; className?: string }) {
  return (
    <div role="separator" className={cn('flex items-center gap-4', className)}>
      <span className="h-1 flex-1 rounded-pill shadow-soft-inset-sm" />
      {label && <><span className="text-xs font-semibold uppercase tracking-[.14em] text-nm-muted">{label}</span><span className="h-1 flex-1 rounded-pill shadow-soft-inset-sm" /></>}
    </div>
  );
}
