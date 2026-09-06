'use client';
import { useState } from 'react';
import { Truck, Hammer, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceTag } from '@/components/ui/price-tag';
import { RatingStars } from '@/components/ui/rating-stars';
import { QuantityInput } from '@/components/ui/quantity-input';
import { WoodSwatchPicker, type Timber } from './wood-swatch-picker';
import { DimensionSelector, type DimensionOption } from './dimension-selector';
import { cn } from '@/lib/cn';

export function ProductDetail({ name, price, images, timbers, sizes, description }: { name: string; price: number; images: string[]; timbers: Timber[]; sizes: DimensionOption[]; description: string }) {
  const [img, setImg] = useState(0); const [timber, setTimber] = useState(timbers[0].id); const [size, setSize] = useState(sizes[0].id); const [qty, setQty] = useState(1);
  const total = price + (sizes.find(s => s.id === size)?.priceDelta ?? 0);
  return (
    <section className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_1fr]">
      <div className="grid gap-4">
        <div className="rounded-soft-lg p-4 shadow-soft"><img src={images[img]} alt={name} className="aspect-square w-full rounded-soft object-cover shadow-soft-inset" /></div>
        <div className="flex gap-3">{images.map((s, i) => <button key={s} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`} className={cn('nm-transition size-20 rounded-soft-sm p-1.5', i === img ? 'shadow-soft-inset' : 'shadow-soft-sm')}><img src={s} alt="" className="size-full rounded-[10px] object-cover" /></button>)}</div>
      </div>
      <div className="grid content-start gap-8">
        <div><RatingStars value={4.8} count={36} /><h1 className="mt-3 text-4xl md:text-5xl">{name}</h1><PriceTag amount={total * qty} size="lg" className="mt-4" /><p className="mt-4 leading-relaxed text-nm-muted">{description}</p></div>
        <WoodSwatchPicker timbers={timbers} value={timber} onChange={setTimber} />
        <DimensionSelector options={sizes} value={size} onChange={setSize} />
        <div className="flex flex-wrap items-center gap-4"><QuantityInput value={qty} onChange={setQty} /><Button variant="accent" size="lg" className="flex-1">Add to order</Button></div>
        <ul className="grid gap-3 text-sm text-nm-muted sm:grid-cols-3">
          {[[Hammer, 'Made to order · 8–10 wks'], [Truck, 'Delivered & assembled'], [ShieldCheck, '25-year guarantee']].map(([I, t]) => { const Icon = I as typeof Truck; return <li key={t as string} className="flex items-center gap-2"><Icon className="size-4 text-nm-accent" />{t as string}</li>; })}
        </ul>
      </div>
    </section>
  );
}
