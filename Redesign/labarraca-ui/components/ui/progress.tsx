import { cn } from '@/lib/cn';
export function Progress({ value, label, className }: { value: number; label?: string; className?: string }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('grid gap-2', className)}>
      {label && <div className="flex justify-between text-sm"><span className="font-medium">{label}</span><span className="text-nm-muted">{Math.round(v)}%</span></div>}
      <div role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} className="h-4 rounded-pill p-1 shadow-soft-inset">
        <div className="nm-transition h-full rounded-pill bg-nm-accent shadow-soft-xs" style={{ width: v + '%' }} />
      </div>
    </div>
  );
}
