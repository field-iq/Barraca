import { cn } from '@/lib/cn';
export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
const tones = { neutral: 'text-nm-muted', accent: 'text-nm-accent', success: 'text-nm-success', warning: 'text-nm-warning', danger: 'text-nm-danger' };
export function Badge({ tone = 'neutral', sunken, className, children }: { tone?: BadgeTone; sunken?: boolean; className?: string; children: React.ReactNode }) {
  return <span className={cn('inline-flex h-7 items-center gap-1.5 rounded-pill px-3 text-xs font-semibold uppercase tracking-wider bg-nm-surface', sunken ? 'shadow-soft-inset-sm' : 'shadow-soft-xs', tones[tone], className)}>{children}</span>;
}
