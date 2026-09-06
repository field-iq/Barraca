'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
export function AnnouncementBar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 rounded-pill px-6 py-2.5 text-sm shadow-soft-inset">
      <span>{children}</span>
      <button aria-label="Dismiss" onClick={() => setOpen(false)} className="grid size-7 place-items-center rounded-full shadow-soft-sm"><X className="size-3.5" /></button>
    </div>
  );
}
