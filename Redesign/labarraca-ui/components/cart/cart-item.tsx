'use client';
import { Trash2 } from 'lucide-react';
import { QuantityInput } from '@/components/ui/quantity-input';
import { PriceTag } from '@/components/ui/price-tag';
export interface CartLine { id: string; name: string; spec: string; price: number; qty: number; image: string }
export function CartItem({ line, onQty, onRemove }: { line: CartLine; onQty: (q: number) => void; onRemove: () => void }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-4 rounded-soft bg-nm-surface p-4 shadow-soft">
      <img src={line.image} alt="" className="size-20 rounded-soft-sm object-cover shadow-soft-inset" />
      <div className="grid gap-3">
        <div className="flex items-start justify-between gap-3"><div><p className="font-heading text-lg leading-tight">{line.name}</p><p className="text-xs text-nm-muted">{line.spec}</p></div><button aria-label="Remove" onClick={onRemove} className="grid size-8 shrink-0 place-items-center rounded-full text-nm-muted shadow-soft-sm hover:text-nm-danger"><Trash2 className="size-3.5" /></button></div>
        <div className="flex items-center justify-between"><QuantityInput value={line.qty} onChange={onQty} className="h-10" /><PriceTag amount={line.price * line.qty} size="sm" /></div>
      </div>
    </div>
  );
}
