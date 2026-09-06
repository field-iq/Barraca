import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
type Tone = 'info' | 'success' | 'warning' | 'danger';
const map = { info: [Info, 'text-nm-accent'], success: [CheckCircle2, 'text-nm-success'], warning: [AlertTriangle, 'text-nm-warning'], danger: [XCircle, 'text-nm-danger'] } as const;
export function Alert({ tone = 'info', title, children, className }: { tone?: Tone; title: string; children?: React.ReactNode; className?: string }) {
  const [Icon, color] = map[tone];
  return (
    <div role="alert" className={cn('flex gap-4 rounded-soft p-5 shadow-soft-inset', className)}>
      <span className={cn('grid size-10 shrink-0 place-items-center rounded-full bg-nm-surface shadow-soft-sm', color)}><Icon className="size-4" /></span>
      <div className="text-sm"><p className="font-semibold">{title}</p>{children && <p className="mt-0.5 text-nm-muted">{children}</p>}</div>
    </div>
  );
}
