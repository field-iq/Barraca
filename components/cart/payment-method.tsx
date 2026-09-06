'use client';
import { CreditCard, Landmark, Wallet } from 'lucide-react';
import { cn } from '@/lib/cn';
const methods = [{ id: 'card', label: 'Card', icon: CreditCard }, { id: 'bank', label: 'Bank transfer', icon: Landmark }, { id: 'afterpay', label: 'Afterpay', icon: Wallet }];
export function PaymentMethod({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div role="radiogroup" className="grid gap-3 sm:grid-cols-3">
      {methods.map(({ id, label, icon: Icon }) => (
        <button key={id} role="radio" aria-checked={value === id} onClick={() => onChange(id)} className={cn('nm-transition grid gap-3 rounded-soft bg-nm-surface p-5 text-left', value === id ? 'shadow-soft-inset text-nm-accent' : 'shadow-soft hover:shadow-soft-lg')}>
          <Icon className="size-5" /><span className="text-sm font-semibold">{label}</span>
        </button>
      ))}
    </div>
  );
}
