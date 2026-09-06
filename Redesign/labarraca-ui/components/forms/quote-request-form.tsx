'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-field';
import { Chip } from '@/components/ui/chip';
import { Slider } from '@/components/ui/slider';

const kinds = ['Dining table', 'Coffee table', 'Robe', 'Bedside', 'Sideboard', 'Kitchen', 'Something else'];
export function QuoteRequestForm({ onSubmit }: { onSubmit?: (data: Record<string, unknown>) => void }) {
  const [kind, setKind] = useState('Dining table'); const [budget, setBudget] = useState(4000); const [sending, setSending] = useState(false);
  return (
    <form className="mx-auto grid max-w-2xl gap-6 rounded-soft-lg bg-nm-surface p-8 shadow-soft md:p-10"
      onSubmit={async e => { e.preventDefault(); setSending(true); const d = Object.fromEntries(new FormData(e.currentTarget)); onSubmit?.({ ...d, kind, budget }); setSending(false); }}>
      <div><h2 className="text-3xl">Request a quote</h2><p className="mt-2 text-sm text-nm-muted">Tell us about the piece. We reply within two business days.</p></div>
      <div className="grid gap-2"><span className="px-1 text-xs font-semibold uppercase tracking-[.12em] text-nm-muted">What are we making?</span><div className="flex flex-wrap gap-2">{kinds.map(k => <Chip key={k} label={k} selected={kind === k} onClick={() => setKind(k)} />)}</div></div>
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name" required><Input id="name" name="name" required placeholder="Your name" /></FormField>
        <FormField label="Email" htmlFor="email" required><Input id="email" name="email" type="email" required placeholder="you@example.com" /></FormField>
        <FormField label="Phone" htmlFor="phone"><Input id="phone" name="phone" type="tel" placeholder="04xx xxx xxx" /></FormField>
        <FormField label="Timber preference" htmlFor="timber"><Select id="timber" name="timber" options={[{ value: 'oak', label: 'American oak' }, { value: 'blackbutt', label: 'Blackbutt' }, { value: 'walnut', label: 'Walnut' }, { value: 'unsure', label: 'Not sure yet' }]} /></FormField>
      </div>
      <Slider label="Approximate budget" min={1000} max={20000} step={250} value={budget} onChange={setBudget} format={v => `$${v.toLocaleString()}${v === 20000 ? '+' : ''}`} />
      <FormField label="Details" htmlFor="details" hint="Dimensions, room, finish, anything you have in mind."><Textarea id="details" name="details" placeholder="A 2.4 m dining table for eight…" /></FormField>
      <Button type="submit" variant="accent" size="lg" loading={sending}>Send request</Button>
    </form>
  );
}
