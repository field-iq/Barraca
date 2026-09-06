import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
export function Breadcrumbs({ items, className }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex flex-wrap items-center gap-2 text-sm', className)}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {it.href ? <Link href={it.href} className="text-nm-muted hover:text-nm-accent">{it.label}</Link> : <span aria-current="page" className="font-semibold">{it.label}</span>}
          {i < items.length - 1 && <ChevronRight className="size-3.5 text-nm-muted/60" />}
        </span>
      ))}
    </nav>
  );
}
