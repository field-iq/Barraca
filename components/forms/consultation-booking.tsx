'use client';
import { useState } from 'react';
import { DatePicker } from './date-picker';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/lib/cn';
const slots = ['9:00', '10:30', '12:00', '14:00', '15:30'];
export function ConsultationBooking({ onBook }: { onBook?: (d: Date, slot: string, mode: string) => void }) {
  const [date, setDate] = useState<Date>(); const [slot, setSlot] = useState<string>(); const [mode, setMode] = useState('workshop');
  return (
    <section className="mx-auto grid max-w-4xl gap-8 rounded-soft-lg bg-nm-surface p-8 shadow-soft md:grid-cols-[auto_1fr]">
      <DatePicker value={date} onChange={setDate} disabledDay={d => d.getDay() === 0 || d < new Date()} />
      <div className="grid content-start gap-6">
        <div><h2 className="text-3xl">Book a consultation</h2><p className="mt-1 text-sm text-nm-muted">45 minutes with a maker. Free, no obligation.</p></div>
        <RadioGroup name="mode" value={mode} onChange={setMode} options={[{ value: 'workshop', label: 'At the workshop', hint: 'See timbers in person' }, { value: 'home', label: 'At your home', hint: 'Metro only' }, { value: 'video', label: 'Video call' }]} />
        <div className="grid gap-3"><span className="text-sm font-medium">Time</span><div className="flex flex-wrap gap-2">{slots.map(s => <button key={s} onClick={() => setSlot(s)} className={cn('nm-transition h-10 rounded-pill px-4 text-sm font-semibold bg-nm-surface', slot === s ? 'shadow-soft-inset-sm text-nm-accent' : 'shadow-soft-sm hover:shadow-soft')}>{s}</button>)}</div></div>
        <Button variant="accent" size="lg" disabled={!date || !slot} onClick={() => date && slot && onBook?.(date, slot, mode)}>{date && slot ? `Confirm ${date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })} at ${slot}` : 'Pick a date and time'}</Button>
      </div>
    </section>
  );
}
