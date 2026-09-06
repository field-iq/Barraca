'use client';
import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
export function NewsletterForm({ title = 'Workshop notes', body = 'New pieces, timber arrivals and the occasional open day. Monthly, at most.' }: { title?: string; body?: string }) {
  const [done, setDone] = useState(false);
  return (
    <section className="mx-auto grid max-w-4xl gap-8 rounded-soft-lg p-10 shadow-soft-inset-lg md:grid-cols-2 md:items-center">
      <div><h2 className="text-3xl">{title}</h2><p className="mt-2 text-sm text-nm-muted">{body}</p></div>
      {done ? <p className="flex items-center gap-2 font-medium text-nm-success"><Check className="size-5" /> You're on the list.</p> :
        <form onSubmit={e => { e.preventDefault(); setDone(true); }} className="flex h-14 items-center rounded-pill bg-nm-surface p-1.5 pl-6 shadow-soft">
          <input type="email" required placeholder="you@example.com" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-nm-muted/70" />
          <button aria-label="Subscribe" className="grid size-11 place-items-center rounded-full bg-nm-accent text-nm-accent-fg shadow-soft-xs active:shadow-soft-inset-sm"><ArrowRight className="size-4" /></button>
        </form>}
    </section>
  );
}
