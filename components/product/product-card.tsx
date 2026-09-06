'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { PriceTag } from '@/components/ui/price-tag';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
export interface Product { slug: string; name: string; timber: string; price: number; compareAt?: number; image: string; badge?: string; leadTime?: string }
export function ProductCard({ product, saved, onSave, className }: { product: Product; saved?: boolean; onSave?: () => void; className?: string }) {
  return (
    <article className={cn('group rounded-soft bg-nm-surface p-4 shadow-soft nm-transition hover:shadow-soft-lg', className)}>
      <div className="relative overflow-hidden rounded-soft-sm shadow-soft-inset">
        <img src={product.image} alt={product.name} className="aspect-square w-full object-cover nm-transition group-hover:scale-[1.03]" />
        {product.badge && <Badge tone="accent" className="absolute left-3 top-3">{product.badge}</Badge>}
        <button aria-label="Save" aria-pressed={saved} onClick={onSave} className={cn('absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-nm-surface shadow-soft-sm', saved && 'text-nm-accent')}><Heart className={cn('size-4', saved && 'fill-current')} /></button>
      </div>
      <div className="px-2 pb-2 pt-5">
        <p className="text-xs uppercase tracking-wider text-nm-muted">{product.timber}</p>
        <Link href={`/products/${product.slug}`} className="mt-1 block text-xl leading-tight font-heading hover:text-nm-accent">{product.name}</Link>
        <div className="mt-3 flex items-center justify-between"><PriceTag amount={product.price} compareAt={product.compareAt} from size="sm" />{product.leadTime && <span className="text-xs text-nm-muted">{product.leadTime}</span>}</div>
      </div>
    </article>
  );
}
