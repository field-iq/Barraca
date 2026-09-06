'use client';
import { X } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { CartItem, type CartLine } from './cart-item';
import { OrderSummary } from './order-summary';
import { EmptyState } from '@/components/feedback/empty-state';
import { cn } from '@/lib/cn';
export function CartDrawer({ open, onClose, lines, onQty, onRemove }: { open: boolean; onClose: () => void; lines: CartLine[]; onQty: (id: string, q: number) => void; onRemove: (id: string) => void }) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  return (
    <>
      <div onClick={onClose} className={cn('fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity', open ? 'opacity-100' : 'pointer-events-none opacity-0')} />
      <aside role="dialog" aria-label="Cart" className={cn('fixed inset-y-3 right-3 z-50 flex w-[min(440px,calc(100vw-24px))] flex-col gap-5 rounded-soft-lg bg-nm-bg p-6 shadow-soft-lg transition-transform duration-300 ease-soft', open ? 'translate-x-0' : 'translate-x-[110%]')}>
        <div className="flex items-center justify-between"><h2 className="text-2xl">Your order</h2><IconButton size="sm" label="Close" onClick={onClose}><X className="size-4" /></IconButton></div>
        <div className="grid flex-1 content-start gap-4 overflow-y-auto pr-1">
          {lines.length === 0 ? <EmptyState title="Nothing here yet" body="Pieces you add will appear here." /> : lines.map(l => <CartItem key={l.id} line={l} onQty={q => onQty(l.id, q)} onRemove={() => onRemove(l.id)} />)}
        </div>
        {lines.length > 0 && <OrderSummary subtotal={subtotal} delivery={0} />}
      </aside>
    </>
  );
}
