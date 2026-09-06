import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';
export function RatingStars({ value, count, size = 'md', className }: { value: number; count?: number; size?: 'sm' | 'md'; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => <Star key={i} className={cn(size === 'sm' ? 'size-3.5' : 'size-4', i <= Math.round(value) ? 'fill-nm-accent text-nm-accent' : 'text-nm-muted/40')} />)}
      {count !== undefined && <span className="ml-1.5 text-xs text-nm-muted">({count})</span>}
    </span>
  );
}
