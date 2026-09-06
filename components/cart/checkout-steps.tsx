import { Stepper } from '@/components/ui/stepper';
export function CheckoutSteps({ current }: { current: number }) {
  return <div className="rounded-pill px-6 py-4 shadow-soft-inset"><Stepper steps={['Details', 'Delivery', 'Deposit', 'Confirm']} current={current} /></div>;
}
