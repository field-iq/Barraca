import { Button } from '@/components/ui/button';
const fmt = (n: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(n);
export function OrderSummary({ subtotal, delivery, deposit = 0.5, cta = 'Pay deposit', onCheckout }: { subtotal: number; delivery: number; deposit?: number; cta?: string; onCheckout?: () => void }) {
  const total = subtotal + delivery;
  return (
    <aside className="grid gap-4 rounded-soft bg-nm-surface p-7 shadow-soft">
      <h3 className="text-2xl">Summary</h3>
      <dl className="grid gap-2.5 text-sm">
        <div className="flex justify-between"><dt className="text-nm-muted">Subtotal</dt><dd>{fmt(subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-nm-muted">Delivery & assembly</dt><dd>{delivery ? fmt(delivery) : 'Quoted'}</dd></div>
        <div className="flex justify-between border-t border-nm-line pt-3 text-base font-semibold"><dt>Total</dt><dd>{fmt(total)}</dd></div>
        <div className="flex justify-between rounded-soft-sm px-4 py-3 shadow-soft-inset-sm"><dt className="text-nm-muted">Deposit today ({deposit * 100}%)</dt><dd className="font-heading text-lg text-nm-accent">{fmt(total * deposit)}</dd></div>
      </dl>
      <Button variant="accent" size="lg" block onClick={onCheckout}>{cta}</Button>
      <p className="text-center text-xs text-nm-muted">Balance due before delivery. Cancel free within 7 days.</p>
    </aside>
  );
}
