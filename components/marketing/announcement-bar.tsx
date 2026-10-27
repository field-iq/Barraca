'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface Announcement { text: string; href?: string; cta?: string }

const ROTATE_MS = 5000;

export function AnnouncementBar({ messages, dismissLabel = 'Dismiss', previousLabel = 'Previous', nextLabel = 'Next' }: {
  messages: Announcement[];
  dismissLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
}) {
  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = messages.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [count, paused]);

  if (!open || count === 0) return null;
  const current = messages[index % count];
  const step = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div
      role="region"
      aria-label="Anuncios"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative bg-nm-accent text-nm-accent-fg"
    >
      <div className="mx-auto flex h-11 max-w-6xl items-center gap-2 px-3 sm:px-6">
        {count > 1 ? (
          <button type="button" aria-label={previousLabel} onClick={() => step(-1)} className="nm-transition hidden size-7 shrink-0 place-items-center rounded-full opacity-80 hover:opacity-100 sm:grid">
            <ChevronLeft className="size-4" />
          </button>
        ) : (
          <span className="hidden size-7 shrink-0 sm:block" />
        )}

        <p key={index} aria-live={paused ? 'polite' : 'off'} className="flex min-w-0 flex-1 animate-nm-in items-center justify-center gap-3 text-center text-xs font-medium sm:text-sm">
          <span className="truncate">{current.text}</span>
          {current.href && current.cta && (
            <Link href={current.href} className="shrink-0 font-semibold underline underline-offset-4 hover:no-underline">
              {current.cta}
            </Link>
          )}
        </p>

        {count > 1 && (
          <div className="hidden items-center gap-1.5 md:flex" aria-hidden="true">
            {messages.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full bg-current transition-all ${i === index ? 'w-4 opacity-100' : 'w-1.5 opacity-40'}`} />
            ))}
          </div>
        )}
        {count > 1 && (
          <button type="button" aria-label={nextLabel} onClick={() => step(1)} className="nm-transition hidden size-7 shrink-0 place-items-center rounded-full opacity-80 hover:opacity-100 sm:grid">
            <ChevronRight className="size-4" />
          </button>
        )}
        <button type="button" aria-label={dismissLabel} onClick={() => setOpen(false)} className="nm-transition grid size-7 shrink-0 place-items-center rounded-full opacity-80 hover:opacity-100">
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
