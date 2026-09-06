import { cn } from '@/lib/cn';
export function PriceTag({ amount, compareAt, currency = 'AUD', size = 'md', from, className }: { amount: number; compareAt?: number; currency?: string; size?: 'sm' | 'md' | 'lg'; from?: boolean; className?: string }) {
  const fmt = (n: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  const s = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' }[size];
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      {from && <span className="text-xs uppercase tracking-wider text-nm-muted">from</span>}
      <span className={cn('font-heading', s)}>{fmt(amount)}</span>
      {compareAt && <span className="text-sm text-nm-muted line-through">{fmt(compareAt)}</span>}
    </span>
  );
}
